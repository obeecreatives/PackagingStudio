import React from 'react';
import {
  BEAN_VARIANTS,
  GENERATED_ASSETS,
  isTallGusset,
  PackagingConfig,
  POUCH_SHAPES,
  PouchShapeId,
  ROAST_LEVELS,
} from '../types/packaging';
import { KthEastJavaSeal, RoastProfileCrest } from './BrandCrests';
import { BackPanel, FrontPanel, SideGussetPanel } from './PackagingPanels';

export type MockupSceneMode = 'natural-kawi' | 'studio-front' | 'studio-rear';

interface LiveMockupSceneProps {
  config: PackagingConfig;
  scene?: MockupSceneMode;
  size?: 'hero' | 'card' | 'critique';
  backgroundOnly?: boolean;
}

interface PhotoOverlaySpec {
  weightBox: { left: string; top: string; width: string; height: string; skew?: string; darkBand?: boolean };
  subtitleBox: {
    left: string;
    top: string;
    width: string;
    height: string;
    skew?: string;
    gradient: string;
  };
  frontSealPos: { left: string; top: string };
  rearPirtBox: { left: string; top: string; width: string; height: string; skew?: string };
  rearStoryBox: {
    left: string;
    top: string;
    width: string;
    height: string;
    skew?: string;
    storyFontCqi: number;
    compFontCqi: number;
    gradient: string;
  };
  rearProducerBox: {
    left: string;
    top: string;
    width: string;
    height: string;
    skew?: string;
    gradient: string;
  };
  rearCodeBox?: {
    left: string;
    top: string;
    width: string;
    height: string;
    skew?: string;
    gradient: string;
  };
  rearBottomBand?: {
    left: string;
    top: string;
    width: string;
    height: string;
    skew?: string;
    darkBand?: boolean;
  };
  rearCrestBox?: {
    left: string;
    top: string;
    width: string;
    skew?: string;
  };
  rearSealBox?: {
    left: string;
    top: string;
    skew?: string;
  };
}

const NATURAL_PHOTO_SPECS: Record<PouchShapeId, PhotoOverlaySpec> = {
  'box-gusset': {
    weightBox: { left: '13.5%', top: '76.3%', width: '34.2%', height: '5.0%' },
    subtitleBox: {
      left: '13.0%',
      top: '51.4%',
      width: '35.0%',
      height: '6.8%',
      gradient:
        'linear-gradient(90deg, rgba(50,34,23,0.99) 0%, rgba(42,27,19,0.99) 55%, rgba(34,21,14,0.98) 100%)',
    },
    frontSealPos: { left: '40.0%', top: '65.8%' },
    rearPirtBox: { left: '57.3%', top: '72.4%', width: '9.8%', height: '1.5%', skew: 'skewY(2.2deg)' },
    rearStoryBox: {
      left: '52.2%',
      top: '41.6%',
      width: '31.8%',
      height: '22.4%',
      skew: 'skewY(2.2deg)',
      storyFontCqi: 1.18,
      compFontCqi: 1.06,
      gradient:
        'linear-gradient(90deg, rgba(64,45,32,0.99) 0%, rgba(45,31,22,0.99) 55%, rgba(30,19,13,0.98) 100%)',
    },
    rearProducerBox: {
      left: '56.4%',
      top: '68.9%',
      width: '14.6%',
      height: '3.6%',
      skew: 'skewY(2.2deg)',
      gradient:
        'linear-gradient(90deg, rgba(36,24,17,0.99) 0%, rgba(30,19,13,0.99) 60%, rgba(25,16,11,0.98) 100%)',
    },
    rearCodeBox: {
      left: '70.4%',
      top: '69.0%',
      width: '12.6%',
      height: '6.4%',
      skew: 'skewY(2.2deg)',
      gradient:
        'linear-gradient(90deg, rgba(28,18,12,0.99) 0%, rgba(24,15,10,0.99) 60%, rgba(20,12,8,0.98) 100%)',
    },
  },
  'doypack-valve': {
    weightBox: { left: '16.8%', top: '74.1%', width: '30.4%', height: '4.6%' },
    subtitleBox: {
      left: '15.0%',
      top: '54.0%',
      width: '34.2%',
      height: '6.8%',
      gradient:
        'linear-gradient(90deg, rgba(65,45,33,0.99) 0%, rgba(49,32,23,0.99) 52%, rgba(30,18,12,0.98) 100%)',
    },
    frontSealPos: { left: '39.5%', top: '64.2%' },
    rearPirtBox: { left: '60.8%', top: '74.3%', width: '11.8%', height: '1.6%' },
    rearStoryBox: {
      left: '54.2%',
      top: '43.6%',
      width: '34.6%',
      height: '19.4%',
      storyFontCqi: 1.24,
      compFontCqi: 1.1,
      gradient:
        'linear-gradient(90deg, rgba(50,35,26,0.99) 0%, rgba(36,24,17,0.99) 55%, rgba(27,17,12,0.98) 100%)',
    },
    rearProducerBox: {
      left: '60.3%',
      top: '70.5%',
      width: '14.2%',
      height: '3.1%',
      gradient:
        'linear-gradient(90deg, rgba(35,23,16,0.99) 0%, rgba(30,20,14,0.99) 60%, rgba(26,17,12,0.98) 100%)',
    },
    rearCodeBox: {
      left: '75.5%',
      top: '70.3%',
      width: '12.5%',
      height: '6.0%',
      gradient:
        'linear-gradient(90deg, rgba(28,18,12,0.99) 0%, rgba(25,16,11,0.99) 60%, rgba(22,14,9,0.98) 100%)',
    },
  },
  'tall-heritage': {
    weightBox: { left: '16.2%', top: '83.0%', width: '31.6%', height: '4.8%' },
    subtitleBox: {
      left: '14.8%',
      top: '51.2%',
      width: '34.2%',
      height: '7.0%',
      gradient:
        'linear-gradient(90deg, rgba(46,31,22,0.99) 0%, rgba(38,25,18,0.99) 55%, rgba(60,42,30,0.98) 100%)',
    },
    frontSealPos: { left: '40.5%', top: '72.0%' },
    rearPirtBox: { left: '64.3%', top: '77.8%', width: '10.2%', height: '1.5%', skew: 'skewY(-3deg)' },
    rearStoryBox: {
      left: '59.8%',
      top: '38.4%',
      width: '27.0%',
      height: '23.4%',
      skew: 'skewY(-3deg)',
      storyFontCqi: 1.0,
      compFontCqi: 0.9,
      gradient:
        'linear-gradient(90deg, rgba(45,30,22,0.99) 0%, rgba(36,24,17,0.99) 55%, rgba(50,35,25,0.98) 100%)',
    },
    rearProducerBox: {
      left: '63.4%',
      top: '72.6%',
      width: '13.2%',
      height: '3.2%',
      skew: 'skewY(-3deg)',
      gradient:
        'linear-gradient(90deg, rgba(35,23,16,0.99) 0%, rgba(31,20,14,0.99) 60%, rgba(28,18,13,0.98) 100%)',
    },
    rearCodeBox: {
      left: '76.8%',
      top: '72.0%',
      width: '10.5%',
      height: '6.2%',
      skew: 'skewY(-3deg)',
      gradient:
        'linear-gradient(90deg, rgba(31,21,15,0.99) 0%, rgba(28,19,13,0.99) 60%, rgba(25,16,11,0.98) 100%)',
    },
  },
  'tall-botanical': {
    weightBox: { left: '18.0%', top: '81.8%', width: '32.0%', height: '4.6%', skew: 'skewY(-2.4deg)' },
    subtitleBox: {
      left: '17.2%',
      top: '50.1%',
      width: '34.6%',
      height: '7.0%',
      skew: 'skewY(-1.6deg)',
      gradient:
        'linear-gradient(90deg, rgba(44,30,22,0.99) 0%, rgba(38,25,18,0.99) 55%, rgba(56,38,27,0.98) 100%)',
    },
    frontSealPos: { left: '42.5%', top: '70.5%' },
    rearPirtBox: { left: '66.7%', top: '74.5%', width: '10.5%', height: '1.5%', skew: 'skewY(-2deg)' },
    rearStoryBox: {
      left: '60.2%',
      top: '35.2%',
      width: '31.2%',
      height: '23.4%',
      skew: 'skewY(-2deg)',
      storyFontCqi: 1.12,
      compFontCqi: 1.0,
      gradient:
        'linear-gradient(90deg, rgba(44,30,22,0.99) 0%, rgba(37,25,18,0.99) 55%, rgba(50,34,24,0.98) 100%)',
    },
    rearProducerBox: {
      left: '65.8%',
      top: '69.8%',
      width: '13.8%',
      height: '3.2%',
      skew: 'skewY(-2deg)',
      gradient:
        'linear-gradient(90deg, rgba(34,23,16,0.99) 0%, rgba(30,20,14,0.99) 60%, rgba(27,18,12,0.98) 100%)',
    },
    rearCodeBox: {
      left: '79.6%',
      top: '69.0%',
      width: '10.8%',
      height: '6.2%',
      skew: 'skewY(-2deg)',
      gradient:
        'linear-gradient(90deg, rgba(30,20,14,0.99) 0%, rgba(27,18,12,0.99) 60%, rgba(24,15,10,0.98) 100%)',
    },
  },
  'tall-copper': {
    weightBox: { left: '19.0%', top: '79.0%', width: '28.5%', height: '4.6%', darkBand: true },
    subtitleBox: {
      left: '19.5%',
      top: '54.4%',
      width: '28.0%',
      height: '6.4%',
      gradient:
        'linear-gradient(90deg, rgba(34,22,16,0.99) 0%, rgba(28,18,13,0.99) 55%, rgba(24,15,10,0.98) 100%)',
    },
    frontSealPos: { left: '39.5%', top: '68.0%' },
    rearPirtBox: { left: '57.6%', top: '73.2%', width: '6.5%', height: '1.2%', skew: 'skewY(2.2deg)' },
    rearStoryBox: {
      left: '52.2%',
      top: '36.0%',
      width: '19.4%',
      height: '26.5%',
      skew: 'skewY(2.2deg)',
      storyFontCqi: 0.78,
      compFontCqi: 0.72,
      gradient:
        'linear-gradient(90deg, rgba(72,53,42,0.96) 0%, rgba(58,41,32,0.96) 55%, rgba(42,29,22,0.95) 100%)',
    },
    rearProducerBox: {
      left: '55.5%',
      top: '67.5%',
      width: '9.0%',
      height: '4.5%',
      skew: 'skewY(2.2deg)',
      gradient:
        'linear-gradient(90deg, rgba(48,34,26,0.98) 0%, rgba(40,28,21,0.98) 60%, rgba(34,23,17,0.98) 100%)',
    },
    rearCodeBox: {
      left: '64.8%',
      top: '67.8%',
      width: '7.0%',
      height: '6.4%',
      skew: 'skewY(2.2deg)',
      gradient:
        'linear-gradient(90deg, rgba(36,24,17,0.98) 0%, rgba(30,20,14,0.98) 60%, rgba(25,16,11,0.98) 100%)',
    },
    rearCrestBox: { left: '57.6%', top: '28.5%', width: '8.5%', skew: 'skewY(2.2deg)' },
    rearSealBox: { left: '52.4%', top: '68.0%', skew: 'skewY(2.2deg)' },
    rearBottomBand: { left: '52.2%', top: '78.2%', width: '19.6%', height: '4.6%', skew: 'skewY(2.2deg)', darkBand: true },
  },
  'tall-minimal': {
    weightBox: { left: '15.0%', top: '81.8%', width: '31.5%', height: '5.0%' },
    subtitleBox: {
      left: '16.5%',
      top: '56.6%',
      width: '28.5%',
      height: '6.6%',
      gradient:
        'linear-gradient(90deg, rgba(40,26,19,0.99) 0%, rgba(32,21,15,0.99) 55%, rgba(26,16,11,0.98) 100%)',
    },
    frontSealPos: { left: '39.0%', top: '70.0%' },
    rearPirtBox: { left: '59.2%', top: '72.4%', width: '7.4%', height: '1.3%', skew: 'skewY(2.6deg)' },
    rearStoryBox: {
      left: '53.2%',
      top: '38.0%',
      width: '22.8%',
      height: '25.0%',
      skew: 'skewY(2.6deg)',
      storyFontCqi: 0.9,
      compFontCqi: 0.82,
      gradient:
        'linear-gradient(90deg, rgba(84,64,51,0.98) 0%, rgba(68,50,39,0.98) 55%, rgba(50,36,28,0.98) 100%)',
    },
    rearProducerBox: {
      left: '56.8%',
      top: '67.0%',
      width: '10.6%',
      height: '4.8%',
      skew: 'skewY(2.6deg)',
      gradient:
        'linear-gradient(90deg, rgba(72,53,42,0.99) 0%, rgba(60,44,34,0.99) 60%, rgba(48,34,26,0.99) 100%)',
    },
    rearCodeBox: {
      left: '67.6%',
      top: '67.2%',
      width: '8.4%',
      height: '6.4%',
      skew: 'skewY(2.6deg)',
      gradient:
        'linear-gradient(90deg, rgba(56,41,32,0.99) 0%, rgba(46,33,25,0.99) 60%, rgba(38,27,20,0.99) 100%)',
    },
    rearCrestBox: { left: '59.6%', top: '30.5%', width: '9.5%', skew: 'skewY(2.6deg)' },
    rearSealBox: { left: '53.4%', top: '67.2%', skew: 'skewY(2.6deg)' },
    rearBottomBand: { left: '52.4%', top: '79.4%', width: '23.8%', height: '5.2%', skew: 'skewY(2.6deg)' },
  },
};

const FEATHERED_PATCH_MASK =
  'radial-gradient(ellipse 50% 49% at 50% 50%, rgba(0,0,0,1) 76%, rgba(0,0,0,0.9) 90%, rgba(0,0,0,0) 100%)';

const GOLD_BAND_FEATHER_MASK =
  'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%)';

function getNaturalPhotoForShape(shape: PouchShapeId): string {
  switch (shape) {
    case 'box-gusset':
      return GENERATED_ASSETS.pouchMockup;
    case 'doypack-valve':
      return GENERATED_ASSETS.doypackNatural;
    case 'tall-heritage':
      return GENERATED_ASSETS.tallHeritage;
    case 'tall-botanical':
      return GENERATED_ASSETS.tallBotanical;
    case 'tall-copper':
      return GENERATED_ASSETS.tallCopper;
    case 'tall-minimal':
      return GENERATED_ASSETS.tallMinimal;
  }
}

export const LiveMockupScene = React.memo(function LiveMockupScene({
  config,
  scene = 'natural-kawi',
  size = 'hero',
  backgroundOnly = false,
}: LiveMockupSceneProps) {
  const isDoypack = config.pouchShape === 'doypack-valve';
  const tall = isTallGusset(config.pouchShape);
  const shapeMeta = POUCH_SHAPES[config.pouchShape];
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const isCompact = size !== 'hero';
  const isStudio = scene === 'studio-front' || scene === 'studio-rear';

  const hasMoodOverride = config.naturalMood !== 'kawi-beans';
  const rearCompositionText =
    config.beanVariant === 'robusta-100'
      ? 'KOMPOSISI 100 % BIJI KOPI ROBUSTA'
      : `KOMPOSISI ${variant.frontLabel.toUpperCase()}`;

  const usePhotorealisticNatural =
    !backgroundOnly && config.artworkSource === 'uploaded-final' && scene === 'natural-kawi';
  const usePhotorealisticDoypackStudio =
    !backgroundOnly && config.artworkSource === 'uploaded-final' && isDoypack && isStudio;

  if (usePhotorealisticDoypackStudio) {
    const showFront = scene === 'studio-front';
    return (
      <div
        className="relative w-full h-full overflow-hidden flex items-center justify-center bg-white"
        style={{ containerType: 'size' }}
        aria-label={`${shapeMeta.code} ${showFront ? 'Tampak Depan' : 'Tampak Belakang'} (${config.netWeight})`}
      >
        <div
          className="relative flex items-center justify-center"
          style={{
            width: 'min(100cqw, 100cqh)',
            height: 'min(100cqw, 100cqh)',
          }}
        >
          <div className="relative w-full h-full" style={{ containerType: 'inline-size' }}>
            <img
              src={showFront ? GENERATED_ASSETS.doypackStudio : GENERATED_ASSETS.doypackStudioRear}
              alt={`${shapeMeta.label} ${showFront ? 'Tampak Depan' : 'Tampak Belakang'}`}
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />

            {/* Front Studio: Unmasked text over feathered warm-brown & gold backdrops */}
            {showFront && (
              <>
                <div
                  className="absolute flex flex-col items-center justify-center text-center pointer-events-none px-1"
                  style={{
                    left: '27.5%',
                    top: '51.8%',
                    width: '45.0%',
                    height: '8.2%',
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(52,34,24,0.99) 0%, rgba(39,25,17,1) 50%, rgba(28,17,11,0.99) 100%)',
                      maskImage: FEATHERED_PATCH_MASK,
                      WebkitMaskImage: FEATHERED_PATCH_MASK,
                    }}
                  />
                  <p
                    className="relative z-10 font-sans font-semibold text-[#FAF5EB] leading-[1.18] whitespace-nowrap"
                    style={{ fontSize: '2.15cqi' }}
                  >
                    {roast.subtitle}
                  </p>
                  <p
                    className="relative z-10 font-sans font-semibold text-[#FAF5EB] leading-[1.18] whitespace-nowrap"
                    style={{ fontSize: '2.15cqi' }}
                  >
                    {variant.frontLabel}
                  </p>
                </div>

                <div
                  className="absolute flex items-center justify-center pointer-events-none"
                  style={{
                    left: '33.5%',
                    top: '86.8%',
                    width: '32.5%',
                    height: '5.4%',
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(105deg, #D5B26E 0%, #E7CE97 50%, #BF934B 100%)',
                      maskImage: GOLD_BAND_FEATHER_MASK,
                      WebkitMaskImage: GOLD_BAND_FEATHER_MASK,
                    }}
                  />
                  <span
                    className="relative z-10 font-sans font-bold text-[#140B07] tabular-nums whitespace-nowrap"
                    style={{ fontSize: '2.35cqi' }}
                  >
                    Isi Bersih : {config.netWeight}
                  </span>
                </div>

                {config.sealPlacement === 'front' && (
                  <div className="absolute right-[26%] bottom-[16%] pointer-events-none">
                    <KthEastJavaSeal variant="original-green" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md" />
                  </div>
                )}
              </>
            )}

          {/* Rear Studio: Unmasked Goreng Kreweng Story & White PIRT Box (NO Weight on Rear) */}
          {!showFront && (
            <>
              <div
                className="absolute flex flex-col items-center justify-center text-center pointer-events-none px-4"
                style={{
                  left: '25.5%',
                  top: '30.5%',
                  width: '49.0%',
                  height: '29.5%',
                }}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(50,34,24,0.99) 0%, rgba(35,23,16,1) 55%, rgba(27,17,12,0.99) 100%)',
                    maskImage: FEATHERED_PATCH_MASK,
                    WebkitMaskImage: FEATHERED_PATCH_MASK,
                  }}
                />
                <p
                  className="relative z-10 font-sans text-[#FAF5EB] leading-[1.32]"
                  style={{ fontSize: '1.72cqi' }}
                >
                  Diolah secara tradisional (<em>Goreng Kreweng</em>) oleh Kelompok Tani Hutan. Dipetik langsung dari
                  lereng Gunung Kawi. Setiap seduhan menghadirkan karakter{' '}
                  <span className="font-semibold text-[#D8B474]">{variant.storyCharacter}</span> {roast.storyRoast}
                </p>
                <p
                  className="relative z-10 mt-2 font-sans font-semibold leading-tight"
                  style={{ fontSize: '1.78cqi' }}
                >
                  <span className="text-[#D8B474]">Arunika Kawi Coffee</span>{' '}
                  <span className="text-[#FAF5EB]">Harum dan Nikmat</span>
                </p>
                <p
                  className="relative z-10 mt-2.5 font-sans font-semibold tracking-[0.04em] text-[#FAF5EB] whitespace-nowrap"
                  style={{ fontSize: '1.58cqi' }}
                >
                  {rearCompositionText}
                </p>
              </div>

              {/* White PIRT stamp box cleanly below "PIRT" text & above the bottom gold band */}
              <div
                className="absolute bg-white pointer-events-none"
                style={{ left: '34.4%', top: '81.6%', width: '16.0%', height: '1.6%' }}
              />
            </>
          )}
          </div>
        </div>
      </div>
    );
  }

  if (usePhotorealisticNatural) {
    const spec = NATURAL_PHOTO_SPECS[config.pouchShape];
    const photoSrc = getNaturalPhotoForShape(config.pouchShape);

    return (
      <div
        className="relative w-full h-full overflow-hidden flex items-center justify-center bg-[#18100C]"
        style={size === 'hero' ? { containerType: 'size' } : undefined}
        aria-label={`${shapeMeta.code} · ${shapeMeta.shortLabel} (${config.netWeight})`}
      >
        {/* Ambient blurred backdrop when Hero container is wider than 896:1200 */}
        {size === 'hero' && (
          <img
            src={photoSrc}
            alt=""
            aria-hidden="true"
            decoding="async"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-55 pointer-events-none"
          />
        )}

        {/* Exact 896:1200 inner frame on all screen ratios */}
        <div
          className={`relative overflow-hidden ${size === 'hero' ? '' : 'w-full h-full'}`}
          style={
            size === 'hero'
              ? {
                  width: 'min(100cqw, calc(100cqh * 896 / 1200))',
                  height: 'min(100cqh, calc(100cqw * 1200 / 896))',
                }
              : undefined
          }
        >
          <div className="relative w-full h-full" style={{ containerType: 'inline-size' }}>
          <img
            src={photoSrc}
            alt={`${shapeMeta.code} · ${shapeMeta.label}`}
            loading={size === 'card' ? 'lazy' : 'eager'}
            decoding="async"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-center transition-all duration-300 ${
              config.naturalMood === 'espresso-matte'
                ? 'brightness-[0.86] contrast-[1.08] saturate-[0.82]'
                : config.naturalMood === 'cherries-beans'
                  ? 'brightness-[0.94] contrast-[1.06] sepia-[0.14]'
                  : ''
            }`}
          />

          {/* Subtle Atmospheric Mood Filter when changed from default Kawi Mist */}
          {hasMoodOverride && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  config.naturalMood === 'espresso-matte'
                    ? 'linear-gradient(to bottom, rgba(20,12,8,0.42) 0%, rgba(20,12,8,0.12) 48%, rgba(12,7,4,0.22) 100%)'
                    : 'radial-gradient(circle at 20% 20%, rgba(168,58,34,0.24) 0%, rgba(28,14,10,0.08) 55%, rgba(18,9,6,0.24) 100%)',
              }}
            />
          )}

          {/* Front Pouch: Unmasked crisp text over feathered warm-brown backdrop */}
          <div
            className="absolute flex flex-col items-center justify-center text-center pointer-events-none"
            style={{
              left: spec.subtitleBox.left,
              top: spec.subtitleBox.top,
              width: spec.subtitleBox.width,
              height: spec.subtitleBox.height,
              transform: spec.subtitleBox.skew,
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: spec.subtitleBox.gradient,
                maskImage: FEATHERED_PATCH_MASK,
                WebkitMaskImage: FEATHERED_PATCH_MASK,
              }}
            />
            <p
              className="relative z-10 font-sans font-semibold text-[#FAF5EB] leading-[1.16] whitespace-nowrap"
              style={{ fontSize: '1.88cqi' }}
            >
              {roast.subtitle}
            </p>
            <p
              className="relative z-10 font-sans font-semibold text-[#FAF5EB] leading-[1.16] whitespace-nowrap"
              style={{ fontSize: '1.88cqi' }}
            >
              {variant.frontLabel}
            </p>
          </div>

          {/* Front Pouch ONLY: Unmasked Net Weight ("Isi Bersih : 100 gram" or "Isi Bersih : 250 gram") */}
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              left: spec.weightBox.left,
              top: spec.weightBox.top,
              width: spec.weightBox.width,
              height: spec.weightBox.height,
              transform: spec.weightBox.skew,
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: spec.weightBox.darkBand
                  ? 'linear-gradient(105deg, #241610 0%, #1B100B 50%, #140B07 100%)'
                  : 'linear-gradient(105deg, #D5B26E 0%, #E7CE97 50%, #BF934B 100%)',
                maskImage: GOLD_BAND_FEATHER_MASK,
                WebkitMaskImage: GOLD_BAND_FEATHER_MASK,
              }}
            />
            <span
              className={`relative z-10 font-sans font-bold tabular-nums whitespace-nowrap ${
                spec.weightBox.darkBand ? 'text-[#FAF5EB]' : 'text-[#140B07]'
              }`}
              style={{ fontSize: '2.15cqi' }}
            >
              Isi Bersih : {config.netWeight}
            </span>
          </div>

          {/* Rear Top Crest & Subtitle (for clean tall-copper & tall-minimal back panels) */}
          {spec.rearCrestBox && (
            <div
              className="absolute flex flex-col items-center text-center pointer-events-none"
              style={{
                left: spec.rearCrestBox.left,
                top: spec.rearCrestBox.top,
                width: spec.rearCrestBox.width,
                transform: spec.rearCrestBox.skew,
              }}
            >
              <RoastProfileCrest topText={roast.crestTop} bottomText={roast.crestBottom} className="w-full h-auto" />
              <p
                className="mt-[4%] font-sans font-bold text-[#D8B474] whitespace-nowrap"
                style={{ fontSize: '1.1cqi' }}
              >
                Arunika Kawi Coffee
              </p>
            </div>
          )}

          {/* Rear Pouch (All 6 Mockups): Exact Confirmed Goreng Kreweng Story + Signature + Komposisi */}
          <div
            className="absolute flex flex-col items-center justify-center text-center pointer-events-none px-[1%]"
            style={{
              left: spec.rearStoryBox.left,
              top: spec.rearStoryBox.top,
              width: spec.rearStoryBox.width,
              height: spec.rearStoryBox.height,
              transform: spec.rearStoryBox.skew,
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: spec.rearStoryBox.gradient,
                maskImage: FEATHERED_PATCH_MASK,
                WebkitMaskImage: FEATHERED_PATCH_MASK,
              }}
            />
            <p
              className="relative z-10 font-sans text-[#FAF5EB] leading-[1.24]"
              style={{ fontSize: `${spec.rearStoryBox.storyFontCqi}cqi` }}
            >
              Diolah secara tradisional (<em>Goreng Kreweng</em>) oleh Kelompok Tani Hutan. Dipetik langsung dari lereng
              Gunung Kawi. Setiap seduhan menghadirkan karakter{' '}
              <span className="font-semibold text-[#D8B474]">{variant.storyCharacter}</span> {roast.storyRoast}
            </p>
            <p
              className="relative z-10 mt-[2.2%] font-sans font-semibold leading-tight whitespace-nowrap"
              style={{ fontSize: `${spec.rearStoryBox.storyFontCqi * 1.05}cqi` }}
            >
              <span className="text-[#D8B474]">Arunika Kawi Coffee</span>{' '}
              <span className="text-[#FAF5EB]">Harum dan Nikmat</span>
            </p>
            <p
              className="relative z-10 mt-[2.5%] font-sans font-semibold tracking-[0.03em] text-[#FAF5EB] whitespace-nowrap"
              style={{ fontSize: `${spec.rearStoryBox.compFontCqi}cqi` }}
            >
              {rearCompositionText}
            </p>
          </div>

          {/* Rear Seal & PIRT Label for newly generated clean tall-copper & tall-minimal */}
          {spec.rearSealBox && config.sealPlacement === 'back' && (
            <div
              className="absolute flex flex-col items-center pointer-events-none"
              style={{
                left: spec.rearSealBox.left,
                top: spec.rearSealBox.top,
                transform: spec.rearSealBox.skew,
              }}
            >
              <KthEastJavaSeal
                variant="original-green"
                className={size === 'hero' ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-3.5 h-3.5'}
              />
              <span className="mt-[2%] font-sans font-semibold text-[#FAF5EB]" style={{ fontSize: '0.78cqi' }}>
                PIRT
              </span>
            </div>
          )}

          {/* Rear Pouch (All 6 Mockups): Clean KUPS Himatarian Blitar producer text replacing AI typos */}
          <div
            className="absolute flex flex-col justify-center text-left pointer-events-none px-[0.6%]"
            style={{
              left: spec.rearProducerBox.left,
              top: spec.rearProducerBox.top,
              width: spec.rearProducerBox.width,
              height: spec.rearProducerBox.height,
              transform: spec.rearProducerBox.skew,
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: spec.rearProducerBox.gradient,
                maskImage: FEATHERED_PATCH_MASK,
                WebkitMaskImage: FEATHERED_PATCH_MASK,
              }}
            />
            {spec.rearCrestBox && (
              <p
                className="relative z-10 font-sans font-semibold text-[#D8B474] leading-[1.15] whitespace-nowrap"
                style={{ fontSize: '0.96cqi' }}
              >
                Diproduksi Oleh
              </p>
            )}
            <p
              className="relative z-10 font-sans font-medium text-[#FAF5EB] leading-[1.2] whitespace-nowrap"
              style={{ fontSize: spec.rearCrestBox ? '0.82cqi' : '1.08cqi' }}
            >
              KUPS Himatarian Blitar
            </p>
            <p
              className="relative z-10 font-sans font-medium text-[#FAF5EB] leading-[1.2] whitespace-nowrap"
              style={{ fontSize: spec.rearCrestBox ? '0.82cqi' : '1.08cqi' }}
            >
              Jawa Timur – INDONESIA
            </p>
          </div>

          {/* Rear Pouch: Crisp Kode Produksi & Baik Digunakan Sebelum replacing blurry AI text */}
          {spec.rearCodeBox && (
            <div
              className="absolute flex flex-col justify-between text-left pointer-events-none px-[0.5%] py-[0.3%]"
              style={{
                left: spec.rearCodeBox.left,
                top: spec.rearCodeBox.top,
                width: spec.rearCodeBox.width,
                height: spec.rearCodeBox.height,
                transform: spec.rearCodeBox.skew,
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background: spec.rearCodeBox.gradient,
                  maskImage: FEATHERED_PATCH_MASK,
                  WebkitMaskImage: FEATHERED_PATCH_MASK,
                }}
              />
              <div className="relative z-10 w-full">
                <p
                  className="font-sans font-medium text-[#FAF5EB] leading-[1.1] whitespace-nowrap"
                  style={{ fontSize: spec.rearCrestBox ? '0.72cqi' : '0.85cqi' }}
                >
                  Kode Produksi
                </p>
                <div className="mt-[2%] w-[92%] h-[0.95cqi] bg-white/95" />
              </div>
              <div className="relative z-10 w-full">
                <p
                  className="font-sans font-medium text-[#FAF5EB] leading-[1.1] whitespace-nowrap"
                  style={{ fontSize: spec.rearCrestBox ? '0.68cqi' : '0.8cqi' }}
                >
                  Baik Digunakan Sebelum
                </p>
                <div className="mt-[2%] w-[92%] h-[0.95cqi] bg-white/95" />
              </div>
            </div>
          )}

          {/* Rear Pouch: White PIRT stamp box matching latest Arunika_Kawi_rear */}
          <div
            className="absolute bg-white/95 pointer-events-none"
            style={{
              left: spec.rearPirtBox.left,
              top: spec.rearPirtBox.top,
              width: spec.rearPirtBox.width,
              height: spec.rearPirtBox.height,
              transform: spec.rearPirtBox.skew,
            }}
          />

          {/* Rear Bottom Band for new clean tall-copper & tall-minimal (NO net weight on rear!) */}
          {spec.rearBottomBand && (
            <div
              className="absolute flex items-center justify-center pointer-events-none"
              style={{
                left: spec.rearBottomBand.left,
                top: spec.rearBottomBand.top,
                width: spec.rearBottomBand.width,
                height: spec.rearBottomBand.height,
                transform: spec.rearBottomBand.skew,
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background: spec.rearBottomBand.darkBand
                    ? 'linear-gradient(105deg, #241610 0%, #1B100B 50%, #140B07 100%)'
                    : 'linear-gradient(105deg, #D5B26E 0%, #E7CE97 50%, #BF934B 100%)',
                  maskImage: GOLD_BAND_FEATHER_MASK,
                  WebkitMaskImage: GOLD_BAND_FEATHER_MASK,
                }}
              />
              <span
                className={`relative z-10 font-sans font-bold uppercase whitespace-nowrap ${
                  spec.rearBottomBand.darkBand ? 'text-[#FAF5EB]' : 'text-[#140B07]'
                }`}
                style={{ fontSize: '1.25cqi' }}
              >
                100 % KOPI ASLI INDONESIA
              </span>
            </div>
          )}

          {/* Dynamic Front KTH Seal if user toggles sealPlacement === 'front' */}
          {config.sealPlacement === 'front' && (
            <div
              className="absolute pointer-events-none"
              style={{ left: spec.frontSealPos.left, top: spec.frontSealPos.top }}
            >
              <KthEastJavaSeal
                variant="original-green"
                className={size === 'hero' ? 'w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md' : 'w-4 h-4 sm:w-5 sm:h-5 drop-shadow'}
              />
            </div>
          )}
          </div>
        </div>
      </div>
    );
  }

  // Procedural Fallback for:
  // 1) backgroundOnly === true ("Lihat Background Saja")
  // 2) artworkSource === 'studio-custom' ("Artwork: Template Dinamis")
  // 3) studio-front / studio-rear on non-doypack shapes
  const scaleFactor = config.netWeight === '100 gram' ? 0.9 : 1;

  if (isStudio) {
    const showFront = scene === 'studio-front';
    return (
      <div
        className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-[#FFFFFF] via-[#FBFBF9] to-[#EFECE5]"
        aria-label={`${shapeMeta.code} ${showFront ? 'Tampak Depan' : 'Tampak Belakang'} (${config.netWeight})`}
      >
        <div
          className="absolute bottom-[9%] w-[62%] h-[6%] rounded-[100%] pointer-events-none blur-[6px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(26,20,18,0.34) 0%, rgba(26,20,18,0) 72%)',
          }}
        />

        <div
          className="relative z-10 flex items-end justify-center w-full px-3 origin-bottom transition-transform duration-200"
          style={{ transform: `scale(${scaleFactor})` }}
        >
          {isDoypack ? (
            <div
              className={`relative ${
                size === 'hero' ? 'w-[54%] max-w-[330px]' : 'w-[64%]'
              } aspect-[150/220] overflow-hidden shadow-[0_24px_48px_-12px_rgba(26,20,18,0.42)]`}
              style={{ borderRadius: '8px 8px 20px 20px' }}
            >
              {showFront ? (
                <FrontPanel
                  config={config}
                  compact={isCompact}
                  showValveGraphic={!backgroundOnly}
                  backgroundOnly={backgroundOnly}
                />
              ) : (
                <BackPanel config={config} compact={isCompact} backgroundOnly={backgroundOnly} />
              )}
              <div className="absolute inset-y-0 left-0 w-[3.2%] bg-gradient-to-r from-white/15 via-black/25 to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-[3.2%] bg-gradient-to-l from-white/15 via-black/25 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 top-[9.5%] h-[1.5px] bg-black/45 border-b border-white/15 pointer-events-none" />
              <div className="absolute inset-x-0 top-[11.2%] h-[2px] bg-black/35 border-b border-white/10 pointer-events-none" />
              <div className="absolute left-0 top-[6.8%] w-1.5 h-1 bg-[#EAE6DD] rounded-r-full pointer-events-none" />
              <div className="absolute right-0 top-[6.8%] w-1.5 h-1 bg-[#EAE6DD] rounded-l-full pointer-events-none" />
            </div>
          ) : (
            <div className="relative flex items-end justify-center" style={{ perspective: '1200px' }}>
              <div className="relative flex items-stretch justify-center">
                <div
                  className={`${
                    tall
                      ? size === 'hero'
                        ? 'w-[42px] sm:w-[54px] h-[380px] sm:h-[440px]'
                        : 'w-[28px] h-[235px]'
                      : size === 'hero'
                        ? 'w-[46px] sm:w-[58px] h-[340px] sm:h-[395px]'
                        : 'w-[32px] h-[225px]'
                  } origin-right overflow-hidden rounded-l-sm shadow-xl shrink-0`}
                  style={{
                    transform: 'rotateY(-44deg) translateX(3px) scaleY(0.985)',
                    filter: 'brightness(0.76)',
                  }}
                >
                  <SideGussetPanel config={config} side="left" compact backgroundOnly={backgroundOnly} />
                </div>
                <div
                  className={`relative ${
                    tall
                      ? size === 'hero'
                        ? 'w-[158px] sm:w-[184px] h-[380px] sm:h-[440px]'
                        : 'w-[98px] h-[235px]'
                      : size === 'hero'
                        ? 'w-[210px] sm:w-[245px] h-[340px] sm:h-[395px]'
                        : 'w-[140px] h-[225px]'
                  } overflow-hidden rounded-sm shadow-[0_24px_48px_-12px_rgba(26,20,18,0.42)]`}
                >
                  {showFront ? (
                    <FrontPanel config={config} compact={isCompact || tall} backgroundOnly={backgroundOnly} />
                  ) : (
                    <BackPanel config={config} compact={isCompact || tall} backgroundOnly={backgroundOnly} />
                  )}
                  <div className="absolute inset-x-0 top-[7.5%] h-[1.5px] bg-black/45 border-b border-white/15 pointer-events-none" />
                  <div className="absolute inset-x-0 top-[9.2%] h-[2px] bg-black/35 border-b border-white/10 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col justify-end bg-[#18100C]"
      aria-label={`${shapeMeta.code} · ${shapeMeta.shortLabel} (${config.netWeight})`}
    >
      {config.naturalMood === 'kawi-beans' && (
        <>
          <img
            src={GENERATED_ASSETS.kawiMist}
            alt="Lanskap fajar lereng Gunung Kawi"
            decoding="async"
            referrerPolicy="no-referrer"
            className="absolute inset-x-0 top-0 w-full h-[78%] object-cover object-center brightness-95 contrast-105"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 22% 18%, rgba(252,226,174,0.38) 0%, rgba(28,18,12,0.18) 55%, rgba(20,13,9,0.72) 100%)',
            }}
          />
        </>
      )}

      {config.naturalMood === 'cherries-beans' && (
        <>
          <img
            src={GENERATED_ASSETS.coffeeCherries}
            alt="Ranting ceri kopi Gunung Kawi"
            decoding="async"
            referrerPolicy="no-referrer"
            className="absolute inset-x-0 top-0 w-full h-[78%] object-cover object-center brightness-75 contrast-110"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(24,14,10,0.45) 0%, rgba(24,14,10,0.28) 52%, rgba(16,10,7,0.88) 100%)',
            }}
          />
        </>
      )}

      {config.naturalMood === 'espresso-matte' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 28%, #3B241A 0%, #22140E 55%, #120A07 100%)',
          }}
        />
      )}

      <div
        className="absolute inset-x-0 bottom-0 h-[31%] pointer-events-none"
        style={{
          background:
            config.naturalMood === 'kawi-beans'
              ? 'linear-gradient(180deg, #9A8A73 0%, #C7B8A1 16%, #DFD3BF 36%, #3A2E27 52%, #1C1410 100%)'
              : 'linear-gradient(180deg, #4B382C 0%, #33231B 32%, #1C120D 100%)',
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 h-[23%] pointer-events-none overflow-hidden opacity-85"
        style={{
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.72) 55%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage:
            'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.72) 55%, rgba(0,0,0,0) 100%)',
        }}
      >
        <img
          src={GENERATED_ASSETS.beansCluster}
          alt=""
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-bottom brightness-90 contrast-115"
        />
      </div>

      <div
        className={`relative z-10 w-full flex items-end justify-center ${
          size === 'hero' ? 'pb-[18%] px-4' : 'pb-[11%] px-2.5'
        } origin-bottom transition-transform duration-200`}
        style={{ transform: `scale(${scaleFactor})` }}
      >
        <div
          className="absolute bottom-[8%] w-[86%] h-[5%] rounded-[100%] pointer-events-none blur-[5px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(10,6,4,0.82) 0%, rgba(10,6,4,0) 75%)',
          }}
        />

        {isDoypack ? (
          <div className="relative flex items-end justify-center gap-[3.5%] w-full max-w-[94%]">
            <div
              className="relative w-[46%] aspect-[150/220] overflow-hidden shadow-[0_18px_36px_-8px_rgba(0,0,0,0.85)]"
              style={{ borderRadius: '6px 6px 15px 15px' }}
            >
              <FrontPanel
                config={config}
                compact={isCompact}
                showValveGraphic={!backgroundOnly}
                backgroundOnly={backgroundOnly}
              />
            </div>
            <div
              className="relative w-[46%] aspect-[150/220] overflow-hidden shadow-[0_18px_36px_-8px_rgba(0,0,0,0.85)]"
              style={{ borderRadius: '6px 6px 15px 15px' }}
            >
              <BackPanel config={config} compact={isCompact} backgroundOnly={backgroundOnly} />
            </div>
          </div>
        ) : (
          <div
            className="relative flex items-end justify-center gap-[3.5%] w-full max-w-[96%]"
            style={{ perspective: '1100px' }}
          >
            <div
              className={`relative flex items-stretch ${
                tall ? 'w-[44%] aspect-[128/240]' : 'w-[48%] aspect-[162/210]'
              } shadow-[0_20px_38px_-8px_rgba(0,0,0,0.88)]`}
            >
              <div className="relative w-[78%] h-full overflow-hidden rounded-l-sm">
                <FrontPanel config={config} compact={isCompact || tall} backgroundOnly={backgroundOnly} />
              </div>
              <div
                className="w-[22%] h-full overflow-hidden rounded-r-sm brightness-75 origin-left"
                style={{ transform: 'skewY(-6deg)' }}
              >
                <SideGussetPanel config={config} side="right" compact backgroundOnly={backgroundOnly} />
              </div>
            </div>

            <div
              className={`relative flex items-stretch ${
                tall ? 'w-[44%] aspect-[128/240]' : 'w-[48%] aspect-[162/210]'
              } shadow-[0_20px_38px_-8px_rgba(0,0,0,0.88)]`}
            >
              <div
                className="w-[22%] h-full overflow-hidden rounded-l-sm brightness-75 origin-right"
                style={{ transform: 'skewY(6deg)' }}
              >
                <SideGussetPanel config={config} side="left" compact backgroundOnly={backgroundOnly} />
              </div>
              <div className="relative w-[78%] h-full overflow-hidden rounded-r-sm">
                <BackPanel config={config} compact={isCompact || tall} backgroundOnly={backgroundOnly} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
