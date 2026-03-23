// Tunnel Diode Simulator - Main Application Component
// Integrates all panels and manages layout

import { useRef } from 'react';
import { useTunnelDiode } from './hooks/useTunnelDiode';
import IVPlotter from './components/IVPlotter';
import ParameterPanel from './components/ParameterPanel';
import MetricsPanel from './components/MetricsPanel';
import BandDiagram from './components/BandDiagram';
import TheorySection from './components/TheorySection';
import ComparisonPanel from './components/ComparisonPanel';
import ExportPanel from './components/ExportPanel';
import LabBackground from './components/LabBackground';
import { Activity, Zap } from 'lucide-react';
import { Badge } from './components/ui/badge';
import { Card, CardContent } from './components/ui/card';
import './styles/index.css';

function App() {
  const {
    params,
    setParam,
    resetToDefaults,
    randomizeParams,
    data,
    peak,
    valley,
    metrics,
    operatingPoint,
    setOperatingVoltage,
    snapshot,
    saveSnapshot,
    clearSnapshot,
    snapshotVisible,
    toggleSnapshotVisible,
    visibleSeries,
    toggleSeries,
    paramDefinitions,
  } = useTunnelDiode();

  const chartRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-lab-bg text-lab-text">
      <LabBackground />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.16),transparent_36%),radial-gradient(circle_at_80%_70%,rgba(217,70,239,0.12),transparent_44%)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-lab-panel/70 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-sm border border-lab-cyan/50 bg-lab-cyan/15 p-2 shadow-[0_0_20px_rgba(34,211,238,0.26)]">
              <Zap size={24} className="text-lab-cyan" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold uppercase tracking-[0.2em] text-lab-cyan">
                Tunnel Diode Simulator
              </h1>
              <p className="text-xs text-zinc-400">
                Quantum Lab Instrument
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Badge variant="cyan">Live Compute</Badge>
            <Badge variant={snapshot ? 'amber' : 'gray'}>
              {snapshot ? 'Snapshot Ready' : 'No Snapshot'}
            </Badge>
          </div>

          <div className="hidden grid-cols-2 gap-x-4 gap-y-1 rounded-md border border-lab-cyan/25 bg-lab-bg/75 px-4 py-2 text-xs font-mono text-zinc-300 shadow-[0_0_24px_rgba(0,0,0,0.35)] xl:grid">
            <span className="whitespace-nowrap">Ip: {params.Ip.toFixed(2)}mA</span>
            <span className="whitespace-nowrap">Vp: {params.Vp.toFixed(3)}V</span>
            <span className="whitespace-nowrap">Iv: {params.Iv.toFixed(2)}mA</span>
            <span className="whitespace-nowrap">Vv: {params.Vv.toFixed(2)}V</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1800px] px-6 py-10 lg:px-8">
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <ParameterPanel
                className="h-full min-h-[42rem]"
                params={params}
                paramDefinitions={paramDefinitions}
                onParamChange={setParam}
                onReset={resetToDefaults}
                onRandomize={randomizeParams}
              />
            </div>

            <div className="xl:col-span-8">
              <Card className="living-panel h-full min-h-[42rem] p-0">
                <CardContent className="oscilloscope-surface h-full rounded-md p-6">
                  <div ref={chartRef} className="h-full">
                    <IVPlotter
                      data={data}
                      snapshotData={snapshot?.data}
                      snapshotVisible={snapshotVisible}
                      peak={peak}
                      valley={valley}
                      visibleSeries={visibleSeries}
                      onToggleSeries={toggleSeries}
                      onChartClick={setOperatingVoltage}
                      activeVoltage={operatingPoint.voltage}
                      Vp={params.Vp}
                      Vv={params.Vv}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <MetricsPanel
                metrics={metrics}
                operatingPoint={operatingPoint}
                onVoltageProbe={setOperatingVoltage}
              />
            </div>

            <div className="xl:col-span-8">
              <BandDiagram
                voltage={operatingPoint.voltage}
                current={operatingPoint.current}
                params={params}
                region={operatingPoint.region}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
            <div className="xl:col-span-4">
              <ComparisonPanel
                snapshot={snapshot}
                currentParams={params}
                onSaveSnapshot={saveSnapshot}
                onClearSnapshot={clearSnapshot}
                onToggleOverlay={toggleSnapshotVisible}
                overlayVisible={snapshotVisible}
              />
            </div>

            <div className="xl:col-span-8">
              <TheorySection />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
            <div className="xl:col-span-12">
              <ExportPanel
                data={data}
                params={params}
                chartRef={chartRef}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-14 border-t border-white/10 py-7">
        <div className="mx-auto flex max-w-[1800px] flex-col items-center justify-between gap-3 px-6 text-center text-sm text-zinc-400 lg:flex-row lg:px-8 lg:text-left">
          <p className="max-w-4xl">
            I-V curve modeled as{' '}
            <span className="font-mono text-lab-cyan">
              I_tunnel(V) = Ip·(V/Vp)·exp(1-V/Vp)
            </span>{' '}
            and{' '}
            <span className="font-mono text-lab-amber">
              I_diffusion(V) = Iv·exp(α(V-Vv))
            </span>
          </p>
          <div className="flex items-center gap-2 text-lab-cyan">
            <Activity size={16} />
            <span className="font-heading text-xs uppercase tracking-[0.12em]">Instrument Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
