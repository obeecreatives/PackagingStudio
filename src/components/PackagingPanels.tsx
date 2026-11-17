import React from 'react';
import { Coffee, Droplets, Flame, Mountain } from 'lucide-react';
import {
  BEAN_VARIANTS,
  GENERATED_ASSETS,
  getWeightSpecs,
  isTallGusset,
  ORIGINAL_UPLOADS,
  PackagingConfig,
  ROAST_LEVELS,
} from '../types/packaging';
import {
  ArunikaSunBeanCrest,
  BotanicalCornerArt,
  Ean13Barcode,
  KthEastJavaSeal,
  MandalaHeritageCrest,
  RoastProfileCrest,
} from './BrandCrests';
import { getWibBatchAndExpiry } from '../utils/dateUtils';

interface PanelProps {
  config: PackagingConfig;
  compact?: boolean;
  showValveGraphic?: boolean;
  backgroundOnly?: boolean;
}

function DegassingValveVisual({
  compact = false,
  isPrintGuide = false,
}: {
  compact?: boolean;
  isPrintGuide?: boolean;
}) {
  const sizeClass = compact ? 'w-6 h-6' : 'w-8 h-8';
  if (isPrintGuide) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div
          className={`${sizeClass} rounded-full border border-dashed border-[#38BDF8] bg-[#160F0C]/65 flex items-center justify-center`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]/80" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-[#2B1D16] via-[#1C110C] to-[#110906] border border-[#5A4232]/75 shadow-[inset_0_1px_3px_rgba(255,255,255,0.14),0_2px_5px_rgba(0,0,0,0.65)] flex items-center justify-center relative`}
      aria-label="Katup udara satu arah (one-way degassing valve)"
    >
      <div className="w-[72%] h-[72%] rounded-full border border-[#0E0704]/80 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const cx = 12 + Math.cos(rad) * 6.5;
            const cy = 12 + Math.sin(rad) * 6.5;
            return <circle key={deg} cx={cx} cy={cy} r="0.85" fill="#0B0604" />;
          })}
        </svg>
      </div>
    </div>
  );
}

function NaturalArtworkLayers({ config, isBack = false }: { config: PackagingConfig; isBack?: boolean }) {
  const isCopper = config.pouchShape === 'tall-copper';
  const isBotanical = config.pouchShape === 'tall-botanical';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 pouch-matte-surface" />

      {config.naturalMood === 'kawi-beans' && (
        <div
          className="absolute inset-x-0 top-0 h-[56%] overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.22) 55%, rgba(0,0,0,0) 100%)',
          }}
        >
          <img
            src={GENERATED_ASSETS.kawiMist}
            alt="Lanskap fajar Gunung Kawi"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-50 sepia-[0.38] contrast-110 brightness-75"
          />
        </div>
      )}

      {config.naturalMood === 'cherries-beans' && (
        <div
          className={`absolute ${
            isBack ? 'top-0 right-0 w-[85%] h-[42%]' : 'top-[32%] -left-6 w-[88%] h-[44%]'
          } overflow-hidden`}
          style={{
            maskImage:
              'radial-gradient(ellipse at 45% 50%, rgba(0,0,0,0.68) 15%, rgba(0,0,0,0.22) 60%, rgba(0,0,0,0) 92%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at 45% 50%, rgba(0,0,0,0.68) 15%, rgba(0,0,0,0.22) 60%, rgba(0,0,0,0) 92%)',
          }}
        >
          <img
            src={GENERATED_ASSETS.coffeeCherries}
            alt="Ranting buah ceri kopi natural"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-50 brightness-75 contrast-115"
          />
        </div>
      )}

      {/* Botanical Foil Corner Sprays for Alternatif 04 */}
      {isBotanical && !isBack && (
        <>
          <BotanicalCornerArt className="absolute -top-2 -left-2 w-24 h-24 opacity-85" />
          <BotanicalCornerArt className="absolute -top-2 -right-2 w-24 h-24 -scale-x-100 opacity-85" />
          <BotanicalCornerArt className="absolute bottom-[11%] -left-2 w-24 h-24 -scale-y-100 opacity-75" />
          <BotanicalCornerArt className="absolute bottom-[11%] -right-2 w-24 h-24 scale-[-1] opacity-75" />
        </>
      )}

      {/* Copper Geometric Diagonal Sash & Vertical Gold Pinstripe for Alternatif 05 */}
      {isCopper && !isBack && (
        <>
          <div className="absolute inset-y-0 left-[7.5%] w-[1.5px] gold-foil-gradient opacity-85" />
          <div
            className="absolute inset-x-0 bottom-0 h-[44%]"
            style={{
              background: 'linear-gradient(135deg, #9C4F2B 0%, #B86339 55%, #78391D 100%)',
              clipPath: 'polygon(0 78%, 100% 18%, 100% 100%, 0 100%)',
              opacity: 0.92,
            }}
          />
          <BotanicalCornerArt className="absolute bottom-[11%] -right-2 w-28 h-28 scale-[-1] opacity-90" />
          <BotanicalCornerArt className="absolute bottom-[12%] left-[5%] w-24 h-24 -scale-y-100 opacity-50" />
        </>
      )}

      {/* Natural roasted Robusta beans cluster above bottom band */}
      {!isBack && (
        <div
          className={`absolute inset-x-0 ${
            isCopper ? 'bottom-[18%] h-[25%] opacity-75' : 'bottom-[11.5%] h-[33%]'
          } overflow-hidden`}
          style={{
            maskImage:
              'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 52%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage:
              'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 52%, rgba(0,0,0,0) 100%)',
          }}
        >
          <img
            src={GENERATED_ASSETS.beansCluster}
            alt="Biji kopi Robusta sangrai natural"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-bottom brightness-95 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F0A] via-transparent to-[#140B07]/45" />
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 34%, rgba(214, 179, 115, 0.08) 0%, rgba(16, 9, 6, 0.42) 78%, rgba(12, 7, 4, 0.72) 100%)',
        }}
      />
    </div>
  );
}

export function FrontPanel({
  config,
  compact = false,
  showValveGraphic = false,
  backgroundOnly = false,
}: PanelProps) {
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const isDoypack = config.pouchShape === 'doypack-valve';
  const tall = isTallGusset(config.pouchShape);
  const isHeritage = config.pouchShape === 'tall-heritage';
  const isBotanical = config.pouchShape === 'tall-botanical';
  const isCopper = config.pouchShape === 'tall-copper';

  const isUploadedFinal = config.artworkSource === 'uploaded-final';
  const hasTextOverride = config.beanVariant !== 'robusta-100' || config.roastLevel !== 'traditional';

  const uploadedFrontSrc =
    config.netWeight === '100 gram' ? ORIGINAL_UPLOADS.revisedFront100 : ORIGINAL_UPLOADS.revisedFront250;

  if (isUploadedFinal && !backgroundOnly) {
    if (tall) {
      return (
        <div
          className="relative w-full h-full overflow-hidden select-none text-[#FAF5EB] bg-[#1A0F0A] flex flex-col justify-between"
          style={{ containerType: 'inline-size' }}
        >
          {/* Base Warm Mountain Atmosphere */}
          <div className="absolute inset-0 pouch-matte-surface" />
          <div
            className="absolute inset-x-0 top-0 h-[50%] overflow-hidden pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.22) 60%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.22) 60%, rgba(0,0,0,0) 100%)',
            }}
          >
            <img
              src={config.naturalMood === 'cherries-beans' ? GENERATED_ASSETS.coffeeCherries : GENERATED_ASSETS.kawiMist}
              alt=""
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-55 sepia-[0.28] brightness-75 contrast-110"
            />
          </div>

          {config.naturalMood === 'espresso-matte' && (
            <div
              className="absolute inset-x-0 top-0 h-[55%] pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(22,12,8,0.82) 0%, rgba(28,16,11,0.56) 60%, rgba(28,16,11,0) 100%)',
              }}
            />
          )}

          {/* Roasted Robusta Beans Cluster Above Bottom Band */}
          <div
            className="absolute inset-x-0 bottom-[10.5%] h-[34%] overflow-hidden pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 55%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 55%, rgba(0,0,0,0) 100%)',
            }}
          >
            <img
              src={GENERATED_ASSETS.beansCluster}
              alt="Biji kopi Robusta sangrai"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-bottom brightness-95 contrast-110"
            />
          </div>

          {/* Style-Specific Accents */}
          {isHeritage && (
            <div className="absolute inset-[3.5%] border border-[#D8B474]/50 pointer-events-none z-10" />
          )}

          {isBotanical && (
            <>
              <BotanicalCornerArt className="absolute -top-1 -left-1 w-[26cqi] h-[26cqi] opacity-90 pointer-events-none" />
              <BotanicalCornerArt className="absolute -top-1 -right-1 w-[26cqi] h-[26cqi] -scale-x-100 opacity-90 pointer-events-none" />
              <BotanicalCornerArt className="absolute bottom-[11.5%] -left-1 w-[26cqi] h-[26cqi] -scale-y-100 opacity-80 pointer-events-none" />
              <BotanicalCornerArt className="absolute bottom-[11.5%] -right-1 w-[26cqi] h-[26cqi] scale-[-1] opacity-80 pointer-events-none" />
            </>
          )}

          {isCopper && (
            <>
              <div className="absolute inset-y-0 left-[6.5%] w-[1.5px] gold-foil-gradient opacity-90 pointer-events-none z-10" />
              <div
                className="absolute inset-x-0 bottom-[10.5%] h-[34%] pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, #9C4F2B 0%, #B86339 55%, #78391D 100%)',
                  clipPath: 'polygon(26% 100%, 100% 18%, 100% 100%)',
                  opacity: 0.9,
                }}
              />
              <BotanicalCornerArt className="absolute bottom-[11%] -right-1 w-[24cqi] h-[24cqi] scale-[-1] opacity-90 pointer-events-none" />
            </>
          )}

          {/* Brand & Typography Matching Arunika Kawi Revised Master (100% Uncropped in Tall Width) */}
          <div
            className={`relative z-10 pt-[14%] flex flex-col items-center text-center ${
              isCopper ? 'pl-[11%] pr-[7%]' : 'px-[8%]'
            }`}
          >
            <ArunikaSunBeanCrest className="w-[16cqi] h-[16cqi]" />
            <div className="mt-[4%] flex items-center justify-center gap-[4%] w-[82%]">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D8B474]/80" />
              <span
                className="font-sans font-semibold uppercase tracking-[0.16em] text-[#D8B474] whitespace-nowrap"
                style={{ fontSize: '4.4cqi' }}
              >
                COFFE BEAN · EST. 2024
              </span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D8B474]/80" />
            </div>

            <h2
              className="mt-[9%] font-serif font-bold tracking-[0.04em] leading-[0.96] text-[#D8B474] drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]"
              style={{ fontSize: '15.5cqi' }}
            >
              ARUNIKA
              <span className="block tracking-[0.08em]">KAWI</span>
            </h2>

            <p
              className="mt-[8%] font-sans font-semibold text-[#FAF5EB] leading-[1.2] tracking-[0.01em]"
              style={{ fontSize: '5.1cqi' }}
            >
              {roast.subtitle}
            </p>
            <p
              className="mt-[2%] font-sans font-semibold text-[#FAF5EB] leading-[1.2]"
              style={{ fontSize: '5.1cqi' }}
            >
              {variant.frontLabel}
            </p>
          </div>

          {/* Optional Front KTH Seal */}
          {config.sealPlacement === 'front' && (
            <div className="relative z-10 flex justify-end px-[7%] pb-[3%]">
              <KthEastJavaSeal variant="original-green" className="w-[18cqi] h-[18cqi] drop-shadow-md" />
            </div>
          )}

          {/* Solid Bottom Band (Weight ONLY on Front) */}
          <div
            className={`relative z-10 w-full h-[11%] flex items-center justify-center ${
              isCopper
                ? 'bg-[#1B100B] border-t border-[#E6B89A]/55 text-[#FAF5EB]'
                : 'gold-foil-gradient border-t border-[#F7E8C6]/60 text-[#1E130D]'
            }`}
          >
            <span className="font-sans font-bold tabular-nums whitespace-nowrap" style={{ fontSize: '5.2cqi' }}>
              Isi Bersih : {config.netWeight}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full overflow-hidden select-none text-[#FAF5EB] bg-[#1A0F0A]">
        <img
          src={uploadedFrontSrc}
          alt={`Desain Halaman Depan Arunika Kawi (${config.netWeight})`}
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-fill object-center"
        />

        {/* Dynamic Natural Mood Overlay for Uploaded Artwork */}
        {config.naturalMood === 'cherries-beans' && (
          <div
            className="absolute inset-x-0 top-0 h-[52%] pointer-events-none mix-blend-lighten opacity-45 overflow-hidden"
            style={{
              maskImage:
                'radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0.85) 10%, rgba(0,0,0,0.3) 58%, rgba(0,0,0,0) 92%)',
              WebkitMaskImage:
                'radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0.85) 10%, rgba(0,0,0,0.3) 58%, rgba(0,0,0,0) 92%)',
            }}
          >
            <img
              src={GENERATED_ASSETS.coffeeCherries}
              alt=""
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover brightness-75 contrast-115"
            />
          </div>
        )}

        {config.naturalMood === 'espresso-matte' && (
          <div
            className="absolute inset-x-0 top-0 h-[48%] pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(22,12,8,0.82) 0%, rgba(28,16,11,0.58) 55%, rgba(28,16,11,0) 100%)',
            }}
          />
        )}

        {/* Dynamic Roast & Bean Variant Replacement when changed from default */}
        {hasTextOverride && (
          <div className="absolute inset-x-[9%] top-[48.0%] h-[11.2%] flex flex-col items-center justify-center text-center pointer-events-none z-10 px-2">
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(40,25,18,0.98) 0%, rgba(28,16,11,0.99) 50%, rgba(24,14,9,0.98) 100%)',
                maskImage:
                  'radial-gradient(ellipse 49% 47% at 50% 50%, rgba(0,0,0,1) 66%, rgba(0,0,0,0.88) 84%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 49% 47% at 50% 50%, rgba(0,0,0,1) 66%, rgba(0,0,0,0.88) 84%, rgba(0,0,0,0) 100%)',
              }}
            />
            <p
              className={`relative z-10 font-sans font-semibold text-[#FAF5EB] leading-tight tracking-[0.01em] ${
                compact ? 'text-[7.5px]' : 'text-[11.5px]'
              }`}
            >
              {roast.subtitle}
            </p>
            <p
              className={`relative z-10 font-sans font-semibold text-[#FAF5EB] leading-tight mt-0.5 ${
                compact ? 'text-[7.5px]' : 'text-[11.5px]'
              }`}
            >
              {variant.frontLabel}
            </p>
          </div>
        )}

        {/* Alternatif 02: Center One-Way Degassing Valve */}
        {isDoypack && (showValveGraphic || config.showPrintMarks) && (
          <div className="absolute top-[25.5%] left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            {showValveGraphic ? (
              <DegassingValveVisual compact />
            ) : (
              <DegassingValveVisual compact isPrintGuide />
            )}
          </div>
        )}

        {/* Optional Front KTH Seal if toggled to Front */}
        {config.sealPlacement === 'front' && (
          <div className={`absolute bottom-[13%] right-0 z-10 ${compact ? 'px-2' : 'px-3.5'}`}>
            <KthEastJavaSeal
              variant="original-green"
              className={compact ? 'w-7 h-7 drop-shadow-md' : 'w-11 h-11 drop-shadow-lg'}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden select-none text-[#FAF5EB] flex flex-col justify-between">
      <NaturalArtworkLayers config={config} />

      {backgroundOnly ? (
        <div className="flex-1" />
      ) : (
        <>
          {isDoypack ? (
        <div className="relative z-10 pt-[14%] px-[10%] flex flex-col items-center text-center">
          <ArunikaSunBeanCrest className={compact ? 'w-7 h-7' : 'w-9 h-9'} />
          <div className="mt-1.5 flex items-center justify-center gap-2 w-full max-w-[180px]">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C99C52]/80" />
            <span
              className={`font-sans font-semibold uppercase tracking-[0.26em] text-[#D8B474] whitespace-nowrap ${
                compact ? 'text-[6px]' : 'text-[8.5px]'
              }`}
            >
              COFFEE BEAN · EST. 2024
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C99C52]/80" />
          </div>

          <div className={`${compact ? 'my-2' : 'my-3'} flex items-center justify-center`}>
            {showValveGraphic ? (
              <DegassingValveVisual compact={compact} />
            ) : config.showPrintMarks ? (
              <DegassingValveVisual compact={compact} isPrintGuide />
            ) : (
              <div className={compact ? 'h-6' : 'h-8'} />
            )}
          </div>

          <h2
            className={`font-serif font-bold tracking-[0.06em] leading-[0.95] text-[#FAF5EB] drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] ${
              compact ? 'text-[22px]' : 'text-[31px]'
            }`}
          >
            ARUNIKA
            <span className="block tracking-[0.14em] text-[#E9C98E]">KAWI</span>
          </h2>

          <div className="mt-2 w-[74%] h-[1.5px] gold-foil-gradient opacity-90" />

          <p
            className={`mt-1.5 font-serif italic tracking-[0.04em] text-[#EFE3D0] ${
              compact ? 'text-[9.5px]' : 'text-[13px]'
            }`}
          >
            {roast.subtitle}
          </p>

          <p
            className={`mt-1 font-sans font-medium tracking-[0.14em] text-[#F5ECD9] ${
              compact ? 'text-[8px]' : 'text-[10.5px]'
            }`}
          >
            {variant.frontLabel}
          </p>
        </div>
      ) : isHeritage ? (
        /* Alternatif 03: Tall Heritage Mandala Crest */
        <div className="relative z-10 pt-[10%] px-[9%] flex flex-col items-center text-center">
          <ArunikaSunBeanCrest className={compact ? 'w-7 h-7' : 'w-10 h-10'} />
          <p
            className={`mt-1.5 font-sans font-semibold uppercase tracking-[0.32em] text-[#D8B474] ${
              compact ? 'text-[6.5px]' : 'text-[9.5px]'
            }`}
          >
            COFFEE BEAN
          </p>
          <h2
            className={`mt-2 font-serif font-bold tracking-[0.06em] leading-[0.92] text-[#E9C98E] drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] ${
              compact ? 'text-[20px]' : 'text-[31px]'
            }`}
          >
            ARUNIKA
            <span className="block tracking-[0.12em]">KAWI</span>
          </h2>
          <p
            className={`mt-1.5 font-serif italic tracking-[0.03em] text-[#EFE3D0] ${
              compact ? 'text-[8.5px]' : 'text-[12px]'
            }`}
          >
            {roast.subtitle}
          </p>

          <div className={compact ? 'mt-2' : 'mt-3'}>
            <MandalaHeritageCrest
              label={variant.frontLabel}
              compact={compact}
              className={compact ? 'w-20 h-20' : 'w-32 h-32'}
            />
          </div>
        </div>
      ) : isBotanical || isCopper ? (
        /* Alternatif 04 & 05: Tall Botanical Foil / Copper Geometric */
        <div
          className={`relative z-10 pt-[11%] flex flex-col items-center text-center ${
            isCopper ? 'pl-[13%] pr-[8%]' : 'px-[10%]'
          }`}
        >
          <ArunikaSunBeanCrest className={compact ? 'w-7 h-7' : 'w-10 h-10'} />
          <p
            className={`mt-1.5 font-sans font-semibold uppercase tracking-[0.3em] text-[#D8B474] ${
              compact ? 'text-[6px]' : 'text-[9px]'
            }`}
          >
            COFFEE BEAN · EST. 2024
          </p>

          <h2
            className={`mt-2.5 font-serif font-bold tracking-[0.06em] leading-[0.94] drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] ${
              compact ? 'text-[20px]' : 'text-[30px]'
            }`}
          >
            <span className="text-[#FAF5EB]">ARUNIKA</span>
            <span className="block tracking-[0.14em] text-[#E9C98E]">KAWI</span>
          </h2>

          <div className="mt-2 w-[68%] h-[1.5px] gold-foil-gradient opacity-85" />

          <p
            className={`mt-1.5 font-serif italic tracking-[0.04em] text-[#EFE3D0] ${
              compact ? 'text-[8.5px]' : 'text-[12px]'
            }`}
          >
            {roast.subtitle}
          </p>

          <div
            className={`mt-4 rounded-full border border-[#D8B474]/75 bg-[#190F0B]/70 flex items-center justify-center text-center px-3 ${
              compact ? 'w-16 h-16' : 'w-24 h-24'
            }`}
          >
            <span
              className={`font-sans font-medium leading-tight text-[#FAF5EB] ${
                compact ? 'text-[7px]' : 'text-[10px]'
              }`}
            >
              {variant.frontLabel}
            </span>
          </div>
        </div>
      ) : (
        /* Versi 01: Box Pouch Gusset */
        <div className="relative z-10 pt-[10%] px-[9%] flex flex-col items-center text-center">
          <ArunikaSunBeanCrest className={compact ? 'w-8 h-8' : 'w-11 h-11'} />

          <p
            className={`mt-2 font-sans font-semibold uppercase tracking-[0.34em] text-[#D8B474] ${
              compact ? 'text-[7px]' : 'text-[10px]'
            }`}
          >
            COFFEE BEAN
          </p>

          <div className="mt-1 flex items-center justify-center gap-2.5 w-full max-w-[170px]">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C99C52]/80" />
            <span
              className={`font-sans tracking-[0.22em] text-[#E6D7C0]/90 ${
                compact ? 'text-[6.5px]' : 'text-[8.5px]'
              }`}
            >
              EST. 2024
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C99C52]/80" />
          </div>

          <h2
            className={`mt-2.5 font-serif font-bold tracking-[0.06em] leading-[0.95] text-[#FAF5EB] drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] ${
              compact ? 'text-[22px]' : 'text-[34px]'
            }`}
          >
            ARUNIKA
            <span className="block tracking-[0.14em] text-[#E9C98E]">KAWI</span>
          </h2>

          <div className="mt-2.5 w-[72%] h-[1.5px] gold-foil-gradient opacity-90" />

          <p
            className={`mt-2 font-serif italic tracking-[0.04em] text-[#EFE3D0] ${
              compact ? 'text-[9.5px]' : 'text-[13.5px]'
            }`}
          >
            {roast.subtitle}
          </p>

          <div className={compact ? 'mt-2.5 w-24' : 'mt-3.5 w-36'}>
            <RoastProfileCrest topText={roast.crestTop} bottomText={roast.crestBottom} className="w-full h-auto" />
          </div>

          <p
            className={`mt-1.5 font-sans font-medium tracking-[0.14em] text-[#F5ECD9] ${
              compact ? 'text-[8px]' : 'text-[11px]'
            }`}
          >
            {variant.frontLabel}
          </p>
        </div>
      )}

      {config.sealPlacement === 'front' && (
        <div className={`relative z-10 flex justify-end ${compact ? 'px-3 pb-1' : 'px-5 pb-2'}`}>
          <KthEastJavaSeal
            variant="gold-heritage"
            className={compact ? 'w-9 h-9 drop-shadow-md' : 'w-14 h-14 drop-shadow-lg'}
          />
        </div>
      )}
        </>
      )}

      {/* Bottom Band (Gold Foil or Copper Satin) */}
      {isCopper ? (
        <div
          className={`relative z-10 w-full border-t border-[#E6B89A]/50 bg-[#1B100B] flex items-center justify-between text-[#FAF5EB] ${
            compact ? 'h-[11%] px-3' : 'h-[11%] px-5'
          }`}
        >
          {!backgroundOnly && (
            <>
              <span
                className={`font-sans font-semibold tracking-[0.08em] uppercase text-[#E9C98E] ${
                  compact ? 'text-[5.5px]' : 'text-[8px]'
                }`}
              >
                Gunung Kawi · Jawa Timur
              </span>
              <span
                className={`font-sans font-bold tracking-[0.04em] tabular-nums ${
                  compact ? 'text-[7px]' : 'text-[10.5px]'
                }`}
              >
                Isi Bersih : {config.netWeight}
              </span>
            </>
          )}
        </div>
      ) : (
        <div
          className={`relative z-10 w-full gold-foil-gradient border-t border-[#F7E8C6]/60 flex items-center justify-between text-[#1E130D] ${
            compact ? 'h-[12%] px-3' : 'h-[12%] px-5'
          }`}
        >
          {!backgroundOnly && (
            <>
              <span
                className={`font-sans font-semibold tracking-[0.08em] uppercase ${
                  compact ? 'text-[5.5px]' : 'text-[8.5px]'
                }`}
              >
                Gunung Kawi · Jawa Timur
              </span>
              <span
                className={`font-sans font-bold tracking-[0.04em] tabular-nums ${
                  compact ? 'text-[7px]' : 'text-[11px]'
                }`}
              >
                Isi Bersih : {config.netWeight}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function SideGussetPanel({
  config,
  side,
  compact = false,
  backgroundOnly = false,
}: PanelProps & { side: 'left' | 'right' }) {
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const isCopper = config.pouchShape === 'tall-copper';

  return (
    <div className="relative w-full h-full overflow-hidden select-none text-[#FAF5EB] flex flex-col justify-between border-x border-[#C99C52]/15">
      <div className="absolute inset-0 pouch-matte-surface" />
      <div
        className="absolute inset-x-0 bottom-[12%] h-[36%] opacity-65"
        style={{
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage:
            'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0) 100%)',
        }}
      >
        <img
          src={GENERATED_ASSETS.beansCluster}
          alt=""
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {!backgroundOnly ? (
        <>
          <div className="absolute inset-y-0 left-1/2 -translate-x-px w-px border-l border-dashed border-[#D8B474]/20 pointer-events-none" />

      <div className={`relative z-10 flex flex-col items-center text-center ${compact ? 'pt-6 px-1.5' : 'pt-9 px-3'}`}>
        <Mountain className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} text-[#D8B474]`} />
        <p
          className={`mt-1.5 font-sans uppercase tracking-[0.2em] text-[#D8B474] ${
            compact ? 'text-[5.5px]' : 'text-[7.5px]'
          }`}
        >
          {side === 'left' ? 'ORIGIN' : 'TASTING'}
        </p>

        {side === 'left' ? (
          <div className="mt-3 space-y-2.5 w-full">
            <div>
              <p className={`text-[#B9A795] uppercase tracking-wider ${compact ? 'text-[5px]' : 'text-[7px]'}`}>
                Elevasi
              </p>
              <p className={`font-mono text-[#F5ECD9] tabular-nums ${compact ? 'text-[6px]' : 'text-[8.5px]'}`}>
                {variant.altitude}
              </p>
            </div>
            <div className="h-px bg-[#C99C52]/25 mx-2" />
            <div>
              <p className={`text-[#B9A795] uppercase tracking-wider ${compact ? 'text-[5px]' : 'text-[7px]'}`}>
                Proses
              </p>
              <p className={`text-[#F5ECD9] leading-snug ${compact ? 'text-[5.5px]' : 'text-[8px]'}`}>
                {variant.process}
              </p>
            </div>
            <div className="h-px bg-[#C99C52]/25 mx-2" />
            <div>
              <p className={`text-[#B9A795] uppercase tracking-wider ${compact ? 'text-[5px]' : 'text-[7px]'}`}>
                Panen
              </p>
              <p className={`text-[#F5ECD9] leading-snug ${compact ? 'text-[5.5px]' : 'text-[8px]'}`}>
                Petik Merah Selektif
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 space-y-2.5 w-full">
            {[
              { label: 'Body', score: roast.bodyScore },
              { label: 'Aroma', score: roast.aromaScore },
              { label: 'Boldness', score: roast.bitternessScore },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <span className={`text-[#D6C5B2] uppercase tracking-wider ${compact ? 'text-[5px]' : 'text-[7px]'}`}>
                  {item.label}
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={`${compact ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full ${
                        n <= item.score ? 'bg-[#D8B474]' : 'bg-[#D8B474]/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center">
        <span
          className={`font-serif tracking-[0.34em] uppercase text-[#E4C58A]/70 whitespace-nowrap -rotate-90 ${
            compact ? 'text-[8px]' : 'text-[11px]'
          }`}
        >
          ARUNIKA KAWI
        </span>
      </div>
        </>
      ) : (
        <div className="flex-1" />
      )}

      <div
        className={`relative z-10 w-full flex items-center justify-center ${
          isCopper
            ? 'h-[11%] bg-[#9C4F2B] border-t border-[#E6B89A]/45 text-[#FAF5EB]'
            : 'h-[12%] gold-foil-gradient border-t border-[#F7E8C6]/60 text-[#1E130D]'
        }`}
      >
        {!backgroundOnly && (
          <span className={`font-sans font-bold tracking-[0.1em] uppercase ${compact ? 'text-[4.8px]' : 'text-[7px]'}`}>
            JAWA TIMUR · INDONESIA
          </span>
        )}
      </div>
    </div>
  );
}

export function BackPanel({ config, compact = false, backgroundOnly = false }: PanelProps) {
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const isDoypack = config.pouchShape === 'doypack-valve';
  const tall = isTallGusset(config.pouchShape);
  const isCopper = config.pouchShape === 'tall-copper';
  const isBotanical = config.pouchShape === 'tall-botanical';
  const isUploadedFinal = config.artworkSource === 'uploaded-final';
  const { batchCode, expiryLabel } = getWibBatchAndExpiry(12);

  const isHeritage = config.pouchShape === 'tall-heritage';
  const hasRearTextOverride = config.beanVariant !== 'robusta-100' || config.roastLevel !== 'traditional';

  if (isUploadedFinal && !backgroundOnly) {
    if (tall) {
      return (
        <div
          className="relative w-full h-full overflow-hidden select-none text-[#FAF5EB] bg-[#1A0F0A] flex flex-col justify-between"
          style={{ containerType: 'inline-size' }}
        >
          {/* Base Espresso Matte + Top Mountain Silhouette */}
          <div className="absolute inset-0 pouch-matte-surface" />
          <div
            className="absolute inset-x-0 top-0 h-[42%] overflow-hidden pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.18) 65%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.18) 65%, rgba(0,0,0,0) 100%)',
            }}
          >
            <img
              src={config.naturalMood === 'cherries-beans' ? GENERATED_ASSETS.coffeeCherries : GENERATED_ASSETS.kawiMist}
              alt=""
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-50 sepia-[0.3] brightness-75 contrast-110"
            />
          </div>

          {config.naturalMood === 'espresso-matte' && (
            <div
              className="absolute inset-x-0 top-0 h-[55%] pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(22,12,8,0.8) 0%, rgba(28,16,11,0.5) 55%, rgba(28,16,11,0) 100%)',
              }}
            />
          )}

          {isHeritage && (
            <div className="absolute inset-[3.5%] border border-[#D8B474]/50 pointer-events-none z-10" />
          )}

          {isBotanical && (
            <>
              <BotanicalCornerArt className="absolute -top-1 -left-1 w-[22cqi] h-[22cqi] opacity-80 pointer-events-none" />
              <BotanicalCornerArt className="absolute -top-1 -right-1 w-[22cqi] h-[22cqi] -scale-x-100 opacity-80 pointer-events-none" />
            </>
          )}

          {isCopper && (
            <div className="absolute inset-y-0 left-[6.5%] w-[1.5px] gold-foil-gradient opacity-85 pointer-events-none z-10" />
          )}

          {/* Top Roast Crest + Arunika Kawi Coffee Story */}
          <div
            className={`relative z-10 flex-1 flex flex-col justify-between pt-[13%] pb-[5%] ${
              isCopper ? 'pl-[11%] pr-[7%]' : 'px-[7.5%]'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-[34cqi]">
                <RoastProfileCrest topText={roast.crestTop} bottomText={roast.crestBottom} className="w-full h-auto" />
              </div>

              <h3
                className="mt-[4%] font-sans font-bold text-[#D8B474] tracking-[0.02em]"
                style={{ fontSize: '6.6cqi' }}
              >
                Arunika Kawi Coffee
              </h3>

              <p
                className="mt-[5%] text-[#F4ECE0] leading-[1.35]"
                style={{ fontSize: '3.6cqi' }}
              >
                Diolah secara tradisional (<em>Goreng Kreweng</em>) oleh Kelompok Tani Hutan, dipetik langsung dari
                lereng Gunung Kawi. Setiap seduhannya menghadirkan karakter{' '}
                <span className="font-semibold text-[#D8B474]">{variant.storyCharacter}</span>{' '}
                {roast.storyRoast}{' '}
                <span className="font-semibold text-[#D8B474]">Arunika Kawi Coffee</span>{' '}
                <span className="font-semibold">harum dan nikmat</span>
              </p>

              <p
                className="mt-[7%] font-sans font-semibold tracking-[0.03em] uppercase text-[#FAF5EB]"
                style={{ fontSize: '3.3cqi' }}
              >
                KOMPOSISI {variant.frontLabel.toUpperCase()}
              </p>
            </div>

            {/* Bottom Legal Block: Green Seal, KUPS Himatarian Blitar, PIRT, Kode Produksi & Expiry */}
            <div className="flex items-end justify-between gap-[3%] pt-[4%]">
              <div className="flex items-start gap-[2.5cqi] min-w-0 flex-[1.25]">
                {config.sealPlacement === 'back' && (
                  <KthEastJavaSeal variant="original-green" className="w-[12cqi] h-[12cqi] shrink-0 mt-[1cqi]" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#D8B474] leading-[1.15]" style={{ fontSize: '3.3cqi' }}>
                    Diproduksi Oleh
                  </p>
                  <p className="text-[#FAF5EB] leading-[1.2] mt-[1cqi]" style={{ fontSize: '2.7cqi' }}>
                    KUPS Himatarian Blitar
                    <br />
                    Jawa Timur – INDONESIA
                  </p>
                  <p className="text-[#FAF5EB] font-medium leading-[1.1] mt-[1.5cqi]" style={{ fontSize: '2.6cqi' }}>
                    PIRT
                  </p>
                  <div className="mt-[1cqi] w-full h-[3.2cqi] bg-white rounded-[1px]" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[#FAF5EB] font-medium leading-[1.1]" style={{ fontSize: '2.6cqi' }}>
                  Kode Produksi
                </p>
                <div className="mt-[1cqi] w-full h-[3cqi] bg-white rounded-[1px]" />
                <p className="text-[#FAF5EB] font-medium leading-[1.1] mt-[2.2cqi]" style={{ fontSize: '2.5cqi' }}>
                  Baik Digunakan Sebelum
                </p>
                <div className="mt-[1cqi] w-full h-[3cqi] bg-white rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Solid Bottom Band: NO Net Weight on Rear */}
          <div
            className={`relative z-10 w-full h-[11%] flex items-center justify-center ${
              isCopper
                ? 'bg-[#1B100B] border-t border-[#E6B89A]/55 text-[#FAF5EB]'
                : 'gold-foil-gradient border-t border-[#F7E8C6]/60 text-[#1E130D]'
            }`}
          >
            <span className="font-sans font-bold tracking-[0.05em] uppercase whitespace-nowrap" style={{ fontSize: '4.1cqi' }}>
              100 % KOPI ASLI INDONESIA
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full overflow-hidden select-none text-[#FAF5EB] bg-[#1A0F0A]">
        <img
          src={ORIGINAL_UPLOADS.revisedRear}
          alt="Desain Halaman Belakang Arunika Kawi"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-fill object-center"
        />

        {config.naturalMood === 'espresso-matte' && (
          <div
            className="absolute inset-x-0 top-0 h-[55%] pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(22,12,8,0.75) 0%, rgba(28,16,11,0.48) 55%, rgba(28,16,11,0) 100%)',
            }}
          />
        )}

        {/* Dynamic Roast & Bean Variant Override on Rear when changed from default */}
        {hasRearTextOverride && (
          <div className="absolute inset-x-[7%] top-[24.2%] h-[34%] flex flex-col items-center justify-center text-center pointer-events-none px-3 z-10">
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(40,25,18,0.98) 0%, rgba(28,16,11,0.99) 50%, rgba(24,14,9,0.98) 100%)',
                maskImage:
                  'radial-gradient(ellipse 49% 47% at 50% 50%, rgba(0,0,0,1) 66%, rgba(0,0,0,0.88) 84%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 49% 47% at 50% 50%, rgba(0,0,0,1) 66%, rgba(0,0,0,0.88) 84%, rgba(0,0,0,0) 100%)',
              }}
            />
            <p className={`relative z-10 text-[#F4ECE0] leading-relaxed ${compact ? 'text-[6.2px]' : 'text-[10.5px]'}`}>
              Diolah secara tradisional (<em>Goreng Kreweng</em>) oleh Kelompok Tani Hutan, dipetik langsung dari
              lereng Gunung Kawi. Setiap seduhannya menghadirkan karakter{' '}
              <span className="font-semibold text-[#D8B474]">{variant.storyCharacter}</span>{' '}
              {roast.storyRoast}{' '}
              <span className="font-semibold text-[#D8B474]">Arunika Kawi Coffee</span>{' '}
              <span className="font-semibold">harum dan nikmat</span>
            </p>
            <p
              className={`relative z-10 mt-3 font-sans font-semibold tracking-[0.04em] uppercase text-[#FAF5EB] ${
                compact ? 'text-[5.5px]' : 'text-[9px]'
              }`}
            >
              KOMPOSISI {variant.frontLabel.toUpperCase()}
            </p>
          </div>
        )}

        {/* Hide green KTH seal on rear if toggled to front or hidden */}
        {config.sealPlacement !== 'back' && (
          <div
            className="absolute left-[5.5%] bottom-[13.5%] w-[15%] h-[13.5%] pointer-events-none z-10"
            style={{
              background: 'radial-gradient(circle, rgba(22,12,8,0.99) 62%, rgba(22,12,8,0.92) 82%, transparent 100%)',
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden select-none text-[#FAF5EB] flex flex-col justify-between">
      <NaturalArtworkLayers config={config} isBack />

      {backgroundOnly ? (
        <div className="flex-1" />
      ) : (
        <div
          className={`relative z-10 flex-1 flex flex-col justify-between ${
            compact ? 'pt-[11%] px-3.5 pb-2' : 'pt-[11%] px-6 pb-3.5'
          }`}
        >
        <div className="text-center">
          <p className={`font-sans uppercase tracking-[0.28em] text-[#D8B474] ${compact ? 'text-[5.5px]' : 'text-[8.5px]'}`}>
            WARISAN LERENG GUNUNG KAWI
          </p>
          <h3 className={`mt-1 font-serif font-semibold text-[#FAF5EB] ${compact ? 'text-[12px]' : 'text-[20px]'}`}>
            Cahaya Pagi dalam Setiap Seduhan
          </h3>
          <p
            className={`mt-1.5 text-[#E0D2C0]/90 leading-relaxed mx-auto max-w-[94%] ${
              compact ? 'text-[5.5px]' : 'text-[8.5px]'
            }`}
          >
            Diolah secara tradisional (Goreng Kreweng) oleh Kelompok Tani Hutan dari lereng Gunung Kawi (
            {variant.altitude}) untuk menjaga aroma khas kopi Robusta Jawa Timur yang harum dan nikmat.
          </p>
        </div>

        {isDoypack && (
          <div className="my-1 py-1.5 border-y border-[#C99C52]/25 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className={`text-[#D8B474] uppercase tracking-wider ${compact ? 'text-[5px]' : 'text-[7px]'}`}>
                Elevasi
              </p>
              <p className={`font-mono text-[#FAF5EB] tabular-nums ${compact ? 'text-[5.5px]' : 'text-[8px]'}`}>
                {variant.altitude}
              </p>
            </div>
            <div>
              <p className={`text-[#D8B474] uppercase tracking-wider ${compact ? 'text-[5px]' : 'text-[7px]'}`}>
                Proses
              </p>
              <p className={`text-[#FAF5EB] ${compact ? 'text-[5.5px]' : 'text-[8px]'}`}>
                {variant.process}
              </p>
            </div>
            <div>
              <p className={`text-[#D8B474] uppercase tracking-wider ${compact ? 'text-[5px]' : 'text-[7px]'}`}>
                Intensitas Body
              </p>
              <p className={`font-mono text-[#FAF5EB] tabular-nums ${compact ? 'text-[5.5px]' : 'text-[8px]'}`}>
                {roast.bodyScore} / 5 Bold
              </p>
            </div>
          </div>
        )}

        {!isDoypack && (
          <div className="h-px bg-gradient-to-r from-transparent via-[#C99C52]/45 to-transparent my-1.5" />
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className={`font-sans font-semibold uppercase tracking-[0.18em] text-[#D8B474] mb-1.5 ${compact ? 'text-[5px]' : 'text-[8px]'}`}>
              Saran Penyajian
            </p>
            <div className="space-y-1.5">
              <div className="flex items-start gap-1.5">
                <Coffee className={`${compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} text-[#D8B474] shrink-0 mt-0.5`} />
                <div>
                  <p className={`font-semibold text-[#FAF5EB] ${compact ? 'text-[5px]' : 'text-[8px]'}`}>Tubruk Klasik</p>
                  <p className={`text-[#CBBBA8] ${compact ? 'text-[4.5px]' : 'text-[7px]'}`}>12g kopi · 180ml · 92°C</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <Droplets className={`${compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} text-[#D8B474] shrink-0 mt-0.5`} />
                <div>
                  <p className={`font-semibold text-[#FAF5EB] ${compact ? 'text-[5px]' : 'text-[8px]'}`}>Pour Over / V60</p>
                  <p className={`text-[#CBBBA8] ${compact ? 'text-[4.5px]' : 'text-[7px]'}`}>15g kopi · 225ml · 90°C</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <Flame className={`${compact ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'} text-[#D8B474] shrink-0 mt-0.5`} />
                <div>
                  <p className={`font-semibold text-[#FAF5EB] ${compact ? 'text-[5px]' : 'text-[8px]'}`}>Espresso / Moka</p>
                  <p className={`text-[#CBBBA8] ${compact ? 'text-[4.5px]' : 'text-[7px]'}`}>18g halus · 36ml · 27 dtk</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className={`font-sans font-semibold uppercase tracking-[0.18em] text-[#D8B474] mb-1.5 ${compact ? 'text-[5px]' : 'text-[8px]'}`}>
              Catatan Rasa
            </p>
            <div className="space-y-1">
              {variant.notes.map((note) => (
                <div
                  key={note}
                  className={`border-b border-[#C99C52]/20 pb-0.5 text-[#F2E6D5] ${
                    compact ? 'text-[5px]' : 'text-[8px]'
                  }`}
                >
                  {note}
                </div>
              ))}
              <div className="pt-1">
                <p className={`text-[#CBBBA8] ${compact ? 'text-[4.5px]' : 'text-[7px]'}`}>
                  Komposisi: 100% Biji Kopi {variant.label} Pilihan.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-[#C99C52]/25 flex items-end justify-between gap-2">
          <div className="flex items-center gap-2">
            {config.sealPlacement === 'back' && (
              <KthEastJavaSeal
                variant="gold-heritage"
                className={compact ? 'w-8 h-8 shrink-0' : 'w-12 h-12 shrink-0'}
              />
            )}
            <div className="space-y-0.5">
              <p className={`font-semibold text-[#E9C98E] ${compact ? 'text-[5px]' : 'text-[7.5px]'}`}>
                Diproduksi oleh:
              </p>
              <p className={`text-[#E5D7C6] leading-tight ${compact ? 'text-[4.5px]' : 'text-[7px]'}`}>
                KUPS Himatarian Blitar
                <br />
                Jawa Timur — Indonesia
              </p>
              <p className={`font-mono text-[#B7A693] pt-0.5 tabular-nums ${compact ? 'text-[4px]' : 'text-[6.5px]'}`}>
                EXP: {expiryLabel} · BATCH {batchCode}
              </p>
            </div>
          </div>

          <Ean13Barcode className={compact ? 'w-14 h-6 shrink-0' : 'w-24 h-10 shrink-0'} />
        </div>
      </div>
      )}

      <div
        className={`relative z-10 w-full flex items-center justify-center ${
          isCopper
            ? 'h-[11%] bg-[#20120C] border-t border-[#E6B89A]/45 text-[#FAF5EB]'
            : 'h-[12%] gold-foil-gradient border-t border-[#F7E8C6]/60 text-[#1E130D]'
        } ${compact ? 'px-3' : 'px-5'}`}
      >
        {!backgroundOnly && (
          <span className={`font-sans font-bold tracking-[0.06em] uppercase ${compact ? 'text-[5.5px]' : 'text-[8.5px]'}`}>
            100 % KOPI ASLI INDONESIA
          </span>
        )}
      </div>
    </div>
  );
}

export function FullPrintDieline({
  config,
  backgroundOnly = false,
}: {
  config: PackagingConfig;
  backgroundOnly?: boolean;
}) {
  const showMarks = config.showPrintMarks && !backgroundOnly;
  const isDoypack = config.pouchShape === 'doypack-valve';
  const tall = isTallGusset(config.pouchShape);
  const weightSpecs = getWeightSpecs(config.pouchShape, config.netWeight);
  const variant = BEAN_VARIANTS[config.beanVariant];

  if (isDoypack) {
    return (
      <div className="w-full overflow-x-auto pb-2">
        <div className="min-w-[780px] max-w-[980px] mx-auto bg-[#160F0C] p-6 rounded-xl border border-[#C99C52]/25">
          {showMarks && (
            <div className="grid grid-cols-2 gap-6 mb-2 text-center font-mono text-[10px] text-[#7BD3EA] tabular-nums">
              <div>
                Panel Depan Doypack · {weightSpecs.frontDim} (+ {weightSpecs.sealWidth} Seal Samping · {config.netWeight})
              </div>
              <div>
                Panel Belakang Doypack · {weightSpecs.frontDim} (+ {weightSpecs.sealWidth} Seal Samping · {config.netWeight})
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div
              className={`relative aspect-[150/220] w-full overflow-hidden rounded-xl ${
                showMarks ? 'ring-1 ring-[#EC4899]/75' : ''
              }`}
            >
              <FrontPanel config={config} compact={false} backgroundOnly={backgroundOnly} />
              {showMarks && (
                <>
                  <div className="absolute inset-y-0 left-[4.5%] border-l border-dashed border-[#4ADE80]/60 pointer-events-none" />
                  <div className="absolute inset-y-0 right-[4.5%] border-r border-dashed border-[#4ADE80]/60 pointer-events-none" />
                  <div className="absolute inset-x-0 top-[11%] border-t border-dashed border-[#38BDF8]/75 pointer-events-none">
                    <span className="absolute left-3 -top-3.5 font-mono text-[9px] text-[#38BDF8] bg-[#160F0C]/85 px-1">
                      Zipper &amp; Tear Notch · 22 mm
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-[12%] border-t border-dashed border-[#FACC15]/75 pointer-events-none" />
                </>
              )}
            </div>

            <div
              className={`relative aspect-[150/220] w-full overflow-hidden rounded-xl ${
                showMarks ? 'ring-1 ring-[#EC4899]/75' : ''
              }`}
            >
              <BackPanel config={config} compact={false} backgroundOnly={backgroundOnly} />
              {showMarks && (
                <>
                  <div className="absolute inset-y-0 left-[4.5%] border-l border-dashed border-[#4ADE80]/60 pointer-events-none" />
                  <div className="absolute inset-y-0 right-[4.5%] border-r border-dashed border-[#4ADE80]/60 pointer-events-none" />
                  <div className="absolute inset-x-0 top-[11%] border-t border-dashed border-[#38BDF8]/75 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-[12%] border-t border-dashed border-[#FACC15]/75 pointer-events-none" />
                </>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div
              className={`h-12 w-full gold-foil-gradient rounded-md flex items-center justify-between px-6 text-[#1E130D] ${
                showMarks ? 'ring-1 ring-[#EC4899]/60' : ''
              }`}
            >
              {!backgroundOnly && (
                <>
                  <span className="font-mono text-[10px] font-semibold">
                    Lipatan Alas Bawah (Bottom W-Gusset · {weightSpecs.bottomFold})
                  </span>
                  <span className="font-sans text-xs font-bold tracking-[0.14em] uppercase tabular-nums">
                    ARUNIKA KAWI · {variant.frontLabel.toUpperCase()} · {config.netWeight}
                  </span>
                </>
              )}
            </div>
          </div>

          {showMarks && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] text-[#B9A795]">
              <div className="flex flex-wrap items-center gap-4">
                <span>Magenta: Garis Potong &amp; 3mm Bleed</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#38BDF8]">Cyan: Zipper &amp; Zona Katup Udara (Ø 22 mm)</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#4ADE80]">Hijau: Heat-Seal Samping ({weightSpecs.sealWidth})</span>
              </div>
              <span className="tabular-nums">
                Format Doypack ({config.netWeight}): {weightSpecs.dimensions}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-[860px] mx-auto bg-[#160F0C] p-6 rounded-xl border border-[#C99C52]/25">
        {showMarks && (
          <div
            className={`grid ${
              tall ? 'grid-cols-[65fr_100fr_65fr_100fr]' : 'grid-cols-[70fr_130fr_70fr_130fr]'
            } gap-0 mb-2 text-center font-mono text-[10px] text-[#7BD3EA] tabular-nums`}
          >
            <div>Gusset Kiri · {weightSpecs.gussetWmm} mm</div>
            <div>Panel Depan · {weightSpecs.frontWmm} mm ({config.netWeight})</div>
            <div>Gusset Kanan · {weightSpecs.gussetWmm} mm</div>
            <div>Panel Belakang · {weightSpecs.frontWmm} mm ({config.netWeight})</div>
          </div>
        )}

        <div className="relative">
          <div
            className={`relative grid ${
              tall
                ? 'grid-cols-[65fr_100fr_65fr_100fr] aspect-[330/240]'
                : 'grid-cols-[70fr_130fr_70fr_130fr] aspect-[400/210]'
            } w-full overflow-hidden ${showMarks ? 'ring-1 ring-[#EC4899]/70' : ''}`}
          >
            <div className="relative h-full">
              <SideGussetPanel config={config} side="left" compact backgroundOnly={backgroundOnly} />
            </div>
            <div className="relative h-full border-x border-[#D8B474]/20">
              <FrontPanel config={config} compact backgroundOnly={backgroundOnly} />
            </div>
            <div className="relative h-full">
              <SideGussetPanel config={config} side="right" compact backgroundOnly={backgroundOnly} />
            </div>
            <div className="relative h-full border-l border-[#D8B474]/20">
              <BackPanel config={config} compact backgroundOnly={backgroundOnly} />
            </div>

            {showMarks && (
              <>
                <div className="absolute inset-x-0 top-[8.5%] border-t border-dashed border-[#38BDF8]/75 pointer-events-none">
                  <span className="absolute left-2 -top-3.5 font-mono text-[9px] text-[#38BDF8] bg-[#160F0C]/85 px-1">
                    Zipper &amp; Tear Notch · 18 mm
                  </span>
                </div>
                <div className="absolute inset-[2.2%] border border-dashed border-[#22C55E]/55 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-[12%] border-t border-dashed border-[#FACC15]/70 pointer-events-none" />
              </>
            )}
          </div>
        </div>

        {showMarks && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] text-[#B9A795]">
            <div className="flex flex-wrap items-center gap-4">
              <span>Magenta: Trim &amp; 3mm Bleed</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#38BDF8]">Cyan: Zipper Seal (18 mm)</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#4ADE80]">Hijau: Safe Print Zone (5 mm)</span>
            </div>
            <span className="tabular-nums">
              Total Lebar Unwrap ({config.netWeight}): {weightSpecs.unwrapDim}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function InteractivePouch3D({
  config,
  backgroundOnly = false,
}: {
  config: PackagingConfig;
  backgroundOnly?: boolean;
}) {
  const isDoypack = config.pouchShape === 'doypack-valve';
  const tall = isTallGusset(config.pouchShape);
  const weightSpecs = getWeightSpecs(config.pouchShape, config.netWeight);

  if (isDoypack) {
    return (
      <div className="relative w-full py-10 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-[#1E1410] via-[#150E0B] to-[#0E0907] rounded-xl overflow-hidden border border-[#C99C52]/20">
        <div
          className="absolute top-6 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(214, 179, 115, 0.16) 0%, rgba(214, 179, 115, 0) 70%)',
          }}
        />

        <div
          className="relative w-[300px] sm:w-[320px] h-[445px] overflow-hidden shadow-[0_32px_60px_-14px_rgba(0,0,0,0.88)] origin-bottom transition-transform duration-200"
          style={{
            borderRadius: '14px 14px 28px 28px',
            transform: `scale(${weightSpecs.visualScale})`,
          }}
        >
          <FrontPanel config={config} showValveGraphic={!backgroundOnly} backgroundOnly={backgroundOnly} />
          <div className="absolute inset-y-0 left-0 w-[11px] bg-gradient-to-r from-white/10 via-black/35 to-transparent border-r border-white/10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-[11px] bg-gradient-to-l from-white/10 via-black/35 to-transparent border-l border-white/10 pointer-events-none" />
          <div className="absolute inset-x-0 top-[9.5%] h-[2px] bg-black/55 border-b border-white/15 pointer-events-none" />
          <div className="absolute inset-x-0 top-[11.2%] h-[3px] bg-black/45 border-b border-white/10 pointer-events-none" />
          <div className="absolute left-0 top-[6.8%] w-2 h-1 bg-[#0E0907] rounded-r-full pointer-events-none" />
          <div className="absolute right-0 top-[6.8%] w-2 h-1 bg-[#0E0907] rounded-l-full pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 62%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.12) 70%, rgba(0,0,0,0.34) 100%)',
            }}
          />
        </div>

        <div className="mt-2 w-[300px] sm:w-[340px] h-6 rounded-[100%] bg-gradient-to-b from-[#C7B8A3]/30 via-[#6E5C4A]/15 to-transparent blur-[1px] border-t border-[#EAE0D0]/20" />
      </div>
    );
  }

  return (
    <div className="relative w-full py-10 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-[#1E1410] via-[#150E0B] to-[#0E0907] rounded-xl overflow-hidden border border-[#C99C52]/20">
      <div
        className="absolute top-6 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(214, 179, 115, 0.16) 0%, rgba(214, 179, 115, 0) 70%)',
        }}
      />

      <div
        className="relative flex items-stretch justify-center origin-bottom transition-transform duration-200"
        style={{ perspective: '1200px', transform: `scale(${weightSpecs.visualScale})` }}
      >
        <div
          className={`hidden sm:block ${tall ? 'w-[62px] h-[465px]' : 'w-[72px] h-[440px]'} origin-right rounded-l-md overflow-hidden shadow-2xl`}
          style={{
            transform: 'rotateY(-46deg) translateX(4px) scaleY(0.985)',
            filter: 'brightness(0.76)',
          }}
        >
          <SideGussetPanel config={config} side="left" compact backgroundOnly={backgroundOnly} />
        </div>

        <div
          className={`relative ${
            tall ? 'w-[225px] sm:w-[245px] h-[465px]' : 'w-[290px] sm:w-[310px] h-[440px]'
          } rounded-md overflow-hidden shadow-[0_32px_60px_-14px_rgba(0,0,0,0.88)]`}
          style={{
            transform: 'rotateY(6deg)',
          }}
        >
          <FrontPanel config={config} compact={tall} backgroundOnly={backgroundOnly} />

          <div className="absolute inset-x-0 top-[7.5%] h-[2px] bg-black/55 border-b border-white/15 pointer-events-none" />
          <div className="absolute inset-x-0 top-[9.2%] h-[3px] bg-black/45 border-b border-white/10 pointer-events-none" />
          <div className="absolute left-0 top-[5.8%] w-1.5 h-1 bg-[#0E0907] rounded-r-full pointer-events-none" />
          <div className="absolute right-0 top-[5.8%] w-1.5 h-1 bg-[#0E0907] rounded-l-full pointer-events-none" />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(108deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 28%, rgba(0,0,0,0.16) 72%, rgba(255,255,255,0.05) 100%)',
            }}
          />
        </div>
      </div>

      <div className="mt-2 w-[310px] sm:w-[360px] h-7 rounded-[100%] bg-gradient-to-b from-[#C7B8A3]/35 via-[#6E5C4A]/20 to-transparent blur-[1px] border-t border-[#EAE0D0]/20" />
    </div>
  );
}
