import React, { useRef, useState } from 'react';
import { Check, Copy, Download, Maximize2 } from 'lucide-react';
import {
  ArunikaKawiWordmark,
  ArunikaSunBeanCrest,
  BotanicalCornerArt,
  Ean13Barcode,
  KthEastJavaSeal,
  MandalaHeritageCrest,
  RoastProfileCrest,
} from './BrandCrests';
import {
  BEAN_VARIANTS,
  getWeightSpecs,
  PackagingConfig,
  POUCH_SHAPES,
  ROAST_LEVELS,
} from '../types/packaging';
import { COLOR_TOKENS, getNaturalMockupAssetForShape, PHOTO_ASSETS } from '../data/packagingSpecs';
import { LiveMockupScene, MockupSceneMode } from './LiveMockupScene';
import { BackPanel, FrontPanel } from './PackagingPanels';
import type { ExpandPreviewTarget } from './ExpandPreviewModal';
import { ExportScope } from '../utils/exportPrintArtwork';
import { renderAndDownloadMockup } from '../utils/exportMockupScene';
import {
  downloadImageAsset,
  downloadSvgAsPng,
  downloadSvgElement,
} from '../utils/exportSingleElement';
import { getWibBatchAndExpiry, getWibFormattedDate } from '../utils/dateUtils';

function VectorElementCard({
  title,
  description,
  fileSlug,
  pngSize = [1200, 1200],
  onExpandClick,
  children,
}: {
  title: string;
  description: string;
  fileSlug: string;
  pngSize?: [number, number];
  onExpandClick: () => void;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const getSvg = (): SVGSVGElement | null => {
    return containerRef.current?.querySelector('svg') ?? null;
  };

  return (
    <div className="bg-[#EFECE6] rounded-xl border border-[#1A1412]/10 overflow-hidden flex flex-col">
      <div
        ref={containerRef}
        data-vector-slug={fileSlug}
        onClick={onExpandClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onExpandClick();
          }
        }}
        className="group relative h-44 bg-[#18100C] flex items-center justify-center p-5 border-b border-[#1A1412]/10 cursor-zoom-in"
      >
        {children}
        <span className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#120C09]/70 text-[#FAF5EB] flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:bg-[#8A6429] transition-colors">
          <Maximize2 className="w-3.5 h-3.5" />
        </span>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-serif text-lg font-semibold text-[#1A1412] leading-snug">{title}</h4>
          <p className="mt-1 text-xs text-[#574D47] leading-relaxed">{description}</p>
        </div>
        <div className="mt-4 pt-3 border-t border-[#1A1412]/10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => downloadSvgElement(getSvg(), fileSlug)}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#1A1412] text-[#FAF5EB] hover:bg-[#31221B] rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-[#D8B474]" />
            <span>SVG Vektor</span>
          </button>
          <button
            type="button"
            onClick={() => downloadSvgAsPng(getSvg(), fileSlug, pngSize[0], pngSize[1])}
            className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white text-[#1A1412] border border-[#1A1412]/15 hover:bg-[#E7E2D8] rounded-md transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-[#8A6429]" />
            <span>PNG Transparan</span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface DesignElementsKitProps {
  config: PackagingConfig;
  onExport: (scope: ExportScope) => void;
  isExporting: boolean;
  onExpand: (target: ExpandPreviewTarget) => void;
}

export function DesignElementsKit({ config, onExport, isExporting, onExpand }: DesignElementsKitProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [photoPage, setPhotoPage] = useState<number>(0);
  const [activeKitScene, setActiveKitScene] = useState<MockupSceneMode>('natural-kawi');
  const [downloadingAssetId, setDownloadingAssetId] = useState<string | null>(null);
  const PHOTOS_PER_PAGE = 7;
  const totalPhotoPages = Math.ceil(PHOTO_ASSETS.length / PHOTOS_PER_PAGE);
  const visiblePhotos = PHOTO_ASSETS.slice(
    photoPage * PHOTOS_PER_PAGE,
    photoPage * PHOTOS_PER_PAGE + PHOTOS_PER_PAGE
  );
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const shapeMeta = POUCH_SHAPES[config.pouchShape];
  const weightSpecs = getWeightSpecs(config.pouchShape, config.netWeight);
  const activeNaturalMeta = getNaturalMockupAssetForShape(config.pouchShape);
  const { batchCode, expiryCompact } = getWibBatchAndExpiry(12);
  const wibDateLabel = getWibFormattedDate();

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 1800);
    } catch {
      // Ignore clipboard failures in restricted environments
    }
  };

  const fullCopyText = [
    `JUDUL MEREK: ARUNIKA KAWI`,
    `SUB-JUDUL: COFFE BEAN · EST 2024`,
    `TAGLINE: ${roast.subtitle}`,
    `VARIAN: ${variant.frontLabel}`,
    `BERAT BERSIH (DEPAN SAJA): Isi Bersih : ${config.netWeight} (${weightSpecs.dimensions})`,
    ``,
    `JUDUL BELAKANG: Arunika Kawi Coffee (${roast.crestTop} ${roast.crestBottom})`,
    `CERITA PANEL BELAKANG:`,
    `Diolah secara tradisional (Goreng Kreweng) oleh Kelompok Tani Hutan. Dipetik langsung dari lereng Gunung Kawi. Setiap seduhan menghadirkan karakter ${variant.storyCharacter} ${roast.storyRoast}`,
    `Arunika Kawi Coffee Harum dan Nikmat`,
    ``,
    `KOMPOSISI: ${config.beanVariant === 'robusta-100' ? 'KOMPOSISI 100 % BIJI KOPI ROBUSTA' : `KOMPOSISI ${variant.frontLabel.toUpperCase()}`}`,
    `DIPRODUKSI OLEH: KUPS Himatarian Blitar, Jawa Timur – INDONESIA (Stempel KTH Hijau + PIRT di bawah stempel + Kotak PIRT)`,
    `KODE PRODUKSI & BAIK DIGUNAKAN SEBELUM: Kotak Putih Cetak Tanggal (${batchCode} · EXP ${expiryCompact} · WIB GMT+7 ${wibDateLabel})`,
    `PITA BAWAH BELAKANG: 100 % KOPI ASLI INDONESIA (Tanpa Berat Bersih)`,
  ].join('\n');

  return (
    <section id="kit-elemen" className="py-20 border-t border-[#1A1412]/10 bg-[#ECE9E1]">
      <div className="max-w-[1360px] mx-auto px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#8A6429]">
            Kit Aset &amp; Elemen Pembentuk Desain
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1A1412] leading-tight">
            File Background Murni, Vektor, Foto Natural, Warna &amp; Tipografi
          </h2>
          <p className="mt-3 text-[15px] text-[#574D47] leading-relaxed">
            Unduh kanvas <strong className="font-semibold text-[#1A1412]">Background Saja (tanpa teks, logo,
            stempel, barcode, maupun garis potong)</strong> beserta seluruh komponen penyusun kemasan Arunika Kawi
            dalam format <strong className="font-semibold text-[#1A1412]">PNG Resolusi Cetak</strong>,{' '}
            <strong className="font-semibold text-[#1A1412]">SVG Vektor</strong>, dan{' '}
            <strong className="font-semibold text-[#1A1412]">JPG Resolusi Tinggi</strong>.
          </p>
        </div>

        {/* 00. Pure Background Only Canvas Export */}
        <div className="mt-10 bg-[#F6F5F2] rounded-xl border border-[#8A6429]/35 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#1A1412]/10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8A6429]">
                00. File Background Murni (Tanpa Teks &amp; Logo)
              </p>
              <h3 className="mt-1 font-serif text-2xl font-semibold text-[#1A1412]">
                Kanvas Background Full Print · {shapeMeta.code} ({shapeMeta.shortLabel} · {config.netWeight})
              </h3>
              <p className="mt-1 text-xs text-[#574D47]">
                Ukuran aktif {weightSpecs.dimensions} · {variant.frontLabel} — berisi latar espresso matte, kabut Gunung
                Kawi, klaster biji kopi tanpa sambungan, dan pita foil emas bersih tanpa teks/logo.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                disabled={isExporting}
                onClick={() => onExport('bg-full-dieline')}
                className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#8A6429] hover:bg-[#73511D] disabled:opacity-60 text-[#FAF5EB] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Background Full Sheet (PNG)</span>
              </button>
              <button
                type="button"
                disabled={isExporting}
                onClick={() => onExport('bg-front-only')}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold bg-[#1A1412] hover:bg-[#31221B] disabled:opacity-60 text-[#FAF5EB] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-[#D8B474]" />
                <span>Background Depan</span>
              </button>
              <button
                type="button"
                disabled={isExporting}
                onClick={() => onExport('bg-back-only')}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold bg-white hover:bg-[#EFECE6] disabled:opacity-60 text-[#1A1412] border border-[#1A1412]/15 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 text-[#8A6429]" />
                <span>Background Belakang</span>
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#160F0C] p-6 rounded-xl border border-[#C99C52]/20">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() =>
                  onExpand({
                    kind: 'panel',
                    title: `Background Murni Panel Depan · ${shapeMeta.code}`,
                    subtitle: `${weightSpecs.frontDim} · Tanpa Teks & Logo`,
                    config,
                    panel: 'front',
                    backgroundOnly: true,
                  })
                }
                className={`group relative w-full ${
                  config.pouchShape === 'doypack-valve'
                    ? 'max-w-[300px] aspect-[150/220] rounded-xl'
                    : config.pouchShape === 'box-gusset'
                      ? 'max-w-[290px] aspect-[130/210] rounded-sm'
                      : 'max-w-[250px] aspect-[100/240] rounded-sm'
                } overflow-hidden shadow-2xl ring-1 ring-[#D8B474]/25 cursor-zoom-in`}
              >
                <FrontPanel config={config} backgroundOnly />
                <span className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#120C09]/75 text-[#FAF5EB] flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:bg-[#8A6429] transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </button>
              <p className="mt-2.5 font-mono text-[11px] text-[#CBBBA8]">
                Pratinjau Background Panel Depan (Murni Tanpa Teks &amp; Logo)
              </p>
            </div>
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() =>
                  onExpand({
                    kind: 'panel',
                    title: `Background Murni Panel Belakang · ${shapeMeta.code}`,
                    subtitle: `${weightSpecs.frontDim} · Tanpa Teks & Logo`,
                    config,
                    panel: 'back',
                    backgroundOnly: true,
                  })
                }
                className={`group relative w-full ${
                  config.pouchShape === 'doypack-valve'
                    ? 'max-w-[300px] aspect-[150/220] rounded-xl'
                    : config.pouchShape === 'box-gusset'
                      ? 'max-w-[290px] aspect-[130/210] rounded-sm'
                      : 'max-w-[250px] aspect-[100/240] rounded-sm'
                } overflow-hidden shadow-2xl ring-1 ring-[#D8B474]/25 cursor-zoom-in`}
              >
                <BackPanel config={config} backgroundOnly />
                <span className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-[#120C09]/75 text-[#FAF5EB] flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:bg-[#8A6429] transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </button>
              <p className="mt-2.5 font-mono text-[11px] text-[#CBBBA8]">
                Pratinjau Background Panel Belakang (Murni Tanpa Teks &amp; Logo)
              </p>
            </div>
          </div>
        </div>

        {/* 1. Vector Logos, Ornaments, Seals & Barcode */}
        <div className="mt-12">
          <div className="flex items-baseline justify-between mb-5 border-b border-[#1A1412]/10 pb-2">
            <h3 className="font-serif text-2xl font-semibold text-[#1A1412]">
              01. Elemen Vektor, Emblem, Stempel &amp; Barcode
            </h3>
            <span className="font-mono text-xs text-[#574D47]">8 Aset Vektor Skalabel</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <VectorElementCard
              title="Wordmark ARUNIKA KAWI"
              description="Tipografi utama 'ARUNIKA' swash display serif & 'KAWI' bold sans berlapis foil emas."
              fileSlug="arunika-wordmark-utama"
              pngSize={[1600, 440]}
              onExpandClick={() =>
                onExpand({
                  kind: 'vector',
                  title: 'Wordmark ARUNIKA KAWI',
                  subtitle: 'SVG Vektor · PNG 1600×440 Transparan',
                  slug: 'arunika-wordmark-utama',
                  pngSize: [1600, 440],
                  roastTop: roast.crestTop,
                  roastBottom: roast.crestBottom,
                  beanLabel: variant.frontLabel,
                })
              }
            >
              <ArunikaKawiWordmark className="w-52 h-auto" />
            </VectorElementCard>

            <VectorElementCard
              title="Emblem Arunika Sun & Bean"
              description="Ikon dua biji kopi & sinar fajar ('Arunika') berlapis gradasi emas."
              fileSlug="arunika-emblem-utama"
              onExpandClick={() =>
                onExpand({
                  kind: 'vector',
                  title: 'Emblem Arunika Sun & Bean',
                  subtitle: 'SVG Vektor · PNG 1200×1200 Transparan',
                  slug: 'arunika-emblem-utama',
                  roastTop: roast.crestTop,
                  roastBottom: roast.crestBottom,
                  beanLabel: variant.frontLabel,
                })
              }
            >
              <ArunikaSunBeanCrest className="w-28 h-28" />
            </VectorElementCard>

            <VectorElementCard
              title="Bingkai Profil Sangrai"
              description="Bingkai awan emas mewah untuk label Traditional / Bold / Artisan Roast."
              fileSlug="arunika-bingkai-roast"
              pngSize={[1400, 840]}
              onExpandClick={() =>
                onExpand({
                  kind: 'vector',
                  title: 'Bingkai Profil Sangrai',
                  subtitle: 'SVG Vektor · PNG 1400×840 Transparan',
                  slug: 'arunika-bingkai-roast',
                  pngSize: [1400, 840],
                  roastTop: roast.crestTop,
                  roastBottom: roast.crestBottom,
                  beanLabel: variant.frontLabel,
                })
              }
            >
              <RoastProfileCrest topText={roast.crestTop} bottomText={roast.crestBottom} className="w-44" />
            </VectorElementCard>

            <VectorElementCard
              title="Ornamen Mandala Heritage"
              description="Bingkai mandala emas 16 kelopak untuk Alternatif 03 Tall Gusset."
              fileSlug="arunika-mandala-heritage"
              onExpandClick={() =>
                onExpand({
                  kind: 'vector',
                  title: 'Ornamen Mandala Heritage',
                  subtitle: 'SVG Vektor · PNG 1200×1200 Transparan',
                  slug: 'arunika-mandala-heritage',
                  roastTop: roast.crestTop,
                  roastBottom: roast.crestBottom,
                  beanLabel: variant.frontLabel,
                })
              }
            >
              <MandalaHeritageCrest label={variant.frontLabel} className="w-32 h-32" />
            </VectorElementCard>

            <VectorElementCard
              title="Garis Botani Daun & Ceri Kopi"
              description="Ornamen sudut daun dan buah ceri kopi emas khusus Alternatif 04 Tall Botanical."
              fileSlug="arunika-botani-daun-kopi"
              onExpandClick={() =>
                onExpand({
                  kind: 'vector',
                  title: 'Garis Botani Daun & Ceri Kopi',
                  subtitle: 'SVG Vektor · PNG 1200×1200 Transparan',
                  slug: 'arunika-botani-daun-kopi',
                  roastTop: roast.crestTop,
                  roastBottom: roast.crestBottom,
                  beanLabel: variant.frontLabel,
                })
              }
            >
              <BotanicalCornerArt className="w-32 h-32" />
            </VectorElementCard>

            <VectorElementCard
              title="Stempel KTH (Emas Heritage)"
              description="Stempel Produk Asli Kelompok Tani Hutan Jawa Timur selaras palet emas."
              fileSlug="arunika-stempel-kth-emas"
              onExpandClick={() =>
                onExpand({
                  kind: 'vector',
                  title: 'Stempel KTH (Emas Heritage)',
                  subtitle: 'SVG Vektor · PNG 1200×1200 Transparan',
                  slug: 'arunika-stempel-kth-emas',
                  roastTop: roast.crestTop,
                  roastBottom: roast.crestBottom,
                  beanLabel: variant.frontLabel,
                })
              }
            >
              <KthEastJavaSeal variant="gold-heritage" className="w-28 h-28" />
            </VectorElementCard>

            <VectorElementCard
              title="Stempel KTH (Hijau Asli)"
              description="Versi warna hijau-emas asli sesuai draf pertama untuk kebutuhan resmi."
              fileSlug="arunika-stempel-kth-hijau"
              onExpandClick={() =>
                onExpand({
                  kind: 'vector',
                  title: 'Stempel KTH (Hijau Asli)',
                  subtitle: 'SVG Vektor · PNG 1200×1200 Transparan',
                  slug: 'arunika-stempel-kth-hijau',
                  roastTop: roast.crestTop,
                  roastBottom: roast.crestBottom,
                  beanLabel: variant.frontLabel,
                })
              }
            >
              <KthEastJavaSeal variant="original-green" className="w-28 h-28" />
            </VectorElementCard>

            <VectorElementCard
              title="Barcode Produk EAN-13"
              description="Barcode 8 997024 192504 siap tempat pada pojok kanan bawah panel belakang."
              fileSlug="arunika-barcode-ean13"
              pngSize={[1300, 560]}
              onExpandClick={() =>
                onExpand({
                  kind: 'vector',
                  title: 'Barcode Produk EAN-13',
                  subtitle: 'SVG Vektor · PNG 1300×560 Transparan',
                  slug: 'arunika-barcode-ean13',
                  pngSize: [1300, 560],
                  roastTop: roast.crestTop,
                  roastBottom: roast.crestBottom,
                  beanLabel: variant.frontLabel,
                })
              }
            >
              <Ean13Barcode className="w-44 h-20" />
            </VectorElementCard>
          </div>
        </div>

        {/* 2. Natural Photos & Mockup Assets (Paginated for Mobile/Tablet Performance) */}
        <div className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-[#1A1412]/10 pb-3">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-[#1A1412]">
                02. Elemen Fotografi Natural &amp; Mockup Produk
              </h3>
              <span className="font-mono text-xs text-[#574D47]">
                Menampilkan {visiblePhotos.length} dari {PHOTO_ASSETS.length} Aset Master &amp; Mockup
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 p-1 bg-[#E4DFD6] rounded-lg self-start sm:self-auto">
              {Array.from({ length: totalPhotoPages }, (_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPhotoPage(idx)}
                  className={`min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    photoPage === idx
                      ? 'bg-[#1A1412] text-[#FAF5EB]'
                      : 'text-[#574D47] hover:text-[#1A1412]'
                  }`}
                >
                  Halaman {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Featured Active Mockup Final Card (Always Tracks Active Alternative & Weight) */}
          <div className="mb-6 bg-[#F6F5F2] rounded-xl border border-[#8A6429]/40 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            <button
              type="button"
              onClick={() =>
                onExpand({
                  kind: 'mockup',
                  title: `Mockup Final · ${shapeMeta.code} ${shapeMeta.shortLabel}`,
                  subtitle: `${weightSpecs.dimensions} · ${config.netWeight} · ${variant.frontLabel}`,
                  config,
                  initialScene: activeKitScene,
                })
              }
              className={`group relative lg:col-span-5 aspect-[4/3] lg:aspect-auto lg:min-h-[320px] ${
                activeKitScene === 'natural-kawi' ? 'bg-[#18100C]' : 'bg-white'
              } overflow-hidden cursor-zoom-in text-left`}
            >
              <LiveMockupScene config={config} scene={activeKitScene} size="card" />
              <span className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-[#120C09]/75 text-[#FAF5EB] flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:bg-[#8A6429] transition-colors shadow">
                <Maximize2 className="w-4 h-4" />
              </span>
            </button>
            <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A6429]">
                    Mockup Final Aktif · Otomatis Mengikuti Pilihan
                  </span>
                  <div className="inline-flex items-center gap-1 p-1 bg-[#E4DFD6] rounded-lg">
                    {(
                      [
                        { id: 'natural-kawi', label: 'Suasana Natural' },
                        { id: 'studio-front', label: 'Studio Depan' },
                        { id: 'studio-rear', label: 'Studio Belakang' },
                      ] as const
                    ).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveKitScene(s.id)}
                        className={`px-2.5 py-1.5 min-h-[38px] text-[11px] font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                          activeKitScene === s.id
                            ? 'bg-[#1A1412] text-[#FAF5EB]'
                            : 'text-[#574D47] hover:text-[#1A1412]'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <h4 className="mt-3 font-serif text-2xl font-semibold text-[#1A1412]">
                  Mockup Final · {shapeMeta.code} {shapeMeta.shortLabel} ({config.netWeight})
                </h4>
                <p className="mt-1.5 text-sm text-[#574D47] leading-relaxed">
                  {activeNaturalMeta.usage} · {variant.frontLabel} · {roast.label}.
                </p>
              </div>

              <div className="pt-3 border-t border-[#1A1412]/10 flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono text-xs text-[#8A6429] tabular-nums">
                  {weightSpecs.dimensions} · {config.netWeight}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={() => onExport('full-dieline')}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#8A6429] hover:bg-[#73511D] disabled:opacity-60 text-[#FAF5EB] rounded-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Sheet Full Print</span>
                  </button>
                  <button
                    type="button"
                    disabled={downloadingAssetId === 'featured-mockup'}
                    onClick={async () => {
                      setDownloadingAssetId('featured-mockup');
                      try {
                        await renderAndDownloadMockup(
                          config,
                          activeKitScene,
                          `arunika-mockup-${config.pouchShape}-${activeKitScene}-${config.netWeight.replace(/\s+/g, '')}.png`,
                          'image/png'
                        );
                      } finally {
                        setDownloadingAssetId(null);
                      }
                    }}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#1A1412] text-[#FAF5EB] hover:bg-[#31221B] disabled:opacity-60 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D8B474]" />
                    <span>
                      {downloadingAssetId === 'featured-mockup' ? 'Memproses...' : 'Unduh Mockup PNG'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visiblePhotos.map((asset) => {
              const liveSpec = asset.liveMockup;
              const isBusy = downloadingAssetId === asset.id;
              return (
                <div
                  key={asset.id}
                  className="bg-[#F6F5F2] rounded-xl border border-[#1A1412]/10 overflow-hidden flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (liveSpec) {
                        onExpand({
                          kind: 'mockup',
                          title: asset.title,
                          subtitle: `${POUCH_SHAPES[liveSpec.shape].dimensions} · ${config.netWeight}`,
                          config: { ...config, pouchShape: liveSpec.shape },
                          initialScene: liveSpec.scene,
                        });
                      } else {
                        onExpand({
                          kind: 'image',
                          title: asset.title,
                          subtitle: `${asset.dims} · ${asset.filename}`,
                          src: asset.src,
                          filename: asset.filename,
                        });
                      }
                    }}
                    className={`group relative aspect-[4/3] w-full ${
                      liveSpec && liveSpec.scene !== 'natural-kawi' ? 'bg-white' : 'bg-[#18100C]'
                    } overflow-hidden cursor-zoom-in text-left`}
                  >
                    {liveSpec ? (
                      <LiveMockupScene
                        config={{ ...config, pouchShape: liveSpec.shape }}
                        scene={liveSpec.scene}
                        size="card"
                      />
                    ) : (
                      <img
                        src={asset.src}
                        alt={asset.title}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute top-2.5 right-2.5 z-30 w-8 h-8 rounded-full bg-[#120C09]/75 text-[#FAF5EB] flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:bg-[#8A6429] transition-colors shadow">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </button>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-serif text-lg font-semibold text-[#1A1412]">{asset.title}</h4>
                      </div>
                      <p className="mt-1 text-xs text-[#574D47] leading-relaxed">{asset.usage}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#1A1412]/10 flex items-center justify-between gap-3">
                      <span className="font-mono text-[11px] text-[#8A6429] tabular-nums">{asset.dims}</span>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={async () => {
                          setDownloadingAssetId(asset.id);
                          try {
                            if (liveSpec) {
                              await renderAndDownloadMockup(
                                { ...config, pouchShape: liveSpec.shape },
                                liveSpec.scene,
                                asset.filename,
                                'image/png'
                              );
                            } else {
                              await downloadImageAsset(asset.src, asset.filename);
                            }
                          } finally {
                            setDownloadingAssetId(null);
                          }
                        }}
                        className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#1A1412] text-[#FAF5EB] hover:bg-[#31221B] disabled:opacity-60 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Download className="w-3.5 h-3.5 text-[#D8B474]" />
                        <span>{isBusy ? 'Memproses...' : asset.filename.endsWith('.png') ? 'Unduh PNG' : 'Unduh JPG'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Color Palette & Typography + Copywriting System */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Color Swatches */}
          <div className="lg:col-span-7 bg-[#F6F5F2] rounded-xl border border-[#1A1412]/10 p-6">
            <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-[#1A1412]/10">
              <h3 className="font-serif text-2xl font-semibold text-[#1A1412]">
                03. Palet Warna &amp; Finishing Percetakan
              </h3>
              <span className="font-mono text-xs text-[#574D47]">HEX · CMYK · Pantone</span>
            </div>

            <div className="divide-y divide-[#1A1412]/10">
              {COLOR_TOKENS.map((c) => (
                <div key={c.hex} className="py-3.5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span
                      className="w-10 h-10 rounded-lg border border-[#1A1412]/15 shrink-0"
                      style={{ backgroundColor: c.hex }}
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#1A1412]">{c.name}</p>
                      <p className="text-xs text-[#574D47]">
                        {c.role} · {c.finish}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono text-xs tabular-nums">
                      <p className="font-semibold text-[#1A1412]">{c.hex}</p>
                      <p className="text-[#574D47] text-[11px]">{c.cmyk}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(c.hex, c.hex)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md border border-[#1A1412]/15 hover:bg-[#EFECE6] text-[#1A1412] transition-colors cursor-pointer"
                      aria-label={`Salin kode warna ${c.hex}`}
                    >
                      {copiedId === c.hex ? (
                        <Check className="w-3.5 h-3.5 text-[#8A6429]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography & Copywriting Block */}
          <div className="lg:col-span-5 bg-[#F6F5F2] rounded-xl border border-[#1A1412]/10 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-[#1A1412]/10">
                <h3 className="font-serif text-2xl font-semibold text-[#1A1412]">04. Tipografi &amp; Copywriting</h3>
                <span className="font-mono text-xs text-[#574D47]">{shapeMeta.code}</span>
              </div>

              <div className="space-y-4">
                <div className="pb-3 border-b border-[#1A1412]/10">
                  <p className="text-xs font-medium text-[#8A6429]">
                    Display Utama · {shapeMeta.fonts.display}
                  </p>
                  <div className="mt-2 mb-1">
                    <ArunikaKawiWordmark tone="dark-ink" className="w-48 h-auto" />
                  </div>
                  <p className="font-serif italic text-base text-[#574D47]">
                    {roast.subtitle} ({shapeMeta.fonts.tagline})
                  </p>
                </div>

                <div className="pb-3 border-b border-[#1A1412]/10">
                  <p className="text-xs font-medium text-[#8A6429]">
                    Sub-Judul &amp; Informasi · {shapeMeta.fonts.body}
                  </p>
                  <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-[#1A1412]">
                    COFFE BEAN · EST 2024
                  </p>
                  <p className="mt-1 font-sans text-sm text-[#574D47]">
                    {variant.frontLabel} · Depan: Isi Bersih : {config.netWeight} ({weightSpecs.dimensions})
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[#8A6429]">
                    Copywriting Belakang &amp; Data Legal · {shapeMeta.fonts.mono}
                  </p>
                  <p className="mt-1 text-xs text-[#1A1412] leading-relaxed">
                    Diolah secara tradisional (<em>Goreng Kreweng</em>) oleh Kelompok Tani Hutan. Dipetik langsung dari
                    lereng Gunung Kawi. Setiap seduhan menghadirkan karakter {variant.storyCharacter}{' '}
                    {roast.storyRoast} <strong className="font-semibold text-[#8A6429]">Arunika Kawi Coffee</strong>{' '}
                    <strong className="font-semibold">Harum dan Nikmat</strong>
                  </p>
                  <p className="mt-1.5 font-mono text-[11px] text-[#574D47] tabular-nums">
                    KUPS Himatarian Blitar · Stempel KTH + PIRT · Kode Produksi &amp; Baik Digunakan Sebelum
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#1A1412]/10">
              <button
                type="button"
                onClick={() => handleCopy('full-copy', fullCopyText)}
                className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#1A1412] text-[#FAF5EB] hover:bg-[#31221B] rounded-md transition-colors cursor-pointer"
              >
                {copiedId === 'full-copy' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#D8B474]" />
                    <span>Teks Kemasan Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#D8B474]" />
                    <span>Salin Seluruh Teks Copywriting Kemasan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
