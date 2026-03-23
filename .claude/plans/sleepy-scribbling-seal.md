# Tunnel Diode Simulator - Implementation Plan

## Context
Building a professional-grade physics lab instrument for visualizing tunnel diode I-V characteristics. The app will have a Dark Physics Lab aesthetic with electric cyan/amber accents on deep charcoal backgrounds, featuring real-time animated charts, interactive band diagrams, and comprehensive parameter controls.

## Tech Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite (as specified)
- **Styling**: Tailwind CSS + custom CSS for animations/effects
- **Charts**: Recharts
- **Math Rendering**: KaTeX
- **Icons**: Lucide React

## Implementation Priority Order

### Phase 1: Foundation (Physics & State)
**Files to create:**
- `src/types/index.ts` - All TypeScript interfaces
- `src/lib/constants.ts` - Default parameter values and ranges
- `src/lib/physics.ts` - Pure physics calculation functions
- `src/lib/utils.ts` - Helper utilities (CSV export, etc.)
- `src/hooks/useTunnelDiode.ts` - Custom state management hook

**Key Implementation Details:**
- Physics model: I_tunnel(V) = Ip * (V/Vp) * exp(1 - V/Vp)
- I_diffusion(V) = Iv * exp(α * (V - Vv))
- Voltage sweep: 0 to 0.6V in 500 steps
- All calculations in pure functions, no side effects
- Hook manages: parameters, computed curves, operating point, snapshot

**Verification:** After Phase 1, verify the physics calculations match expected tunnel diode curve shape with NDR region between Vp and Vv.

---

### Phase 2: I-V Plotter Component
**File:** `src/components/IVPlotter.tsx`

**Features:**
- Recharts LineChart with ResponsiveContainer
- Three data series: total, tunneling, diffusion (toggleable visibility)
- NDR region shading between Vp and Vv (ReferenceArea with cyan tint)
- Peak and valley markers (ReferenceDot with labels)
- Custom tooltip showing voltage/current values
- Click handler to set operating voltage
- Animated transitions (300ms duration)
- Legend with toggle buttons for each series

**Props Interface:**
```typescript
interface IVPlotterProps {
  data: IVDataPoint[];
  peak: Point;
  valley: Point;
  visibleSeries: {
    total: boolean;
    tunneling: boolean;
    diffusion: boolean;
  };
  onToggleSeries: (series: string) => void;
  onChartClick: (voltage: number) => void;
  activeVoltage?: number;
}
```

**Verification:** Chart renders smooth curves, NDR region is visually distinct, clicking sets correct voltage.

---

### Phase 3: Parameter Panel Component
**File:** `src/components/ParameterPanel.tsx`

**Features:**
- 5 parameter controls: Ip (0.1-5 mA), Vp (0.01-0.2 V), Iv (0.01-2 mA), Vv (0.1-0.6 V), α (1-30 V⁻¹)
- Each control: slider (range input) + number input (synced)
- Live updates during drag (no debounce needed for 500 data points)
- Reset to defaults button (circular arrow icon)
- Randomize button (dice icon) - generates plausible random values
- Labels with units and current values displayed

**Props Interface:**
```typescript
interface ParameterPanelProps {
  params: DiodeParams;
  onParamChange: (param: keyof DiodeParams, value: number) => void;
  onReset: () => void;
  onRandomize: () => void;
}
```

**Verification:** Slider drag updates chart in real-time, number input syncs with slider, reset/randomize work correctly.

---

### Phase 4: Metrics Panel Component
**File:** `src/components/MetricsPanel.tsx`

**Features:**
- Six metric displays with animated value transitions:
  - Ip (peak current) in mA
  - Vp (peak voltage) in V
  - Iv (valley current) in mA
  - Vv (valley voltage) in V
  - PVCR (peak-to-valley current ratio) = Ip/Iv
  - Negative resistance in Ω (calculated from slope in NDR region)
- Voltage probe input (0-0.6V range)
- Operating region indicator: Tunneling / NDR / Diffusion
- Animated number display using CSS transitions

**Props Interface:**
```typescript
interface MetricsPanelProps {
  metrics: {
    Ip: number;
    Vp: number;
    Iv: number;
    Vv: number;
    pvcr: number;
    negativeResistance: number;
  };
  operatingPoint: {
    voltage: number;
    current: number;
    region: OperatingRegion;
  };
  onVoltageProbe: (voltage: number) => void;
}
```

**Verification:** Metrics update smoothly when parameters change, region detection is accurate, probe updates operating point.

---

### Phase 5: Band Diagram Component
**File:** `src/components/BandDiagram.tsx`

**Features:**
- SVG visualization (400x250px)
- Elements:
  - EC (conduction band) - top curve
  - EV (valence band) - bottom curve
  - EF (Fermi level) - horizontal dashed line
  - p-side (left) and n-side (right) labels
  - Depletion region shading
- Animations:
  - Bands tilt proportional to applied voltage
  - Tunneling arrow grows/shrinks with current magnitude
  - Arrow opacity tied to normalized current
  - Smooth CSS transitions on path changes
- Dynamic mechanism label showing dominant conduction mode

**Band Diagram Math:**
- Band bending: linear function of voltage
- Arrow length: proportional to tunneling current / Ip
- Arrow y-position: centered between bands in depletion region

**Props Interface:**
```typescript
interface BandDiagramProps {
  voltage: number;
  current: number;
  params: DiodeParams;
  region: OperatingRegion;
}
```

**Verification:** Diagram animates smoothly with voltage changes, arrow size correlates with current, labels are clear.

---

### Phase 6: Theory Section Component
**File:** `src/components/TheorySection.tsx`

**Features:**
- Accordion with 4 sections:
  1. **Quantum Tunneling** - Explanation with KaTeX equation
  2. **Esaki Diode** - Heavy doping explanation
  3. **I-V Characteristics** - Full equation set with KaTeX
  4. **Operation Regions** - Table with columns: Region, Voltage Range, Physics, Application
- KaTeX CSS import for equation styling
- Smooth accordion animations
- Content written in educational style

**Key Equations (KaTeX):**
```
I_{tunnel} = I_p \cdot \frac{V}{V_p} \cdot \exp(1 - \frac{V}{V_p})

I_{diffusion} = I_v \cdot \exp(\alpha(V - V_v))

I_{total} = I_{tunnel} + I_{diffusion}
```

**Regions Table:**
| Region | Voltage Range | Physics | Application |
|--------|--------------|---------|-------------|
| Tunneling | 0 to Vp | Quantum tunneling | Fast switching |
| NDR | Vp to Vv | Negative resistance | Oscillators, amplifiers |
| Diffusion | > Vv | Thermal diffusion | Standard diode behavior |

**Verification:** Equations render correctly, accordion expands/collapses smoothly, content is accurate and educational.

---

### Phase 7: Comparison Mode Component
**File:** `src/components/ComparisonPanel.tsx`

**Features:**
- "Save Snapshot" button to capture current I-V curve
- Snapshot stored in hook state with timestamp
- Toggle overlay visibility
- Saved curve displayed in amber color on same chart
- Parameter diff display showing saved vs current values
- Clear snapshot button

**Props Interface:**
```typescript
interface ComparisonPanelProps {
  snapshot: SnapshotData | null;
  currentParams: DiodeParams;
  onSaveSnapshot: () => void;
  onClearSnapshot: () => void;
  onToggleOverlay: (visible: boolean) => void;
  overlayVisible: boolean;
}
```

**Verification:** Snapshot saves correctly, overlay shows saved curve in different color, diff displays correctly.

---

### Phase 8: Export Panel Component
**File:** `src/components/ExportPanel.tsx`

**Features:**
- **CSV Export**: Download I-V data with columns: Voltage (V), Total Current (mA), Tunneling Current (mA), Diffusion Current (mA)
- **JSON Export**: Copy current parameters as formatted JSON to clipboard
- **PNG Export**: Save chart as image using Recharts' built-in export
- Three export buttons with appropriate icons (Download, Copy, Image)

**Props Interface:**
```typescript
interface ExportPanelProps {
  data: IVDataPoint[];
  params: DiodeParams;
  chartRef: React.RefObject<HTMLDivElement>;
}
```

**Verification:** CSV has correct format, JSON copies to clipboard, PNG captures chart correctly.

---

### Phase 9: Main App Integration
**File:** `src/App.tsx`

**Layout:**
- CSS Grid layout: sidebar (320px) + main content (flex)
- Sidebar contains: ParameterPanel, MetricsPanel, ComparisonPanel, ExportPanel
- Main content: I-V Plotter (top, 60%), Band Diagram (bottom, 40%)
- Theory Section below main content or in modal/section

**Theme Setup:**
- CSS variables for Dark Physics Lab theme
- Tailwind config extended with custom colors
- Global styles for animated numbers, glow effects

**Responsive Behavior:**
- Desktop: side-by-side layout
- Mobile: stacked layout (sidebar above main)

---

### Phase 10: Styling & Polish
**File:** `src/styles/index.css`

**Custom CSS:**
- Phosphor glow effects: `.glow-cyan { filter: drop-shadow(0 0 4px rgba(0, 212, 255, 0.5)); }`
- Scan line overlay: repeating-linear-gradient background
- Engineering grid background: background-image with linear-gradient
- Animated value transitions: CSS custom properties with transitions
- Custom scrollbar styling
- Focus states for accessibility

**Tailwind Extensions:**
```javascript
// tailwind.config.js
colors: {
  'lab-bg': '#0a0a0f',
  'lab-panel': '#12121a',
  'lab-cyan': '#00d4ff',
  'lab-amber': '#ffb800',
  'lab-gray': '#2a2a3a',
}
```

---

## Component Breakdown Summary

| Component | File | Lines (est) | Key Dependencies |
|-----------|------|-------------|------------------|
| Types | `types/index.ts` | 50 | None |
| Constants | `lib/constants.ts` | 40 | None |
| Physics | `lib/physics.ts` | 80 | None |
| Utils | `lib/utils.ts` | 40 | None |
| useTunnelDiode Hook | `hooks/useTunnelDiode.ts` | 150 | Physics, Utils |
| IVPlotter | `components/IVPlotter.tsx` | 180 | Recharts |
| ParameterPanel | `components/ParameterPanel.tsx` | 120 | None |
| MetricsPanel | `components/MetricsPanel.tsx` | 100 | None |
| BandDiagram | `components/BandDiagram.tsx` | 150 | None |
| TheorySection | `components/TheorySection.tsx` | 200 | KaTeX |
| ComparisonPanel | `components/ComparisonPanel.tsx` | 80 | None |
| ExportPanel | `components/ExportPanel.tsx` | 100 | None |
| App | `App.tsx` | 100 | All components |
| Styles | `styles/index.css` | 150 | Tailwind |

**Total Estimated Lines:** ~1,540

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        useTunnelDiode Hook                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ Parameters  │  │ I-V Curves   │  │ Operating Point    │  │
│  │ (Ip,Vp,...) │  │ (500 points) │  │ (V, I, Region)     │  │
│  └─────────────┘  └──────────────┘  └────────────────────┘  │
│  ┌─────────────┐  ┌──────────────┐                         │
│  │ Metrics     │  │ Snapshot     │                         │
│  │ (PVCR, etc) │  │ (saved curve)│                         │
│  └─────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌────────────────┐  ┌─────────────────┐  ┌────────────────────┐
│ ParameterPanel │  │ IVPlotter       │  │ MetricsPanel       │
│ (sliders)      │  │ (chart)         │  │ (displays)         │
└────────────────┘  └─────────────────┘  └────────────────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              ▼
                    ┌─────────────────┐
                    │ BandDiagram     │
                    │ (SVG)           │
                    └─────────────────┘
```

---

## Verification Strategy

**Manual Testing Checklist:**
1. [ ] Default parameters produce recognizable tunnel diode curve with NDR
2. [ ] Dragging Ip slider increases/decreases peak current
3. [ ] Dragging Vp slider shifts peak voltage
4. [ ] NDR region shading appears between Vp and Vv
5. [ ] Clicking chart sets active voltage and updates band diagram
6. [ ] Band diagram arrows correlate with current magnitude
7. [ ] Equations render with proper formatting in Theory section
8. [ ] CSV export contains 500 rows of data
9. [ ] Snapshot saves and displays overlay in amber
10. [ ] Randomize generates valid, different parameters

**Visual Verification:**
- Chart traces have phosphor glow effect
- Numbers animate smoothly between values
- All interactive elements have hover states
- Layout is responsive and usable on different screen sizes

---

## Critical Implementation Notes

1. **Physics calculations must be pure functions** - no React hooks in physics.ts
2. **Memoization** - Use useMemo in hook for I-V curve calculations
3. **TypeScript strict mode** - No `any` types allowed
4. **Component props** - Every component has explicit interface
5. **Recharts animation** - Set `isAnimationActive={true}` and `animationDuration={300}`
6. **KaTeX** - Import CSS in TheorySection or global styles
7. **Vite config** - Ensure proper TypeScript and path alias setup

---

## Post-Implementation Steps

1. Run dev server and verify all features work
2. Test export functionality (CSV, JSON, PNG)
3. Verify responsive layout on mobile viewport
4. Review code for any `any` types or inline physics calculations
5. Final visual polish (shadows, transitions, spacing)

---

*Plan created for Tunnel Diode Simulator - Dark Physics Lab aesthetic*
*Priority: Physics lib → Hook → I-V Plotter → Parameter Panel → Metrics Panel → Band Diagram → Theory Section → Comparison Mode → Export Panel → Integration → Polish*
