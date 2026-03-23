// Tunnel Diode Simulator - Physics Calculations
// Pure functions - no React dependencies, no side effects

import type { DiodeParams, IVDataPoint, Point, OperatingRegion } from '../types';
import { VOLTAGE_SWEEP } from './constants';

/**
 * Calculate tunneling current at given voltage
 * I_tunnel(V) = Ip * (V/Vp) * exp(1 - V/Vp)
 */
export function calculateTunnelingCurrent(
  voltage: number,
  Ip: number,
  Vp: number
): number {
  if (voltage <= 0) return 0;
  if (Vp <= 0) return 0;

  const normalizedVoltage = voltage / Vp;
  return Ip * normalizedVoltage * Math.exp(1 - normalizedVoltage);
}

/**
 * Calculate diffusion current at given voltage
 * I_diffusion(V) = Iv * exp(alpha * (V - Vv))
 */
export function calculateDiffusionCurrent(
  voltage: number,
  Iv: number,
  Vv: number,
  alpha: number
): number {
  if (voltage <= 0) return 0;

  return Iv * Math.exp(alpha * (voltage - Vv));
}

/**
 * Calculate total current at given voltage
 * I_total = I_tunnel + I_diffusion
 */
export function calculateTotalCurrent(
  voltage: number,
  params: DiodeParams
): number {
  const tunneling = calculateTunnelingCurrent(voltage, params.Ip, params.Vp);
  const diffusion = calculateDiffusionCurrent(
    voltage,
    params.Iv,
    params.Vv,
    params.alpha
  );
  return tunneling + diffusion;
}

/**
 * Generate complete I-V curve data
 */
export function generateIVCurve(
  params: DiodeParams,
  steps: number = VOLTAGE_SWEEP.steps
): IVDataPoint[] {
  const data: IVDataPoint[] = [];
  const stepSize = (VOLTAGE_SWEEP.max - VOLTAGE_SWEEP.min) / steps;

  for (let i = 0; i <= steps; i++) {
    const voltage = VOLTAGE_SWEEP.min + i * stepSize;
    const tunnelingCurrent = calculateTunnelingCurrent(
      voltage,
      params.Ip,
      params.Vp
    );
    const diffusionCurrent = calculateDiffusionCurrent(
      voltage,
      params.Iv,
      params.Vv,
      params.alpha
    );

    data.push({
      voltage,
      totalCurrent: tunnelingCurrent + diffusionCurrent,
      tunnelingCurrent,
      diffusionCurrent,
    });
  }

  return data;
}

/**
 * Find peak and valley points from I-V data
 */
export function findPeakAndValley(data: IVDataPoint[]): {
  peak: Point;
  valley: Point;
} {
  if (data.length === 0) {
    return { peak: { x: 0, y: 0 }, valley: { x: 0, y: 0 } };
  }

  // Find peak (maximum current before valley voltage)
  let peak: Point = { x: data[0].voltage, y: data[0].totalCurrent };
  let maxCurrent = data[0].totalCurrent;

  // Find valley (minimum current in NDR region)
  let valley: Point = { x: data[0].voltage, y: data[0].totalCurrent };
  let minCurrentInNDR = Infinity;
  let inNDRRegion = false;

  for (const point of data) {
    const current = point.totalCurrent;

    // Track peak (before any significant drop)
    if (current > maxCurrent) {
      maxCurrent = current;
      peak = { x: point.voltage, y: current };
    }

    // Start looking for valley after we see a current drop
    if (!inNDRRegion && current < maxCurrent * 0.9) {
      inNDRRegion = true;
    }

    // Find minimum in NDR region
    if (inNDRRegion && current < minCurrentInNDR) {
      minCurrentInNDR = current;
      valley = { x: point.voltage, y: current };
    }
  }

  // Fallback if valley wasn't found
  if (valley.y === data[0].totalCurrent && data.length > 10) {
    const lastPoint = data[data.length - 1];
    valley = { x: lastPoint.voltage, y: lastPoint.totalCurrent };
  }

  return { peak, valley };
}

/**
 * Calculate peak-to-valley current ratio (PVCR)
 */
export function calculatePVCR(peak: Point, valley: Point): number {
  if (valley.y === 0) return Infinity;
  return peak.y / valley.y;
}

/**
 * Calculate negative resistance in NDR region (Ohms)
 * R = -dV/dI ≈ -(V2-V1)/(I2-I1)
 */
export function calculateNegativeResistance(
  data: IVDataPoint[],
  Vp: number,
  Vv: number
): number {
  // Find points near Vp and Vv
  const startIdx = data.findIndex((p) => p.voltage >= Vp);
  const endIdx = data.findIndex((p) => p.voltage >= Vv);

  if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
    return 0;
  }

  const v1 = data[startIdx].voltage;
  const i1 = data[startIdx].totalCurrent;
  const v2 = data[endIdx].voltage;
  const i2 = data[endIdx].totalCurrent;

  if (i2 === i1) return 0;

  // Convert current from mA to A for Ohms calculation
  const di = (i2 - i1) * 1e-3;
  const dv = v2 - v1;

  return -(dv / di); // Negative resistance is positive value
}

/**
 * Determine operating region based on voltage
 */
export function getOperatingRegion(
  voltage: number,
  Vp: number,
  Vv: number
): OperatingRegion {
  if (voltage < Vp) {
    return 'tunneling';
  } else if (voltage >= Vp && voltage <= Vv) {
    return 'ndr';
  } else {
    return 'diffusion';
  }
}

/**
 * Calculate current at specific voltage
 */
export function getCurrentAtVoltage(
  voltage: number,
  params: DiodeParams
): { total: number; tunneling: number; diffusion: number } {
  const tunneling = calculateTunnelingCurrent(voltage, params.Ip, params.Vp);
  const diffusion = calculateDiffusionCurrent(
    voltage,
    params.Iv,
    params.Vv,
    params.alpha
  );

  return {
    total: tunneling + diffusion,
    tunneling,
    diffusion,
  };
}

/**
 * Generate random valid parameters
 */
export function generateRandomParams(): DiodeParams {
  // Ensure logical constraints: Vv > Vp, Ip > Iv
  const Vp = 0.03 + Math.random() * 0.12; // 0.03 to 0.15 V
  const Vv = Vp + 0.1 + Math.random() * 0.3; // Vp + 0.1 to Vp + 0.4 V
  const Ip = 0.5 + Math.random() * 3; // 0.5 to 3.5 mA
  const Iv = 0.05 + Math.random() * Math.min(Ip * 0.5, 1.0); // Less than Ip
  const alpha = 5 + Math.random() * 20; // 5 to 25 V^-1

  return {
    Ip: Math.round(Ip * 100) / 100,
    Vp: Math.round(Vp * 1000) / 1000,
    Iv: Math.round(Iv * 100) / 100,
    Vv: Math.round(Vv * 100) / 100,
    alpha: Math.round(alpha * 10) / 10,
  };
}
