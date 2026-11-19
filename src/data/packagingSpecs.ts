import {
  BEAN_VARIANTS,
  GENERATED_ASSETS,
  getWeightSpecs,
  isTallGusset,
  NATURAL_MOODS,
  ORIGINAL_UPLOADS,
  PackagingConfig,
  POUCH_SHAPES,
  PouchShapeId,
  ROAST_LEVELS,
} from '../types/packaging';
import { getWibFormattedDateTime } from '../utils/dateUtils';

export interface ColorToken {
  name: string;
  role: string;
  hex: string;
  rgb: [number, number, number];
  cmyk: string;
  finish: string;
}

export const COLOR_TOKENS: ColorToken[] = [
  {
    name: 'Deep Espresso Matte',
    role: 'Kanvas Dasar Kemasan',
    hex: '#1C100B',
    rgb: [28, 16, 11],
    cmyk: 'C45 M72 Y78 K82',
    finish: 'Matte Velvet Film',
  },
  {
    name: 'Roast Umber Highlight',
    role: 'Gradasi Pencahayaan Atas',
    hex: '#2B1912',
    rgb: [43, 25, 18],
    cmyk: 'C40 M68 Y74 K68',
    finish: 'Matte Velvet Film',
  },
  {
    name: 'Champagne Gold Foil',
    role: 'Pita Bawah, Emblem & Garis',
    hex: '#D6B373',
    rgb: [214, 179, 115],
    cmyk: 'C15 M28 Y62 K4',
    finish: 'Spot Gold Foil (Pantone 871 C)',
  },
  {
    name: 'Antique Bronze Shadow',
    role: 'Gradasi Gelap Foil Emas',
    hex: '#8C6429',
    rgb: [140, 100, 41],
    cmyk: 'C28 M52 Y84 K28',
    finish: 'Spot Gold Foil',
  },
  {
    name: 'Warm Ivory Parchment',
    role: 'Tipografi Utama & Teks Belakang',
    hex: '#FAF5EB',
    rgb: [250, 245, 235],
    cmyk: 'C2 M3 Y8 K0',
    finish: 'Opaque White / Ivory Ink',
  },
  {
    name: 'Copper Terracotta Sash',
    role: 'Bidang Diagonal Alternatif 05',
    hex: '#9C4F2B',
    rgb: [156, 79, 43],
    cmyk: 'C20 M72 Y86 K18',
    finish: 'Metallic Copper / Satin Ink',
  },
];

export interface VectorElementMeta {
  slug: string;
  title: string;
  description: string;
  format: string;
}

export const VECTOR_ELEMENTS_META: VectorElementMeta[] = [
  {
    slug: 'arunika-wordmark-utama',
    title: 'Wordmark ARUNIKA KAWI',
    description: "Tipografi utama 'ARUNIKA' swash display serif & 'KAWI' bold sans berlapis foil emas.",
    format: 'SVG Vektor · PNG 1600×440',
  },
  {
    slug: 'arunika-emblem-utama',
    title: 'Emblem Arunika Sun & Bean',
    description: "Ikon dua biji kopi & sinar fajar ('Arunika') berlapis gradasi emas.",
    format: 'SVG Vektor · PNG 1200×1200',
  },
  {
    slug: 'arunika-bingkai-roast',
    title: 'Bingkai Profil Sangrai',
    description: 'Bingkai awan emas mewah untuk label Traditional / Artisan / Bold Roast.',
    format: 'SVG Vektor · PNG 1400×840',
  },
  {
    slug: 'arunika-mandala-heritage',
    title: 'Ornamen Mandala Heritage',
    description: 'Bingkai mandala emas 16 kelopak untuk Alternatif 03 Tall Gusset.',
    format: 'SVG Vektor · PNG 1200×1200',
  },
  {
    slug: 'arunika-botani-daun-kopi',
    title: 'Garis Botani Daun & Ceri Kopi',
    description: 'Ornamen sudut daun, bunga, dan buah ceri kopi persis sesuai mockup Alternatif 04 Tall Botanical Foil.',
    format: 'SVG Vektor · PNG 1080×1380',
  },
  {
    slug: 'arunika-stempel-kth-emas',
    title: 'Stempel KTH (Emas Heritage)',
    description: 'Stempel Produk Asli Kelompok Tani Hutan Jawa Timur selaras palet emas.',
    format: 'SVG Vektor · PNG 1200×1200',
  },
  {
    slug: 'arunika-stempel-kth-hijau',
    title: 'Stempel KTH (Hijau Asli)',
    description: 'Versi warna hijau-emas asli sesuai draf pertama untuk kebutuhan resmi.',
    format: 'SVG Vektor · PNG 1200×1200',
  },
  {
    slug: 'arunika-barcode-ean13',
    title: 'Barcode Produk EAN-13',
    description: 'Barcode 8 997024 192504 siap tempat pada pojok kanan bawah panel belakang.',
    format: 'SVG Vektor · PNG 1300×560',
  },
];

export interface PhotoAssetMeta {
  id: string;
  title: string;
  usage: string;
  src: string;
  filename: string;
  dims: string;
  liveMockup?: {
    shape: PouchShapeId;
    scene: 'natural-kawi' | 'studio-front' | 'studio-rear';
  };
}

export const PHOTO_ASSETS: PhotoAssetMeta[] = [
  {
    id: 'revised-front-100',
    title: 'Master Revisi Terbaru · Halaman Depan (100 gram)',
    usage: 'Artwork final depan revisi (2 ornamen botani sudut atas, Traditional Roasted Coffee, 100 % Biji Kopi Robusta, Isi Bersih : 100 gram)',
    src: ORIGINAL_UPLOADS.revisedFront100,
    filename: 'arunika-kawi-master-depan-revisi.png',
    dims: 'Master Revisi · 1184 × 1892 px',
  },
  {
    id: 'revised-rear',
    title: 'Master Revisi Terbaru · Halaman Belakang',
    usage: 'Artwork final belakang revisi (tanpa tagline harum & nikmat, stempel KTH tengah, KUPS Blitar 66186 + ikon Recycle, dan 3 kotak putih kanan)',
    src: ORIGINAL_UPLOADS.revisedRear,
    filename: 'arunika-kawi-master-belakang-revisi.png',
    dims: 'Master Revisi · 1182 × 1890 px',
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
    usage: 'Presentasi Box Pouch Gusset (Depan & Belakang) di atas travertine & fajar Kawi',
    src: GENERATED_ASSETS.blankV1BoxGusset,
    filename: 'arunika-mockup-01-box-pouch.png',
    dims: 'High-Res Komposit',
    liveMockup: { shape: 'box-gusset', scene: 'natural-kawi' },
  },
  {
    id: 'mockup-doypack-studio',
    title: 'Mockup Final · Alternatif 02 Doypack Depan',
    usage: 'Mockup lurus latar studio putih persis bentuk Doypack + katup udara tengah',
    src: GENERATED_ASSETS.blankStudioDoypackFront,
    filename: 'arunika-mockup-02a-doypack-depan.png',
    dims: 'High-Res Komposit',
    liveMockup: { shape: 'doypack-valve', scene: 'studio-front' },
  },
  {
    id: 'mockup-doypack-studio-rear',
    title: 'Mockup Final · Alternatif 02 Doypack Belakang',
    usage: 'Mockup lurus latar studio putih sisi belakang Doypack tanpa katup udara',
    src: GENERATED_ASSETS.blankStudioDoypackRear,
    filename: 'arunika-mockup-02b-doypack-belakang.png',
    dims: 'High-Res Komposit',
    liveMockup: { shape: 'doypack-valve', scene: 'studio-rear' },
  },
  {
    id: 'mockup-doypack-natural',
    title: 'Mockup Final · Alternatif 02 Doypack Natural',
    usage: 'Mockup Doypack (Depan & Belakang) di atas batu vulkanik, travertine & fajar Gunung Kawi',
    src: GENERATED_ASSETS.blankV2DoypackNatural,
    filename: 'arunika-mockup-02c-doypack-natural.png',
    dims: 'High-Res Komposit',
    liveMockup: { shape: 'doypack-valve', scene: 'natural-kawi' },
  },
  {
    id: 'mockup-tall-heritage',
    title: 'Mockup Final · Alternatif 03 Tall Classic Border',
    usage: 'Foto tall gusset (Depan & Belakang) dengan bingkai garis emas tipis',
    src: GENERATED_ASSETS.blankV3TallHeritage,
    filename: 'arunika-mockup-03-tall-classic.png',
    dims: 'High-Res Komposit',
    liveMockup: { shape: 'tall-heritage', scene: 'natural-kawi' },
  },
  {
    id: 'mockup-tall-botanical',
    title: 'Mockup Final · Alternatif 04 Tall Botanical (Ornamen Daun)',
    usage: 'Foto tall gusset dengan ilustrasi botani daun & ceri kopi foil emas — dipertahankan sebagai opsi berornamen',
    src: GENERATED_ASSETS.blankV4TallBotanical,
    filename: 'arunika-mockup-04-tall-botanical.png',
    dims: 'High-Res Komposit',
    liveMockup: { shape: 'tall-botanical', scene: 'natural-kawi' },
  },
  {
    id: 'mockup-tall-copper',
    title: 'Mockup Final · Alternatif 05 Tall Copper Clean (Tanpa Daun)',
    usage: 'Foto tall gusset bersih tanpa ornamen daun dengan garis emas vertikal & bidang diagonal tembaga',
    src: GENERATED_ASSETS.blankV5TallCopper,
    filename: 'arunika-mockup-05-tall-copper-clean.png',
    dims: 'High-Res Komposit',
    liveMockup: { shape: 'tall-copper', scene: 'natural-kawi' },
  },
  {
    id: 'mockup-tall-minimal',
    title: 'Mockup Final · Alternatif 06 Tall Minimalis Bersih',
    usage: 'Foto tall gusset gaya minimalis bersih tanpa bingkai dan tanpa ornamen daun dengan pita foil emas bawah',
    src: GENERATED_ASSETS.blankV6TallMinimal,
    filename: 'arunika-mockup-06-tall-minimalis.png',
    dims: 'High-Res Komposit',
    liveMockup: { shape: 'tall-minimal', scene: 'natural-kawi' },
  },
];

export function getNaturalMockupAssetForShape(shape: PouchShapeId): {
  title: string;
  src: string;
  usage: string;
} {
  switch (shape) {
    case 'box-gusset':
      return {
        title: 'Mockup Natural · Versi 01 Box Pouch Gusset',
        src: GENERATED_ASSETS.blankV1BoxGusset,
        usage: 'Presentasi Box Pouch Gusset (Depan & Belakang) di atas batu travertine & fajar Gunung Kawi',
      };
    case 'doypack-valve':
      return {
        title: 'Mockup Natural · Alternatif 02 Doypack + Valve',
        src: GENERATED_ASSETS.blankV2DoypackNatural,
        usage: 'Presentasi Stand-Up Doypack + Katup Udara Tengah di atas batu vulkanik & fajar Gunung Kawi',
      };
    case 'tall-heritage':
      return {
        title: 'Mockup Natural · Alternatif 03 Tall Classic Border',
        src: GENERATED_ASSETS.blankV3TallHeritage,
        usage: 'Tall Flat-Bottom Gusset dengan bingkai garis emas tipis & suasana kopi hangat',
      };
    case 'tall-botanical':
      return {
        title: 'Mockup Natural · Alternatif 04 Tall Botanical Foil',
        src: GENERATED_ASSETS.blankV4TallBotanical,
        usage: 'Tall Flat-Bottom Gusset dengan ilustrasi botani daun & ceri kopi foil emas',
      };
    case 'tall-copper':
      return {
        title: 'Mockup Natural · Alternatif 05 Tall Copper Clean (Tanpa Daun)',
        src: GENERATED_ASSETS.blankV5TallCopper,
        usage: 'Tall Flat-Bottom Gusset bersih tanpa daun dengan garis emas vertikal & bidang diagonal tembaga terakota',
      };
    case 'tall-minimal':
      return {
        title: 'Mockup Natural · Alternatif 06 Tall Minimalis Bersih',
        src: GENERATED_ASSETS.blankV6TallMinimal,
        usage: 'Tall Flat-Bottom Gusset minimalis murni tanpa bingkai dan tanpa daun dengan pita foil emas bawah',
      };
  }
}

export function getPrintSpecificationRows(config: PackagingConfig): Array<{ label: string; value: string }> {
  const isDoypack = config.pouchShape === 'doypack-valve';
  const tall = isTallGusset(config.pouchShape);
  const shapeMeta = POUCH_SHAPES[config.pouchShape];
  const weightSpecs = getWeightSpecs(config.pouchShape, config.netWeight);
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const mood = NATURAL_MOODS[config.naturalMood];

  const sealPositionLabel =
    config.sealPlacement === 'back'
      ? 'Panel Belakang (Tengah di Bawah Komposisi)'
      : config.sealPlacement === 'front'
        ? 'Panel Depan (Pojok Kanan Bawah)'
        : 'Disembunyikan (Tata Letak Bersih)';

  const baseSpecs = isDoypack
    ? [
        { label: 'Model Kemasan', value: 'Stand-Up Doypack + One-Way Degassing Valve & Zipper' },
        { label: 'Berat Bersih & Estimasi Sajian', value: `${config.netWeight} (${weightSpecs.servings}) · Tampil di Depan Saja` },
        { label: 'Dimensi Panel Depan & Belakang', value: `${weightSpecs.frontDim} (Sudut ${weightSpecs.cornerRadius})` },
        { label: 'Lipatan Alas Bawah (W-Gusset)', value: `${weightSpecs.bottomFold} (Expanded Bottom Fold)` },
        { label: 'Margin Heat-Seal Kiri & Kanan', value: `${weightSpecs.sealWidth} Keliling + Tear Notch 22 mm dari Atas` },
        { label: 'Posisi Katup Udara (Valve)', value: `Center Atas · ${weightSpecs.valveDist} dari Tepi Atas (Ø 22 mm)` },
        { label: 'Varian Biji & Profil Sangrai', value: `${variant.frontLabel} · ${roast.label}` },
        { label: 'Komposisi Latar & Stempel KTH', value: `${mood.label} · ${sealPositionLabel}` },
        { label: 'Material & Finishing Mewah', value: 'Matte Velvet Film + Hot-Foil Champagne Gold (Pantone 871 C)' },
      ]
    : tall
      ? [
          { label: 'Model Kemasan', value: `Tall Flat-Bottom Gusset Bag (${shapeMeta.shortLabel})` },
          { label: 'Berat Bersih & Estimasi Sajian', value: `${config.netWeight} (${weightSpecs.servings}) · Tampil di Depan Saja` },
          { label: 'Dimensi Panel Depan & Belakang', value: weightSpecs.frontDim },
          { label: 'Dimensi Gusset Kiri & Kanan', value: weightSpecs.gussetDim },
          { label: 'Total Lebar Unwrap Full Print', value: weightSpecs.unwrapDim },
          { label: 'Zona Aman Teks (Safe Zone)', value: `${weightSpecs.sealWidth} dari garis potong · 18 mm area zipper atas` },
          { label: 'Varian Biji & Profil Sangrai', value: `${variant.frontLabel} · ${roast.label}` },
          { label: 'Komposisi Latar & Stempel KTH', value: `${mood.label} · ${sealPositionLabel}` },
          {
            label: 'Finishing Mewah (Spot)',
            value:
              config.pouchShape === 'tall-copper'
                ? 'Metallic Copper Ink + Spot Gold Pinstripe (Bersih Tanpa Daun)'
                : config.pouchShape === 'tall-minimal'
                  ? 'Matte Velvet Film Minimalis Tanpa Ornamen + Hot-Foil Champagne Gold'
                  : 'Hot-Foil Stamping Champagne Gold (Ornamen & Emblem)',
          },
        ]
      : [
          { label: 'Model Kemasan', value: 'Standing Pouch Flat-Bottom / Side Gusset + Zipper' },
          { label: 'Berat Bersih & Estimasi Sajian', value: `${config.netWeight} (${weightSpecs.servings}) · Tampil di Depan Saja` },
          { label: 'Dimensi Panel Depan & Belakang', value: weightSpecs.frontDim },
          { label: 'Dimensi Gusset Kiri & Kanan', value: weightSpecs.gussetDim },
          { label: 'Total Lebar Unwrap Full Print', value: weightSpecs.unwrapDim },
          { label: 'Zona Aman Teks (Safe Zone)', value: `${weightSpecs.sealWidth} dari garis potong · 18 mm area zipper atas` },
          { label: 'Varian Biji & Profil Sangrai', value: `${variant.frontLabel} · ${roast.label}` },
          { label: 'Komposisi Latar & Stempel KTH', value: `${mood.label} · ${sealPositionLabel}` },
          { label: 'Finishing & Profil Warna', value: 'Matte Velvet Film + Spot Gold Foil (Pantone 871 C)' },
        ];

  return [
    ...baseSpecs,
    { label: 'Font Display & Tagline', value: shapeMeta.fonts.display },
    { label: 'Font Sub-Judul & Teknis', value: `${shapeMeta.fonts.body} · ${shapeMeta.fonts.mono}` },
    { label: 'Tanggal & Zona Waktu Cetak', value: getWibFormattedDateTime() },
  ];
}
