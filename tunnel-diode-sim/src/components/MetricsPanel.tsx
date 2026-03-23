// Tunnel Diode Simulator - Metrics Panel Component
// Live display of calculated metrics with animated values

import React, { useState, useEffect, useRef } from 'react';
import type { DiodeMetrics, OperatingPoint } from '../types';
import { REGION_LABELS } from '../lib/constants';
import { formatCurrent, formatVoltage, formatResistance } from '../lib/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardTitle } from './ui/card';

interface MetricsPanelProps {
  metrics: DiodeMetrics;
  operatingPoint: OperatingPoint;
  onVoltageProbe: (voltage: number) => void;
}

interface AnimatedValueProps {
  value: number;
  formatter: (val: number) => string;
  className?: string;
}

// Animated number component with smooth transitions
const AnimatedValue: React.FC<AnimatedValueProps> = ({
  value,
  formatter,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    const duration = 300; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = value;
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value]);

  return (
    <span className={`tabular-nums ${className}`}>
      {formatter(displayValue)}
    </span>
  );
};

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  metrics,
  operatingPoint,
  onVoltageProbe,
}) => {
  const [voltageInput, setVoltageInput] = useState('');
  const [isEditingVoltage, setIsEditingVoltage] = useState(false);

  const handleVoltageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputToParse = isEditingVoltage
      ? voltageInput
      : operatingPoint.voltage.toFixed(3);
    const voltage = parseFloat(inputToParse);
    if (!isNaN(voltage)) {
      onVoltageProbe(Math.max(0, Math.min(0.6, voltage)));
      setIsEditingVoltage(false);
    }
  };

  // Get region color
  const getRegionColor = (region: string) => {
    switch (region) {
      case 'tunneling':
        return 'text-lab-cyan';
      case 'ndr':
        return 'text-lab-amber';
      case 'diffusion':
        return 'text-green-400';
      default:
        return 'text-lab-text';
    }
  };

  return (
    <Card>
      <CardHeader className="mb-5">
        <CardTitle>Device Metrics</CardTitle>
        <Badge variant="cyan">Live</Badge>
      </CardHeader>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-md border border-white/10 bg-zinc-950/55 p-4">
          <p className="mb-2 text-xs uppercase tracking-[0.12em] text-zinc-400">
            Peak Current (I<sub>p</sub>)
          </p>
          <p className="font-mono text-2xl font-bold tracking-tight text-lab-cyan drop-shadow-[0_0_6px_rgba(34,211,238,0.45)]">
            <AnimatedValue
              value={metrics.Ip}
              formatter={formatCurrent}
            />
            <span className="ml-1 text-sm text-zinc-400">mA</span>
          </p>
        </div>

        <div className="rounded-md border border-white/10 bg-zinc-950/55 p-4">
          <p className="mb-2 text-xs uppercase tracking-[0.12em] text-zinc-400">
            Peak Voltage (V<sub>p</sub>)
          </p>
          <p className="font-mono text-2xl font-bold tracking-tight text-lab-cyan drop-shadow-[0_0_6px_rgba(34,211,238,0.45)]">
            <AnimatedValue
              value={metrics.Vp}
              formatter={formatVoltage}
            />
            <span className="ml-1 text-sm text-zinc-400">V</span>
          </p>
        </div>

        <div className="rounded-md border border-white/10 bg-zinc-950/55 p-4">
          <p className="mb-2 text-xs uppercase tracking-[0.12em] text-zinc-400">
            Valley Current (I<sub>v</sub>)
          </p>
          <p className="font-mono text-2xl font-bold tracking-tight text-lab-amber drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]">
            <AnimatedValue
              value={metrics.Iv}
              formatter={formatCurrent}
            />
            <span className="ml-1 text-sm text-zinc-400">mA</span>
          </p>
        </div>

        <div className="rounded-md border border-white/10 bg-zinc-950/55 p-4">
          <p className="mb-2 text-xs uppercase tracking-[0.12em] text-zinc-400">
            Valley Voltage (V<sub>v</sub>)
          </p>
          <p className="font-mono text-2xl font-bold tracking-tight text-lab-amber drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]">
            <AnimatedValue
              value={metrics.Vv}
              formatter={formatVoltage}
            />
            <span className="ml-1 text-sm text-zinc-400">V</span>
          </p>
        </div>

        <div className="rounded-md border border-white/10 bg-zinc-950/55 p-4">
          <p className="mb-2 text-xs uppercase tracking-[0.12em] text-zinc-400">
            PVCR Ratio
          </p>
          <p className="font-mono text-2xl font-bold tracking-tight text-fuchsia-400">
            <AnimatedValue
              value={metrics.pvcr}
              formatter={(v) => (isFinite(v) ? v.toFixed(2) : '∞')}
            />
            <span className="ml-1 text-sm text-zinc-400">:1</span>
          </p>
        </div>

        <div className="rounded-md border border-white/10 bg-zinc-950/55 p-4">
          <p className="mb-2 text-xs uppercase tracking-[0.12em] text-zinc-400">
            Neg. Resistance
          </p>
          <p className="font-mono text-2xl font-bold tracking-tight text-rose-400">
            <AnimatedValue
              value={metrics.negativeResistance}
              formatter={formatResistance}
            />
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 pt-5">
        <h4 className="mb-3 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300">
          Voltage Probe
        </h4>

        <form onSubmit={handleVoltageSubmit} className="mb-4">
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="0.001"
              min="0"
              max="0.6"
              value={isEditingVoltage ? voltageInput : operatingPoint.voltage.toFixed(3)}
              onFocus={() => {
                setVoltageInput(operatingPoint.voltage.toFixed(3));
                setIsEditingVoltage(true);
              }}
              onBlur={() => {
                setIsEditingVoltage(false);
              }}
              onChange={(e) => setVoltageInput(e.target.value)}
              data-testid="metrics-voltage-input"
              className="flex-1 border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-lab-cyan focus:border-lab-cyan"
            />
            <span className="font-mono text-sm text-zinc-400">V</span>
            <Button
              type="submit"
              variant="default"
              size="sm"
              data-testid="metrics-probe"
            >
              Probe
            </Button>
          </div>
        </form>

        <div className="rounded-md border border-white/10 bg-zinc-950/55 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-1 text-xs text-zinc-400">Current at Probe</p>
              <p className="text-lg font-mono font-bold text-lab-cyan">
                {formatCurrent(operatingPoint.current)}
                <span className="ml-1 text-sm text-zinc-400">mA</span>
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs text-zinc-400">Operating Region</p>
              <p
                className={`text-sm font-semibold ${getRegionColor(
                  operatingPoint.region
                )}`}
              >
                {REGION_LABELS[operatingPoint.region]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MetricsPanel;
