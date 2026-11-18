import React, { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import {
  BEAN_VARIANTS,
  getDynamicShapeDescription,
  getWeightSpecs,
  ORIGINAL_UPLOADS,
  PackagingConfig,
  POUCH_SHAPES,
  ROAST_LEVELS,
} from '../types/packaging';
import { LiveMockupScene } from './LiveMockupScene';
import type { ExpandPreviewTarget } from './ExpandPreviewModal';

type ReferenceTab = 'revised-final' | 'tall-3style' | 'doypack-blank' | 'draft-1' | 'draft-2' | 'ref-3';

export function DesignCritiqueSection({
  config,
  onExpand,
}: {
  config: PackagingConfig;
  onExpand: (target: ExpandPreviewTarget) => void;
}) {
  const [selectedRef, setSelectedRef] = useState<ReferenceTab>('revised-final');
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const activeShapeMeta = POUCH_SHAPES[config.pouchShape];
  const weightSpecs = getWeightSpecs(config.pouchShape, config.netWeight);

  const improvements = [
    {
      index: '01.',
      title: 'Enam Alternatif Lengkap Tanpa Menghilangkan Versi Awal',
      detail: `Semua bentuk kemasan—Box Pouch Gusset (Versi 01), Stand-Up Doypack + Valve (Alternatif 02), hingga 4 gaya Tall Gusset (Classic, Botanical Berornamen, Copper Clean, dan Minimalis Bersih)—otomatis menyesuaikan berat ${config.netWeight} (${weightSpecs.dimensions}), ${variant.frontLabel}, dan profil ${roast.label}.`,
    },
    {
      index: '02.',
      title: 'Perbaikan Teks Stempel & Tipografi Presisi',
      detail:
        'Pada referensi AI tall bag sebelumnya, teks kecil pada stempel hijau masih kurang terbaca dan inkonsisten. Di sini seluruh tipografi, nama "ARUNIKA KAWI", dan stempel KTH Jawa Timur dirender ulang secara tajam.',
    },
    {
      index: '03.',
      title: 'Transisi dari Ilustrasi Datar ke Fotografi Natural',
      detail:
        'Menggantikan ilustrasi vektor datar pada draf awal dengan fotografi makro biji kopi Robusta sangrai, ranting ceri kopi berembun, dan atmosfer kabut pagi Gunung Kawi.',
    },
    {
      index: '04.',
      title: 'Siap Cetak Full Print 360° untuk Setiap Bentuk',
      detail: `Setiap alternatif memiliki dieline full print lengkap untuk ukuran ${config.netWeight} (${weightSpecs.frontDim}), panduan seduh, barcode EAN-13, serta garis bleed 3 mm.`,
    },
  ];

  const getTargetConfig = (): PackagingConfig => {
    if (selectedRef === 'tall-3style') {
      const tallShape =
        config.pouchShape === 'tall-botanical' ||
        config.pouchShape === 'tall-copper' ||
        config.pouchShape === 'tall-minimal' ||
        config.pouchShape === 'tall-heritage'
          ? config.pouchShape
          : 'tall-heritage';
      return { ...config, pouchShape: tallShape };
    }
    if (selectedRef === 'doypack-blank') {
      return { ...config, pouchShape: 'doypack-valve' };
    }
    if (selectedRef === 'draft-1' || selectedRef === 'ref-3') {
      return { ...config, pouchShape: 'box-gusset' };
    }
    return config;
  };

  const targetConfig = getTargetConfig();
  const targetMeta = POUCH_SHAPES[targetConfig.pouchShape];

  const activeSource =
    selectedRef === 'revised-final'
      ? {
          src: config.netWeight === '100 gram' ? ORIGINAL_UPLOADS.revisedFront100 : ORIGINAL_UPLOADS.revisedFront250,
          title: `Artwork Revisi Terbaru · Depan (${config.netWeight})`,
          caption: `Desain final terbaru Anda (${config.netWeight}): Traditional Roasted Coffee, 100 % Biji Kopi Robusta, Isi Bersih : ${config.netWeight} tampil khusus di halaman depan, narasi Goreng Kreweng, KOMPOSISI 100 % BIJI KOPI ROBUSTA, dan kotak PIRT baru di belakang.`,
          afterTitle: `Implementasi Live · ${activeShapeMeta.code} (${config.netWeight})`,
          afterCaption: getDynamicShapeDescription(config.pouchShape, config),
        }
      : selectedRef === 'tall-3style'
        ? {
            src: ORIGINAL_UPLOADS.tallReferenceGroup,
            title: 'Referensi Tall Bag 3 Gaya',
            caption: 'Referensi tiga varian desain tall gusset (Botanical, Heritage Mandala, Copper Diagonal).',
            afterTitle: `Sesudah · ${targetMeta.code} (${config.netWeight})`,
            afterCaption: getDynamicShapeDescription(targetConfig.pouchShape, targetConfig),
          }
        : selectedRef === 'doypack-blank'
          ? {
              src: ORIGINAL_UPLOADS.doypackBlank,
              title: 'Referensi Bentuk Doypack Polos',
              caption: 'Bentuk stand-up doypack dengan sudut membulat, seal samping, zipper atas, dan katup udara tengah.',
              afterTitle: `Sesudah · Alternatif 02 Doypack (${config.netWeight})`,
              afterCaption: getDynamicShapeDescription('doypack-valve', targetConfig),
            }
          : selectedRef === 'draft-1'
            ? {
                src: ORIGINAL_UPLOADS.draftWithSeal,
                title: 'Draf Awal 01 (Dengan Stempel KTH)',
                caption: 'Latar cokelat polos, ilustrasi vektor biji kopi, dan penulisan "Isi Bersi :250 gram".',
                afterTitle: `Sesudah · Versi 01 Box Pouch (${config.netWeight})`,
                afterCaption: getDynamicShapeDescription('box-gusset', targetConfig),
              }
            : selectedRef === 'draft-2'
              ? {
                  src: ORIGINAL_UPLOADS.draftClean,
                  title: 'Draf Awal 02 (Tata Letak Bersih)',
                  caption: 'Versi tanpa stempel hijau dengan lingkaran 100% Robusta Bean di kanan bawah.',
                  afterTitle: `Sesudah · ${activeShapeMeta.code} Natural (${config.netWeight})`,
                  afterCaption: getDynamicShapeDescription(targetConfig.pouchShape, targetConfig),
                }
              : {
                  src: ORIGINAL_UPLOADS.referenceMockup,
                  title: 'Referensi Awal 03 (Gaya Box Pouch)',
                  caption: 'Inspirasi kemasan matte gelap, alas emas metalik, dan tumpukan biji kopi natural.',
                  afterTitle: `Sesudah · Versi 01 Box Pouch (${config.netWeight})`,
                  afterCaption: getDynamicShapeDescription('box-gusset', targetConfig),
                };

  return (
    <section id="analisis-revisi" className="py-20 border-t border-[#1A1412]/10">
      <div className="max-w-[1360px] mx-auto px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#8A6429]">
            Analisis &amp; Penyempurnaan Grafis
          </p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1A1412] leading-tight">
            Evolusi dari Seluruh Referensi Menuju Enam Alternatif Siap Cetak
          </h2>
          <p className="mt-3 text-[15px] text-[#574D47] leading-relaxed">
            Bandingkan setiap draf dan gambar referensi yang Anda kirimkan dengan hasil implementasi langsung untuk{' '}
            <strong className="font-semibold text-[#1A1412]">
              {activeShapeMeta.shortLabel} · {config.netWeight} · {variant.frontLabel}
            </strong>
            .
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7 bg-[#EFECE6] rounded-xl p-6 border border-[#1A1412]/10">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#1A1412]/10">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#574D47]">
                Perbandingan Referensi
              </span>
              <div className="flex flex-wrap items-center gap-1 p-1 bg-[#E4DFD6] rounded-lg">
                {[
                  { id: 'revised-final' as const, label: 'Revisi Final' },
                  { id: 'tall-3style' as const, label: 'Tall 3 Gaya' },
                  { id: 'doypack-blank' as const, label: 'Doypack Polos' },
                  { id: 'draft-1' as const, label: 'Draf 1' },
                  { id: 'draft-2' as const, label: 'Draf 2' },
                  { id: 'ref-3' as const, label: 'Referensi 3' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedRef(tab.id)}
                    className={`min-h-[44px] px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedRef === tab.id
                        ? 'bg-white text-[#1A1412] shadow-xs'
                        : 'text-[#574D47] hover:text-[#1A1412]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() =>
                    onExpand({
                      kind: 'image',
                      title: activeSource.title,
                      subtitle: 'Referensi Sebelum · Resolusi Asli',
                      src: activeSource.src,
                      filename: `arunika-referensi-${selectedRef}.png`,
                      bgClass: 'bg-white',
                    })
                  }
                  className="group relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-white border border-[#1A1412]/12 cursor-zoom-in text-left"
                >
                  <img
                    src={activeSource.src}
                    alt={activeSource.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full ${
                      selectedRef === 'doypack-blank' ? 'object-contain p-2' : 'object-cover'
                    }`}
                  />
                  <span className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-[#120C09]/75 text-[#FAF5EB] flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:bg-[#8A6429] transition-colors shadow">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </button>
                <div className="mt-3">
                  <p className="text-xs font-medium text-[#8A6429]">Sebelum · {activeSource.title}</p>
                  <p className="mt-1 text-xs text-[#574D47] leading-relaxed">{activeSource.caption}</p>
                </div>
              </div>

              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() =>
                    onExpand({
                      kind: 'mockup',
                      title: activeSource.afterTitle,
                      subtitle: `${targetMeta.label} · ${config.netWeight}`,
                      config: targetConfig,
                      initialScene: 'natural-kawi',
                    })
                  }
                  className="group relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-[#18100C] border border-[#A67B38]/40 cursor-zoom-in text-left"
                >
                  <LiveMockupScene config={targetConfig} scene="natural-kawi" size="critique" />
                  <span className="absolute top-2.5 right-2.5 z-30 w-9 h-9 rounded-full bg-[#120C09]/75 text-[#FAF5EB] flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:bg-[#8A6429] transition-colors shadow">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </button>
                <div className="mt-3">
                  <p className="text-xs font-medium text-[#1A1412]">{activeSource.afterTitle}</p>
                  <p className="mt-1 text-xs text-[#574D47] leading-relaxed">{activeSource.afterCaption}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 divide-y divide-[#1A1412]/10 border-t border-b border-[#1A1412]/10">
            {improvements.map((item) => (
              <div key={item.index} className="py-5 first:pt-2 last:pb-2">
                <h3 className="font-serif text-xl font-semibold text-[#1A1412]">
                  {item.index} {item.title}
                </h3>
                <p className="mt-1.5 text-sm text-[#574D47] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
