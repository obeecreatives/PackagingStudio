import React, { useRef, useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import {
  ArunikaSunBeanCrest,
  BotanicalCornerArt,
  Ean13Barcode,
  KthEastJavaSeal,
  MandalaHeritageCrest,
  RoastProfileCrest,
} from './BrandCrests';
import {
  BEAN_VARIANTS,
  GENERATED_ASSETS,
  getWeightSpecs,
  ORIGINAL_UPLOADS,
  PackagingConfig,
  POUCH_SHAPES,
  ROAST_LEVELS,
} from '../types/packaging';
import { BackPanel, FrontPanel } from './PackagingPanels';
import { ExportScope } from '../utils/exportPrintArtwork';
import {
  downloadImageAsset,
  downloadSvgAsPng,
  downloadSvgElement,
} from '../utils/exportSingleElement';
import { getWibBatchAndExpiry, getWibFormattedDate } from '../utils/dateUtils';

interface ColorToken {
  name: string;
  role: string;
  hex: string;
  cmyk: string;
  finish: string;
}

const COLOR_TOKENS: ColorToken[] = [
  {
    name: 'Deep Espresso Matte',
    role: 'Kanvas Dasar Kemasan',
    hex: '#1C100B',
    cmyk: 'C45 M72 Y78 K82',
    finish: 'Matte Velvet Film',
  },
  {
    name: 'Roast Umber Highlight',
    role: 'Gradasi Pencahayaan Atas',
    hex: '#2B1912',
    cmyk: 'C40 M68 Y74 K68',
    finish: 'Matte Velvet Film',
  },
  {
    name: 'Champagne Gold Foil',
    role: 'Pita Bawah, Emblem & Garis',
    hex: '#D6B373',
    cmyk: 'C15 M28 Y62 K4',
    finish: 'Spot Gold Foil (Pantone 871 C)',
  },
  {
    name: 'Antique Bronze Shadow',
    role: 'Gradasi Gelap Foil Emas',
    hex: '#8C6429',
    cmyk: 'C28 M52 Y84 K28',
    finish: 'Spot Gold Foil',
  },
  {
    name: 'Warm Ivory Parchment',
    role: 'Tipografi Utama & Teks Belakang',
    hex: '#FAF5EB',
    cmyk: 'C2 M3 Y8 K0',
    finish: 'Opaque White / Ivory Ink',
  },
  {
    name: 'Copper Terracotta Sash',
    role: 'Bidang Diagonal Alternatif 05',
    hex: '#9C4F2B',
    cmyk: 'C20 M72 Y86 K18',
    finish: 'Metallic Copper / Satin Ink',
  },
];

const PHOTO_ASSETS = [
  {
    id: 'revised-front',
    title: 'Master Revisi Anda · Halaman Depan',
    usage: 'Artwork final depan (ARUNIKA KAWI swash gold, biji kopi natural, Isi Bersih : 250 Gr)',
    src: ORIGINAL_UPLOADS.revisedFront,
    filename: 'arunika-kawi-master-depan.png',
    dims: 'Master Upload',
  },
  {
    id: 'revised-rear',
    title: 'Master Revisi Anda · Halaman Belakang',
    usage: 'Artwork final belakang (TRADITIONAL ROAST, KUPS Himatarian Blitar, Kode Produksi)',
    src: ORIGINAL_UPLOADS.revisedRear,
    filename: 'arunika-kawi-master-belakang.png',
    dims: 'Master Upload',
  },
  {
    id: 'beans-cluster',
    title: 'Foto Klaster Biji Kopi Robusta',
    usage: 'Elemen utama bagian bawah panel depan & gusset samping',
    src: GENERATED_ASSETS.beansCluster,
    filename: 'arunika-elemen-biji-kopi-robusta.jpg',
    dims: '1400 × 1050 px',
  },
  {
    id: 'kawi-mist',
    title: 'Foto Lanskap Fajar Gunung Kawi',
    usage: 'Atmosfer kabut pagi ("Arunika") pada latar atas kemasan',
    src: GENERATED_ASSETS.kawiMist,
    filename: 'arunika-elemen-kabut-gunung-kawi.jpg',
    dims: '1600 × 900 px',
  },
  {
    id: 'mockup-box',
    title: 'Mockup Final · Versi 01 Box Pouch',
    usage: 'Presentasi Box Pouch Gusset (Depan & Belakang) di atas travertine',
    src: GENERATED_ASSETS.pouchMockup,
    filename: 'arunika-mockup-01-box-pouch.jpg',
    dims: 'High-Res Studio',
  },
  {
    id: 'mockup-doypack-studio',
    title: 'Mockup Final · Alternatif 02 Doypack Depan',
    usage: 'Mockup lurus latar putih persis bentuk contoh Doypack + katup udara tengah',
    src: GENERATED_ASSETS.doypackStudio,
    filename: 'arunika-mockup-02a-doypack-depan.jpg',
    dims: 'High-Res Studio',
  },
  {
    id: 'mockup-doypack-studio-rear',
    title: 'Mockup Final · Alternatif 02 Doypack Belakang',
    usage: 'Mockup lurus latar putih sisi belakang Doypack tanpa katup udara',
    src: GENERATED_ASSETS.doypackStudioRear,
    filename: 'arunika-mockup-02b-doypack-belakang.jpg',
    dims: 'High-Res Studio',
  },
  {
    id: 'mockup-doypack-natural',
    title: 'Mockup Final · Alternatif 02 Doypack Natural',
    usage: 'Mockup persis bentuk contoh Doypack (Depan & Belakang) di atas batu vulkanik, travertine & fajar Gunung Kawi',
    src: GENERATED_ASSETS.doypackNatural,
    filename: 'arunika-mockup-02c-doypack-natural.jpg',
    dims: 'High-Res Studio',
  },
  {
    id: 'mockup-tall-heritage',
    title: 'Mockup Final · Alternatif 03 Tall Classic Border',
    usage: 'Foto tall gusset (Depan & Belakang) dengan bingkai garis emas tipis',
    src: GENERATED_ASSETS.tallHeritage,
    filename: 'arunika-mockup-03-tall-classic.jpg',
    dims: 'High-Res Studio',
  },
  {
    id: 'mockup-tall-botanical',
    title: 'Mockup Final · Alternatif 04 Tall Botanical',
    usage: 'Foto tall gusset dengan ilustrasi botani daun & ceri kopi foil emas',
    src: GENERATED_ASSETS.tallBotanical,
    filename: 'arunika-mockup-04-tall-botanical.jpg',
    dims: 'High-Res Studio',
  },
  {
    id: 'mockup-tall-copper',
    title: 'Mockup Final · Alternatif 05 Tall Copper',
    usage: 'Foto tall gusset dengan garis emas vertikal & bidang diagonal tembaga',
    src: GENERATED_ASSETS.tallCopper,
    filename: 'arunika-mockup-05-tall-copper.jpg',
    dims: 'High-Res Studio',
  },
];

function VectorElementCard({
  title,
  description,
  fileSlug,
  pngSize = [1200, 1200],
  children,
}: {
  title: string;
  description: string;
  fileSlug: string;
  pngSize?: [number, number];
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
        className="h-44 bg-[#18100C] flex items-center justify-center p-5 border-b border-[#1A1412]/10"
      >
        {children}
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
}

export function DesignElementsKit({ config, onExport, isExporting }: DesignElementsKitProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [photoPage, setPhotoPage] = useState<number>(0);
  const PHOTOS_PER_PAGE = 6;
  const totalPhotoPages = Math.ceil(PHOTO_ASSETS.length / PHOTOS_PER_PAGE);
  const visiblePhotos = PHOTO_ASSETS.slice(
    photoPage * PHOTOS_PER_PAGE,
    photoPage * PHOTOS_PER_PAGE + PHOTOS_PER_PAGE
  );
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const shapeMeta = POUCH_SHAPES[config.pouchShape];
  const weightSpecs = getWeightSpecs(config.pouchShape, config.netWeight);
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
    `BERAT & UKURAN: Isi Bersih : ${config.netWeight} (${weightSpecs.dimensions})`,
    ``,
    `JUDUL BELAKANG: Arunika Kawi Coffee (${roast.crestTop} ${roast.crestBottom})`,
    `CERITA PANEL BELAKANG:`,
    `Diolah secara tradisional (traditional roasting) oleh Kelompok Tani Hutan langsung dari lereng Gunung Kawi, setiap seduhannya menghadirkan karakter ${variant.storyCharacter} ${roast.storyRoast} yang langsung membangkitkan semangat begitu air panas disiramkan. Pas banget buat menemani momen santai maupun kerja produktif Anda.`,
    ``,
    `KOMPOSISI: ${config.beanVariant === 'robusta-100' ? '100 % KOPI ROBUSTA' : variant.frontLabel.toUpperCase()}`,
    `ELEVASI & PROSES: ${variant.altitude} · ${variant.process} · Panen Petik Merah Selektif`,
    ``,
    `SARAN PENYAJIAN:`,
    `- Tubruk Klasik: 12g kopi · 180ml · 92°C`,
    `- Pour Over / V60: 15g kopi · 225ml · 90°C`,
    `- Espresso / Moka: 18g halus · 36ml · 27 dtk`,
    ``,
    `CATATAN RASA: ${variant.notes.join(', ')}`,
    `DIPRODUKSI OLEH: KUPS Himatarian Blitar, Jawa Timur – INDONESIA (PIRT · ${config.netWeight})`,
    `KODE PRODUKSI / BAIK DIGUNAKAN SEBELUM: ${batchCode} · EXP ${expiryCompact} (WIB GMT+7 · ${wibDateLabel})`,
    `PITA BAWAH BELAKANG: 100 % KOPI ASLI INDONESIA · ${config.netWeight}`,
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
              <div
                className={`w-full ${
                  config.pouchShape === 'doypack-valve'
                    ? 'max-w-[300px] aspect-[150/220] rounded-xl'
                    : config.pouchShape === 'box-gusset'
                      ? 'max-w-[290px] aspect-[130/210] rounded-sm'
                      : 'max-w-[250px] aspect-[100/240] rounded-sm'
                } overflow-hidden shadow-2xl ring-1 ring-[#D8B474]/25`}
              >
                <FrontPanel config={config} backgroundOnly />
              </div>
              <p className="mt-2.5 font-mono text-[11px] text-[#CBBBA8]">
                Pratinjau Background Panel Depan (Murni Tanpa Teks &amp; Logo)
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-full ${
                  config.pouchShape === 'doypack-valve'
                    ? 'max-w-[300px] aspect-[150/220] rounded-xl'
                    : config.pouchShape === 'box-gusset'
                      ? 'max-w-[290px] aspect-[130/210] rounded-sm'
                      : 'max-w-[250px] aspect-[100/240] rounded-sm'
                } overflow-hidden shadow-2xl ring-1 ring-[#D8B474]/25`}
              >
                <BackPanel config={config} backgroundOnly />
              </div>
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
            <span className="font-mono text-xs text-[#574D47]">7 Aset Vektor Skalabel</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <VectorElementCard
              title="Emblem Arunika Sun & Bean"
              description="Ikon dua biji kopi & sinar fajar ('Arunika') berlapis gradasi emas."
              fileSlug="arunika-emblem-utama"
            >
              <ArunikaSunBeanCrest className="w-28 h-28" />
            </VectorElementCard>

            <VectorElementCard
              title="Bingkai Profil Sangrai"
              description="Bingkai awan emas mewah untuk label Traditional / Bold / Artisan Roast."
              fileSlug="arunika-bingkai-roast"
              pngSize={[1400, 840]}
            >
              <RoastProfileCrest topText={roast.crestTop} bottomText={roast.crestBottom} className="w-44" />
            </VectorElementCard>

            <VectorElementCard
              title="Ornamen Mandala Heritage"
              description="Bingkai mandala emas 16 kelopak untuk Alternatif 03 Tall Gusset."
              fileSlug="arunika-mandala-heritage"
            >
              <MandalaHeritageCrest label={variant.frontLabel} className="w-32 h-32" />
            </VectorElementCard>

            <VectorElementCard
              title="Garis Botani Daun & Ceri Kopi"
              description="Ornamen sudut daun dan buah ceri kopi emas untuk Alternatif 04 & 05."
              fileSlug="arunika-botani-daun-kopi"
            >
              <BotanicalCornerArt className="w-32 h-32" />
            </VectorElementCard>

            <VectorElementCard
              title="Stempel KTH (Emas Heritage)"
              description="Stempel Produk Asli Kelompok Tani Hutan Jawa Timur selaras palet emas."
              fileSlug="arunika-stempel-kth-emas"
            >
              <KthEastJavaSeal variant="gold-heritage" className="w-28 h-28" />
            </VectorElementCard>

            <VectorElementCard
              title="Stempel KTH (Hijau Asli)"
              description="Versi warna hijau-emas asli sesuai draf pertama untuk kebutuhan resmi."
              fileSlug="arunika-stempel-kth-hijau"
            >
              <KthEastJavaSeal variant="original-green" className="w-28 h-28" />
            </VectorElementCard>

            <VectorElementCard
              title="Barcode Produk EAN-13"
              description="Barcode 8 997024 192504 siap tempat pada pojok kanan bawah panel belakang."
              fileSlug="arunika-barcode-ean13"
              pngSize={[1300, 560]}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visiblePhotos.map((asset) => (
              <div
                key={asset.id}
                className="bg-[#F6F5F2] rounded-xl border border-[#1A1412]/10 overflow-hidden flex flex-col"
              >
                <div className="aspect-[16/10] bg-[#18100C] overflow-hidden">
                  <img
                    src={asset.src}
                    alt={asset.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
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
                      onClick={() => downloadImageAsset(asset.src, asset.filename)}
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#1A1412] text-[#FAF5EB] hover:bg-[#31221B] rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Download className="w-3.5 h-3.5 text-[#D8B474]" />
                      <span>Unduh JPG</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
                  <p className="mt-1 font-serif text-3xl font-bold tracking-[0.06em] text-[#1A1412]">
                    ARUNIKA KAWI
                  </p>
                  <p className="font-serif italic text-base text-[#574D47]">
                    Traditional Roasting Coffee ({shapeMeta.fonts.tagline})
                  </p>
                </div>

                <div className="pb-3 border-b border-[#1A1412]/10">
                  <p className="text-xs font-medium text-[#8A6429]">
                    Sub-Judul &amp; Informasi · {shapeMeta.fonts.body}
                  </p>
                  <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-[0.26em] text-[#1A1412]">
                    COFFEE BEAN · EST. 2024
                  </p>
                  <p className="mt-1 font-sans text-sm text-[#574D47]">
                    {variant.frontLabel} · Isi Bersih : {config.netWeight} ({weightSpecs.dimensions})
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-[#8A6429]">
                    Data Teknis &amp; Barcode · {shapeMeta.fonts.mono}
                  </p>
                  <p className="mt-1 font-mono text-xs text-[#1A1412] tabular-nums">
                    8 997024 192504 · {variant.altitude} · {config.netWeight} · EXP {expiryCompact} (WIB)
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
