// Tunnel Diode Simulator - Comparison Panel Component
// Save snapshots and compare parameter sets

import React from 'react';
import { Camera, Trash2, Eye, EyeOff } from 'lucide-react';
import type { DiodeParams, SnapshotData } from '../types';
import { formatCurrent, formatVoltage } from '../lib/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ComparisonPanelProps {
  snapshot: SnapshotData | null;
  currentParams: DiodeParams;
  onSaveSnapshot: () => void;
  onClearSnapshot: () => void;
  onToggleOverlay: () => void;
  overlayVisible: boolean;
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  snapshot,
  currentParams,
  onSaveSnapshot,
  onClearSnapshot,
  onToggleOverlay,
  overlayVisible,
}) => {
  // Calculate diff between snapshot and current
  const getParamDiff = (key: keyof DiodeParams): { diff: number; percent: number } | null => {
    if (!snapshot) return null;

    const saved = snapshot.params[key];
    const current = currentParams[key];
    const diff = current - saved;
    const percent = saved !== 0 ? (diff / saved) * 100 : 0;

    return { diff, percent };
  };

  const formatDiff = (value: number): string => {
    if (Math.abs(value) < 0.001) return value.toExponential(2);
    if (Math.abs(value) < 0.01) return value.toFixed(4);
    return value.toFixed(3);
  };

  return (
    <Card>
      <CardHeader className="mb-5 flex-col items-start gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>Comparison</CardTitle>
          <Badge variant={snapshot ? 'amber' : 'gray'}>{snapshot ? 'Snapshot Saved' : 'No Snapshot'}</Badge>
        </div>

        <div className="flex w-full flex-wrap gap-2 xl:w-auto xl:justify-end">
          <Button
            onClick={onSaveSnapshot}
            variant="default"
            size="sm"
            data-testid="comparison-save"
          >
            <Camera size={16} />
            <span>Save</span>
          </Button>

          <Button
            onClick={onToggleOverlay}
            variant={overlayVisible ? 'amber' : 'secondary'}
            size="sm"
            disabled={!snapshot}
            data-testid="comparison-toggle-overlay"
          >
            {overlayVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            <span>{overlayVisible ? 'Overlay On' : 'Overlay Off'}</span>
          </Button>

          <Button
            onClick={onClearSnapshot}
            variant="danger"
            size="sm"
            title="Clear snapshot"
            disabled={!snapshot}
            data-testid="comparison-clear"
          >
            <Trash2 size={16} />
            <span>Clear</span>
          </Button>
        </div>
      </CardHeader>

      {snapshot ? (
        <CardContent className="space-y-5">
          <div className="rounded-md border border-white/10 bg-zinc-950/55 p-4">
            <p className="mb-3 text-xs text-zinc-400">
              Snapshot saved: {new Date(snapshot.timestamp).toLocaleString()}
            </p>
            <div className="grid grid-cols-1 gap-2 text-xs xl:grid-cols-2">
              <div>
                <span className="text-zinc-400">Peak: </span>
                <span className="text-lab-cyan font-mono">
                  {formatCurrent(snapshot.peak.y)}mA @ {formatVoltage(snapshot.peak.x)}V
                </span>
              </div>
              <div>
                <span className="text-zinc-400">Valley: </span>
                <span className="text-lab-amber font-mono">
                  {formatCurrent(snapshot.valley.y)}mA @ {formatVoltage(snapshot.valley.x)}V
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-white/10 bg-zinc-950/45 p-4">
            <h4 className="mb-3 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300">
              Parameter Differences
            </h4>

            <div className="space-y-2">
              {(['Ip', 'Vp', 'Iv', 'Vv', 'alpha'] as const).map((key) => {
                const diff = getParamDiff(key);
                if (!diff) return null;

                const isPositive = diff.diff >= 0;
                const colorClass = isPositive ? 'text-green-400' : 'text-rose-400';
                const arrow = isPositive ? '↑' : '↓';

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="font-mono text-lab-text">{key}</span>
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-xs text-zinc-400">
                        {formatDiff(snapshot.params[key])} →{' '}
                        {formatDiff(currentParams[key])}
                      </span>
                      <span
                        className={`font-mono text-xs font-bold ${colorClass}`}
                      >
                        {arrow} {Math.abs(diff.percent).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      ) : (
        <CardContent className="py-10 text-center text-zinc-400">
          <Camera size={32} className="mx-auto mb-3 opacity-55" />
          <p className="text-sm">No snapshot saved</p>
          <p className="mt-1 text-xs">Capture first, then toggle overlay to compare curve drift.</p>
        </CardContent>
      )}
    </Card>
  );
};

export default ComparisonPanel;
