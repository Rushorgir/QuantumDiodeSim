// Tunnel Diode Simulator - Band Diagram Component
// SVG energy band diagram with animations responding to voltage

import React, { useMemo } from 'react';
import type { DiodeParams, OperatingRegion } from '../types';

interface BandDiagramProps {
  voltage: number;
  current: number;
  params: DiodeParams;
  region: OperatingRegion;
}

export const BandDiagram: React.FC<BandDiagramProps> = ({
  voltage,
  current,
  params,
  region,
}) => {
  // SVG dimensions
  const width = 400;
  const height = 250;
  const padding = { top: 30, right: 40, bottom: 30, left: 40 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Calculate band positions based on voltage
  const bandConfig = useMemo(() => {
    // Energy scale (arbitrary units for visualization)
    const bandGap = plotHeight * 0.4;
    const baseEnergy = padding.top + plotHeight * 0.3;

    // Depletion region width (varies with voltage)
    const depletionWidth = Math.min(plotWidth * 0.25, plotWidth * 0.15 + voltage * plotWidth * 0.3);
    const depletionCenter = padding.left + plotWidth * 0.5;
    const depletionLeft = depletionCenter - depletionWidth / 2;
    const depletionRight = depletionCenter + depletionWidth / 2;

    // Band tilt (increases with voltage)
    const tiltAmount = voltage * plotHeight * 0.3; // Proportional to applied voltage

    // Conduction band positions
    const ecLeft = baseEnergy - tiltAmount * 0.5;
    const ecRight = baseEnergy + tiltAmount * 0.5 + bandGap * 0.3;

    // Valence band positions (offset by band gap)
    const evLeft = ecLeft + bandGap;
    const evRight = ecRight + bandGap;

    // Fermi level (horizontal reference)
    const fermiLevel = padding.top + plotHeight * 0.5;

    // Tunneling arrow
    const tunnelingMagnitude = Math.min(
      1,
      current / params.Ip
    ); // Normalized by peak current
    const arrowLength = depletionWidth * 0.8 * tunnelingMagnitude;
    const arrowOpacity = 0.2 + tunnelingMagnitude * 0.8;

    return {
      bandGap,
      baseEnergy,
      depletionLeft,
      depletionRight,
      depletionWidth,
      depletionCenter,
      ecLeft,
      ecRight,
      evLeft,
      evRight,
      fermiLevel,
      arrowLength,
      arrowOpacity,
    };
  }, [voltage, current, params.Ip, plotWidth, plotHeight, padding.top, padding.left]);

  // Generate path for conduction band
  const ecPath = useMemo(() => {
    const { depletionLeft, depletionRight, ecLeft, ecRight } = bandConfig;
    const leftX = padding.left;
    const rightX = padding.left + plotWidth;

    return `
      M ${leftX},${ecLeft}
      L ${depletionLeft},${ecLeft}
      Q ${depletionLeft + (depletionRight - depletionLeft) * 0.2},${ecLeft}
        ${depletionLeft + (depletionRight - depletionLeft) * 0.3},${(ecLeft + ecRight) / 2}
      Q ${depletionLeft + (depletionRight - depletionLeft) * 0.7},${ecRight}
        ${depletionRight},${ecRight}
      L ${rightX},${ecRight}
    `;
  }, [bandConfig, padding.left, plotWidth]);

  // Generate path for valence band
  const evPath = useMemo(() => {
    const { depletionLeft, depletionRight, evLeft, evRight } = bandConfig;
    const leftX = padding.left;
    const rightX = padding.left + plotWidth;

    return `
      M ${leftX},${evLeft}
      L ${depletionLeft},${evLeft}
      Q ${depletionLeft + (depletionRight - depletionLeft) * 0.2},${evLeft}
        ${depletionLeft + (depletionRight - depletionLeft) * 0.3},${(evLeft + evRight) / 2}
      Q ${depletionLeft + (depletionRight - depletionLeft) * 0.7},${evRight}
        ${depletionRight},${evRight}
      L ${rightX},${evRight}
    `;
  }, [bandConfig, padding.left, plotWidth]);

  // Get region-specific styling
  const getRegionStyle = () => {
    switch (region) {
      case 'tunneling':
        return {
          glow: '#00d4ff',
          label: 'Quantum Tunneling',
          description: 'Electrons tunnel through the depletion region',
        };
      case 'ndr':
        return {
          glow: '#ffb800',
          label: 'Negative Resistance',
          description: 'Current decreases as voltage increases',
        };
      case 'diffusion':
        return {
          glow: '#00ff88',
          label: 'Thermal Diffusion',
          description: 'Standard diode conduction mechanism',
        };
    }
  };

  const regionStyle = getRegionStyle();

  return (
    <div className="panel-glass rounded-xl border border-lab-cyan/20 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-lab-cyan tracking-tight">
          Energy Band Diagram
        </h3>
        <div className="text-right">
          <p className={`text-sm font-semibold`} style={{ color: regionStyle.glow }}>
            {regionStyle.label}
          </p>
          <p className="max-w-50 text-xs text-lab-gray">
            {regionStyle.description}
          </p>
        </div>
      </div>

      {/* SVG Band Diagram */}
      <div className="relative">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
        >
          <defs>
            {/* Glow filter for bands */}
            <filter id="band-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Gradient for depletion region */}
            <linearGradient id="depletion-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
              <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
            </linearGradient>

            {/* Arrow marker */}
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#00d4ff" />
            </marker>
          </defs>

          {/* Background grid */}
          <g stroke="#2a2a3a" strokeWidth="0.5">
            {Array.from({ length: 11 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1={padding.left}
                y1={padding.top + (i * plotHeight) / 10}
                x2={padding.left + plotWidth}
                y2={padding.top + (i * plotHeight) / 10}
              />
            ))}
            {Array.from({ length: 11 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={padding.left + (i * plotWidth) / 10}
                y1={padding.top}
                x2={padding.left + (i * plotWidth) / 10}
                y2={padding.top + plotHeight}
              />
            ))}
          </g>

          {/* Depletion region shading */}
          <rect
            x={bandConfig.depletionLeft}
            y={padding.top}
            width={bandConfig.depletionWidth}
            height={plotHeight}
            fill="url(#depletion-gradient)"
            className="transition-all duration-300"
          />

          {/* Depletion region borders */}
          <line
            x1={bandConfig.depletionLeft}
            y1={padding.top}
            x2={bandConfig.depletionLeft}
            y2={padding.top + plotHeight}
            stroke="#00d4ff"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.5"
          />
          <line
            x1={bandConfig.depletionRight}
            y1={padding.top}
            x2={bandConfig.depletionRight}
            y2={padding.top + plotHeight}
            stroke="#00d4ff"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.5"
          />

          {/* Conduction Band (EC) */}
          <path
            d={ecPath}
            fill="none"
            stroke="#00d4ff"
            strokeWidth="3"
            filter="url(#band-glow)"
            className="transition-all duration-300"
          />

          {/* Valence Band (EV) */}
          <path
            d={evPath}
            fill="none"
            stroke="#ff4757"
            strokeWidth="3"
            filter="url(#band-glow)"
            className="transition-all duration-300"
          />

          {/* Fermi Level (EF) - dashed line */}
          <line
            x1={padding.left}
            y1={bandConfig.fermiLevel}
            x2={padding.left + plotWidth}
            y2={bandConfig.fermiLevel}
            stroke="#e0e0e0"
            strokeWidth="1"
            strokeDasharray="6 4"
            opacity="0.4"
          />

          {/* Tunneling arrow (in depletion region) */}
          {region === 'tunneling' && (
            <g opacity={bandConfig.arrowOpacity}>
              <line
                x1={bandConfig.depletionLeft + 10}
                y1={(bandConfig.ecLeft + bandConfig.ecRight) / 2 + bandConfig.bandGap / 2}
                x2={bandConfig.depletionRight - 10}
                y2={(bandConfig.ecLeft + bandConfig.ecRight) / 2 + bandConfig.bandGap / 2}
                stroke="#00d4ff"
                strokeWidth={2 + bandConfig.arrowOpacity * 2}
                markerEnd="url(#arrowhead)"
                className="transition-all duration-300"
              />
              {/* Electron dots */}
              <circle
                cx={bandConfig.depletionLeft + 20}
                cy={(bandConfig.ecLeft + bandConfig.ecRight) / 2 + bandConfig.bandGap / 2 - 5}
                r={3}
                fill="#00d4ff"
                opacity={0.8}
              />
              <circle
                cx={bandConfig.depletionLeft + 35}
                cy={(bandConfig.ecLeft + bandConfig.ecRight) / 2 + bandConfig.bandGap / 2 + 3}
                r={2.5}
                fill="#00d4ff"
                opacity={0.7}
              />
              <circle
                cx={bandConfig.depletionLeft + 50}
                cy={(bandConfig.ecLeft + bandConfig.ecRight) / 2 + bandConfig.bandGap / 2 - 4}
                r={2}
                fill="#00d4ff"
                opacity={0.6}
              />
            </g>
          )}

          {/* Labels */}
          <text
            x={padding.left - 8}
            y={bandConfig.ecLeft + 5}
            fill="#00d4ff"
            fontSize="12"
            fontFamily="JetBrains Mono"
            textAnchor="end"
          >
            EC
          </text>

          <text
            x={padding.left - 8}
            y={bandConfig.evLeft + 5}
            fill="#ff4757"
            fontSize="12"
            fontFamily="JetBrains Mono"
            textAnchor="end"
          >
            EV
          </text>

          <text
            x={padding.left - 8}
            y={bandConfig.fermiLevel + 4}
            fill="#e0e0e0"
            fontSize="12"
            fontFamily="JetBrains Mono"
            textAnchor="end"
            opacity="0.7"
          >
            EF
          </text>

          {/* Side labels */}
          <text
            x={padding.left + 30}
            y={padding.top + plotHeight + 20}
            fill="#e0e0e0"
            fontSize="11"
            fontFamily="JetBrains Mono"
            textAnchor="middle"
          >
            p-side
          </text>

          <text
            x={padding.left + plotWidth - 30}
            y={padding.top + plotHeight + 20}
            fill="#e0e0e0"
            fontSize="11"
            fontFamily="JetBrains Mono"
            textAnchor="middle"
          >
            n-side
          </text>

          {/* Voltage indicator */}
          <text
            x={width / 2}
            y={padding.top - 10}
            fill="#e0e0e0"
            fontSize="11"
            fontFamily="JetBrains Mono"
            textAnchor="middle"
          >
            V = {voltage.toFixed(3)} V
          </text>
        </svg>

        {/* Scan line overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] rounded-lg overflow-hidden">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.1) 2px, rgba(0,212,255,0.1) 4px)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BandDiagram;
