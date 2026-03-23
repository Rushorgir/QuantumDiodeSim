// Tunnel Diode Simulator - Parameter Panel Component
// Controls for all diode parameters with sliders and synced number inputs

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { RotateCcw, Shuffle } from 'lucide-react';
import type { DiodeParams, ParameterDefinition } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '../lib/cn';

interface ParameterPanelProps {
  params: DiodeParams;
  paramDefinitions: ParameterDefinition[];
  onParamChange: (param: keyof DiodeParams, value: number) => void;
  onReset: () => void;
  onRandomize: () => void;
  className?: string;
}

interface ParameterControlProps {
  definition: ParameterDefinition;
  value: number;
  max: number;
  onChange: (value: number) => void;
}

const ParameterControl: React.FC<ParameterControlProps> = ({
  definition,
  value,
  max,
  onChange,
}) => {
  const { key, label, unit, min, step } = definition;
  const [draftValue, setDraftValue] = useState<string>(String(value));

  useEffect(() => {
    setDraftValue(String(value));
  }, [value]);

  const progress = ((value - min) / (max - min)) * 100;

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseFloat(e.target.value));
    },
    [onChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDraftValue(e.target.value);
    },
    []
  );

  const commitDraftValue = useCallback(() => {
    const parsed = parseFloat(draftValue);
    if (Number.isNaN(parsed)) {
      setDraftValue(String(value));
      return;
    }

    const clamped = Math.max(min, Math.min(max, parsed));
    onChange(clamped);
  }, [draftValue, max, min, onChange, value]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <label
          htmlFor={key}
          className="hud-label"
        >
          {label}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            id={`${key}-input`}
            value={draftValue}
            onChange={handleInputChange}
            onBlur={commitDraftValue}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitDraftValue();
              }
            }}
            min={min}
            max={max}
            step={step}
            data-testid={`param-input-${key}`}
            className="w-24 border border-zinc-800 bg-zinc-950 px-2 py-1 text-right font-mono text-sm text-lab-cyan focus:border-lab-cyan"
          />
          <span className="w-10 text-right font-mono text-xs text-zinc-400">{unit}</span>
        </div>
      </div>

      <input
        type="range"
        id={key}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSliderChange}
        data-testid={`param-slider-${key}`}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-800"
        style={{
          background: `linear-gradient(to right, #22d3ee 0%, #22d3ee ${progress}%, #27272a ${progress}%, #27272a 100%)`,
        }}
      />
    </div>
  );
};

export const ParameterPanel: React.FC<ParameterPanelProps> = ({
  params,
  paramDefinitions,
  onParamChange,
  onReset,
  onRandomize,
  className,
}) => {
  const handleParamChange = useCallback(
    (param: keyof DiodeParams) => (value: number) => {
      onParamChange(param, value);
    },
    [onParamChange]
  );

  const effectiveDefinitions = useMemo(
    () =>
      paramDefinitions.map((definition) => {
        if (definition.key === 'Iv') {
          return {
            ...definition,
            max: Math.min(definition.max, Number((params.Ip - 0.01).toFixed(2))),
          };
        }
        return definition;
      }),
    [paramDefinitions, params.Ip]
  );

  return (
    <Card className={cn('flex h-full flex-col overflow-hidden', className)}>
      <CardHeader className="items-start gap-4 sm:items-center">
        <div>
          <CardTitle>Parameter Deck</CardTitle>
          <p className="mt-2 text-sm text-zinc-400">Tune quantum transport characteristics in real time.</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <Button
            onClick={onReset}
            variant="secondary"
            size="icon"
            title="Reset to defaults"
            data-testid="params-reset"
          >
            <RotateCcw size={16} />
          </Button>
          <Button
            onClick={onRandomize}
            variant="amber"
            size="icon"
            title="Randomize parameters"
            data-testid="params-randomize"
          >
            <Shuffle size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-5 overflow-y-auto pr-1">
        {effectiveDefinitions.map((definition) => {
          const safeMax = Math.max(definition.min, definition.max);

          return (
            <ParameterControl
              key={definition.key}
              definition={definition}
              value={Math.min(params[definition.key], safeMax)}
              max={safeMax}
              onChange={handleParamChange(definition.key)}
            />
          );
        })}
      </CardContent>

      <div className="mt-6 border-t border-white/5 pt-4">
        <p className="text-xs leading-relaxed text-zinc-400">
          Adjust the parameters to explore how they affect the I-V curve.
          <span className="text-lab-cyan"> Iₚ</span>/<span className="text-lab-cyan">Vₚ</span> set tunneling peak behavior,
          while <span className="text-lab-amber">Iᵥ</span>/<span className="text-lab-amber">Vᵥ</span> shape the valley and diffusion rise.
        </p>
      </div>
    </Card>
  );
};

export default ParameterPanel;
