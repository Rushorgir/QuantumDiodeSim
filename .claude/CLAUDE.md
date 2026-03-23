# Tunnel Diode Simulator Project Context

## 🎯 RESUME INSTRUCTIONS FOR NEXT SESSION
**Before doing anything else, read this entire file and the plan file to understand where the project left off. Then continue implementation from the current phase.**

## Project Overview
Building a **professional Dark Physics Lab instrument** for visualizing tunnel diode (Esaki diode) I-V characteristics. Real-time animated charts, interactive band diagrams, and comprehensive parameter controls for educational/lab use.

**Key Visual Theme:** Dark Physics Lab aesthetic with electric cyan (#00d4ff) and amber (#ffb800) accents on deep charcoal backgrounds. Think oscilloscope/spectrum analyzer UI.

## Current Status
**Phase:** Planning/Foundation Setup
- ✅ Project structure initialized
- ✅ Comprehensive implementation plan created → [sleepy-scribbling-seal.md](./plans/sleepy-scribbling-seal.md)
- ⏳ **READY TO BEGIN PHASE 1** (Physics & State layer)

**Implementation Priority:** Physics lib → Hook → I-V Plotter → ParameterPanel → MetricsPanel → BandDiagram → TheorySection → ComparisonMode → ExportPanel → Integration → Polish

## Tech Stack
- **Framework:** React 18+ with TypeScript (strict mode)
- **Build:** Vite
- **Styling:** Tailwind CSS + custom CSS (animations, glow effects)
- **Charts:** Recharts
- **Math Rendering:** KaTeX
- **Icons:** Lucide React

## Key Physics Model
```
I_tunnel(V) = Ip * (V/Vp) * exp(1 - V/Vp)
I_diffusion(V) = Iv * exp(α * (V - Vv))
I_total = I_tunnel + I_diffusion

Voltage sweep: 0 to 0.6V in 500 steps
```

## Core Parameters (user-adjustable)
- **Ip:** Peak tunneling current (0.1-5 mA)
- **Vp:** Peak voltage (0.01-0.2 V)
- **Iv:** Valley current (0.01-2 mA)
- **Vv:** Valley voltage (0.1-0.6 V)
- **α:** Diffusion coefficient (1-30 V⁻¹)

## Implementation Phases Summary

| Phase | Component | Features | Status |
|-------|-----------|----------|--------|
| 1 | Types, Constants, Physics Lib, Hook | State management, calculations | ⏳ **NEXT** |
| 2 | IVPlotter | Chart with NDR shading, toggleable series | ⏳ Not started |
| 3 | ParameterPanel | Sliders, number inputs, reset, randomize | ⏳ Not started |
| 4 | MetricsPanel | 6 metrics, operating region indicator | ⏳ Not started |
| 5 | BandDiagram | SVG visualization, animated bands/arrows | ⏳ Not started |
| 6 | TheorySection | Accordion with equations, regions table | ⏳ Not started |
| 7 | ComparisonPanel | Snapshot/overlay functionality | ⏳ Not started |
| 8 | ExportPanel | CSV, JSON, PNG export | ⏳ Not started |
| 9 | App Integration | Grid layout, theming, responsiveness | ⏳ Not started |
| 10 | Polish | Animations, styles, accessibility | ⏳ Not started |

## Project Files Structure
```
tunnel-diode-sim/src/
├── types/index.ts                 (TypeScript interfaces)
├── lib/
│   ├── constants.ts              (default params, ranges)
│   ├── physics.ts                (pure calculation functions)
│   └── utils.ts                  (helpers: CSV export, etc)
├── hooks/
│   └── useTunnelDiode.ts         (state & computed values)
├── components/
│   ├── IVPlotter.tsx
│   ├── ParameterPanel.tsx
│   ├── MetricsPanel.tsx
│   ├── BandDiagram.tsx
│   ├── TheorySection.tsx
│   ├── ComparisonPanel.tsx
│   └── ExportPanel.tsx
├── styles/
│   └── index.css                 (theme vars, glow effects)
├── App.tsx                       (main grid layout)
└── main.tsx
```

## Critical Implementation Notes
1. **Physics = Pure Functions** — No React hooks in physics.ts, no side effects
2. **Memoization** — useMemo for I-V curve calculations (500 points)
3. **TypeScript Strict** — No `any` types allowed
4. **Component Contracts** — Every component has explicit props interface
5. **Recharts Config** — `isAnimationActive={true}` + `animationDuration={300}`
6. **Vite Setup** — Ensure proper TypeScript + path aliases configured

## 🚀 NEXT STEPS (Start Here When Resuming)

### Phase 1 Tasks (in order):
1. **Create `src/types/index.ts`**
   - TypeScript interfaces for: DiodeParams, IVDataPoint, Point, OperatingRegion, SnapshotData, MetricsData
   - Use strict types, no `any`

2. **Create `src/lib/constants.ts`**
   - Export DEFAULT_PARAMS with all parameter default values
   - Export PARAM_RANGES with min/max for each parameter
   - Default: Ip=1.5mA, Vp=0.07V, Iv=0.5mA, Vv=0.35V, α=12 V⁻¹

3. **Implement `src/lib/physics.ts`**
   - Pure functions (no hooks, no side effects):
     - `calculateTunneling(voltage, params): current`
     - `calculateDiffusion(voltage, params): current`
     - `calculateTotal(voltage, params): current`
     - `computeIVCurve(params): IVDataPoint[]` (500 points from 0 to 0.6V)
     - `findPeakAndValley(curve): { peak: Point, valley: Point }`
     - `detectOperatingRegion(voltage, peak, valley): OperatingRegion`
     - `calculateMetrics(curve, peak, valley): MetricsData`

4. **Create `src/hooks/useTunnelDiode.ts`**
   - State: params, curve, snapshot, overlayVisible, operatingVoltage
   - Computed values: peak, valley, metrics, operatingRegion, operatingCurrent
   - Handlers: setParam, reset, randomize, saveSnapshot, clearSnapshot, setOperatingVoltage
   - Use useMemo for curve calculations and metrics

5. **Verify Phase 1**
   - Physics produces recognizable tunnel diode I-V curve
   - NDR region (negative resistance) appears between Vp and Vv
   - Test with default params and a few randomized scenarios

### After Phase 1:
- Move to Phase 2: Build IVPlotter component with Recharts
- Continue phases in order according to priority list

## Reference Links
- **Full Implementation Plan:** [plans/sleepy-scribbling-seal.md](./plans/sleepy-scribbling-seal.md) — 500+ line detailed blueprint with data flow diagram and verification checklist
- **Workspace Root:** `/Users/apple/Desktop/Projects/Web/QuantumDiodeSim`
- **Active Project:** `tunnel-diode-sim/` directory

## Quick Commands
```bash
# Navigate to project
cd tunnel-diode-sim

# Install dependencies (if needed)
npm install

# Start dev server
npm run dev

# Build
npm run build

# TypeScript check
npx tsc --noEmit
```

## Progress Tracking
When resuming, update this section to reflect current progress:
- Session 1 (March 2026): Planning complete, foundation CLAUDE.md and plan files created

---

**⚠️ IMPORTANT**: Before starting work, ensure:
1. You've read this file AND the plan file (./plans/sleepy-scribbling-seal.md)
2. You understand the physics model and implementation priority
3. You're starting from Phase 1 unless noting otherwise in progress tracking
4. You have all critical notes about pure functions, TypeScript strict mode, and memoization

*Last Updated: Session 1 - March 23, 2026*
*Project Stage: Foundation Planning Complete, Ready for Phase 1 Implementation*
