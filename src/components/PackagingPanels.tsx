import React from 'react';
import { Mountain } from 'lucide-react';
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
  ArunikaKawiWordmark,
  ArunikaSunBeanCrest,
  BotanicalCornerArt,
  EcoRecyclingIcons,
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
  const sizeClass = compact ? 'w-[13cqi] h-[13cqi]' : 'w-[12.5cqi] h-[12.5cqi]';
  if (isPrintGuide) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div
          className={`${sizeClass} rounded-full border border-dashed border-[#38BDF8] bg-[#160F0C]/65 flex items-center justify-center`}
        >
          <div className="w-[24%] h-[24%] rounded-full bg-[#38BDF8]/80" />
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
  const isMinimal = config.pouchShape === 'tall-minimal';

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 pouch-matte-surface" />

      {config.naturalMood === 'kawi-beans' && (
        <div
          className="absolute inset-x-0 top-0 h-[56%] overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.22) 58%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.22) 58%, rgba(0,0,0,0) 100%)',
          }}
        >
          <img
            src={GENERATED_ASSETS.kawiMist}
            alt="Lanskap fajar Gunung Kawi"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-55 sepia-[0.34] contrast-110 brightness-75"
          />
        </div>
      )}

      {config.naturalMood === 'cherries-beans' && (
        <div
          className={`absolute ${
            isBack ? 'top-0 right-0 w-[85%] h-[42%]' : 'top-[28%] -left-[6%] w-[92%] h-[46%]'
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
            className="w-full h-full object-cover opacity-52 brightness-75 contrast-115"
          />
        </div>
      )}

      {!isBack && (
        <div
          className={`absolute inset-x-0 ${
            isCopper ? 'bottom-[11.2%] h-[32%] opacity-82' : 'bottom-[11.2%] h-[36%]'
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F0A]/70 via-transparent to-[#140B07]/35" />
        </div>
      )}

      {isBotanical && !isBack && (
        <>
          <BotanicalCornerArt className="absolute -top-[0.5%] -left-[0.5%] z-[5] w-[38cqi] h-[48.55cqi] opacity-[0.92]" />
          <BotanicalCornerArt className="absolute -top-[0.5%] -right-[0.5%] z-[5] w-[38cqi] h-[48.55cqi] -scale-x-100 opacity-[0.92]" />
          <BotanicalCornerArt className="absolute bottom-[11.2%] -left-[0.5%] z-[5] w-[38cqi] h-[48.55cqi] -scale-y-100 opacity-[0.86]" />
          <BotanicalCornerArt className="absolute bottom-[11.2%] -right-[0.5%] z-[5] w-[38cqi] h-[48.55cqi] scale-[-1] opacity-[0.86]" />
        </>
      )}

      {(config.pouchShape === 'box-gusset' || config.pouchShape === 'doypack-valve') && !isBack && (
        <>
          <BotanicalCornerArt className="absolute -top-[0.4%] -left-[0.4%] z-[5] w-[21cqi] h-[26.83cqi] opacity-[0.9]" />
          <BotanicalCornerArt className="absolute -top-[0.4%] -right-[0.4%] z-[5] w-[21cqi] h-[26.83cqi] -scale-x-100 opacity-[0.9]" />
        </>
      )}

      {isCopper && !isBack && (
        <>
          <div
            className="absolute inset-x-0 bottom-[11.2%] z-[4] h-[32%]"
            style={{
              background: 'linear-gradient(135deg, #9C4F2B 0%, #B86339 55%, #78391D 100%)',
              clipPath: 'polygon(26% 100%, 100% 18%, 100% 100%)',
              opacity: 0.94,
            }}
          />
          <div className="absolute inset-y-0 left-[6.8%] z-[5] w-[1.5px] gold-foil-gradient opacity-90" />
        </>
      )}

      {isMinimal && (
        <div className="absolute inset-x-0 bottom-[12.1%] z-[5] h-px bg-[#D8B474]/65" />
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 34%, rgba(214, 179, 115, 0.08) 0%, rgba(16, 9, 6, 0.36) 78%, rgba(12, 7, 4, 0.65) 100%)',
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
  const isMinimal = config.pouchShape === 'tall-minimal';

  const isUploadedFinal = config.artworkSource === 'uploaded-final';
  const matchesExactUploadedMaster =
    isUploadedFinal &&
    !backgroundOnly &&
    !tall &&
    config.netWeight === '100 gram' &&
    config.beanVariant === 'robusta-100' &&
    config.roastLevel === 'traditional' &&
    config.sealPlacement === 'back' &&
    config.naturalMood === 'kawi-beans';

  const uploadedFrontSrc = ORIGINAL_UPLOADS.revisedFront100;

  if (matchesExactUploadedMaster) {
    return (
      <div
        className="relative w-full h-full overflow-hidden select-none text-[#FAF5EB] bg-[#1A0F0A]"
        style={{ containerType: 'inline-size' }}
      >
        <img
          src={uploadedFrontSrc}
          alt={`Desain Halaman Depan Arunika Kawi (${config.netWeight})`}
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-fill object-center"
        />

        {isDoypack && (showValveGraphic || config.showPrintMarks) && (
          <div className="absolute top-[27.4%] left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            {showValveGraphic ? (
              <div className="w-[8.5cqi] h-[8.5cqi] rounded-full bg-gradient-to-br from-[#2B1D16] via-[#1C110C] to-[#110906] border border-[#5A4232]/75 shadow-[inset_0_1px_3px_rgba(255,255,255,0.14),0_2px_5px_rgba(0,0,0,0.65)] flex items-center justify-center">
                <div className="w-[70%] h-[70%] rounded-full border border-[#0E0704]/80" />
              </div>
            ) : (
              <div className="w-[8.5cqi] h-[8.5cqi] rounded-full border border-dashed border-[#38BDF8] bg-[#160F0C]/65 flex items-center justify-center">
                <div className="w-[24%] h-[24%] rounded-full bg-[#38BDF8]/80" />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none text-[#FAF5EB] bg-[#1A0F0A] flex flex-col justify-between"
      style={{ containerType: 'inline-size' }}
    >
      <NaturalArtworkLayers config={config} />

      {isHeritage && (
        <div className="absolute inset-x-[3.5%] top-[3.5%] bottom-[11.2%] border border-b-0 border-[#D8B474]/55 pointer-events-none z-10" />
      )}

      {backgroundOnly ? (
        <div className="flex-1" />
      ) : (
        <>
          {isDoypack ? (
            <div className="relative z-10 pt-[12%] px-[9%] flex flex-col items-center text-center">
              <ArunikaSunBeanCrest className="w-[14cqi] h-[14cqi]" />
              <p
                className="mt-[2.5%] font-sans font-bold uppercase tracking-[0.14em] text-[#D8B474] whitespace-nowrap"
                style={{ fontSize: '4.8cqi' }}
              >
                COFFE BEAN
              </p>
              <div className="mt-[1.2%] flex items-center justify-center gap-[4%] w-[56%]">
                <span className="h-px flex-1 bg-[#FAF5EB]/55" />
                <span
                  className="font-sans font-medium uppercase tracking-[0.14em] text-[#FAF5EB] whitespace-nowrap"
                  style={{ fontSize: '3.2cqi' }}
                >
                  EST 2024
                </span>
                <span className="h-px flex-1 bg-[#FAF5EB]/55" />
              </div>

              <div className="my-[2.5%] flex items-center justify-center">
                {showValveGraphic ? (
                  <DegassingValveVisual compact={compact} />
                ) : config.showPrintMarks ? (
                  <DegassingValveVisual compact={compact} isPrintGuide />
                ) : (
                  <div className="h-[10cqi]" />
                )}
              </div>

              <ArunikaKawiWordmark className="w-[58cqi] h-auto shrink-0" />

              <p
                className="mt-[5%] font-sans font-semibold text-[#FAF5EB] leading-[1.18]"
                style={{ fontSize: '4.4cqi' }}
              >
                {roast.subtitle}
              </p>
              <p
                className="mt-[1.5%] font-sans font-semibold text-[#FAF5EB] leading-[1.18]"
                style={{ fontSize: '4.4cqi' }}
              >
                {variant.frontLabel}
              </p>
            </div>
          ) : isHeritage ? (
            <div className="relative z-10 pt-[11%] px-[8%] flex flex-col items-center text-center">
              <ArunikaSunBeanCrest className="w-[15cqi] h-[15cqi]" />
              <p
                className="mt-[3%] font-sans font-bold uppercase tracking-[0.12em] text-[#D8B474] whitespace-nowrap"
                style={{ fontSize: '5.6cqi' }}
              >
                COFFE BEAN
              </p>
              <div className="mt-[1.4%] flex items-center justify-center gap-[5%] w-[62%]">
                <span className="h-px flex-1 bg-[#FAF5EB]/55" />
                <span
                  className="font-sans font-medium uppercase tracking-[0.14em] text-[#FAF5EB] whitespace-nowrap"
                  style={{ fontSize: '3.7cqi' }}
                >
                  EST 2024
                </span>
                <span className="h-px flex-1 bg-[#FAF5EB]/55" />
              </div>

              <ArunikaKawiWordmark className="mt-[6.5%] w-[62cqi] h-auto shrink-0" />

              <p
                className="mt-[6%] font-sans font-semibold text-[#FAF5EB] leading-[1.2]"
                style={{ fontSize: '4.9cqi' }}
              >
                {roast.subtitle}
              </p>
              <div className="mt-[4%]">
                <MandalaHeritageCrest label={variant.frontLabel} compact={compact} className="w-[34cqi] h-[34cqi]" />
              </div>
            </div>
          ) : isBotanical || isCopper || isMinimal || tall ? (
            <div
              className={`relative z-10 flex flex-col items-center text-center ${
                isBotanical ? 'pt-[17%] px-[8%]' : isCopper ? 'pt-[13.5%] pl-[11%] pr-[7%]' : 'pt-[13.5%] px-[8%]'
              }`}
            >
              <ArunikaSunBeanCrest className={isBotanical ? 'w-[14cqi] h-[14cqi]' : 'w-[15.5cqi] h-[15.5cqi]'} />
              <p
                className="mt-[3%] font-sans font-bold uppercase tracking-[0.12em] text-[#D8B474] whitespace-nowrap"
                style={{ fontSize: isBotanical ? '5.2cqi' : '6cqi' }}
              >
                COFFE BEAN
              </p>
              <div
                className={`mt-[1.4%] flex items-center justify-center gap-[5%] ${
                  isBotanical ? 'w-[48%]' : 'w-[62%]'
                }`}
              >
                <span className="h-px flex-1 bg-[#FAF5EB]/55" />
                <span
                  className="font-sans font-medium uppercase tracking-[0.14em] text-[#FAF5EB] whitespace-nowrap"
                  style={{ fontSize: isBotanical ? '3.5cqi' : '3.9cqi' }}
                >
                  EST 2024
                </span>
                <span className="h-px flex-1 bg-[#FAF5EB]/55" />
              </div>

              <ArunikaKawiWordmark
                className={`${isBotanical ? 'mt-[6%] w-[64cqi]' : 'mt-[6.5%] w-[66cqi]'} h-auto shrink-0`}
              />

              <p
                className="mt-[5.5%] font-sans font-semibold text-[#FAF5EB] leading-[1.2] tracking-[0.01em]"
                style={{ fontSize: '5cqi' }}
              >
                {roast.subtitle}
              </p>
              <p
                className="mt-[1.8%] font-sans font-semibold text-[#FAF5EB] leading-[1.2]"
                style={{ fontSize: '5cqi' }}
              >
                {variant.frontLabel}
              </p>
            </div>
          ) : (
            <div className="relative z-10 pt-[11%] px-[8%] flex flex-col items-center text-center">
              <ArunikaSunBeanCrest className="w-[14.5cqi] h-[14.5cqi]" />
              <p
                className="mt-[3%] font-sans font-bold uppercase tracking-[0.14em] text-[#D8B474] whitespace-nowrap"
                style={{ fontSize: '5cqi' }}
              >
                COFFE BEAN
              </p>
              <div className="mt-[1.4%] flex items-center justify-center gap-[4%] w-[56%]">
                <span className="h-px flex-1 bg-[#FAF5EB]/55" />
                <span
                  className="font-sans font-medium uppercase tracking-[0.14em] text-[#FAF5EB] whitespace-nowrap"
                  style={{ fontSize: '3.4cqi' }}
                >
                  EST 2024
                </span>
                <span className="h-px flex-1 bg-[#FAF5EB]/55" />
              </div>

              <ArunikaKawiWordmark className="mt-[7%] w-[62cqi] h-auto shrink-0" />

              <p
                className="mt-[7%] font-sans font-semibold text-[#FAF5EB] leading-[1.2]"
                style={{ fontSize: '4.6cqi' }}
              >
                {roast.subtitle}
              </p>
              <p
                className="mt-[1.8%] font-sans font-semibold text-[#FAF5EB] leading-[1.2]"
                style={{ fontSize: '4.6cqi' }}
              >
                {variant.frontLabel}
              </p>
            </div>
          )}

          {config.sealPlacement === 'front' && (
            <div className="relative z-10 flex justify-end px-[7%] pb-[3%]">
              <KthEastJavaSeal variant="original-green" className="w-[17cqi] h-[17cqi] drop-shadow-md" />
            </div>
          )}
        </>
      )}

      {isCopper ? (
        <div className="relative z-10 w-full h-[11.2%] bg-[#1B100B] border-t border-[#E6B89A]/65 flex items-center justify-center text-[#FAF5EB] px-[5%]">
          {!backgroundOnly && (
            <span className="font-sans font-bold tabular-nums whitespace-nowrap" style={{ fontSize: '5cqi' }}>
              Isi Bersih : {config.netWeight}
            </span>
          )}
        </div>
      ) : (
        <div className="relative z-10 w-full h-[11.2%] gold-foil-gradient border-t border-[#F7E8C6]/60 flex items-center justify-center text-[#1E130D] px-[5%]">
          {!backgroundOnly && (
            <span className="font-sans font-bold tabular-nums whitespace-nowrap" style={{ fontSize: '5cqi' }}>
              Isi Bersih : {config.netWeight}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function SideGussetPanel({
  config,
  side,
  backgroundOnly = false,
}: PanelProps & { side: 'left' | 'right' }) {
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const isCopper = config.pouchShape === 'tall-copper';
  const isHeritage = config.pouchShape === 'tall-heritage';
  const isBotanical = config.pouchShape === 'tall-botanical';
  const isMinimal = config.pouchShape === 'tall-minimal';

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none flex flex-col justify-between border-x border-[#C99C52]/15 ${
        isHeritage ? 'text-[#1E130D]' : 'text-[#FAF5EB]'
      }`}
      style={{
        containerType: 'inline-size',
        background: isHeritage
          ? 'linear-gradient(90deg, #A88446 0%, #DFC389 48%, #8F6D36 52%, #C9A96A 100%)'
          : undefined,
      }}
    >
      {!isHeritage && <div className="absolute inset-0 pouch-matte-surface" />}

      {isBotanical && (
        <BotanicalCornerArt
          className={`absolute bottom-[11.2%] z-[5] w-[58cqi] h-[74.1cqi] opacity-[0.82] pointer-events-none ${
            side === 'left' ? '-right-[3%] scale-[-1]' : '-left-[3%] -scale-y-100'
          }`}
        />
      )}

      {isMinimal && <div className="absolute inset-x-0 bottom-[12.1%] z-[5] h-px bg-[#D8B474]/65" />}

      {!backgroundOnly ? (
        <>
          <div
            className={`absolute inset-y-0 left-1/2 -translate-x-px w-px border-l border-dashed pointer-events-none ${
              isHeritage ? 'border-[#1E130D]/20' : 'border-[#D8B474]/20'
            }`}
          />

          <div className="relative z-10 flex flex-col items-center text-center pt-[14%] px-[8%]">
            <Mountain className={`w-[15cqi] h-[15cqi] ${isHeritage ? 'text-[#2D1C12]' : 'text-[#D8B474]'}`} />
            <p
              className={`mt-[4%] font-sans font-bold uppercase tracking-[0.16em] ${
                isHeritage ? 'text-[#2D1C12]' : 'text-[#D8B474]'
              }`}
              style={{ fontSize: '9cqi' }}
            >
              {side === 'left' ? 'ORIGIN' : 'TASTING'}
            </p>

            {side === 'left' ? (
              <div className="mt-[10%] space-y-[10%] w-full">
                <div>
                  <p
                    className={`uppercase tracking-wider ${isHeritage ? 'text-[#4B321C]' : 'text-[#B9A795]'}`}
                    style={{ fontSize: '7.5cqi' }}
                  >
                    Elevasi
                  </p>
                  <p
                    className={`font-mono tabular-nums font-semibold ${
                      isHeritage ? 'text-[#1E130D]' : 'text-[#F5ECD9]'
                    }`}
                    style={{ fontSize: '8.5cqi' }}
                  >
                    {variant.altitude}
                  </p>
                </div>
                <div className={`h-px mx-[8%] ${isHeritage ? 'bg-[#1E130D]/20' : 'bg-[#C99C52]/25'}`} />
                <div>
                  <p
                    className={`uppercase tracking-wider ${isHeritage ? 'text-[#4B321C]' : 'text-[#B9A795]'}`}
                    style={{ fontSize: '7.5cqi' }}
                  >
                    Proses
                  </p>
                  <p
                    className={`leading-snug font-medium ${isHeritage ? 'text-[#1E130D]' : 'text-[#F5ECD9]'}`}
                    style={{ fontSize: '8cqi' }}
                  >
                    {variant.process}
                  </p>
                </div>
                <div className={`h-px mx-[8%] ${isHeritage ? 'bg-[#1E130D]/20' : 'bg-[#C99C52]/25'}`} />
                <div>
                  <p
                    className={`uppercase tracking-wider ${isHeritage ? 'text-[#4B321C]' : 'text-[#B9A795]'}`}
                    style={{ fontSize: '7.5cqi' }}
                  >
                    Panen
                  </p>
                  <p
                    className={`leading-snug font-medium ${isHeritage ? 'text-[#1E130D]' : 'text-[#F5ECD9]'}`}
                    style={{ fontSize: '8cqi' }}
                  >
                    Petik Merah Selektif
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-[10%] space-y-[12%] w-full">
                {[
                  { label: 'Body', score: roast.bodyScore },
                  { label: 'Aroma', score: roast.aromaScore },
                  { label: 'Boldness', score: roast.bitternessScore },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-[3cqi]">
                    <span
                      className={`uppercase tracking-wider font-medium ${
                        isHeritage ? 'text-[#3A2516]' : 'text-[#D6C5B2]'
                      }`}
                      style={{ fontSize: '7.5cqi' }}
                    >
                      {item.label}
                    </span>
                    <div className="flex items-center gap-[3cqi]">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className={`w-[5.5cqi] h-[5.5cqi] rounded-full ${
                            isHeritage
                              ? n <= item.score
                                ? 'bg-[#1E130D]'
                                : 'bg-[#1E130D]/20'
                              : n <= item.score
                                ? 'bg-[#D8B474]'
                                : 'bg-[#D8B474]/20'
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
              className={`font-serif tracking-[0.28em] uppercase whitespace-nowrap -rotate-90 font-semibold ${
                isHeritage ? 'text-[#1E130D]/75' : 'text-[#E4C58A]/70'
              }`}
              style={{ fontSize: '12cqi' }}
            >
              ARUNIKA KAWI
            </span>
          </div>
        </>
      ) : (
        <div className="flex-1" />
      )}

      <div
        className={`relative z-10 w-full h-[11.2%] flex items-center justify-center ${
          isCopper
            ? 'bg-[#1B100B] border-t border-[#E6B89A]/65 text-[#FAF5EB]'
            : 'gold-foil-gradient border-t border-[#F7E8C6]/60 text-[#1E130D]'
        }`}
      >
        {!backgroundOnly && (
          <span
            className="font-sans font-bold tracking-[0.06em] uppercase whitespace-nowrap"
            style={{ fontSize: '6.4cqi' }}
          >
            JAWA TIMUR · ID
          </span>
        )}
      </div>
    </div>
  );
}

export function BackPanel({ config, backgroundOnly = false }: PanelProps) {
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const tall = isTallGusset(config.pouchShape);
  const isCopper = config.pouchShape === 'tall-copper';
  const isMinimal = config.pouchShape === 'tall-minimal';
  const isUploadedFinal = config.artworkSource === 'uploaded-final';
  const { batchCode, expiryLabel } = getWibBatchAndExpiry(12);

  const matchesExactUploadedMaster =
    isUploadedFinal &&
    !backgroundOnly &&
    !tall &&
    config.beanVariant === 'robusta-100' &&
    config.roastLevel === 'traditional' &&
    config.sealPlacement === 'back' &&
    config.naturalMood === 'kawi-beans';

  if (matchesExactUploadedMaster) {
    return (
      <div className="relative w-full h-full overflow-hidden select-none text-[#FAF5EB] bg-[#1A0F0A]">
        <img
          src={ORIGINAL_UPLOADS.revisedRear}
          alt="Desain Halaman Belakang Arunika Kawi"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-fill object-center"
        />
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none text-[#FAF5EB] bg-[#1A0F0A] flex flex-col justify-between"
      style={{ containerType: 'inline-size' }}
    >
      <div className="absolute inset-0 pouch-matte-surface" />
      <div
        className="absolute inset-x-0 top-0 h-[44%] overflow-hidden pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.18) 65%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.18) 65%, rgba(0,0,0,0) 100%)',
        }}
      >
        {config.naturalMood !== 'espresso-matte' && (
          <img
            src={config.naturalMood === 'cherries-beans' ? GENERATED_ASSETS.coffeeCherries : GENERATED_ASSETS.kawiMist}
            alt=""
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-50 sepia-[0.3] brightness-75 contrast-110"
          />
        )}
      </div>

      {isMinimal && (
        <div className="absolute inset-x-0 bottom-[12.1%] z-[5] h-px bg-[#D8B474]/65 pointer-events-none" />
      )}

      {backgroundOnly ? (
        <div className="flex-1" />
      ) : (
        <div className="relative z-10 flex-1 flex flex-col justify-between pt-[13.5%] pb-[4%] px-[6.5%]">
          <div className="flex flex-col items-center text-center">
            <div className="w-[29cqi]">
              <RoastProfileCrest topText={roast.crestTop} bottomText={roast.crestBottom} className="w-full h-auto" />
            </div>

            <h3
              className="mt-[3%] font-sans font-bold text-[#D8B474] tracking-[0.015em]"
              style={{ fontSize: '5.8cqi' }}
            >
              Arunika Kawi Coffee
            </h3>

            <p className="mt-[4%] text-[#F4ECE0] leading-[1.34]" style={{ fontSize: '3.55cqi' }}>
              Diolah secara tradisional (<em>Goreng Kreweng</em>) oleh Kelompok Tani Hutan, dipetik langsung dari lereng
              Gunung Kawi. Setiap seduhannya menghadirkan karakter{' '}
              <span className="font-semibold text-[#D8B474]">{variant.storyCharacter}</span> {roast.storyRoast}
            </p>

            <p
              className="mt-[5.5%] font-sans font-bold tracking-[0.02em] uppercase text-[#FAF5EB]"
              style={{ fontSize: '3.4cqi' }}
            >
              KOMPOSISI {config.beanVariant === 'robusta-100' ? '100 % BIJI KOPI ROBUSTA' : variant.frontLabel.toUpperCase()}
            </p>
          </div>

          {config.sealPlacement === 'back' && (
            <div className="flex items-center justify-center my-auto py-[2%]">
              <KthEastJavaSeal variant="original-green" className="w-[14cqi] h-[14cqi] drop-shadow-md" />
            </div>
          )}

          <div className="flex items-end justify-between gap-[4%] pt-[2%]">
            <div className="min-w-0 flex-[1.25] flex flex-col justify-between">
              <div>
                <p className="font-semibold text-[#D8B474] leading-[1.15]" style={{ fontSize: '3.1cqi' }}>
                  Diproduksi Oleh
                </p>
                <p className="text-[#FAF5EB] leading-[1.2] mt-[1cqi]" style={{ fontSize: '2.7cqi' }}>
                  KUPS Himatarian Blitar
                  <br />
                  Jawa Timur – INDONESIA
                  <br />
                  66186
                </p>
              </div>
              <div className="mt-[2.8cqi]">
                <EcoRecyclingIcons className="h-[5.4cqi] w-auto" />
              </div>
            </div>

            <div className="w-[38%] shrink-0">
              <p className="text-[#FAF5EB] font-medium leading-[1.1]" style={{ fontSize: '2.5cqi' }}>
                Kode Produksi
              </p>
              <div className="mt-[0.8cqi] w-full h-[3.2cqi] bg-white rounded-[3px]" title={batchCode} />
              <p className="text-[#FAF5EB] font-medium leading-[1.1] mt-[1.5cqi]" style={{ fontSize: '2.35cqi' }}>
                Baik Digunakan Sebelum
              </p>
              <div className="mt-[0.8cqi] w-full h-[3.2cqi] bg-white rounded-[3px]" title={expiryLabel} />
              <p className="text-[#FAF5EB] font-medium leading-[1.1] mt-[1.5cqi]" style={{ fontSize: '2.45cqi' }}>
                PIRT
              </p>
              <div className="mt-[0.8cqi] w-full h-[3.2cqi] bg-white rounded-[3px]" />
            </div>
          </div>
        </div>
      )}

      <div
        className={`relative z-10 w-full h-[11.2%] flex items-center justify-center ${
          isCopper
            ? 'bg-[#1B100B] border-t border-[#E6B89A]/65 text-[#FAF5EB]'
            : 'gold-foil-gradient border-t border-[#F7E8C6]/60 text-[#1E130D]'
        }`}
      >
        {!backgroundOnly && (
          <span
            className="font-sans font-bold tracking-[0.05em] uppercase whitespace-nowrap"
            style={{ fontSize: '4cqi' }}
          >
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
  const isCopper = config.pouchShape === 'tall-copper';
  const isHeritage = config.pouchShape === 'tall-heritage';
  const isBotanical = config.pouchShape === 'tall-botanical';
  const isMinimal = config.pouchShape === 'tall-minimal';
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

        {/* Contoured Stand-Up Doypack Silhouette (top corners, tear notches, slightly tapered sides, curved bottom arch) */}
        <div
          className="relative w-[300px] sm:w-[325px] h-[455px] overflow-hidden shadow-[0_32px_60px_-14px_rgba(0,0,0,0.88)] origin-bottom transition-transform duration-200"
          style={{
            clipPath:
              'polygon(1.5% 0.4%, 98.5% 0.4%, 99.6% 2%, 99.6% 6.3%, 98.4% 6.9%, 99.4% 7.6%, 96.6% 93.5%, 94.2% 96.8%, 84% 98.8%, 68% 99.7%, 50% 100%, 32% 99.7%, 16% 98.8%, 5.8% 96.8%, 3.4% 93.5%, 0.6% 7.6%, 1.6% 6.9%, 0.4% 6.3%, 0.4% 2%)',
            transform: `scale(${weightSpecs.visualScale})`,
          }}
        >
          <FrontPanel config={config} showValveGraphic={!backgroundOnly} backgroundOnly={backgroundOnly} />
          <div className="absolute inset-y-0 left-0 w-[12px] bg-gradient-to-r from-white/12 via-black/35 to-transparent border-r border-white/10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-[12px] bg-gradient-to-l from-white/12 via-black/35 to-transparent border-l border-white/10 pointer-events-none" />
          <div className="absolute inset-x-0 top-[9.5%] h-[2px] bg-black/55 border-b border-white/15 pointer-events-none" />
          <div className="absolute inset-x-0 top-[11.2%] h-[3px] bg-black/45 border-b border-white/10 pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 58%, rgba(255,248,234,0.08) 0%, rgba(0,0,0,0.10) 68%, rgba(0,0,0,0.34) 100%)',
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
        {/* Realistic Pinched-Top Side Gusset with V-Fold Center Shadow & Bottom Wrap */}
        <div
          className={`hidden sm:block relative ${tall ? 'w-[76px] h-[465px]' : 'w-[84px] h-[440px]'} shrink-0`}
          style={{
            clipPath: 'polygon(78% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 16%)',
            background: isHeritage
              ? 'linear-gradient(90deg, #A88446 0%, #DFC389 48%, #8F6D36 52%, #C9A96A 100%)'
              : 'linear-gradient(90deg, #1E130E 0%, #312018 46%, #140B07 52%, #261811 100%)',
            boxShadow: 'inset -4px 0 10px rgba(0,0,0,0.45)',
          }}
        >
          {isBotanical && (
            <BotanicalCornerArt className="absolute bottom-[11.2%] right-0 w-[62px] h-[79px] scale-[-1] opacity-82 pointer-events-none" />
          )}
          {isMinimal && <div className="absolute inset-x-0 bottom-[12.1%] h-px bg-[#D8B474]/65 pointer-events-none" />}
          <div className="absolute inset-y-[16%] left-[48%] w-[2px] bg-black/55" />
          <div
            className={`absolute inset-x-0 bottom-0 h-[11.2%] ${
              isCopper
                ? 'bg-[#180E0A] border-t border-[#E6B89A]/65'
                : 'gold-foil-gradient border-t border-[#F7E8C6]/65'
            }`}
          />
        </div>

        <div
          className={`relative ${
            tall ? 'w-[225px] sm:w-[245px] h-[465px]' : 'w-[290px] sm:w-[310px] h-[440px]'
          } rounded-r-[4px] overflow-hidden shadow-[14px_32px_60px_-14px_rgba(0,0,0,0.88)] origin-left`}
          style={{
            transform: 'rotateY(7deg)',
          }}
        >
          <FrontPanel config={config} compact={tall} backgroundOnly={backgroundOnly} />

          <div className="absolute inset-x-0 top-[7.5%] h-[2px] bg-black/55 border-b border-white/15 pointer-events-none" />
          <div className="absolute inset-x-0 top-[9.2%] h-[3px] bg-black/45 border-b border-white/10 pointer-events-none" />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(108deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0) 28%, rgba(0,0,0,0.16) 72%, rgba(255,255,255,0.05) 100%)',
            }}
          />
        </div>
      </div>

      <div className="mt-2 w-[310px] sm:w-[360px] h-7 rounded-[100%] bg-gradient-to-b from-[#C7B8A3]/35 via-[#6E5C4A]/20 to-transparent blur-[1px] border-t border-[#EAE0D0]/20" />
    </div>
  );
}
