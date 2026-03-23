// Tunnel Diode Simulator - TypeScript Type Definitions

// Diode parameters interface
export interface DiodeParams {
  Ip: number; // Peak current (mA)
  Vp: number; // Peak voltage (V)
  Iv: number; // Valley current (mA)
  Vv: number; // Valley voltage (V)
  alpha: number; // Exponential factor (V^-1)
}

// Single I-V data point
export interface IVDataPoint {
  voltage: number; // V
  totalCurrent: number; // mA
  tunnelingCurrent: number; // mA
  diffusionCurrent: number; // mA
}

// Peak/Valley point for marking on chart
export interface Point {
  x: number;
  y: number;
}

// Operating region type
export type OperatingRegion = 'tunneling' | 'ndr' | 'diffusion';

// Snapshot data for comparison mode
export interface SnapshotData {
  id: string;
  timestamp: number;
  params: DiodeParams;
  data: IVDataPoint[];
  peak: Point;
  valley: Point;
}

// Calculated metrics
export interface DiodeMetrics {
  Ip: number;
  Vp: number;
  Iv: number;
  Vv: number;
  pvcr: number; // Peak-to-valley current ratio
  negativeResistance: number; // Ohms
}

// Operating point at specific voltage
export interface OperatingPoint {
  voltage: number;
  current: number;
  region: OperatingRegion;
}

// Visible series state for chart
export interface VisibleSeries {
  total: boolean;
  tunneling: boolean;
  diffusion: boolean;
}

// Parameter definition for UI controls
export interface ParameterDefinition {
  key: keyof DiodeParams;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}
