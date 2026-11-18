import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  BEAN_VARIANTS,
  GENERATED_ASSETS,
  isTallGusset,
  ORIGINAL_UPLOADS,
  PackagingConfig,
  POUCH_SHAPES,
  ROAST_LEVELS,
} from '../types/packaging';
import {
  NATURAL_MOCKUP_LAYOUTS,
  PanelOverlayRect,
  STUDIO_DOYPACK_LAYOUT,
} from '../data/mockupSceneLayouts';
import { computeQuadHomography } from '../utils/perspectiveHomography';
import {
  ArunikaKawiWordmark,
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

interface StageSize {
  w: number;
  h: number;
}

function useStageSize(ref: React.RefObject<HTMLDivElement | null>, layoutKey: string): StageSize {
  const [size, setSize] = useState<StageSize>({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };

    update();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, layoutKey]);

  return size;
}

function getBoxTransform(rect: PanelOverlayRect, stageSize: StageSize): React.CSSProperties {
  if (stageSize.w > 0 && stageSize.h > 0 && rect.quad) {
    const nominalW = Math.max(1, (rect.w / 100) * stageSize.w);
    const nominalH = Math.max(1, (rect.h / 100) * stageSize.h);
    const [tlPct, trPct, brPct, blPct] = rect.quad;
    const tl = { x: (tlPct.x / 100) * stageSize.w, y: (tlPct.y / 100) * stageSize.h };
    const tr = { x: (trPct.x / 100) * stageSize.w, y: (trPct.y / 100) * stageSize.h };
    const br = { x: (brPct.x / 100) * stageSize.w, y: (brPct.y / 100) * stageSize.h };
    const bl = { x: (blPct.x / 100) * stageSize.w, y: (blPct.y / 100) * stageSize.h };

    const { cssMatrix3d } = computeQuadHomography(nominalW, nominalH, tl, tr, br, bl);

    return {
      left: 0,
      top: 0,
      width: `${nominalW}px`,
      height: `${nominalH}px`,
      transform: cssMatrix3d,
      transformOrigin: '0 0',
    };
  }

  return {
    left: `${rect.x}%`,
    top: `${rect.y}%`,
    width: `${rect.w}%`,
    height: `${rect.h}%`,
  };
}

function FrontTextOverlay({
  config,
  rect,
  stageSize,
  variantStyle,
}: {
  config: PackagingConfig;
  rect: PanelOverlayRect;
  stageSize: StageSize;
  variantStyle: 'classic' | 'doypack' | 'heritage-mandala' | 'botanical' | 'copper' | 'minimal';
}) {
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const hasValveGap = Boolean(rect.valveClearCenterRatio);
  const isHeritage = variantStyle === 'heritage-mandala';
  const isBotanical = variantStyle === 'botanical';
  const isCopper = variantStyle === 'copper';
  const isDoypack = variantStyle === 'doypack';

  const topPadPct = hasValveGap ? 5.5 : isBotanical ? 14.5 : isCopper ? 14.0 : 12.2;
  const titleGapPct = hasValveGap ? 14.5 : isBotanical ? 9.0 : isCopper ? 10.0 : 9.5;
  const subGapPct = hasValveGap ? 5.2 : isCopper ? 8.5 : 8.4;

  return (
    <div className="absolute pointer-events-none select-none z-20 overflow-visible" style={getBoxTransform(rect, stageSize)}>
      <div className="relative w-full h-full" style={{ containerType: 'inline-size' }}>
        {/* Exact Coffee Bean Bed from User Reference (Arunika_Kawi_Front_250_gr) when needed */}
        {rect.useMasterBeans && (
          <div
            className="absolute inset-x-0 pointer-events-none overflow-hidden z-0"
            style={{
              top: '48.5%',
              height: `${Math.max(10, (rect.bandRatioTop - 0.485 - 0.014) * 100)}%`,
              clipPath: isCopper ? 'polygon(7.5% 0%, 100% 0%, 100% 24%, 25% 100%, 7.5% 100%)' : undefined,
              maskImage:
                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.88) 20%, rgba(0,0,0,1) 34%, rgba(0,0,0,1) 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.88) 20%, rgba(0,0,0,1) 34%, rgba(0,0,0,1) 100%)',
            }}
          >
            <div className="absolute inset-0 bg-[#150C08]" />
            <img
              src={ORIGINAL_UPLOADS.revisedFront250}
              alt=""
              aria-hidden="true"
              decoding="async"
              referrerPolicy="no-referrer"
              className="absolute inset-x-0 w-full max-w-none"
              style={{
                height: '261.8%',
                top: '-130.9%',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(106deg, rgba(255,248,234,0.08) 0%, rgba(255,255,255,0) 36%, rgba(0,0,0,0.22) 100%)',
              }}
            />
          </div>
        )}

        {/* Main Upper Typography Zone (Height-Relative Vertical Rhythm matching Master Artwork) */}
        <div
          className={`relative z-10 w-full flex flex-col items-center text-center ${
            isBotanical ? 'px-[10%]' : isCopper ? 'px-[7%]' : 'px-[8%]'
          }`}
          style={{ height: `${rect.bandRatioTop * 100}%` }}
        >
          <div className="shrink-0 w-full" style={{ height: `${topPadPct}%` }} aria-hidden="true" />

          <ArunikaSunBeanCrest
            className={
              isDoypack ? 'w-[11cqi] h-[11cqi] shrink-0' : isCopper ? 'w-[13.2cqi] h-[13.2cqi] shrink-0' : 'w-[12.2cqi] h-[12.2cqi] shrink-0'
            }
          />
          <p
            className="mt-[1.8%] font-sans font-bold uppercase tracking-[0.14em] text-[#D8B474] whitespace-nowrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] shrink-0"
            style={{ fontSize: isCopper ? '6cqi' : isDoypack ? '4.5cqi' : '5.1cqi' }}
          >
            COFFE BEAN
          </p>
          <div className="mt-[0.8%] flex items-center justify-center gap-[4%] w-[56%] shrink-0">
            <span className="h-px flex-1 bg-[#FAF5EB]/55" />
            <span
              className="font-sans font-medium uppercase tracking-[0.14em] text-[#FAF5EB] whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]"
              style={{ fontSize: isCopper ? '3.8cqi' : isDoypack ? '3cqi' : '3.3cqi' }}
            >
              EST 2024
            </span>
            <span className="h-px flex-1 bg-[#FAF5EB]/55" />
          </div>

          <div className="shrink-0 w-full" style={{ height: `${titleGapPct}%` }} aria-hidden="true" />

          <ArunikaKawiWordmark
            className={`shrink-0 h-auto ${
              isDoypack ? 'w-[58cqi]' : isCopper ? 'w-[65cqi]' : 'w-[62cqi]'
            }`}
          />

          <div className="shrink-0 w-full" style={{ height: `${subGapPct}%` }} aria-hidden="true" />

          <p
            className="shrink-0 font-sans font-semibold text-[#FAF5EB] leading-[1.2] drop-shadow-[0_1px_6px_rgba(0,0,0,0.92)]"
            style={{ fontSize: isDoypack ? '4.5cqi' : isCopper ? '5.2cqi' : '4.7cqi' }}
          >
            {roast.subtitle}
          </p>

          {isHeritage ? (
            <div className="mt-[3%] flex flex-col items-center shrink-0">
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
              className="mt-[1.6%] shrink-0 font-sans font-semibold text-[#FAF5EB] leading-[1.2] drop-shadow-[0_1px_6px_rgba(0,0,0,0.92)]"
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
          className="absolute inset-x-0 z-10 flex items-center justify-center px-[4%]"
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
    </div>
  );
}

function RearTextOverlay({
  config,
  rect,
  stageSize,
  variantStyle,
}: {
  config: PackagingConfig;
  rect: PanelOverlayRect;
  stageSize: StageSize;
  variantStyle: 'classic' | 'doypack' | 'heritage-mandala' | 'botanical' | 'copper' | 'minimal';
}) {
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const isCopper = variantStyle === 'copper';
  const topPad = rect.topPadPct ?? 12.0;

  return (
    <div className="absolute pointer-events-none select-none z-20 overflow-visible" style={getBoxTransform(rect, stageSize)}>
      <div className="relative w-full h-full" style={{ containerType: 'inline-size' }}>
        <div
          className="relative w-full flex flex-col justify-between px-[8%] pb-[3.5%]"
          style={{
            height: `${rect.bandRatioTop * 100}%`,
          }}
        >
          {/* Height-Relative Top Clearance Below Zipper / Fin Seam */}
          <div className="shrink-0 w-full" style={{ height: `${topPad}%` }} aria-hidden="true" />

          {/* Top Crest + Story Copy */}
          <div className="flex flex-col items-center text-center shrink-0">
            <div className={isCopper ? 'w-[32cqi]' : 'w-[30cqi]'}>
              <RoastProfileCrest topText={roast.crestTop} bottomText={roast.crestBottom} className="w-full h-auto" />
            </div>

            <h3
              className="mt-[2.4%] font-sans font-bold text-[#D8B474] tracking-[0.02em] drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]"
              style={{ fontSize: isCopper ? '6.1cqi' : '5.7cqi' }}
            >
              Arunika Kawi Coffee
            </h3>

            <p
              className="mt-[3.5%] text-[#F4ECE0] leading-[1.3] drop-shadow-[0_1px_5px_rgba(0,0,0,0.92)]"
              style={{ fontSize: isCopper ? '3.35cqi' : '3.2cqi' }}
            >
              Diolah secara tradisional (<em>Goreng Kreweng</em>) oleh Kelompok Tani Hutan, dipetik langsung dari lereng
              Gunung Kawi. Setiap seduhannya menghadirkan karakter{' '}
              <span className="font-semibold text-[#D8B474]">{variant.storyCharacter}</span> {roast.storyRoast}
            </p>

            <p
              className="mt-[3.2%] font-sans font-semibold leading-tight text-center drop-shadow-[0_1px_5px_rgba(0,0,0,0.92)]"
              style={{ fontSize: isCopper ? '3.45cqi' : '3.3cqi' }}
            >
              <span className="text-[#D8B474]">Arunika Kawi Coffee</span>{' '}
              <span className="text-[#FAF5EB]">harum dan nikmat</span>
            </p>
          </div>

          {/* Middle Composition Line — Anchored vertically in the middle open space matching master */}
          <div className="flex-1 flex items-center justify-center text-center pt-[2%]">
            <p
              className="font-sans font-semibold tracking-[0.025em] uppercase text-[#FAF5EB] drop-shadow-[0_1px_5px_rgba(0,0,0,0.92)]"
              style={{ fontSize: isCopper ? '3.15cqi' : '2.95cqi' }}
            >
              KOMPOSISI {config.beanVariant === 'robusta-100' ? '100 % BIJI KOPI ROBUSTA' : variant.frontLabel.toUpperCase()}
            </p>
          </div>

          {/* Footer Legal Row */}
          <div className="shrink-0 flex items-end justify-between gap-[3%]">
            <div className="flex items-start gap-[2.2cqi] min-w-0 flex-[1.32]">
              {config.sealPlacement === 'back' && (
                <div className="flex flex-col items-center shrink-0">
                  <KthEastJavaSeal variant="original-green" className="w-[12cqi] h-[12cqi] mt-[0.4cqi] drop-shadow" />
                  <span
                    className="text-[#FAF5EB] font-medium leading-[1.1] mt-[0.7cqi] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                    style={{ fontSize: '2.35cqi' }}
                  >
                    PIRT
                  </span>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p
                  className="font-semibold text-[#D8B474] leading-[1.15] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                  style={{ fontSize: '3cqi' }}
                >
                  Diproduksi Oleh
                </p>
                <p
                  className="text-[#FAF5EB] leading-[1.18] mt-[0.7cqi] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                  style={{ fontSize: '2.45cqi' }}
                >
                  KUPS Himatarian Blitar
                  <br />
                  Jawa Timur – INDONESIA
                </p>
                {config.sealPlacement !== 'back' && (
                  <p
                    className="text-[#FAF5EB] font-medium leading-[1.1] mt-[0.7cqi] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                    style={{ fontSize: '2.35cqi' }}
                  >
                    PIRT
                  </p>
                )}
                <div className="mt-[1.3cqi] w-full h-[2.9cqi] bg-white rounded-[1px]" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="text-[#FAF5EB] font-medium leading-[1.1] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                style={{ fontSize: '2.35cqi' }}
              >
                Kode Produksi
              </p>
              <div className="mt-[0.7cqi] w-full h-[2.7cqi] bg-white rounded-[1px]" />
              <p
                className="text-[#FAF5EB] font-medium leading-[1.1] mt-[1.6cqi] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                style={{ fontSize: '2.15cqi' }}
              >
                Baik Digunakan Sebelum
              </p>
              <div className="mt-[0.7cqi] w-full h-[2.7cqi] bg-white rounded-[1px]" />
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
            style={{ fontSize: isCopper ? '4.3cqi' : '3.95cqi' }}
          >
            100 % KOPI ASLI INDONESIA
          </span>
        </div>
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

  const stageRef = useRef<HTMLDivElement | null>(null);
  const stageSize = useStageSize(stageRef, `${scene}-${isDoypack ? 'doy' : 'gusset'}`);

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
            ref={stageRef}
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
                <FrontTextOverlay config={config} rect={overlayRect} stageSize={stageSize} variantStyle="doypack" />
              ) : (
                <RearTextOverlay config={config} rect={overlayRect} stageSize={stageSize} variantStyle="doypack" />
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
        ref={stageRef}
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
            <FrontTextOverlay config={config} rect={layout.front} stageSize={stageSize} variantStyle={layout.variantStyle} />
            <RearTextOverlay config={config} rect={layout.rear} stageSize={stageSize} variantStyle={layout.variantStyle} />
          </>
        )}
      </div>
    </div>
  );
});
