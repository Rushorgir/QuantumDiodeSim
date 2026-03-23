// Tunnel Diode Simulator - Custom Hook
// Manages all state and coordinates physics calculations

import { useState, useMemo, useCallback } from 'react';
import type {
  DiodeParams,
  IVDataPoint,
  DiodeMetrics,
  OperatingPoint,
  SnapshotData,
  VisibleSeries,
} from '../types';
import {
  DEFAULT_PARAMS,
  VOLTAGE_SWEEP,
  PARAMETER_DEFINITIONS,
} from '../lib/constants';
import {
  generateIVCurve,
  findPeakAndValley,
  calculatePVCR,
  calculateNegativeResistance,
  getOperatingRegion,
  getCurrentAtVoltage,
  generateRandomParams,
} from '../lib/physics';
import { createSnapshotData } from '../lib/utils';

export interface UseTunnelDiodeReturn {
  // Parameters
  params: DiodeParams;
  setParam: (param: keyof DiodeParams, value: number) => void;
  resetToDefaults: () => void;
  randomizeParams: () => void;

  // I-V Data
  data: IVDataPoint[];
  peak: { x: number; y: number };
  valley: { x: number; y: number };

  // Metrics
  metrics: DiodeMetrics;

  // Operating point
  operatingPoint: OperatingPoint;
  setOperatingVoltage: (voltage: number) => void;

  // Snapshot / Comparison
  snapshot: SnapshotData | null;
  saveSnapshot: () => void;
  clearSnapshot: () => void;
  snapshotVisible: boolean;
  toggleSnapshotVisible: () => void;

  // Chart visibility
  visibleSeries: VisibleSeries;
  toggleSeries: (series: keyof VisibleSeries) => void;

  // Parameter definitions
  paramDefinitions: typeof PARAMETER_DEFINITIONS;

  // Voltage sweep config
  voltageSweep: typeof VOLTAGE_SWEEP;
}

export function useTunnelDiode(): UseTunnelDiodeReturn {
  // Core parameters state
  const [params, setParams] = useState<DiodeParams>(DEFAULT_PARAMS);

  // Operating point (voltage probe)
  const [operatingVoltage, setOperatingVoltage] = useState<number>(0.1);

  // Snapshot state
  const [snapshot, setSnapshot] = useState<SnapshotData | null>(null);
  const [snapshotVisible, setSnapshotVisible] = useState<boolean>(true);

  // Chart series visibility
  const [visibleSeries, setVisibleSeries] = useState<VisibleSeries>({
    total: true,
    tunneling: true,
    diffusion: true,
  });

  // Memoized I-V curve data
  const data = useMemo(() => generateIVCurve(params), [params]);

  // Memoized peak and valley
  const { peak, valley } = useMemo(() => findPeakAndValley(data), [data]);

  // Memoized metrics
  const metrics = useMemo<DiodeMetrics>(() => {
    const pvcr = calculatePVCR(peak, valley);
    const negativeResistance = calculateNegativeResistance(
      data,
      params.Vp,
      params.Vv
    );

    return {
      Ip: params.Ip,
      Vp: params.Vp,
      Iv: params.Iv,
      Vv: params.Vv,
      pvcr,
      negativeResistance,
    };
  }, [data, params, peak, valley]);

  // Memoized operating point
  const operatingPoint = useMemo<OperatingPoint>(() => {
    const currents = getCurrentAtVoltage(operatingVoltage, params);
    const region = getOperatingRegion(operatingVoltage, params.Vp, params.Vv);

    return {
      voltage: operatingVoltage,
      current: currents.total,
      region,
    };
  }, [operatingVoltage, params]);

  // Parameter setter with validation
  const setParam = useCallback(
    (param: keyof DiodeParams, value: number) => {
      const definition = PARAMETER_DEFINITIONS.find((d) => d.key === param);
      if (!definition) return;

      // Clamp to valid range
      const clampedValue = Math.max(
        definition.min,
        Math.min(definition.max, value)
      );

      setParams((prev) => {
        const newParams = { ...prev, [param]: clampedValue };

        // Ensure logical constraints
        // Vv must be > Vp by at least 0.01V
        if (newParams.Vv <= newParams.Vp) {
          if (param === 'Vp') {
            newParams.Vp = Math.max(0.01, Number((newParams.Vv - 0.01).toFixed(3)));
          } else {
            newParams.Vv = Math.min(0.6, Number((newParams.Vp + 0.01).toFixed(3)));
          }
        }

        // Ip must remain above Iv by at least 0.01mA
        const maxIv = Math.max(0.01, Number((newParams.Ip - 0.01).toFixed(2)));
        newParams.Iv = Math.min(newParams.Iv, maxIv);

        return newParams;
      });
    },
    []
  );

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setParams(DEFAULT_PARAMS);
    setOperatingVoltage(0.1);
  }, []);

  // Randomize parameters
  const randomizeParams = useCallback(() => {
    setParams(generateRandomParams());
  }, []);

  // Set operating voltage from chart click
  const handleSetOperatingVoltage = useCallback((voltage: number) => {
    const clampedVoltage = Math.max(
      VOLTAGE_SWEEP.min,
      Math.min(VOLTAGE_SWEEP.max, voltage)
    );
    setOperatingVoltage(clampedVoltage);
  }, []);

  // Save snapshot
  const saveSnapshot = useCallback(() => {
    const newSnapshot = createSnapshotData(params, data, peak, valley);
    setSnapshot(newSnapshot);
    setSnapshotVisible(true);
  }, [params, data, peak, valley]);

  // Clear snapshot
  const clearSnapshot = useCallback(() => {
    setSnapshot(null);
  }, []);

  // Toggle snapshot visibility
  const toggleSnapshotVisible = useCallback(() => {
    setSnapshotVisible((prev) => !prev);
  }, []);

  // Toggle chart series visibility
  const toggleSeries = useCallback((series: keyof VisibleSeries) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [series]: !prev[series],
    }));
  }, []);

  return {
    // Parameters
    params,
    setParam,
    resetToDefaults,
    randomizeParams,

    // I-V Data
    data,
    peak,
    valley,

    // Metrics
    metrics,

    // Operating point
    operatingPoint,
    setOperatingVoltage: handleSetOperatingVoltage,

    // Snapshot
    snapshot,
    saveSnapshot,
    clearSnapshot,
    snapshotVisible,
    toggleSnapshotVisible,

    // Chart visibility
    visibleSeries,
    toggleSeries,

    // Definitions
    paramDefinitions: PARAMETER_DEFINITIONS,

    // Config
    voltageSweep: VOLTAGE_SWEEP,
  };
}
