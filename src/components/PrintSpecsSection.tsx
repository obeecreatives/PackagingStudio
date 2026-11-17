import React from 'react';
import { Download, FileText } from 'lucide-react';
import {
  BEAN_VARIANTS,
  getWeightSpecs,
  PackagingConfig,
  POUCH_SHAPES,
  ROAST_LEVELS,
} from '../types/packaging';
import { getPrintSpecificationRows } from '../data/packagingSpecs';
import { ExportScope } from '../utils/exportPrintArtwork';

interface PrintSpecsSectionProps {
  config: PackagingConfig;
  onExport: (scope: ExportScope) => void;
  isExporting: boolean;
  onExportPdf: () => void;
  isExportingPdf: boolean;
}

export function PrintSpecsSection({
  config,
  onExport,
  isExporting,
  onExportPdf,
  isExportingPdf,
}: PrintSpecsSectionProps) {
  const shapeMeta = POUCH_SHAPES[config.pouchShape];
  const weightSpecs = getWeightSpecs(config.pouchShape, config.netWeight);
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];

  const fullSpecs = React.useMemo(() => getPrintSpecificationRows(config), [config]);

  return (
    <section id="spesifikasi-cetak" className="py-20 border-t border-[#1A1412]/10">
      <div className="max-w-[1360px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#8A6429]">
              Panduan Produksi Percetakan
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1A1412] leading-tight">
              Spesifikasi Teknis Full Print &amp; Unduh File
            </h2>
            <p className="mt-3 text-[15px] text-[#574D47] leading-relaxed">
              Unduh file siap cetak lengkap atau{' '}
              <strong className="font-semibold text-[#1A1412]">background murni tanpa teks &amp; logo</strong> untuk{' '}
              <strong className="font-semibold text-[#1A1412]">
                {shapeMeta.code} · {shapeMeta.shortLabel} ({config.netWeight})
              </strong>{' '}
              · {variant.frontLabel} · {roast.label}.
            </p>

            {/* Dossier PDF Lengkap (00 - 04) */}
            <div className="mt-7 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6429]">
                Ekspor Dokumen Dossier PDF Lengkap (Bagian 00 – 04)
              </p>
              <button
                type="button"
                disabled={isExportingPdf}
                onClick={onExportPdf}
                className="w-full min-h-[44px] flex items-center justify-between gap-3 px-5 py-3 bg-[#8A6429] text-[#FAF5EB] hover:bg-[#73511D] disabled:opacity-60 rounded-lg transition-colors cursor-pointer text-left"
              >
                <span className="text-sm font-semibold leading-snug">
                  {isExportingPdf
                    ? 'Menyusun PDF Dossier...'
                    : `Ekspor PDF Lengkap (${shapeMeta.shortLabel} · ${config.netWeight})`}
                </span>
                <FileText className="w-4 h-4 text-[#FAF5EB] shrink-0" />
              </button>
            </div>

            {/* Full Print With Text & Logo */}
            <div className="mt-6 pt-5 border-t border-[#1A1412]/10 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#574D47]">
                Desain Lengkap ({config.netWeight} · Dengan Teks &amp; Logo)
              </p>
              <button
                type="button"
                disabled={isExporting}
                onClick={() => onExport('full-dieline')}
                className="w-full min-h-[44px] flex items-center justify-between gap-3 px-5 py-3 bg-[#1A1412] text-[#FAF5EB] hover:bg-[#31221B] disabled:opacity-60 rounded-lg transition-colors cursor-pointer text-left"
              >
                <span className="text-sm font-medium leading-snug">
                  Unduh Sheet Full Print ({shapeMeta.shortLabel} · {config.netWeight})
                </span>
                <Download className="w-4 h-4 text-[#D8B474] shrink-0" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => onExport('front-only')}
                  className="min-h-[44px] flex items-center justify-between px-4 py-2.5 bg-[#EFECE6] hover:bg-[#E6E0D6] text-[#1A1412] border border-[#1A1412]/15 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span className="text-xs font-semibold">Panel Depan ({config.netWeight})</span>
                  <Download className="w-3.5 h-3.5 text-[#8A6429] shrink-0" />
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => onExport('back-only')}
                  className="min-h-[44px] flex items-center justify-between px-4 py-2.5 bg-[#EFECE6] hover:bg-[#E6E0D6] text-[#1A1412] border border-[#1A1412]/15 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span className="text-xs font-semibold">Panel Belakang ({config.netWeight})</span>
                  <Download className="w-3.5 h-3.5 text-[#8A6429] shrink-0" />
                </button>
              </div>
            </div>

            {/* Pure Background Only (No Text, No Logo, No Marks) */}
            <div className="mt-6 pt-5 border-t border-[#1A1412]/10 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6429]">
                Background Saja (Tanpa Teks, Logo &amp; Garis Potong)
              </p>
              <button
                type="button"
                disabled={isExporting}
                onClick={() => onExport('bg-full-dieline')}
                className="w-full min-h-[44px] flex items-center justify-between gap-3 px-5 py-3 bg-[#8A6429] text-[#FAF5EB] hover:bg-[#73511D] disabled:opacity-60 rounded-lg transition-colors cursor-pointer text-left"
              >
                <span className="text-sm font-medium leading-snug">
                  Unduh Background Murni Full Sheet ({config.netWeight})
                </span>
                <Download className="w-4 h-4 text-[#FAF5EB] shrink-0" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => onExport('bg-front-only')}
                  className="min-h-[44px] flex items-center justify-between px-4 py-2.5 bg-white hover:bg-[#EFECE6] text-[#1A1412] border border-[#8A6429]/40 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span className="text-xs font-semibold">Background Depan ({config.netWeight})</span>
                  <Download className="w-3.5 h-3.5 text-[#8A6429] shrink-0" />
                </button>
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={() => onExport('bg-back-only')}
                  className="min-h-[44px] flex items-center justify-between px-4 py-2.5 bg-white hover:bg-[#EFECE6] text-[#1A1412] border border-[#8A6429]/40 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span className="text-xs font-semibold">Background Belakang ({config.netWeight})</span>
                  <Download className="w-3.5 h-3.5 text-[#8A6429] shrink-0" />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#EFECE6] rounded-xl border border-[#1A1412]/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1A1412]/10 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#574D47]">
                Lembar Spesifikasi Kemasan
              </span>
              <span className="font-mono text-xs text-[#8A6429] tabular-nums">
                {shapeMeta.code} · {config.netWeight} · {weightSpecs.dimensions}
              </span>
            </div>
            <dl className="divide-y divide-[#1A1412]/10">
              {fullSpecs.map((row) => (
                <div
                  key={row.label}
                  className="px-6 py-3.5 grid grid-cols-1 sm:grid-cols-12 gap-2 items-baseline"
                >
                  <dt className="sm:col-span-5 text-xs font-medium text-[#574D47]">{row.label}</dt>
                  <dd className="sm:col-span-7 text-sm font-medium text-[#1A1412] font-mono sm:text-right tabular-nums">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
