import React, { useEffect, useState } from 'react';
import { Download, X, ZoomIn, ZoomOut } from 'lucide-react';
import { getWeightSpecs, isTallGusset, PackagingConfig, POUCH_SHAPES } from '../types/packaging';
import { LiveMockupScene, MockupSceneMode } from './LiveMockupScene';
import { BackPanel, FrontPanel, FullPrintDieline, InteractivePouch3D } from './PackagingPanels';
import {
  ArunikaSunBeanCrest,
  BotanicalCornerArt,
  Ean13Barcode,
  KthEastJavaSeal,
  MandalaHeritageCrest,
  RoastProfileCrest,
} from './BrandCrests';
import { renderAndDownloadMockup } from '../utils/exportMockupScene';
import { renderAndDownloadPrintSheet } from '../utils/exportPrintArtwork';
import { downloadImageAsset, downloadSvgAsPng, downloadSvgElement } from '../utils/exportSingleElement';

export type ExpandPreviewTarget =
  | {
      kind: 'mockup';
      title: string;
      subtitle: string;
      config: PackagingConfig;
      initialScene: MockupSceneMode;
      backgroundOnly?: boolean;
    }
  | {
      kind: 'panel';
      title: string;
      subtitle: string;
      config: PackagingConfig;
      panel: 'front' | 'back' | 'dieline' | '3d';
      backgroundOnly?: boolean;
    }
  | {
      kind: 'image';
      title: string;
      subtitle: string;
      src: string;
      filename: string;
      bgClass?: string;
    }
  | {
      kind: 'vector';
      title: string;
      subtitle: string;
      slug: string;
      pngSize?: [number, number];
      roastTop: string;
      roastBottom: string;
      beanLabel: string;
    };

interface ExpandPreviewModalProps {
  target: ExpandPreviewTarget | null;
  onClose: () => void;
}

type ModalMockupTab = MockupSceneMode | 'panel-front' | 'panel-back';

export function ExpandPreviewModal({ target, onClose }: ExpandPreviewModalProps) {
  const [mockupTab, setMockupTab] = useState<ModalMockupTab>('natural-kawi');
  const [zoomed, setZoomed] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!target) return;
    setZoomed(false);
    if (target.kind === 'mockup') {
      setMockupTab(target.initialScene);
    }
  }, [target]);

  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [target, onClose]);

  if (!target) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      if (target.kind === 'mockup') {
        if (mockupTab === 'panel-front') {
          await renderAndDownloadPrintSheet(target.config, target.backgroundOnly ? 'bg-front-only' : 'front-only');
        } else if (mockupTab === 'panel-back') {
          await renderAndDownloadPrintSheet(target.config, target.backgroundOnly ? 'bg-back-only' : 'back-only');
        } else {
          await renderAndDownloadMockup(target.config, mockupTab);
        }
      } else if (target.kind === 'panel') {
        const scope =
          target.panel === 'front'
            ? target.backgroundOnly
              ? 'bg-front-only'
              : 'front-only'
            : target.panel === 'back'
              ? target.backgroundOnly
                ? 'bg-back-only'
                : 'back-only'
              : target.backgroundOnly
                ? 'bg-full-dieline'
                : 'full-dieline';
        await renderAndDownloadPrintSheet(target.config, scope);
      } else if (target.kind === 'image') {
        await downloadImageAsset(target.src, target.filename);
      } else if (target.kind === 'vector') {
        const svg = document.querySelector(`[data-modal-vector="${target.slug}"] svg`) as SVGSVGElement | null;
        const size = target.pngSize ?? [1200, 1200];
        downloadSvgAsPng(svg, target.slug, size[0], size[1]);
      }
    } finally {
      setDownloading(false);
    }
  };

  const renderVectorElement = (t: Extract<ExpandPreviewTarget, { kind: 'vector' }>) => {
    switch (t.slug) {
      case 'arunika-emblem-utama':
        return <ArunikaSunBeanCrest className="w-56 h-56" />;
      case 'arunika-bingkai-roast':
        return <RoastProfileCrest topText={t.roastTop} bottomText={t.roastBottom} className="w-72" />;
      case 'arunika-mandala-heritage':
        return <MandalaHeritageCrest label={t.beanLabel} className="w-60 h-60" />;
      case 'arunika-botani-daun-kopi':
        return <BotanicalCornerArt className="w-60 h-60" />;
      case 'arunika-stempel-kth-emas':
        return <KthEastJavaSeal variant="gold-heritage" className="w-56 h-56" />;
      case 'arunika-stempel-kth-hijau':
        return <KthEastJavaSeal variant="original-green" className="w-56 h-56" />;
      case 'arunika-barcode-ean13':
        return <Ean13Barcode className="w-72 h-32" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#120C09]/92 backdrop-blur-sm flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={target.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Bar */}
      <div className="shrink-0 px-4 sm:px-6 py-3 bg-[#1A120E] border-b border-[#D8B474]/20 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#FAF5EB] truncate">{target.title}</h3>
          <p className="text-xs text-[#CBBBA8] truncate">{target.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {target.kind === 'mockup' && (
            <div className="hidden md:inline-flex items-center gap-1 p-1 bg-[#2A1D16] rounded-lg border border-[#D8B474]/15">
              {(
                [
                  { id: 'natural-kawi', label: 'Suasana Natural' },
                  { id: 'studio-front', label: 'Studio Depan' },
                  { id: 'studio-rear', label: 'Studio Belakang' },
                  { id: 'panel-front', label: 'Panel Depan' },
                  { id: 'panel-back', label: 'Panel Belakang' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMockupTab(tab.id)}
                  className={`px-2.5 py-1.5 min-h-[36px] text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    mockupTab === tab.id
                      ? 'bg-[#D8B474] text-[#1A120E]'
                      : 'text-[#FAF5EB]/80 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#2A1D16] hover:bg-[#3A2920] text-[#FAF5EB] border border-[#D8B474]/20 rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            {zoomed ? <ZoomOut className="w-4 h-4 text-[#D8B474]" /> : <ZoomIn className="w-4 h-4 text-[#D8B474]" />}
            <span>{zoomed ? 'Sesuai Layar' : 'Perbesar 1.6x'}</span>
          </button>

          {target.kind === 'vector' && (
            <button
              type="button"
              onClick={() => {
                const svg = document.querySelector(`[data-modal-vector="${target.slug}"] svg`) as SVGSVGElement | null;
                downloadSvgElement(svg, target.slug);
              }}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#2A1D16] hover:bg-[#3A2920] text-[#FAF5EB] border border-[#D8B474]/20 rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-[#D8B474]" />
              <span>SVG</span>
            </button>
          )}

          <button
            type="button"
            disabled={downloading}
            onClick={handleDownload}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#8A6429] hover:bg-[#73511D] disabled:opacity-60 text-[#FAF5EB] rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Memproses...' : target.kind === 'vector' ? 'PNG' : 'Unduh Gambar'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pratinjau"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-[#2A1D16] hover:bg-[#3A2920] text-[#FAF5EB] rounded-md border border-[#D8B474]/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Mockup Tab Switcher */}
      {target.kind === 'mockup' && (
        <div className="md:hidden shrink-0 px-4 py-2 bg-[#160F0C] border-b border-[#D8B474]/15 overflow-x-auto flex items-center gap-1.5">
          {(
            [
              { id: 'natural-kawi', label: 'Suasana Natural' },
              { id: 'studio-front', label: 'Studio Depan' },
              { id: 'studio-rear', label: 'Studio Belakang' },
              { id: 'panel-front', label: 'Panel Depan' },
              { id: 'panel-back', label: 'Panel Belakang' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMockupTab(tab.id)}
              className={`px-3 py-1.5 min-h-[38px] text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                mockupTab === tab.id ? 'bg-[#D8B474] text-[#1A120E]' : 'bg-[#2A1D16] text-[#FAF5EB]/85'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Viewport */}
      <div
        className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className={`transition-transform duration-200 origin-center ${zoomed ? 'scale-[1.55]' : 'scale-100'}`}
        >
          {target.kind === 'mockup' && (
            <>
              {(mockupTab === 'natural-kawi' || mockupTab === 'studio-front' || mockupTab === 'studio-rear') && (
                <div
                  className={`w-[min(88vw,560px)] ${
                    mockupTab === 'natural-kawi' ? 'aspect-[3/4] bg-[#1D120D]' : 'aspect-square bg-white'
                  } rounded-xl overflow-hidden shadow-2xl ring-1 ring-[#D8B474]/30`}
                >
                  <LiveMockupScene
                    config={target.config}
                    scene={mockupTab}
                    size="hero"
                    backgroundOnly={target.backgroundOnly}
                  />
                </div>
              )}

              {(mockupTab === 'panel-front' || mockupTab === 'panel-back') && (
                <div
                  className={`w-[min(86vw,440px)] ${
                    isTallGusset(target.config.pouchShape)
                      ? 'aspect-[100/240] rounded-sm'
                      : target.config.pouchShape === 'doypack-valve'
                        ? 'aspect-[150/220] rounded-xl'
                        : 'aspect-[130/210] rounded-sm'
                  } overflow-hidden shadow-2xl ring-1 ring-[#D8B474]/35`}
                >
                  {mockupTab === 'panel-front' ? (
                    <FrontPanel
                      config={target.config}
                      showValveGraphic={target.config.pouchShape === 'doypack-valve' && !target.backgroundOnly}
                      backgroundOnly={target.backgroundOnly}
                    />
                  ) : (
                    <BackPanel config={target.config} backgroundOnly={target.backgroundOnly} />
                  )}
                </div>
              )}
            </>
          )}

          {target.kind === 'panel' && (
            <>
              {target.panel === 'front' && (
                <div
                  className={`w-[min(86vw,460px)] ${
                    isTallGusset(target.config.pouchShape)
                      ? 'aspect-[100/240] rounded-sm'
                      : target.config.pouchShape === 'doypack-valve'
                        ? 'aspect-[150/220] rounded-xl'
                        : 'aspect-[130/210] rounded-sm'
                  } overflow-hidden shadow-2xl ring-1 ring-[#D8B474]/35`}
                >
                  <FrontPanel
                    config={target.config}
                    showValveGraphic={target.config.pouchShape === 'doypack-valve' && !target.backgroundOnly}
                    backgroundOnly={target.backgroundOnly}
                  />
                </div>
              )}
              {target.panel === 'back' && (
                <div
                  className={`w-[min(86vw,460px)] ${
                    isTallGusset(target.config.pouchShape)
                      ? 'aspect-[100/240] rounded-sm'
                      : target.config.pouchShape === 'doypack-valve'
                        ? 'aspect-[150/220] rounded-xl'
                        : 'aspect-[130/210] rounded-sm'
                  } overflow-hidden shadow-2xl ring-1 ring-[#D8B474]/35`}
                >
                  <BackPanel config={target.config} backgroundOnly={target.backgroundOnly} />
                </div>
              )}
              {target.panel === 'dieline' && (
                <div className="w-[min(94vw,1120px)]">
                  <FullPrintDieline config={target.config} backgroundOnly={target.backgroundOnly} />
                </div>
              )}
              {target.panel === '3d' && (
                <div className="w-[min(90vw,540px)]">
                  <InteractivePouch3D config={target.config} backgroundOnly={target.backgroundOnly} />
                </div>
              )}
            </>
          )}

          {target.kind === 'image' && (
            <div
              className={`max-w-[90vw] max-h-[80vh] rounded-xl overflow-hidden shadow-2xl ring-1 ring-[#D8B474]/30 ${
                target.bgClass || 'bg-[#18100C]'
              }`}
            >
              <img
                src={target.src}
                alt={target.title}
                referrerPolicy="no-referrer"
                className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain"
              />
            </div>
          )}

          {target.kind === 'vector' && (
            <div
              data-modal-vector={target.slug}
              className="w-[min(85vw,380px)] aspect-square rounded-2xl bg-[#18100C] border border-[#D8B474]/30 flex items-center justify-center p-8 shadow-2xl"
            >
              {renderVectorElement(target)}
            </div>
          )}
        </div>
      </div>

      {/* Bottom info hint */}
      {target.kind === 'mockup' && (
        <div className="shrink-0 px-4 py-2 bg-[#160F0C] border-t border-[#D8B474]/15 text-center text-[11px] font-mono text-[#CBBBA8]">
          {POUCH_SHAPES[target.config.pouchShape].code} · {getWeightSpecs(target.config.pouchShape, target.config.netWeight).dimensions} · Tekan ESC atau klik luar area untuk menutup
        </div>
      )}
    </div>
  );
}
