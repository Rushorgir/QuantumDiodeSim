// Tunnel Diode Simulator - Constants and Default Values

import type { DiodeParams, ParameterDefinition } from '../types';
import type { OperatingRegion } from '../types';

// Default diode parameters (Esaki diode typical values)
export const DEFAULT_PARAMS: DiodeParams = {
  Ip: 1.5, // Peak current: 1.5 mA
  Vp: 0.07, // Peak voltage: 0.07 V (70 mV)
  Iv: 0.5, // Valley current: 0.5 mA
  Vv: 0.35, // Valley voltage: 0.35 V
  alpha: 12, // Exponential factor: 12 V^-1
};

// Voltage sweep configuration
export const VOLTAGE_SWEEP = {
  min: 0,
  max: 0.6,
  steps: 500,
};

// Parameter definitions for UI controls
export const PARAMETER_DEFINITIONS: ParameterDefinition[] = [
  {
    key: 'Ip',
    label: 'Peak Current',
    unit: 'mA',
    min: 0.1,
    max: 5.0,
    step: 0.01,
  },
  {
    key: 'Vp',
    label: 'Peak Voltage',
    unit: 'V',
    min: 0.01,
    max: 0.2,
    step: 0.001,
  },
  {
    key: 'Iv',
    label: 'Valley Current',
    unit: 'mA',
    min: 0.01,
    max: 2.0,
    step: 0.01,
  },
  {
    key: 'Vv',
    label: 'Valley Voltage',
    unit: 'V',
    min: 0.1,
    max: 0.6,
    step: 0.01,
  },
  {
    key: 'alpha',
    label: 'Alpha Factor',
    unit: 'V⁻¹',
    min: 1.0,
    max: 30.0,
    step: 0.1,
  },
];

// Chart colors for Dark Physics Lab theme
export const CHART_COLORS = {
  total: '#06b6d4',
  tunneling: '#f59e0b',
  diffusion: '#d946ef',
  ndrRegion: 'rgba(239, 68, 68, 0.15)',
  peak: '#00ff88', // Bright green
  valley: '#ff4757', // Red
  snapshot: '#22d3ee',
  grid: '#18181b',
  text: '#a1a1aa',
};

// Region labels for display
export const REGION_LABELS: Record<OperatingRegion, string> = {
  tunneling: 'Tunneling Region',
  ndr: 'Negative Resistance Region',
  diffusion: 'Diffusion Region',
};

// Band diagram constants
export const BAND_DIAGRAM = {
  width: 400,
  height: 250,
  padding: 30,
  bandGap: 1.12, // eV (silicon)
  fermiLevelOffset: 0.05, // eV
};
