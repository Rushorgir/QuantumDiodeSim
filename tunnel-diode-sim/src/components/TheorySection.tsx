// Tunnel Diode Simulator - Theory Section Component
// Educational content with KaTeX equation rendering

import React, { useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface TheorySectionProps {}

interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="border-b border-lab-gray/30 last:border-b-0">
      <button
        onClick={onToggle}
        className="group flex w-full items-center justify-between rounded-md px-2 py-4 transition-all duration-300 hover:bg-lab-bg/30"
        data-testid={`theory-toggle-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
      >
        <span className="text-sm font-semibold text-lab-text transition-colors duration-300 group-hover:text-lab-cyan">{title}</span>
        <span className={`text-lab-cyan transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-500 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-4 px-2">{children}</div>
      </div>
    </div>
  );
};

export const TheorySection: React.FC<TheorySectionProps> = () => {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));

  const toggleSection = (index: number) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theory & Physics</CardTitle>
      </CardHeader>

      <CardContent className="space-y-1">
        {/* Quantum Tunneling Section */}
        <AccordionItem
          title="Quantum Tunneling"
          isOpen={openSections.has(0)}
          onToggle={() => toggleSection(0)}
        >
          <div className="text-sm text-lab-text leading-relaxed space-y-3">
            <p>
              Tunnel diodes exploit the quantum mechanical phenomenon of
              <strong className="text-lab-cyan">tunneling</strong>, where electrons pass
              through a potential barrier that they classically shouldn't be able
              to cross.
            </p>

            <p>
              In a heavily doped p-n junction, the depletion region is extremely
              narrow (&lt;10 nm). When a small forward bias is applied, electrons
              in the valence band of the p-side can tunnel directly to the
              conduction band of the n-side.
            </p>

            <div className="bg-lab-bg/50 rounded-lg p-4 my-4 border border-lab-gray/20">
              <p className="text-xs text-lab-gray mb-2">Tunneling Current:</p>
              <div className="text-lab-cyan overflow-x-auto">
                <BlockMath
                  math="I_{tunnel}(V) = I_p \cdot \frac{V}{V_p} \cdot \exp\left(1 - \frac{V}{V_p}\right)"
                />
              </div>
            </div>

            <p>
              This equation describes how tunneling current rises linearly with
              voltage initially, then peaks at
              <InlineMath math="V_p" /> before rapidly
              declining as the tunneling probability decreases.
            </p>
          </div>
        </AccordionItem>

        {/* Esaki Diode Section */}
        <AccordionItem
          title="Esaki Diode & Heavy Doping"
          isOpen={openSections.has(1)}
          onToggle={() => toggleSection(1)}
        >
          <div className="text-sm text-lab-text leading-relaxed space-y-3">
            <p>
              The tunnel diode was invented by Leo Esaki in 1957, earning him the
              1973 Nobel Prize in Physics. He discovered that heavily doped
              germanium junctions exhibited a negative resistance region.
            </p>

            <p>
              Key characteristics of Esaki diodes:
            </p>

            <ul className="list-disc list-inside space-y-1 text-lab-gray ml-2">
              <li>Doping concentration: 10¹⁹ to 10²⁰ atoms/cm³</li>
              <li>Depletion width: &lt; 10 nm (extremely narrow)</li>
              <li>Switching speed: &lt; 1 ps (extremely fast)</li>
              <li>Operating voltage: &lt; 1V</li>
            </ul>

            <p className="mt-3">
              The heavy doping causes the Fermi levels to shift into the
              conduction band (n-side) and valence band (p-side), enabling the
              tunneling current.
            </p>
          </div>
        </AccordionItem>

        {/* I-V Characteristics Section */}
        <AccordionItem
          title="I-V Characteristics"
          isOpen={openSections.has(2)}
          onToggle={() => toggleSection(2)}
        >
          <div className="text-sm text-lab-text leading-relaxed space-y-3">
            <p>
              The total current in a tunnel diode is the sum of tunneling and
              diffusion components:
            </p>

            <div className="bg-lab-bg/50 rounded-lg p-4 my-4 border border-lab-gray/20">
              <p className="text-xs text-lab-gray mb-2">Total Current:</p>
              <div className="text-lab-cyan overflow-x-auto">
                <BlockMath
                  math="I_{total}(V) = I_{tunnel}(V) + I_{diffusion}(V)"
                />
              </div>
            </div>

            <p>Where the diffusion current follows:</p>

            <div className="bg-lab-bg/50 rounded-lg p-4 my-4 border border-lab-gray/20">
              <p className="text-xs text-lab-gray mb-2">Diffusion Current:</p>
              <div className="text-lab-amber overflow-x-auto">
                <BlockMath
                  math="I_{diffusion}(V) = I_v \cdot \exp\left(\alpha(V - V_v)\right)"
                />
              </div>
            </div>

            <p>
              The interplay between these two components creates the
              characteristic N-shaped I-V curve with its distinctive{' '}
              <strong className="text-lab-amber">negative resistance</strong> region.
            </p>
          </div>
        </AccordionItem>

        {/* Operation Regions Section */}
        <AccordionItem
          title="Operating Regions"
          isOpen={openSections.has(3)}
          onToggle={() => toggleSection(3)}
        >
          <div className="text-sm text-lab-text">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-lab-gray/30">
                    <th className="py-2 px-2 text-lab-cyan font-semibold">
                      Region
                    </th>
                    <th className="py-2 px-2 text-lab-cyan font-semibold">
                      Voltage Range
                    </th>
                    <th className="py-2 px-2 text-lab-cyan font-semibold">
                      Dominant Physics
                    </th>
                    <th className="py-2 px-2 text-lab-cyan font-semibold">
                      Application
                    </th>
                  </tr>
                </thead>
                <tbody className="text-lab-text">
                  <tr className="border-b border-lab-gray/10">
                    <td className="py-3 px-2 font-mono text-lab-cyan">
                      Tunneling
                    </td>
                    <td className="py-3 px-2">
                      <InlineMath math="0 \leq V < V_p" />
                    </td>
                    <td className="py-3 px-2">
                      Quantum tunneling through thin barrier
                    </td>
                    <td className="py-3 px-2">
                      Ultra-fast switching (&lt;1 ps)
                    </td>
                  </tr>
                  <tr className="border-b border-lab-gray/10">
                    <td className="py-3 px-2 font-mono text-lab-amber">
                      NDR
                    </td>
                    <td className="py-3 px-2">
                      <InlineMath math="V_p \leq V \leq V_v" />
                    </td>
                    <td className="py-3 px-2">
                      Decreasing tunneling, increasing diffusion
                    </td>
                    <td className="py-3 px-2">
                      Oscillators, amplifiers
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-2 font-mono text-green-400">
                      Diffusion
                    </td>
                    <td className="py-3 px-2">
                      <InlineMath math="V > V_v" />
                    </td>
                    <td className="py-3 px-2">
                      Thermal diffusion over barrier
                    </td>
                    <td className="py-3 px-2">
                      Standard diode operation
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-lab-bg/50 rounded-lg border border-lab-gray/20">
              <h4 className="text-sm font-semibold text-lab-cyan mb-2">
                Real-World Applications
              </h4>
              <ul className="list-disc list-inside space-y-1 text-lab-text">
                <li>High-frequency oscillators (GHz range)</li>
                <li>Low-noise microwave amplifiers</li>
                <li>Ultra-fast logic circuits</li>
                <li>Frequency converters and mixers</li>
                <li>Trigger circuits and pulse generators</li>
                <li>Memory storage (historical)</li>
              </ul>
            </div>
          </div>
        </AccordionItem>
      </CardContent>
    </Card>
  );
};

export default TheorySection;
