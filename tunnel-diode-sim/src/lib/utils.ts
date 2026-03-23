// Tunnel Diode Simulator - Utility Functions

import type { DiodeParams, IVDataPoint } from '../types';

/**
 * Format number with specified decimal places
 */
export function formatNumber(value: number, decimals: number = 3): string {
  return value.toFixed(decimals);
}

/**
 * Format current in mA with appropriate precision
 */
export function formatCurrent(current: number): string {
  if (current < 0.01) return current.toExponential(2);
  if (current < 1) return current.toFixed(3);
  return current.toFixed(2);
}

/**
 * Format voltage in V with appropriate precision
 */
export function formatVoltage(voltage: number): string {
  if (voltage < 0.1) return voltage.toFixed(4);
  return voltage.toFixed(3);
}

/**
 * Format resistance with appropriate units
 */
export function formatResistance(ohms: number): string {
  if (ohms >= 1e6) return `${(ohms / 1e6).toFixed(2)} MΩ`;
  if (ohms >= 1e3) return `${(ohms / 1e3).toFixed(2)} kΩ`;
  return `${ohms.toFixed(2)} Ω`;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate CSV content from I-V data
 */
export function generateCSV(data: IVDataPoint[]): string {
  const headers = ['Voltage (V)', 'Total Current (mA)', 'Tunneling Current (mA)', 'Diffusion Current (mA)'];
  const rows = data.map(
    (point) =>
      `${point.voltage.toFixed(6)},${point.totalCurrent.toFixed(6)},${point.tunnelingCurrent.toFixed(6)},${point.diffusionCurrent.toFixed(6)}`
  );

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Download data as CSV file
 */
export function downloadCSV(data: IVDataPoint[], filename: string = 'iv-curve.csv'): void {
  const csv = generateCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copy parameters to clipboard as JSON
 */
export async function copyParamsToClipboard(params: DiodeParams): Promise<boolean> {
  try {
    const json = JSON.stringify(params, null, 2);
    await navigator.clipboard.writeText(json);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Generate unique ID for snapshots
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate snapshot from current state
 */
export function createSnapshotData(
  params: DiodeParams,
  data: IVDataPoint[],
  peak: { x: number; y: number },
  valley: { x: number; y: number }
) {
  return {
    id: generateId(),
    timestamp: Date.now(),
    params: { ...params },
    data: data.map((p) => ({ ...p })),
    peak: { ...peak },
    valley: { ...valley },
  };
}

/**
 * Deep clone I-V data
 */
export function cloneIVData(data: IVDataPoint[]): IVDataPoint[] {
  return data.map((point) => ({ ...point }));
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
