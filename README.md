<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:00d4ff,100:ffb800&height=200&section=header&text=QuantumDiodeSim&fontSize=40&fontColor=ffffff&animation=fadeIn&fontAlignY=35" alt="QuantumDiodeSim Banner"/>
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=22&pause=1000&color=00d4ff&background=FFFFFF00&center=true&vCenter=true&width=650&lines=Tunnel+Diode+I-V+Characteristics+Simulator;Real-time+Physics+Visualization;Interactive+Band+Diagrams+%7C+Parameter+Control;Built+with+React+%7C+TypeScript+%7C+Vite" alt="Typing SVG"/>
</p>

<p align="center">
	<img src="https://img.shields.io/badge/TypeScript-3776AB?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
	<img src="https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
	<img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
	<img src="https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
	<img src="https://img.shields.io/badge/Recharts-charting-8884d8?style=for-the-badge" alt="Recharts"/>
	<img src="https://img.shields.io/badge/KaTeX-math-000000?style=for-the-badge&logo=latex&logoColor=white" alt="KaTeX"/>
	<img src="https://img.shields.io/badge/License-MIT-brightgreen?style=for-the-badge" alt="MIT License"/>
</p>

---

## 📌 Overview
**QuantumDiodeSim** is a **professional physics laboratory instrument** for visualizing tunnel diode (Esaki diode) I-V characteristics with real-time animated charts, interactive band diagrams, and comprehensive parameter controls. Designed for educational and research use with a dark, retro-futurist "Quantum Lab" aesthetic.

Built in **React 18+ with TypeScript**, powered by **Vite**, and styled with **Tailwind CSS** for responsive, accessible physics visualization.

---

## ✨ Features
- 📊 **Real-time I-V Curve Plotting** — Animated Recharts visualization with tunneling & diffusion components
- 🔧 **Interactive Parameter Controls** — Adjustable peak/valley currents, voltages, and diffusion coefficients
- 📈 **Negative Differential Resistance (NDR) Detection** — Shaded regions highlight physics anomalies
- 🧬 **Energy Band Diagrams** — SVG-based visualization with animated electron tunneling
- 📋 **Device Metrics** — Operating point analysis, NDR region indicators, real-time calculations
- 🔀 **Comparison Mode** — Snapshot overlays for side-by-side parameter exploration
- 📚 **Theory Section** — Mathematical equations, region explanations, physics references (KaTeX)
- 💾 **Export Options** — CSV, JSON, PNG chart export for data analysis
- 🎨 **Dark Lab Theme** — Electric cyan & amber accents, oscilloscope-inspired UI
- ♿ **Accessibility First** — High contrast, WCAG 2.1 AA compliance, keyboard navigation

---

## ⚙️ Configuration

### **Physics Parameters** (`src/lib/constants.ts`):
```typescript
DEFAULT_PARAMS {
  Ip: 1.5,     // Peak tunneling current (mA)
  Vp: 0.07,    // Peak voltage (V)
  Iv: 0.5,     // Valley current (mA)
  Vv: 0.35,    // Valley voltage (V)
  α: 12        // Diffusion coefficient (V⁻¹)
}

PARAM_RANGES {
  Ip: [0.1, 5],       // mA
  Vp: [0.01, 0.2],    // V
  Iv: [0.01, 1],      // mA (capped at valley current limit)
  Vv: [0.1, 0.6],     // V
  α: [1, 30]          // V⁻¹
}
```

---

## 🔬 Physics Model

**Current Calculation:**
```
I_tunnel(V) = Ip × (V / Vp) × exp(1 - V / Vp)
I_diffusion(V) = Iv × exp(α × (V - Vv))
I_total(V) = I_tunnel(V) + I_diffusion(V)
```

**Voltage Sweep:** 0 to 0.6 V in 500 discrete steps

**NDR Region:** Automatically detected between peak (Vp) and valley (Vv) voltages where dI/dV < 0.

---

## 🖼️ Key Metrics

The **Device Metrics Panel** displays:
- **Peak Current (Ip):** Maximum tunneling current
- **Valley Current (Iv):** Minimum after NDR
- **Peak-to-Valley Ratio:** Measure of diode quality
- **Operating Point:** Current at selected voltage
- **NDR Magnitude:** Negative resistance value
- **Operating Region:** Tunneling / NDR / Diffusion classification

---

## 🚀 Advanced Features

### **Real-time Comparison**
- Save current parameter snapshot
- Overlay against new parameters
- Toggle visibility for visual A/B testing

### **Microinteractions**
- Hover glows on controls
- Animated parameter transitions
- Scanline/CRT effects (optional via guidelines)
- Smooth chart transitions (300ms animations)

### **Export Capabilities**
- **CSV:** Raw I-V data for external analysis
- **JSON:** Full state snapshot for reproducibility
- **PNG:** High-DPI chart export for reports

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:00d4ff,100:ffb800&height=100&section=footer"/>
</p>
