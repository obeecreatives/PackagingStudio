export type PouchShapeId =
  | 'box-gusset'
  | 'doypack-valve'
  | 'tall-heritage'
  | 'tall-botanical'
  | 'tall-copper';

export type BeanVariantId = 'robusta-100' | 'robusta-honey' | 'robusta-peaberry';
export type RoastLevelId = 'traditional' | 'medium-dark' | 'bold-espresso';
export type NaturalMoodId = 'kawi-beans' | 'cherries-beans' | 'espresso-matte';
export type SealPlacement = 'back' | 'front' | 'hidden';
export type WeightOption = '250 Gr' | '500 Gr' | '100 Gr';
export type PrintViewMode = 'compare' | 'dieline' | 'front' | 'back-gusset' | 'pouch-3d';
export type ArtworkSourceMode = 'uploaded-final' | 'studio-custom';

export interface PackagingConfig {
  pouchShape: PouchShapeId;
  beanVariant: BeanVariantId;
  roastLevel: RoastLevelId;
  naturalMood: NaturalMoodId;
  sealPlacement: SealPlacement;
  netWeight: WeightOption;
  showPrintMarks: boolean;
  artworkSource: ArtworkSourceMode;
}

export interface PouchFontSpec {
  display: string;
  tagline: string;
  body: string;
  mono: string;
  summary: string;
}

export interface WeightAdjustedSpecs {
  dimensions: string;
  frontDim: string;
  gussetDim: string;
  unwrapDim: string;
  bottomFold: string;
  cornerRadius: string;
  sealWidth: string;
  valveDist: string;
  servings: string;
  frontWmm: number;
  panelHmm: number;
  gussetWmm: number;
  bottomMm: number;
  visualScale: number;
}

export const POUCH_SHAPES: Record<
  PouchShapeId,
  {
    code: string;
    label: string;
    shortLabel: string;
    dimensions: string;
    description: string;
    fonts: PouchFontSpec;
  }
> = {
  'box-gusset': {
    code: 'Versi 01',
    label: 'Box Pouch + Side Gusset',
    shortLabel: 'Box Pouch Gusset',
    dimensions: '130 × 210 × 70 mm',
    description:
      'Pouch alas kotak dengan lipatan samping dan pita foil emas bawah, menerapkan desain depan & belakang revisi Anda.',
    fonts: {
      display: 'Swash Display Serif (ARUNIKA) + Bold Sans (KAWI)',
      tagline: 'Plus Jakarta Sans · SemiBold (Traditional Roasting)',
      body: 'Plus Jakarta Sans · Regular–Bold (Deskripsi & KUPS Blitar)',
      mono: 'IBM Plex Mono · Medium 500 (Elevasi & Kode)',
      summary: 'Swash Display Serif · Plus Jakarta Sans · IBM Plex Mono',
    },
  },
  'doypack-valve': {
    code: 'Alternatif 02',
    label: 'Stand-Up Doypack + Katup Udara',
    shortLabel: 'Doypack + Valve',
    dimensions: '150 × 220 mm (+ 40 mm Alas)',
    description:
      'Pouch berdiri sudut membulat dengan seal samping, zipper atas, dan katup udara satu arah di bawah EST 2024.',
    fonts: {
      display: 'Swash Display Serif (ARUNIKA) + Bold Sans (KAWI)',
      tagline: 'Plus Jakarta Sans · SemiBold (Center Valve Layout)',
      body: 'Plus Jakarta Sans · Regular–Bold (Deskripsi & KUPS Blitar)',
      mono: 'IBM Plex Mono · Regular–Medium (Elevasi & Kode)',
      summary: 'Swash Display Serif · Plus Jakarta Sans · IBM Plex Mono',
    },
  },
  'tall-heritage': {
    code: 'Alternatif 03',
    label: 'Tall Gusset · Classic Gold Border',
    shortLabel: 'Tall Classic Border',
    dimensions: '100 × 240 × 65 mm',
    description:
      'Kemasan tinggi ramping dengan bingkai garis emas tipis, menerapkan desain depan & belakang lengkap Anda.',
    fonts: {
      display: 'Swash Display Serif (ARUNIKA) + Bold Sans (KAWI)',
      tagline: 'Plus Jakarta Sans · SemiBold & Traditional Roast Crest',
      body: 'Plus Jakarta Sans · Regular–Bold (Deskripsi & KUPS Blitar)',
      mono: 'IBM Plex Mono · Medium 500 (Data Teknis)',
      summary: 'Swash Display Serif · Plus Jakarta Sans · IBM Plex Mono',
    },
  },
  'tall-botanical': {
    code: 'Alternatif 04',
    label: 'Tall Gusset · Botanical Gold Foil',
    shortLabel: 'Tall Botanical Foil',
    dimensions: '100 × 240 × 65 mm',
    description:
      'Kemasan tinggi dengan bingkai garis halus daun dan buah ceri kopi foil emas membingkai artwork depan Anda.',
    fonts: {
      display: 'Swash Display Serif (ARUNIKA) + Bold Sans (KAWI)',
      tagline: 'Plus Jakarta Sans · SemiBold (Framing Botani Foil)',
      body: 'Plus Jakarta Sans · Regular–Bold (Deskripsi & KUPS Blitar)',
      mono: 'IBM Plex Mono · Medium 500 (Data Teknis)',
      summary: 'Swash Display Serif · Plus Jakarta Sans · IBM Plex Mono',
    },
  },
  'tall-copper': {
    code: 'Alternatif 05',
    label: 'Tall Gusset · Copper Geometric Sash',
    shortLabel: 'Tall Copper Sash',
    dimensions: '100 × 240 × 65 mm',
    description:
      'Gaya kontemporer dengan garis vertikal emas tipis & bidang diagonal tembaga terakota pada artwork depan & belakang Anda.',
    fonts: {
      display: 'Swash Display Serif (ARUNIKA) + Bold Sans (KAWI)',
      tagline: 'Plus Jakarta Sans · SemiBold (Aksen Diagonal Tembaga)',
      body: 'Plus Jakarta Sans · Regular–Bold (Deskripsi & KUPS Blitar)',
      mono: 'IBM Plex Mono · Medium 500 (Data Teknis)',
      summary: 'Swash Display Serif · Plus Jakarta Sans · IBM Plex Mono',
    },
  },
};

export function isTallGusset(shape: PouchShapeId): boolean {
  return shape === 'tall-heritage' || shape === 'tall-botanical' || shape === 'tall-copper';
}

export function getWeightSpecs(shape: PouchShapeId, weight: WeightOption): WeightAdjustedSpecs {
  const tall = isTallGusset(shape);
  const isDoypack = shape === 'doypack-valve';

  if (weight === '100 Gr') {
    if (isDoypack) {
      return {
        dimensions: '120 × 185 mm (+ 32 mm Alas)',
        frontDim: '120 × 185 mm',
        gussetDim: '32 mm (Alas Bawah)',
        unwrapDim: '120 × 185 mm (Depan & Belakang)',
        bottomFold: '32 mm',
        cornerRadius: 'R-8 mm',
        sealWidth: '6 mm',
        valveDist: '52 mm',
        servings: '± 7 – 8 Sajian Seduh',
        frontWmm: 120,
        panelHmm: 185,
        gussetWmm: 0,
        bottomMm: 32,
        visualScale: 0.87,
      };
    }
    if (tall) {
      return {
        dimensions: '85 × 195 × 50 mm',
        frontDim: '85 × 195 mm',
        gussetDim: '50 × 195 mm',
        unwrapDim: '270 × 195 mm (+ 3 mm Bleed Keliling)',
        bottomFold: '50 mm',
        cornerRadius: 'R-4 mm',
        sealWidth: '5 mm',
        valveDist: '46 mm',
        servings: '± 7 – 8 Sajian Seduh',
        frontWmm: 85,
        panelHmm: 195,
        gussetWmm: 50,
        bottomMm: 50,
        visualScale: 0.87,
      };
    }
    return {
      dimensions: '105 × 170 × 55 mm',
      frontDim: '105 × 170 mm',
      gussetDim: '55 × 170 mm',
      unwrapDim: '320 × 170 mm (+ 3 mm Bleed Keliling)',
      bottomFold: '55 mm',
      cornerRadius: 'R-4 mm',
      sealWidth: '5 mm',
      valveDist: '46 mm',
      servings: '± 7 – 8 Sajian Seduh',
      frontWmm: 105,
      panelHmm: 170,
      gussetWmm: 55,
      bottomMm: 55,
      visualScale: 0.87,
    };
  }

  if (weight === '500 Gr') {
    if (isDoypack) {
      return {
        dimensions: '180 × 265 mm (+ 48 mm Alas)',
        frontDim: '180 × 265 mm',
        gussetDim: '48 mm (Alas Bawah)',
        unwrapDim: '180 × 265 mm (Depan & Belakang)',
        bottomFold: '48 mm',
        cornerRadius: 'R-12 mm',
        sealWidth: '10 mm',
        valveDist: '74 mm',
        servings: '± 33 – 40 Sajian Seduh',
        frontWmm: 180,
        panelHmm: 265,
        gussetWmm: 0,
        bottomMm: 48,
        visualScale: 1.06,
      };
    }
    if (tall) {
      return {
        dimensions: '120 × 290 × 75 mm',
        frontDim: '120 × 290 mm',
        gussetDim: '75 × 290 mm',
        unwrapDim: '390 × 290 mm (+ 3 mm Bleed Keliling)',
        bottomFold: '75 mm',
        cornerRadius: 'R-4 mm',
        sealWidth: '6 mm',
        valveDist: '64 mm',
        servings: '± 33 – 40 Sajian Seduh',
        frontWmm: 120,
        panelHmm: 290,
        gussetWmm: 75,
        bottomMm: 75,
        visualScale: 1.06,
      };
    }
    return {
      dimensions: '155 × 255 × 85 mm',
      frontDim: '155 × 255 mm',
      gussetDim: '85 × 255 mm',
      unwrapDim: '480 × 255 mm (+ 3 mm Bleed Keliling)',
      bottomFold: '85 mm',
      cornerRadius: 'R-4 mm',
      sealWidth: '6 mm',
      valveDist: '62 mm',
      servings: '± 33 – 40 Sajian Seduh',
      frontWmm: 155,
      panelHmm: 255,
      gussetWmm: 85,
      bottomMm: 85,
      visualScale: 1.06,
    };
  }

  // Default 250 Gr
  if (isDoypack) {
    return {
      dimensions: '150 × 220 mm (+ 40 mm Alas)',
      frontDim: '150 × 220 mm',
      gussetDim: '40 mm (Alas Bawah)',
      unwrapDim: '150 × 220 mm (Depan & Belakang)',
      bottomFold: '40 mm',
      cornerRadius: 'R-10 mm',
      sealWidth: '8 mm',
      valveDist: '62 mm',
      servings: '± 16 – 20 Sajian Seduh',
      frontWmm: 150,
      panelHmm: 220,
      gussetWmm: 0,
      bottomMm: 40,
      visualScale: 1,
    };
  }
  if (tall) {
    return {
      dimensions: '100 × 240 × 65 mm',
      frontDim: '100 × 240 mm',
      gussetDim: '65 × 240 mm',
      unwrapDim: '330 × 240 mm (+ 3 mm Bleed Keliling)',
      bottomFold: '65 mm',
      cornerRadius: 'R-4 mm',
      sealWidth: '5 mm',
      valveDist: '54 mm',
      servings: '± 16 – 20 Sajian Seduh',
      frontWmm: 100,
      panelHmm: 240,
      gussetWmm: 65,
      bottomMm: 65,
      visualScale: 1,
    };
  }
  return {
    dimensions: '130 × 210 × 70 mm',
    frontDim: '130 × 210 mm',
    gussetDim: '70 × 210 mm',
    unwrapDim: '400 × 210 mm (+ 3 mm Bleed Keliling)',
    bottomFold: '70 mm',
    cornerRadius: 'R-4 mm',
    sealWidth: '5 mm',
    valveDist: '54 mm',
    servings: '± 16 – 20 Sajian Seduh',
    frontWmm: 130,
    panelHmm: 210,
    gussetWmm: 70,
    bottomMm: 70,
    visualScale: 1,
  };
}

export const BEAN_VARIANTS: Record<
  BeanVariantId,
  {
    label: string;
    frontLabel: string;
    originLine: string;
    notes: string[];
    altitude: string;
    process: string;
    storyCharacter: string;
  }
> = {
  'robusta-100': {
    label: '100 % Robusta Bean',
    frontLabel: '100 % Robusta Bean',
    originLine: 'Lereng Gunung Kawi · Jawa Timur',
    notes: ['Dark Chocolate', 'Roasted Hazelnut', 'Spiced Caramel'],
    altitude: '1.100 – 1.400 MDPL',
    process: 'Natural & Traditional Dry Hull',
    storyCharacter: 'rasa kopi robusta yang autentik.',
  },
  'robusta-honey': {
    label: 'Fine Robusta Honey',
    frontLabel: 'Fine Robusta Honey',
    originLine: 'Petik Merah Kawi · Jawa Timur',
    notes: ['Palm Sugar', 'Cacao Nib', 'Sweet Molasses'],
    altitude: '1.200 – 1.450 MDPL',
    process: 'Red Honey Anaerobic Process',
    storyCharacter: 'rasa fine robusta honey yang manis autentik.',
  },
  'robusta-peaberry': {
    label: 'Kawi Peaberry Reserve',
    frontLabel: 'Robusta Lanang Reserve',
    originLine: 'Seleksi Khusus · Gunung Kawi',
    notes: ['Toasted Almond', 'Bitter Cocoa', 'Warm Clove'],
    altitude: '1.250 – 1.500 MDPL',
    process: 'Hand-Sorted Single Bean',
    storyCharacter: 'rasa robusta lanang pilihan yang intens dan berkarakter.',
  },
};

export const ROAST_LEVELS: Record<
  RoastLevelId,
  {
    label: string;
    crestTop: string;
    crestBottom: string;
    subtitle: string;
    bodyScore: number;
    bitternessScore: number;
    aromaScore: number;
    storyRoast: string;
  }
> = {
  traditional: {
    label: 'Traditional Roast',
    crestTop: 'TRADITIONAL',
    crestBottom: 'ROAST',
    subtitle: 'Traditional Roasting Coffee',
    bodyScore: 5,
    bitternessScore: 4,
    aromaScore: 4,
    storyRoast: 'Proses sangrai tradisionalnya menciptakan aroma khas',
  },
  'medium-dark': {
    label: 'Medium-Dark Roast',
    crestTop: 'ARTISAN',
    crestBottom: 'ROAST',
    subtitle: 'Slow-Drum Mountain Roast',
    bodyScore: 4,
    bitternessScore: 3,
    aromaScore: 5,
    storyRoast: 'Proses slow-drum artisannya mengeluarkan aroma karamel hangat',
  },
  'bold-espresso': {
    label: 'Bold Espresso Roast',
    crestTop: 'BOLD',
    crestBottom: 'ROAST',
    subtitle: 'Deep Rich Crema Roasting',
    bodyScore: 5,
    bitternessScore: 5,
    aromaScore: 4,
    storyRoast: 'Proses sangrai bold espresso-nya menghasilkan crema pekat dan aroma kuat',
  },
};

export const NATURAL_MOODS: Record<
  NaturalMoodId,
  {
    label: string;
    description: string;
  }
> = {
  'kawi-beans': {
    label: 'Biji Kopi & Kabut Kawi',
    description: 'Komposisi natural lereng Gunung Kawi saat fajar berpadu taburan biji kopi sangrai.',
  },
  'cherries-beans': {
    label: 'Ceri Merah & Biji Sangrai',
    description: 'Foto makro ranting ceri kopi segar berembun dan biji sangrai Robusta pilihan.',
  },
  'espresso-matte': {
    label: 'Espresso Matte Klasik',
    description: 'Latar espresso gelap dengan fokus fotografi biji kopi natural di bagian bawah kemasan.',
  },
};

export function getDynamicShapeDescription(shape: PouchShapeId, config: PackagingConfig): string {
  const base = POUCH_SHAPES[shape].description;
  const specs = getWeightSpecs(shape, config.netWeight);
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const sealText =
    config.sealPlacement === 'back'
      ? 'Stempel KTH di panel belakang'
      : config.sealPlacement === 'front'
        ? 'Stempel KTH di panel depan'
        : 'Tanpa stempel KTH';

  return `${base} Kemasan ${config.netWeight} (${specs.dimensions}) · ${variant.frontLabel} · ${roast.label} · ${sealText}.`;
}

export const GENERATED_ASSETS = {
  pouchMockup: '/src/assets/images/arunika_v2_box_gusset_1794898861802.jpg',
  doypackStudio: '/src/assets/images/arunika_doypack_exact_front_1794899522560.jpg',
  doypackStudioRear: '/src/assets/images/arunika_doypack_exact_rear_1794899521097.jpg',
  doypackNatural: '/src/assets/images/arunika_doypack_exact_natural_pair_1794899799953.jpg',
  tallHeritage: '/src/assets/images/arunika_v2_tall_heritage_1794898865922.jpg',
  tallBotanical: '/src/assets/images/arunika_v2_tall_botanical_1794898868139.jpg',
  tallCopper: '/src/assets/images/arunika_v2_tall_copper_1794898867985.jpg',
  beansCluster: '/src/assets/images/natural_coffee_beans_cluster_1794878296922.jpg',
  kawiMist: '/src/assets/images/natural_kawi_mist_landscape_1794878296610.jpg',
  coffeeCherries: '/src/assets/images/natural_coffee_cherries_branch_1794878297817.jpg',
};

export const ORIGINAL_UPLOADS = {
  revisedFront: '/assets/aistudio/Arunika_Kawi_Front_5746d0e7.png',
  revisedRear: '/assets/aistudio/Arunika_Kawi_rear_d422cdc0.png',
  draftWithSeal: '/assets/aistudio/1_a10913ea.png',
  draftClean: '/assets/aistudio/2_adb214b7.png',
  referenceMockup: '/assets/aistudio/5_815d0c47.png',
  doypackBlank: '/assets/aistudio/image_a0cc6479.png',
  tallReferenceGroup: '/assets/aistudio/Gemini_Generated_Image_m4bjlam4bjlam4bj_97ebb9eb.jpg',
};
