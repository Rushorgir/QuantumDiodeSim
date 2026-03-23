// Tunnel Diode Simulator - Export Panel Component
// CSV, JSON, and PNG export functionality

import React, { useState, useCallback, useRef } from 'react';
import { Download, Copy, Image as ImageIcon, Check } from 'lucide-react';
import type { DiodeParams, IVDataPoint } from '../types';
import { downloadCSV, copyParamsToClipboard } from '../lib/utils';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ExportPanelProps {
  data: IVDataPoint[];
  params: DiodeParams;
  chartRef?: React.RefObject<HTMLDivElement | null>;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  data,
  params,
  chartRef,
}) => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Export I-V data as CSV
  const handleExportCSV = useCallback(() => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    downloadCSV(data, `tunnel-diode-iv-${timestamp}.csv`);
  }, [data]);

  // Copy parameters as JSON
  const handleCopyJSON = useCallback(async () => {
    const success = await copyParamsToClipboard(params);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [params]);

  // Export chart as PNG
  const handleExportPNG = useCallback(() => {
    // Find the SVG element in the chart container
    const svgElement = chartRef?.current?.querySelector('svg');

    if (!svgElement) {
      console.error('Chart SVG not found');
      return;
    }

    // Clone the SVG to modify it for export
    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

    // Add white background
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('fill', '#12121a');
    clonedSvg.insertBefore(bgRect, clonedSvg.firstChild);

    // Serialize SVG
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(svgBlob);

    // Create canvas
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match SVG
    const svgRect = svgElement.getBoundingClientRect();
    canvas.width = svgRect.width * 2; // 2x for retina
    canvas.height = svgRect.height * 2;

    // Create image
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#12121a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Download
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `tunnel-diode-chart-${timestamp}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [chartRef]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* CSV Export */}
        <Button
          onClick={handleExportCSV}
          variant="secondary"
          className="h-auto w-full justify-between px-4 py-3 text-left"
          data-testid="export-csv"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-lab-cyan/10 p-2 transition-all duration-300 group-hover:scale-105 group-hover:bg-lab-cyan/20">
              <Download size={18} className="text-lab-cyan" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-lab-text">Export CSV</p>
              <p className="text-xs text-zinc-400">
                {data.length} data points
              </p>
            </div>
          </div>
          <Download size={16} className="text-zinc-500 transition-all duration-300 group-hover:translate-y-[-1px] group-hover:text-lab-cyan" />
        </Button>

        {/* JSON Copy */}
        <Button
          onClick={handleCopyJSON}
          variant="secondary"
          className="h-auto w-full justify-between px-4 py-3 text-left"
          data-testid="export-copy-json"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-lab-amber/10 p-2 transition-all duration-300 group-hover:scale-105 group-hover:bg-lab-amber/20">
              {copied ? (
                <Check size={18} className="text-green-400" />
              ) : (
                <Copy size={18} className="text-lab-amber" />
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-lab-text">Copy Parameters</p>
              <p className="text-xs text-zinc-400">
                {copied ? 'Copied!' : 'JSON to clipboard'}
              </p>
            </div>
          </div>
          <Copy size={16} className="text-zinc-500 transition-all duration-300 group-hover:translate-y-[-1px] group-hover:text-lab-amber" />
        </Button>

        {/* PNG Export */}
        <Button
          onClick={handleExportPNG}
          disabled={!chartRef?.current}
          variant="secondary"
          className="h-auto w-full justify-between px-4 py-3 text-left"
          data-testid="export-png"
        >
          <div className="flex items-center gap-3"
          >
            <div className="rounded-md bg-green-400/10 p-2 transition-all duration-300 group-hover:scale-105 group-hover:bg-green-400/20"
            >
              <ImageIcon size={18} className="text-green-400" />
            </div>
            <div className="text-left"
            >
              <p className="text-sm font-medium text-lab-text">Export Chart</p>
              <p className="text-xs text-zinc-400">PNG image</p>
            </div>
          </div>
          <ImageIcon size={16} className="text-zinc-500 transition-all duration-300 group-hover:translate-y-[-1px] group-hover:text-green-400" />
        </Button>
      </CardContent>

      {/* Hidden canvas for PNG export */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Card>
  );
};

export default ExportPanel;
