// Tunnel Diode Simulator - I-V Plotter Component
// Renders interactive chart with tunneling, diffusion, and total current curves

import React, { useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
} from 'recharts';
import type { IVDataPoint, VisibleSeries } from '../types';
import { CHART_COLORS } from '../lib/constants';
import { formatCurrent, formatVoltage } from '../lib/utils';
import { Button } from './ui/button';

interface IVPlotterProps {
  data: IVDataPoint[];
  snapshotData?: IVDataPoint[] | null;
  snapshotVisible?: boolean;
  peak: { x: number; y: number };
  valley: { x: number; y: number };
  visibleSeries: VisibleSeries;
  onToggleSeries: (series: keyof VisibleSeries) => void;
  onChartClick: (voltage: number) => void;
  activeVoltage?: number;
  Vp: number;
  Vv: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: number;
}

interface ChartClickEvent {
  activeLabel?: number | string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-lab-panel border border-lab-gray rounded-lg p-3 shadow-lg">
        <p className="text-lab-cyan font-mono text-sm mb-2">
          V = {formatVoltage(label || 0)} V
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="font-mono text-sm"
            style={{ color: entry.color }}
          >
            {entry.dataKey === 'totalCurrent' && 'Total: '}
            {entry.dataKey === 'tunnelingCurrent' && 'Tunneling: '}
            {entry.dataKey === 'diffusionCurrent' && 'Diffusion: '}
            {formatCurrent(entry.value)} mA
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const IVPlotter: React.FC<IVPlotterProps> = ({
  data,
  snapshotData,
  snapshotVisible,
  peak,
  valley,
  visibleSeries,
  onToggleSeries,
  onChartClick,
  activeVoltage,
  Vp,
  Vv,
}) => {
  // Handle chart click to set operating point
  const handleClick = useCallback(
    (event?: ChartClickEvent) => {
      if (event?.activeLabel === undefined) return;
      const voltage = typeof event.activeLabel === 'number'
        ? event.activeLabel
        : Number(event.activeLabel);

      if (!Number.isNaN(voltage)) {
        onChartClick(voltage);
      }
    },
    [onChartClick]
  );

  // Calculate max current for Y-axis domain
  const maxCurrent = Math.max(
    ...data.map((d) => d.totalCurrent),
    ...(snapshotData?.map((d) => d.totalCurrent) || [0])
  );

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-lab-cyan">
          I-V Characteristics
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => onToggleSeries('total')}
            size="sm"
            variant={visibleSeries.total ? 'default' : 'secondary'}
            data-testid="series-total"
            className={`font-mono ${
              visibleSeries.total
                ? 'text-lab-cyan'
                : 'text-lab-text'
            }`}
          >
            Total
          </Button>
          <Button
            onClick={() => onToggleSeries('tunneling')}
            size="sm"
            variant={visibleSeries.tunneling ? 'default' : 'secondary'}
            data-testid="series-tunneling"
            className={`font-mono ${
              visibleSeries.tunneling
                ? 'text-lab-cyan'
                : 'text-lab-text'
            }`}
          >
            Tunneling
          </Button>
          <Button
            onClick={() => onToggleSeries('diffusion')}
            size="sm"
            variant={visibleSeries.diffusion ? 'amber' : 'secondary'}
            data-testid="series-diffusion"
            className={`font-mono ${
              visibleSeries.diffusion
                ? 'text-lab-amber'
                : 'text-lab-text'
            }`}
          >
            Diffusion
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            onClick={handleClick}
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <defs>
              <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-amber" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_COLORS.grid}
              opacity={0.22}
            />

            <XAxis
              type="number"
              dataKey="voltage"
              domain={[0, 0.6]}
              tickFormatter={(value) => value.toFixed(2)}
              stroke={CHART_COLORS.text}
              tick={{ fill: CHART_COLORS.text, fontSize: 12, fontFamily: 'JetBrains Mono' }}
              label={{
                value: 'Voltage (V)',
                position: 'insideBottom',
                offset: -5,
                fill: CHART_COLORS.text,
                fontSize: 11,
              }}
            />

            <YAxis
              type="number"
              domain={[0, Math.ceil(maxCurrent * 1.1 * 10) / 10]}
              tickFormatter={(value) => value.toFixed(1)}
              stroke={CHART_COLORS.text}
              tick={{ fill: CHART_COLORS.text, fontSize: 12, fontFamily: 'JetBrains Mono' }}
              label={{
                value: 'Current (mA)',
                angle: -90,
                position: 'insideLeft',
                fill: CHART_COLORS.text,
                fontSize: 11,
              }}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: CHART_COLORS.total, strokeWidth: 1 }} />

            {/* NDR Region Shading */}
            <ReferenceArea
              x1={Vp}
              x2={Vv}
              fill={CHART_COLORS.ndrRegion}
              stroke="none"
            />

            {/* Peak Point Marker */}
            <ReferenceDot
              x={peak.x}
              y={peak.y}
              r={6}
              fill={CHART_COLORS.peak}
              stroke="#0a0a0f"
              strokeWidth={2}
              label={{
                value: `Peak: (${formatVoltage(peak.x)}V, ${formatCurrent(peak.y)}mA)`,
                fill: CHART_COLORS.peak,
                fontSize: 11,
                position: 'top',
              }}
            />

            {/* Valley Point Marker */}
            <ReferenceDot
              x={valley.x}
              y={valley.y}
              r={6}
              fill={CHART_COLORS.valley}
              stroke="#0a0a0f"
              strokeWidth={2}
              label={{
                value: `Valley: (${formatVoltage(valley.x)}V, ${formatCurrent(valley.y)}mA)`,
                fill: CHART_COLORS.valley,
                fontSize: 11,
                position: 'bottom',
              }}
            />

            {/* Active Voltage Line */}
            {activeVoltage !== undefined && (
              <ReferenceLine
                x={activeVoltage}
                stroke={CHART_COLORS.total}
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            )}

            {/* Total Current Curve */}
            {visibleSeries.total && (
              <Line
                type="monotone"
                dataKey="totalCurrent"
                stroke={CHART_COLORS.total}
                strokeWidth={3}
                dot={false}
                animationDuration={300}
                isAnimationActive={true}
                style={{ filter: 'url(#glow-cyan)' }}
              />
            )}

            {/* Tunneling Current Curve */}
            {visibleSeries.tunneling && (
              <Line
                type="monotone"
                dataKey="tunnelingCurrent"
                stroke={CHART_COLORS.tunneling}
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                animationDuration={300}
                isAnimationActive={true}
                opacity={0.7}
              />
            )}

            {/* Diffusion Current Curve */}
            {visibleSeries.diffusion && (
              <Line
                type="monotone"
                dataKey="diffusionCurrent"
                stroke={CHART_COLORS.diffusion}
                strokeWidth={2}
                strokeDasharray="2 2"
                dot={false}
                animationDuration={300}
                isAnimationActive={true}
                opacity={0.7}
                style={{ filter: 'url(#glow-amber)' }}
              />
            )}

            {/* Snapshot Curve */}
            {snapshotVisible && snapshotData && (
              <Line
                type="monotone"
                data={snapshotData}
                dataKey="totalCurrent"
                stroke={CHART_COLORS.snapshot}
                strokeWidth={2.8}
                strokeDasharray="6 4"
                dot={false}
                animationDuration={300}
                isAnimationActive={true}
                style={{ filter: 'url(#glow-amber)' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>

        {/* Scan line overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.1) 2px, rgba(0,212,255,0.1) 4px)',
            }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono text-zinc-300">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-lab-cyan" />
          <span>Total Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 border-t-2 border-dashed border-lab-cyan opacity-70" />
          <span>Tunneling</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 border-t-2 border-dashed border-lab-amber opacity-70" />
          <span>Diffusion</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-lab-cyan/10 border border-lab-cyan/30" />
          <span>NDR Region</span>
        </div>
        {snapshotVisible && snapshotData && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-[#ff6b35]" />
            <span>Snapshot</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default IVPlotter;
