import React from 'react';
import {
  BEAN_VARIANTS,
  GENERATED_ASSETS,
  isTallGusset,
  PackagingConfig,
  POUCH_SHAPES,
  ROAST_LEVELS,
} from '../types/packaging';
import {
  NATURAL_MOCKUP_LAYOUTS,
  PanelOverlayRect,
  STUDIO_DOYPACK_LAYOUT,
} from '../data/mockupSceneLayouts';
import {
  ArunikaSunBeanCrest,
  KthEastJavaSeal,
  MandalaHeritageCrest,
  RoastProfileCrest,
} from './BrandCrests';
import { BackPanel, FrontPanel } from './PackagingPanels';

export type MockupSceneMode = 'natural-kawi' | 'studio-front' | 'studio-rear';

interface LiveMockupSceneProps {
  config: PackagingConfig;
  scene?: MockupSceneMode;
  size?: 'hero' | 'card' | 'critique';
  backgroundOnly?: boolean;
}

function getBoxTransform(rect: PanelOverlayRect): React.CSSProperties {
  const parts: string[] = [];
  if (rect.rotateYDeg || rect.skewYDeg) {
    parts.push('perspective(920px)');
    if (rect.rotateYDeg) parts.push(`rotateY(${rect.rotateYDeg}deg)`);
    if (rect.skewYDeg) parts.push(`skewY(${rect.skewYDeg}deg)`);
  }
  return {
    left: `${rect.x}%`,
    top: `${rect.y}%`,
    width: `${rect.w}%`,
    height: `${rect.h}%`,
    containerType: 'inline-size',
    transform: parts.length ? parts.join(' ') : undefined,
    transformOrigin: 'center center',
  };
}

function FrontTextOverlay({
  config,
  rect,
  variantStyle,
}: {
  config: PackagingConfig;
  rect: PanelOverlayRect;
  variantStyle: 'classic' | 'doypack' | 'heritage-mandala' | 'botanical' | 'copper' | 'minimal';
}) {
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const hasValveGap = Boolean(rect.valveClearCenterRatio);
  const isHeritage = variantStyle === 'heritage-mandala';
  const isBotanical = variantStyle === 'botanical';
  const isCopper = variantStyle === 'copper';
  const isDoypack = variantStyle === 'doypack';

  return (
    <div className="absolute pointer-events-none select-none z-20" style={getBoxTransform(rect)}>
      {/* Main Upper Typography Zone */}
      <div
        className={`relative w-full flex flex-col items-center text-center ${
          isBotanical ? 'pt-[14%] px-[10%]' : isCopper ? 'pt-[16%] px-[7%]' : isDoypack ? 'pt-[5.5%] px-[8%]' : 'pt-[10%] px-[8%]'
        }`}
        style={{ height: `${rect.bandRatioTop * 100}%` }}
      >
        <ArunikaSunBeanCrest
          className={isDoypack ? 'w-[12.5cqi] h-[12.5cqi]' : isCopper ? 'w-[15.5cqi] h-[15.5cqi]' : 'w-[14.5cqi] h-[14.5cqi]'}
        />
        <p
          className="mt-[1.6%] font-sans font-bold uppercase tracking-[0.14em] text-[#D8B474] whitespace-nowrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]"
          style={{ fontSize: isCopper ? '6cqi' : isDoypack ? '4.5cqi' : '5.1cqi' }}
        >
          COFFE BEAN
        </p>
        <div className="mt-[0.8%] flex items-center justify-center gap-[4%] w-[56%]">
          <span className="h-px flex-1 bg-[#FAF5EB]/55" />
          <span
            className="font-sans font-medium uppercase tracking-[0.14em] text-[#FAF5EB] whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]"
            style={{ fontSize: isCopper ? '3.8cqi' : isDoypack ? '3cqi' : '3.3cqi' }}
          >
            EST 2024
          </span>
          <span className="h-px flex-1 bg-[#FAF5EB]/55" />
        </div>

        {/* Preserve clear breathing gap over the physical center degassing valve */}
        {hasValveGap && <div className="h-[12.5%]" aria-hidden="true" />}

        <h2
          className={`${
            hasValveGap ? 'mt-[0.5%]' : isBotanical ? 'mt-[7%]' : isCopper ? 'mt-[7.5%]' : 'mt-[6.5%]'
          } font-serif font-bold tracking-[0.04em] leading-[0.94] text-[#D8B474] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]`}
          style={{ fontSize: isDoypack ? '14.2cqi' : isCopper ? '16cqi' : '15cqi' }}
        >
          ARUNIKA
          <span className="block tracking-[0.07em]">KAWI</span>
        </h2>

        <p
          className={`${
            hasValveGap ? 'mt-[4%]' : isCopper ? 'mt-[6.5%]' : 'mt-[5.5%]'
          } font-sans font-semibold text-[#FAF5EB] leading-[1.2] drop-shadow-[0_1px_6px_rgba(0,0,0,0.92)]`}
          style={{ fontSize: isDoypack ? '4.5cqi' : isCopper ? '5.2cqi' : '4.7cqi' }}
        >
          {roast.subtitle}
        </p>

        {isHeritage ? (
          <div className="mt-[3%] flex flex-col items-center">
            <p
              className="font-sans font-semibold text-[#FAF5EB] leading-[1.2] drop-shadow-[0_1px_6px_rgba(0,0,0,0.92)]"
              style={{ fontSize: '4.6cqi' }}
            >
              {variant.frontLabel}
            </p>
            <MandalaHeritageCrest
              label={variant.frontLabel}
              className="mt-[2.5%] w-[26cqi] h-[26cqi] opacity-90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.75)]"
            />
          </div>
        ) : (
          <p
            className="mt-[1.6%] font-sans font-semibold text-[#FAF5EB] leading-[1.2] drop-shadow-[0_1px_6px_rgba(0,0,0,0.92)]"
            style={{ fontSize: isDoypack ? '4.5cqi' : isCopper ? '5.2cqi' : '4.7cqi' }}
          >
            {variant.frontLabel}
          </p>
        )}

        {config.sealPlacement === 'front' && (
          <div className="absolute right-[7%] bottom-[5%]">
            <KthEastJavaSeal variant="original-green" className="w-[16cqi] h-[16cqi] drop-shadow-md" />
          </div>
        )}
      </div>

      {/* Bottom Foil / Dark Band Text */}
      <div
        className="absolute inset-x-0 flex items-center justify-center px-[4%]"
        style={{
          top: `${rect.bandRatioTop * 100}%`,
          height: `${rect.bandRatioH * 100}%`,
          color: rect.bandTextColor,
        }}
      >
        <span
          className="font-sans font-bold tabular-nums whitespace-nowrap"
          style={{ fontSize: isCopper ? '5.6cqi' : '5.1cqi' }}
        >
          Isi Bersih : {config.netWeight}
        </span>
      </div>
    </div>
  );
}

function RearTextOverlay({
  config,
  rect,
  variantStyle,
}: {
  config: PackagingConfig;
  rect: PanelOverlayRect;
  variantStyle: 'classic' | 'doypack' | 'heritage-mandala' | 'botanical' | 'copper' | 'minimal';
}) {
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const isCopper = variantStyle === 'copper';
  const isDoypack = variantStyle === 'doypack';

  return (
    <div className="absolute pointer-events-none select-none z-20" style={getBoxTransform(rect)}>
      <div
        className={`relative w-full flex flex-col justify-between ${
          isDoypack ? 'pt-[12%] pb-[3.8%] px-[7.5%]' : isCopper ? 'pt-[14%] pb-[4%] px-[5.5%]' : 'pt-[11.5%] pb-[4%] px-[7%]'
        }`}
        style={{ height: `${rect.bandRatioTop * 100}%` }}
      >
        {/* Top Crest + Story Copy */}
        <div className="flex flex-col items-center text-center">
          <div className={isCopper ? 'w-[33cqi]' : 'w-[30cqi]'}>
            <RoastProfileCrest topText={roast.crestTop} bottomText={roast.crestBottom} className="w-full h-auto" />
          </div>

          <h3
            className="mt-[2.5%] font-sans font-bold text-[#D8B474] tracking-[0.02em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]"
            style={{ fontSize: isCopper ? '6.2cqi' : '5.8cqi' }}
          >
            Arunika Kawi Coffee
          </h3>

          <p
            className="mt-[3.5%] text-[#F4ECE0] leading-[1.3] drop-shadow-[0_1px_5px_rgba(0,0,0,0.92)]"
            style={{ fontSize: isCopper ? '3.4cqi' : '3.25cqi' }}
          >
            Diolah secara tradisional (<em>Goreng Kreweng</em>) oleh Kelompok Tani Hutan. Dipetik langsung dari lereng
            Gunung Kawi. Setiap seduhan menghadirkan karakter{' '}
            <span className="font-semibold text-[#D8B474]">{variant.storyCharacter}</span> {roast.storyRoast}
          </p>

          <p
            className="mt-[3%] font-sans font-semibold leading-tight text-center drop-shadow-[0_1px_5px_rgba(0,0,0,0.92)]"
            style={{ fontSize: isCopper ? '3.5cqi' : '3.35cqi' }}
          >
            <span className="text-[#D8B474]">Arunika Kawi Coffee</span>{' '}
            <span className="text-[#FAF5EB]">Harum dan Nikmat</span>
          </p>

          <p
            className="mt-[4.5%] font-sans font-semibold tracking-[0.02em] uppercase text-[#FAF5EB] drop-shadow-[0_1px_5px_rgba(0,0,0,0.92)]"
            style={{ fontSize: isCopper ? '3.15cqi' : '2.95cqi' }}
          >
            KOMPOSISI {config.beanVariant === 'robusta-100' ? '100 % BIJI KOPI ROBUSTA' : variant.frontLabel.toUpperCase()}
          </p>
        </div>

        {/* Footer Legal Row */}
        <div className="flex items-end justify-between gap-[3%] pt-[2%]">
          <div className="flex items-start gap-[2.2cqi] min-w-0 flex-[1.32]">
            {config.sealPlacement === 'back' && (
              <div className="flex flex-col items-center shrink-0">
                <KthEastJavaSeal variant="original-green" className="w-[12.5cqi] h-[12.5cqi] mt-[0.5cqi] drop-shadow" />
                <span
                  className="text-[#FAF5EB] font-medium leading-[1.1] mt-[0.8cqi] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                  style={{ fontSize: '2.4cqi' }}
                >
                  PIRT
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p
                className="font-semibold text-[#D8B474] leading-[1.15] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                style={{ fontSize: '3.1cqi' }}
              >
                Diproduksi Oleh
              </p>
              <p
                className="text-[#FAF5EB] leading-[1.2] mt-[0.8cqi] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                style={{ fontSize: '2.5cqi' }}
              >
                KUPS Himatarian Blitar
                <br />
                Jawa Timur – INDONESIA
              </p>
              {config.sealPlacement !== 'back' && (
                <p
                  className="text-[#FAF5EB] font-medium leading-[1.1] mt-[0.8cqi] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                  style={{ fontSize: '2.4cqi' }}
                >
                  PIRT
                </p>
              )}
              <div className="mt-[1.4cqi] w-full h-[3cqi] bg-white rounded-[1px]" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p
              className="text-[#FAF5EB] font-medium leading-[1.1] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
              style={{ fontSize: '2.4cqi' }}
            >
              Kode Produksi
            </p>
            <div className="mt-[0.8cqi] w-full h-[2.8cqi] bg-white rounded-[1px]" />
            <p
              className="text-[#FAF5EB] font-medium leading-[1.1] mt-[1.8cqi] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
              style={{ fontSize: '2.2cqi' }}
            >
              Baik Digunakan Sebelum
            </p>
            <div className="mt-[0.8cqi] w-full h-[2.8cqi] bg-white rounded-[1px]" />
          </div>
        </div>
      </div>

      {/* Bottom Gold / Dark Band Text (NO Net Weight on Rear) */}
      <div
        className="absolute inset-x-0 flex items-center justify-center px-[4%]"
        style={{
          top: `${rect.bandRatioTop * 100}%`,
          height: `${rect.bandRatioH * 100}%`,
          color: rect.bandTextColor,
        }}
      >
        <span
          className="font-sans font-bold tracking-[0.04em] uppercase whitespace-nowrap"
          style={{ fontSize: isCopper ? '4.4cqi' : '4.0cqi' }}
        >
          100 % KOPI ASLI INDONESIA
        </span>
      </div>
    </div>
  );
}

/**
 * Pinched-top realistic 3D coffee gusset bag geometry used in Studio Depan/Belakang
 * for non-doypack gusset shapes (Box Pouch & Tall Gussets).
 */
function StudioGussetPouch3D({
  config,
  showFront,
  isCompact,
  backgroundOnly,
}: {
  config: PackagingConfig;
  showFront: boolean;
  isCompact: boolean;
  backgroundOnly: boolean;
}) {
  const tall = isTallGusset(config.pouchShape);
  const isCopper = config.pouchShape === 'tall-copper';
  const isHeritage = config.pouchShape === 'tall-heritage';
  const scaleFactor = config.netWeight === '100 gram' ? 0.91 : 1;

  return (
    <div
      className="relative z-10 flex items-end justify-center origin-bottom transition-transform duration-200"
      style={{
        height: '82cqh',
        transform: `scale(${scaleFactor})`,
      }}
    >
      <div
        className="relative h-full flex items-stretch justify-center"
        style={{ perspective: '1100px' }}
      >
        {/* Left Pinched-Top Gusset (narrower at top heat-seal, full depth below 17%, V-fold crease) */}
        <div
          className={`relative h-full ${tall ? 'aspect-[42/240]' : 'aspect-[48/210]'} shrink-0`}
          style={{
            clipPath: 'polygon(78% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 16%)',
            background: isHeritage
              ? 'linear-gradient(90deg, #B59254 0%, #DFC389 48%, #8F6D36 52%, #C9A96A 100%)'
              : 'linear-gradient(90deg, #1E130E 0%, #312018 46%, #140B07 52%, #261811 100%)',
            boxShadow: 'inset -3px 0 8px rgba(0,0,0,0.45)',
          }}
        >
          {/* Center V-Fold Vertical Shadow Crease */}
          <div className="absolute inset-y-[16%] left-[48%] w-[2px] bg-black/55" />
          {/* Bottom Wrap Foil / Copper Band */}
          <div
            className={`absolute inset-x-0 bottom-0 ${
              isCopper
                ? 'h-[11%] bg-[#180E0A] border-t border-[#C47145]/75'
                : 'h-[11.2%] gold-foil-gradient border-t border-[#F7E8C6]/65'
            }`}
          />
        </div>

        {/* Main Front / Rear Pouch Face with slight 3/4 Depth & Fin Seal Highlights */}
        <div
          className={`relative h-full ${
            tall ? 'aspect-[100/240]' : 'aspect-[130/210]'
          } overflow-hidden rounded-r-[3px] shadow-[14px_24px_42px_-10px_rgba(26,20,18,0.46)] origin-left`}
          style={{
            transform: 'rotateY(7deg)',
          }}
        >
          {showFront ? (
            <FrontPanel config={config} compact={isCompact || tall} backgroundOnly={backgroundOnly} />
          ) : (
            <BackPanel config={config} compact={isCompact || tall} backgroundOnly={backgroundOnly} />
          )}
          {/* Top Heat-Seal Fin & Zipper Groove */}
          <div className="absolute inset-x-0 top-[7.5%] h-[1.5px] bg-black/45 border-b border-white/15 pointer-events-none z-20" />
          <div className="absolute inset-x-0 top-[9.2%] h-[2px] bg-black/35 border-b border-white/10 pointer-events-none z-20" />
          {/* Soft Cylindrical Pouch Specular */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background:
                'linear-gradient(106deg, rgba(255,248,234,0.12) 0%, rgba(255,255,255,0.02) 28%, rgba(0,0,0,0.08) 70%, rgba(0,0,0,0.22) 100%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export const LiveMockupScene = React.memo(function LiveMockupScene({
  config,
  scene = 'natural-kawi',
  size = 'hero',
  backgroundOnly = false,
}: LiveMockupSceneProps) {
  const isDoypack = config.pouchShape === 'doypack-valve';
  const shapeMeta = POUCH_SHAPES[config.pouchShape];
  const isCompact = size !== 'hero';
  const isStudio = scene === 'studio-front' || scene === 'studio-rear';
  const scaleFactor = config.netWeight === '100 gram' ? 0.93 : 1;

  if (isStudio) {
    const showFront = scene === 'studio-front';

    if (isDoypack) {
      const studioImg = showFront ? STUDIO_DOYPACK_LAYOUT.frontImage : STUDIO_DOYPACK_LAYOUT.rearImage;
      const overlayRect = showFront ? STUDIO_DOYPACK_LAYOUT.front : STUDIO_DOYPACK_LAYOUT.rear;

      return (
        <div
          className="relative w-full h-full overflow-hidden flex items-center justify-center bg-white"
          style={{ containerType: 'size' }}
          aria-label={`${shapeMeta.code} ${showFront ? 'Tampak Depan' : 'Tampak Belakang'} (${config.netWeight})`}
        >
          <div
            className="relative overflow-hidden flex items-center justify-center origin-bottom transition-transform duration-200"
            style={{
              width: 'min(100cqw, 100cqh)',
              height: 'min(100cqh, 100cqw)',
              transform: `scale(${scaleFactor})`,
            }}
          >
            <img
              src={studioImg}
              alt={`${shapeMeta.label} ${showFront ? 'Depan' : 'Belakang'}`}
              decoding="async"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-contain ${
                config.naturalMood === 'espresso-matte'
                  ? 'brightness-[0.94] saturate-[0.82]'
                  : config.naturalMood === 'cherries-beans'
                    ? 'sepia-[0.12]'
                    : ''
              }`}
            />
            {!backgroundOnly &&
              (showFront ? (
                <FrontTextOverlay config={config} rect={overlayRect} variantStyle="doypack" />
              ) : (
                <RearTextOverlay config={config} rect={overlayRect} variantStyle="doypack" />
              ))}
          </div>
        </div>
      );
    }

    return (
      <div
        className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-[#FFFFFF] via-[#FAF9F6] to-[#EDE9E0]"
        style={{ containerType: 'size' }}
        aria-label={`${shapeMeta.code} ${showFront ? 'Tampak Depan' : 'Tampak Belakang'} (${config.netWeight})`}
      >
        <div
          className="absolute bottom-[8%] w-[56%] h-[5.5%] rounded-[100%] pointer-events-none blur-[6px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(26,20,18,0.34) 0%, rgba(26,20,18,0) 74%)',
          }}
        />
        <StudioGussetPouch3D
          config={config}
          showFront={showFront}
          isCompact={isCompact}
          backgroundOnly={backgroundOnly}
        />
      </div>
    );
  }

  // Natural Scenic Presentation (Exact Original 3:4 Pouch Silhouettes + Clean Live Overlay)
  const layout = NATURAL_MOCKUP_LAYOUTS[config.pouchShape];

  return (
    <div
      className="relative w-full h-full overflow-hidden flex items-center justify-center bg-[#18100C]"
      style={{ containerType: 'size' }}
      aria-label={`${shapeMeta.code} · ${shapeMeta.shortLabel} (${config.netWeight})`}
    >
      {/* Subtle Blurred Stage Fill when parent container is wider than 3:4 (e.g. Kit 16:10 or Hero desktop) */}
      <img
        src={layout.baseImage}
        alt=""
        aria-hidden="true"
        decoding="async"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-55 pointer-events-none"
      />

      {/* Exact 3:4 Coordinate-Locked Stage so pouches are never cropped and text overlays align 100% */}
      <div
        className="relative overflow-hidden origin-bottom transition-transform duration-200 shadow-2xl"
        style={{
          width: 'min(100cqw, 75cqh)',
          height: 'min(100cqh, 133.333cqw)',
          transform: `scale(${scaleFactor})`,
        }}
      >
        <img
          src={layout.baseImage}
          alt={`Mockup natural ${shapeMeta.label}`}
          loading={size === 'card' ? 'lazy' : 'eager'}
          decoding="async"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center transition-all duration-300 ${
            config.naturalMood === 'espresso-matte'
              ? 'brightness-[0.82] contrast-[1.08] saturate-[0.76]'
              : config.naturalMood === 'cherries-beans'
                ? 'brightness-[0.94] contrast-[1.05] sepia-[0.12]'
                : ''
          }`}
        />

        {config.naturalMood === 'cherries-beans' && (
          <div
            className="absolute inset-x-0 top-0 h-[28%] pointer-events-none opacity-28 overflow-hidden mix-blend-screen"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
            }}
          >
            <img
              src={GENERATED_ASSETS.coffeeCherries}
              alt=""
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {!backgroundOnly && (
          <>
            <FrontTextOverlay config={config} rect={layout.front} variantStyle={layout.variantStyle} />
            <RearTextOverlay config={config} rect={layout.rear} variantStyle={layout.variantStyle} />
          </>
        )}
      </div>
    </div>
  );
});
