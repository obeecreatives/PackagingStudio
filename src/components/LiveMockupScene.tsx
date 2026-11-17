import React from 'react';
import {
  BEAN_VARIANTS,
  GENERATED_ASSETS,
  getWeightSpecs,
  isTallGusset,
  PackagingConfig,
  POUCH_SHAPES,
  PouchShapeId,
  ROAST_LEVELS,
} from '../types/packaging';
import { KthEastJavaSeal } from './BrandCrests';
import { BackPanel, FrontPanel, SideGussetPanel } from './PackagingPanels';

export type MockupSceneMode = 'natural-kawi' | 'studio-front' | 'studio-rear';

interface LiveMockupSceneProps {
  config: PackagingConfig;
  scene?: MockupSceneMode;
  size?: 'hero' | 'card' | 'critique';
  backgroundOnly?: boolean;
}

interface PhotoOverlaySpec {
  weightBox: { left: string; top: string; width: string; height: string; skew?: string };
  subtitleBox: { left: string; top: string; width: string; height: string; skew?: string };
  frontSealPos: { left: string; top: string };
}

const NATURAL_PHOTO_SPECS: Record<PouchShapeId, PhotoOverlaySpec> = {
  'box-gusset': {
    weightBox: { left: '15%', top: '76.5%', width: '31%', height: '4.6%' },
    subtitleBox: { left: '13%', top: '52.6%', width: '35%', height: '6.6%' },
    frontSealPos: { left: '41%', top: '69.5%' },
  },
  'doypack-valve': {
    weightBox: { left: '17%', top: '74.3%', width: '30%', height: '4.4%' },
    subtitleBox: { left: '14%', top: '56.4%', width: '36%', height: '6.4%' },
    frontSealPos: { left: '40%', top: '67.5%' },
  },
  'tall-heritage': {
    weightBox: { left: '17%', top: '83.1%', width: '30%', height: '4.6%' },
    subtitleBox: { left: '15%', top: '52.2%', width: '34%', height: '6.6%' },
    frontSealPos: { left: '41%', top: '75.5%' },
  },
  'tall-botanical': {
    weightBox: { left: '18.5%', top: '81.9%', width: '31%', height: '4.5%', skew: 'skewY(-2.4deg)' },
    subtitleBox: { left: '16.5%', top: '50.8%', width: '35%', height: '6.5%', skew: 'skewY(-1.5deg)' },
    frontSealPos: { left: '43%', top: '74.2%' },
  },
  'tall-copper': {
    weightBox: { left: '22%', top: '81.6%', width: '30%', height: '4.5%', skew: 'skewY(-3.6deg)' },
    subtitleBox: { left: '20%', top: '53.4%', width: '34%', height: '6.5%', skew: 'skewY(-2.2deg)' },
    frontSealPos: { left: '44%', top: '73.5%' },
  },
};

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
  const weightSpecs = getWeightSpecs(config.pouchShape, config.netWeight);
  const shapeMeta = POUCH_SHAPES[config.pouchShape];
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const isCompact = size !== 'hero';
  const isStudio = scene === 'studio-front' || scene === 'studio-rear';

  const hasWeightOverride = config.netWeight !== '250 Gr';
  const hasTextOverride = config.beanVariant !== 'robusta-100' || config.roastLevel !== 'traditional';
  const hasMoodOverride = config.naturalMood !== 'kawi-beans';

  // Use photorealistic mockups whenever artworkSource is 'uploaded-final' & not backgroundOnly
  const usePhotorealisticNatural =
    !backgroundOnly && config.artworkSource === 'uploaded-final' && scene === 'natural-kawi';
  const usePhotorealisticDoypackStudio =
    !backgroundOnly && config.artworkSource === 'uploaded-final' && isDoypack && isStudio;

  if (usePhotorealisticDoypackStudio) {
    const showFront = scene === 'studio-front';
    return (
      <div
        className="relative w-full h-full overflow-hidden flex items-center justify-center bg-white"
        aria-label={`${shapeMeta.code} ${showFront ? 'Tampak Depan' : 'Tampak Belakang'} (${config.netWeight})`}
      >
        <div className="relative h-full max-w-full aspect-square flex items-center justify-center">
          <img
            src={showFront ? GENERATED_ASSETS.doypackStudio : GENERATED_ASSETS.doypackStudioRear}
            alt={`${shapeMeta.label} ${showFront ? 'Tampak Depan' : 'Tampak Belakang'}`}
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />

          {showFront && hasTextOverride && (
            <div
              className="absolute flex flex-col items-center justify-center text-center pointer-events-none px-2"
              style={{
                left: '27%',
                top: '51.5%',
                width: '46%',
                height: '8.5%',
                background:
                  'radial-gradient(ellipse at center, rgba(28,16,11,0.97) 60%, rgba(28,16,11,0.88) 82%, transparent 100%)',
              }}
            >
              <p className="font-sans font-semibold text-[#FAF5EB] leading-tight text-[10px] sm:text-[13px] truncate max-w-full">
                {roast.subtitle}
              </p>
              <p className="font-sans font-semibold text-[#FAF5EB] leading-tight text-[10px] sm:text-[13px] truncate max-w-full">
                {variant.frontLabel}
              </p>
            </div>
          )}

          {showFront && hasWeightOverride && (
            <div
              className="absolute flex items-center justify-center pointer-events-none"
              style={{
                left: '33%',
                top: '86.4%',
                width: '34%',
                height: '5.6%',
                background: 'linear-gradient(105deg, #D5B26E 0%, #E7CE97 50%, #BF934B 100%)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
              }}
            >
              <span className="font-sans font-bold text-[#140B07] text-[10px] sm:text-[13px] tabular-nums whitespace-nowrap">
                Isi Bersih : {config.netWeight}
              </span>
            </div>
          )}

          {showFront && config.sealPlacement === 'front' && (
            <div className="absolute right-[26%] bottom-[16%] pointer-events-none">
              <KthEastJavaSeal variant="original-green" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md" />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (usePhotorealisticNatural) {
    const spec = NATURAL_PHOTO_SPECS[config.pouchShape];
    const photoSrc = getNaturalPhotoForShape(config.pouchShape);

    return (
      <div
        className="relative w-full h-full overflow-hidden bg-[#18100C]"
        aria-label={`${shapeMeta.code} · ${shapeMeta.shortLabel} (${config.netWeight})`}
      >
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

        {/* Dynamic Roast & Bean Variant Replacement over Front Pouch Subtitle */}
        {hasTextOverride && (
          <div
            className="absolute flex flex-col items-center justify-center text-center pointer-events-none px-1"
            style={{
              left: spec.subtitleBox.left,
              top: spec.subtitleBox.top,
              width: spec.subtitleBox.width,
              height: spec.subtitleBox.height,
              transform: spec.subtitleBox.skew,
              background:
                'radial-gradient(ellipse at center, rgba(26,15,10,0.96) 62%, rgba(26,15,10,0.84) 84%, transparent 100%)',
            }}
          >
            <p
              className={`font-sans font-semibold text-[#FAF5EB] leading-[1.15] truncate max-w-full ${
                size === 'hero' ? 'text-[9px] sm:text-[11px]' : 'text-[5.5px] sm:text-[6.5px]'
              }`}
            >
              {roast.subtitle}
            </p>
            <p
              className={`font-sans font-semibold text-[#FAF5EB] leading-[1.15] truncate max-w-full ${
                size === 'hero' ? 'text-[9px] sm:text-[11px]' : 'text-[5.5px] sm:text-[6.5px]'
              }`}
            >
              {variant.frontLabel}
            </p>
          </div>
        )}

        {/* Dynamic Net Weight Replacement directly on the Pouch Gold Foil Band */}
        {hasWeightOverride && (
          <div
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              left: spec.weightBox.left,
              top: spec.weightBox.top,
              width: spec.weightBox.width,
              height: spec.weightBox.height,
              transform: spec.weightBox.skew,
              background: 'linear-gradient(105deg, #D5B26E 0%, #E7CE97 50%, #BF934B 100%)',
              maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
            }}
          >
            <span
              className={`font-sans font-bold text-[#140B07] tabular-nums whitespace-nowrap ${
                size === 'hero' ? 'text-[9px] sm:text-[11.5px]' : 'text-[5.5px] sm:text-[6.8px]'
              }`}
            >
              Isi Bersih : {config.netWeight}
            </span>
          </div>
        )}

        {/* Dynamic Front KTH Seal if user sets sealPlacement === 'front' */}
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

        {/* Crisp corner badge showing synced non-default net weight & dimensions */}
        {hasWeightOverride && (
          <div
            className={`absolute top-2.5 left-2.5 z-10 pointer-events-none rounded bg-[#1A1412]/88 border border-[#D8B474]/45 text-[#FAF5EB] font-mono tabular-nums ${
              size === 'hero' ? 'px-2.5 py-1 text-[11px]' : 'px-1.5 py-0.5 text-[9px]'
            }`}
          >
            {config.netWeight} · {weightSpecs.dimensions.split(' (')[0]}
          </div>
        )}
      </div>
    );
  }

  // Procedural Fallback for:
  // 1) backgroundOnly === true ("Lihat Background Saja")
  // 2) artworkSource === 'studio-custom' ("Artwork: Template Dinamis")
  // 3) studio-front / studio-rear on non-doypack shapes
  const scaleFactor =
    config.netWeight === '100 Gr' ? 0.87 : config.netWeight === '500 Gr' ? 1.06 : 1;

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
          className="relative z-10 flex items-end justify-center w-full px-4 origin-bottom transition-transform duration-200"
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
              <div
                className={`relative ${
                  tall
                    ? size === 'hero'
                      ? 'w-[220px] aspect-[100/240]'
                      : 'w-[140px] aspect-[100/240]'
                    : size === 'hero'
                      ? 'w-[270px] aspect-[130/210]'
                      : 'w-[175px] aspect-[130/210]'
                } flex items-stretch`}
              >
                <div
                  className="w-[24%] h-full origin-right overflow-hidden rounded-l-sm shadow-xl shrink-0"
                  style={{
                    transform: 'rotateY(-42deg) translateX(3px) scaleY(0.985)',
                    filter: 'brightness(0.76)',
                  }}
                >
                  <SideGussetPanel config={config} side="left" compact backgroundOnly={backgroundOnly} />
                </div>
                <div className="relative flex-1 h-full overflow-hidden rounded-sm shadow-[0_24px_48px_-12px_rgba(26,20,18,0.42)]">
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
            {/* Left: Front + 3D Right Side Gusset with locked equal height */}
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

            {/* Right: 3D Left Side Gusset + Back with locked equal height */}
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
