import React from 'react';
import {
  GENERATED_ASSETS,
  isTallGusset,
  ORIGINAL_UPLOADS,
  PackagingConfig,
  POUCH_SHAPES,
  PouchShapeId,
} from '../types/packaging';
import { BackPanel, FrontPanel, SideGussetPanel } from './PackagingPanels';

export type MockupSceneMode = 'natural-kawi' | 'studio-front' | 'studio-rear';

interface LiveMockupSceneProps {
  config: PackagingConfig;
  scene?: MockupSceneMode;
  size?: 'hero' | 'card' | 'critique';
  backgroundOnly?: boolean;
}

function getStageForShape(shape: PouchShapeId): {
  src: string;
  basePaddingBottom: string;
  stageTint: string;
} {
  switch (shape) {
    case 'box-gusset':
    case 'doypack-valve':
      return {
        src: GENERATED_ASSETS.sceneTravertineKawi,
        basePaddingBottom: '21%',
        stageTint: 'radial-gradient(circle at 25% 20%, rgba(255,226,170,0.14) 0%, rgba(16,10,6,0.28) 100%)',
      };
    case 'tall-heritage':
    case 'tall-copper':
      return {
        src: GENERATED_ASSETS.sceneCafeCounter,
        basePaddingBottom: '18%',
        stageTint: 'radial-gradient(circle at 50% 25%, rgba(255,204,135,0.10) 0%, rgba(14,8,5,0.34) 100%)',
      };
    case 'tall-botanical':
    case 'tall-minimal':
      return {
        src: GENERATED_ASSETS.sceneSlateDawn,
        basePaddingBottom: '22%',
        stageTint: 'radial-gradient(circle at 75% 20%, rgba(255,212,145,0.12) 0%, rgba(12,8,5,0.32) 100%)',
      };
  }
}

function PouchPhysicalOverlay({
  isDoypack,
  isRightSideShadow = false,
}: {
  isDoypack?: boolean;
  isRightSideShadow?: boolean;
}) {
  return (
    <>
      {/* Top Zipper Seal Track & Tear Notches */}
      <div
        className={`absolute inset-x-0 ${
          isDoypack ? 'top-[9.2%]' : 'top-[7.4%]'
        } h-[1.5px] bg-black/45 border-b border-white/15 pointer-events-none z-20`}
      />
      <div
        className={`absolute inset-x-0 ${
          isDoypack ? 'top-[10.8%]' : 'top-[9.0%]'
        } h-[2px] bg-black/35 border-b border-white/10 pointer-events-none z-20`}
      />
      {isDoypack && (
        <>
          <div className="absolute inset-y-0 left-0 w-[3.4%] bg-gradient-to-r from-white/14 via-black/22 to-transparent border-r border-white/10 pointer-events-none z-20" />
          <div className="absolute inset-y-0 right-0 w-[3.4%] bg-gradient-to-l from-white/14 via-black/22 to-transparent border-l border-white/10 pointer-events-none z-20" />
          <div className="absolute left-0 top-[6.6%] w-[3px] h-[5px] bg-[#160F0B]/90 rounded-r-full pointer-events-none z-20" />
          <div className="absolute right-0 top-[6.6%] w-[3px] h-[5px] bg-[#160F0B]/90 rounded-l-full pointer-events-none z-20" />
        </>
      )}

      {/* Photorealistic Pouched Surface Key-Light & Soft Crease Specular */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: isRightSideShadow
            ? 'linear-gradient(112deg, rgba(255,248,234,0.08) 0%, rgba(255,255,255,0) 32%, rgba(0,0,0,0.16) 78%, rgba(0,0,0,0.28) 100%)'
            : 'linear-gradient(108deg, rgba(255,248,234,0.11) 0%, rgba(255,255,255,0.02) 28%, rgba(0,0,0,0.06) 66%, rgba(0,0,0,0.22) 100%)',
        }}
      />
    </>
  );
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
  const isCompact = size !== 'hero';
  const isStudio = scene === 'studio-front' || scene === 'studio-rear';
  const scaleFactor = config.netWeight === '100 gram' ? 0.9 : 1;

  if (isStudio) {
    const showFront = scene === 'studio-front';
    return (
      <div
        className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-[#FFFFFF] via-[#FAF9F6] to-[#EDE9E0]"
        style={{ containerType: 'size' }}
        aria-label={`${shapeMeta.code} ${showFront ? 'Tampak Depan' : 'Tampak Belakang'} (${config.netWeight})`}
      >
        {/* Ground Contact Shadow */}
        <div
          className="absolute bottom-[8%] w-[58%] h-[5.5%] rounded-[100%] pointer-events-none blur-[6px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(26,20,18,0.34) 0%, rgba(26,20,18,0) 74%)',
          }}
        />

        <div
          className="relative z-10 flex items-end justify-center origin-bottom transition-transform duration-200"
          style={{
            height: '82cqh',
            transform: `scale(${scaleFactor})`,
          }}
        >
          {isDoypack ? (
            <div
              className="relative h-full aspect-[150/220] overflow-hidden shadow-[0_24px_46px_-12px_rgba(26,20,18,0.38)]"
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

              {/* Subtle Blank White Doypack Texture Multiply Highlights for Real Fold Depth */}
              <img
                src={ORIGINAL_UPLOADS.doypackBlank}
                alt=""
                aria-hidden="true"
                decoding="async"
                className="absolute inset-0 w-full h-full object-fill pointer-events-none opacity-[0.16] mix-blend-screen z-20"
              />
              <PouchPhysicalOverlay isDoypack />
            </div>
          ) : (
            <div className="relative h-full flex items-stretch justify-center" style={{ perspective: '1200px' }}>
              <div
                className={`h-full ${
                  tall ? 'aspect-[52/240]' : 'aspect-[56/210]'
                } origin-right overflow-hidden rounded-l-sm shadow-xl shrink-0`}
                style={{
                  transform: 'rotateY(-44deg) translateX(2px) scaleY(0.985)',
                  filter: 'brightness(0.76)',
                }}
              >
                <SideGussetPanel config={config} side="left" compact backgroundOnly={backgroundOnly} />
              </div>

              <div
                className={`relative h-full ${
                  tall ? 'aspect-[100/240]' : 'aspect-[130/210]'
                } overflow-hidden rounded-sm shadow-[0_24px_46px_-12px_rgba(26,20,18,0.42)]`}
              >
                {showFront ? (
                  <FrontPanel config={config} compact={isCompact || tall} backgroundOnly={backgroundOnly} />
                ) : (
                  <BackPanel config={config} compact={isCompact || tall} backgroundOnly={backgroundOnly} />
                )}
                <PouchPhysicalOverlay />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const stage = getStageForShape(config.pouchShape);

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col justify-end bg-[#18100C]"
      style={{ containerType: 'size' }}
      aria-label={`${shapeMeta.code} · ${shapeMeta.shortLabel} (${config.netWeight})`}
    >
      {/* Pure Empty Photographic Stage Background (ZERO baked text, ZERO AI pouch pixels) */}
      <img
        src={stage.src}
        alt={`Latar natural ${shapeMeta.shortLabel}`}
        loading={size === 'card' ? 'lazy' : 'eager'}
        decoding="async"
        referrerPolicy="no-referrer"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-300 ${
          config.naturalMood === 'espresso-matte'
            ? 'brightness-[0.68] contrast-[1.1] saturate-[0.72]'
            : config.naturalMood === 'cherries-beans'
              ? 'brightness-[0.86] contrast-[1.06] sepia-[0.14]'
              : ''
        }`}
      />

      {/* Atmospheric Mood Layer */}
      {config.naturalMood === 'cherries-beans' && (
        <div
          className="absolute inset-x-0 top-0 h-[55%] pointer-events-none opacity-45 overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0) 100%)',
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

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: stage.stageTint }}
      />

      {/* Grounded Pair of 3D Standing Pouches (Front + Back Side-by-Side) */}
      <div
        className="relative z-10 w-full flex items-end justify-center origin-bottom transition-transform duration-200 px-[4%]"
        style={{
          paddingBottom: stage.basePaddingBottom,
          transform: `scale(${scaleFactor})`,
        }}
      >
        {/* Soft Directional Pedestal Contact Shadow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[82%] h-[18px] rounded-[100%] pointer-events-none blur-[5px]"
          style={{
            bottom: `calc(${stage.basePaddingBottom} - 6px)`,
            background: 'radial-gradient(ellipse at center, rgba(8,4,2,0.85) 0%, rgba(8,4,2,0) 76%)',
          }}
        />

        {isDoypack ? (
          <div className="relative flex items-end justify-center gap-[4%] w-full max-w-[92%]">
            <div
              className="relative w-[44%] aspect-[150/220] overflow-hidden shadow-[4px_14px_26px_-4px_rgba(0,0,0,0.82)]"
              style={{ borderRadius: '6px 6px 16px 16px' }}
            >
              <FrontPanel
                config={config}
                compact={isCompact}
                showValveGraphic={!backgroundOnly}
                backgroundOnly={backgroundOnly}
              />
              <PouchPhysicalOverlay isDoypack />
            </div>

            <div
              className="relative w-[44%] aspect-[150/220] overflow-hidden shadow-[4px_14px_26px_-4px_rgba(0,0,0,0.82)]"
              style={{ borderRadius: '6px 6px 16px 16px' }}
            >
              <BackPanel config={config} compact={isCompact} backgroundOnly={backgroundOnly} />
              <PouchPhysicalOverlay isDoypack isRightSideShadow />
            </div>
          </div>
        ) : (
          <div
            className="relative flex items-end justify-center gap-[3.5%] w-full max-w-[94%]"
            style={{ perspective: '1100px' }}
          >
            {/* Front Pouch + Angled Right Side Gusset */}
            <div
              className={`relative flex items-stretch ${
                tall ? 'w-[41%] aspect-[124/240]' : 'w-[47%] aspect-[158/210]'
              } shadow-[6px_16px_28px_-4px_rgba(0,0,0,0.85)]`}
            >
              <div className="relative w-[80%] h-full overflow-hidden rounded-l-sm">
                <FrontPanel config={config} compact={isCompact || tall} backgroundOnly={backgroundOnly} />
                <PouchPhysicalOverlay />
              </div>
              <div
                className="w-[20%] h-full overflow-hidden rounded-r-sm brightness-[0.76] origin-left"
                style={{ transform: 'skewY(-6deg)' }}
              >
                <SideGussetPanel config={config} side="right" compact backgroundOnly={backgroundOnly} />
              </div>
            </div>

            {/* Angled Left Side Gusset + Back Pouch */}
            <div
              className={`relative flex items-stretch ${
                tall ? 'w-[41%] aspect-[124/240]' : 'w-[47%] aspect-[158/210]'
              } shadow-[6px_16px_28px_-4px_rgba(0,0,0,0.85)]`}
            >
              <div
                className="w-[20%] h-full overflow-hidden rounded-l-sm brightness-[0.74] origin-right"
                style={{ transform: 'skewY(6deg)' }}
              >
                <SideGussetPanel config={config} side="left" compact backgroundOnly={backgroundOnly} />
              </div>
              <div className="relative w-[80%] h-full overflow-hidden rounded-r-sm">
                <BackPanel config={config} compact={isCompact || tall} backgroundOnly={backgroundOnly} />
                <PouchPhysicalOverlay isRightSideShadow />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
