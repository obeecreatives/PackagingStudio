import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Calculator, Check, Package, Ruler } from 'lucide-react';
import {
  PackagingConfig,
  POUCH_SHAPES,
  PouchShapeId,
  WeightOption,
} from '../types/packaging';

interface PouchSizeRow {
  id: string;
  weightLabel: string;
  studioWeight?: WeightOption;
  servings: string;
  doypack: {
    size: string;
    note: string;
    frontW: number;
    height: number;
    bottomFold: number;
    seal: number;
    zipperSafe: number;
    valveTop: number;
  } | null;
  boxPouch: {
    size: string;
    frontW: number;
    height: number;
    gussetW: number;
    zipperSafe: number;
    valveTop: number;
  } | null;
  tallGusset: {
    size: string;
    frontW: number;
    height: number;
    gussetW: number;
    zipperSafe: number;
    valveTop: number;
  } | null;
  sachetNote?: string;
  beanVolumeNote: string;
  groundVolumeNote: string;
}

const STANDARD_POUCH_SIZES: PouchSizeRow[] = [
  {
    id: '15g',
    weightLabel: '10 – 15 gram',
    servings: '1 sajian (Drip / Sachet)',
    doypack: null,
    boxPouch: null,
    tallGusset: null,
    sachetNote: '3-Side Seal / Drip Bag: 90 × 110 mm s/d 100 × 125 mm (tanpa lipatan alas)',
    beanVolumeNote: 'Umumnya diisi kopi bubuk giling medium untuk filter/drip sekali seduh.',
    groundVolumeNote: 'Format sachet 3-Side Seal; cocok untuk 10–12 g kopi tubruk atau drip bag.',
  },
  {
    id: '50g',
    weightLabel: '50 gram',
    servings: '± 3 – 4 sajian',
    doypack: {
      size: '100 × 150 mm (+ 30 mm alas)',
      note: 'atau 110 × 170 mm',
      frontW: 100,
      height: 150,
      bottomFold: 30,
      seal: 6,
      zipperSafe: 18,
      valveTop: 46,
    },
    boxPouch: {
      size: '90 × 145 × 45 mm',
      frontW: 90,
      height: 145,
      gussetW: 45,
      zipperSafe: 15,
      valveTop: 44,
    },
    tallGusset: {
      size: '70 × 165 × 45 mm',
      frontW: 70,
      height: 165,
      gussetW: 45,
      zipperSafe: 16,
      valveTop: 44,
    },
    beanVolumeNote: 'Biji utuh disarankan memilih opsi 110 × 170 mm agar zipper tidak sesak.',
    groundVolumeNote: 'Pas untuk ukuran sampel / travel pack kopi bubuk maupun tester roastery.',
  },
  {
    id: '100g',
    weightLabel: '100 gram',
    studioWeight: '100 gram',
    servings: '± 7 – 8 sajian',
    doypack: {
      size: '120 × 185 mm (+ 32 mm alas)',
      note: 'opsi lega: 130 × 200 mm',
      frontW: 120,
      height: 185,
      bottomFold: 32,
      seal: 6,
      zipperSafe: 20,
      valveTop: 52,
    },
    boxPouch: {
      size: '105 × 170 × 55 mm',
      frontW: 105,
      height: 170,
      gussetW: 55,
      zipperSafe: 16,
      valveTop: 46,
    },
    tallGusset: {
      size: '85 × 195 × 50 mm',
      frontW: 85,
      height: 195,
      gussetW: 50,
      zipperSafe: 18,
      valveTop: 46,
    },
    beanVolumeNote: 'Untuk biji sangrai gelap (dark roast) 100 g, 130 × 200 mm memberi headspace ekstra.',
    groundVolumeNote: 'Ukuran 120 × 185 mm sangat proporsional dan hemat bahan untuk kopi bubuk 100 g.',
  },
  {
    id: '200g',
    weightLabel: '150 – 200 gram',
    servings: '± 11 – 15 sajian',
    doypack: {
      size: '140 × 210 mm (+ 35 mm alas)',
      note: 'opsi lega: 140 × 220 mm',
      frontW: 140,
      height: 210,
      bottomFold: 35,
      seal: 7,
      zipperSafe: 22,
      valveTop: 58,
    },
    boxPouch: {
      size: '120 × 195 × 65 mm',
      frontW: 120,
      height: 195,
      gussetW: 65,
      zipperSafe: 18,
      valveTop: 52,
    },
    tallGusset: {
      size: '90 × 225 × 55 mm',
      frontW: 90,
      height: 225,
      gussetW: 55,
      zipperSafe: 18,
      valveTop: 52,
    },
    beanVolumeNote: 'Cocok untuk kemasan retail 200 g specialty coffee dengan katup udara standar.',
    groundVolumeNote: 'Memberi ruang udara cukup sebelum heat-seal atas sehingga bubuk tidak terjepit.',
  },
  {
    id: '250g',
    weightLabel: '250 gram',
    studioWeight: '250 gram',
    servings: '± 16 – 20 sajian',
    doypack: {
      size: '150 × 220 mm (+ 40 mm alas)',
      note: 'opsi lega: 160 × 235 mm',
      frontW: 150,
      height: 220,
      bottomFold: 40,
      seal: 8,
      zipperSafe: 22,
      valveTop: 62,
    },
    boxPouch: {
      size: '130 × 210 × 70 mm',
      frontW: 130,
      height: 210,
      gussetW: 70,
      zipperSafe: 18,
      valveTop: 54,
    },
    tallGusset: {
      size: '100 × 240 × 65 mm',
      frontW: 100,
      height: 240,
      gussetW: 65,
      zipperSafe: 18,
      valveTop: 54,
    },
    beanVolumeNote: 'Standar utama retail 250 g; menampung biji utuh medium–dark dengan area zipper bersih.',
    groundVolumeNote: 'Optimal untuk kopi bubuk 250 g dengan tampilan rak tegak dan proporsional.',
  },
  {
    id: '500g',
    weightLabel: '500 gram',
    servings: '± 32 – 40 sajian',
    doypack: {
      size: '180 × 260 mm (+ 45 mm alas)',
      note: 'opsi lega: 180 × 280 mm',
      frontW: 180,
      height: 260,
      bottomFold: 45,
      seal: 8,
      zipperSafe: 24,
      valveTop: 65,
    },
    boxPouch: {
      size: '145 × 255 × 85 mm',
      frontW: 145,
      height: 255,
      gussetW: 85,
      zipperSafe: 20,
      valveTop: 60,
    },
    tallGusset: {
      size: '120 × 300 × 75 mm',
      frontW: 120,
      height: 300,
      gussetW: 75,
      zipperSafe: 20,
      valveTop: 60,
    },
    beanVolumeNote: 'Untuk 500 g whole bean, pilih tinggi min. 255–280 mm dengan gusset dalam (75–85 mm).',
    groundVolumeNote: 'Ideal untuk kemasan kedai kopi / kafe skala menengah dan penjualan grosir.',
  },
  {
    id: '1000g',
    weightLabel: '1.000 gram (1 kg)',
    servings: '± 65 – 80 sajian',
    doypack: {
      size: '230 × 330 mm (+ 60 mm alas)',
      note: 'opsi lega: 250 × 350 mm',
      frontW: 230,
      height: 330,
      bottomFold: 60,
      seal: 10,
      zipperSafe: 25,
      valveTop: 70,
    },
    boxPouch: {
      size: '165 × 330 × 105 mm',
      frontW: 165,
      height: 330,
      gussetW: 105,
      zipperSafe: 22,
      valveTop: 65,
    },
    tallGusset: {
      size: '140 × 365 × 95 mm',
      frontW: 140,
      height: 365,
      gussetW: 95,
      zipperSafe: 22,
      valveTop: 65,
    },
    beanVolumeNote: 'Gunakan gusset min. 95–105 mm & laminasi tebal (120–140 mikron) agar tahan beban 1 kg biji.',
    groundVolumeNote: 'Standar kemasan Horeca / B2B 1 kg untuk suplai kafe, hotel, dan restoran.',
  },
];

const PREPRESS_RULES = [
  {
    number: '01',
    title: 'Bleed Keliling (+3 mm)',
    spec: '3 mm di seluruh 4 sisi luar garis potong',
    detail:
      'Semua warna latar (espresso matte, foto Gunung Kawi, pita foil emas/tembaga) wajib dilebihkan minimal 3 mm keluar garis trim agar tidak muncul garis putih sisa pemotongan.',
  },
  {
    number: '02',
    title: 'Zona Mati Zipper & Tear Notch',
    spec: '18 – 25 mm Doypack · 15 – 22 mm Box Pouch',
    detail:
      'Area paling atas terkena heat-seal penutup, rel zipper, dan sobekan tear notch. Jangan menaruh logo, nama merek, atau teks penting di zona ini.',
  },
  {
    number: '03',
    title: 'Heat-Seal Samping & Margin Aman',
    spec: '5 – 8 mm kiri/kanan (Doypack) · 5 mm dari lipatan',
    detail:
      'Hindari menempatkan garis bingkai tipis atau huruf kecil terlalu mepet tepi seal samping dan lipatan dasar agar tidak pecah saat proses penyegelan panas.',
  },
  {
    number: '04',
    title: 'Posisi Katup Udara (Degassing Valve)',
    spec: 'Ø 20 – 22 mm · Jarak 50 – 65 mm dari atas',
    detail:
      'Lubang one-way valve dipasang tepat di bawah area zipper. Pastikan area berdiameter 22 mm di titik katup bersih dari teks agar keterbacaan kemasan tetap utuh.',
  },
];

type GuidePouchType = 'doypack' | 'box-gusset' | 'tall-gusset';

interface PouchSizeGuideSectionProps {
  config: PackagingConfig;
  onApplyPreset: (shape: PouchShapeId, weight: WeightOption) => void;
}

export function PouchSizeGuideSection({ config, onApplyPreset }: PouchSizeGuideSectionProps) {
  const [fillMode, setFillMode] = useState<'whole-bean' | 'ground'>('whole-bean');
  const [calcRowId, setCalcRowId] = useState<string>(config.netWeight === '100 gram' ? '100g' : '250g');
  const [calcType, setCalcType] = useState<GuidePouchType>(
    config.pouchShape === 'doypack-valve'
      ? 'doypack'
      : config.pouchShape === 'box-gusset'
        ? 'box-gusset'
        : 'tall-gusset'
  );

  const selectableCalcRows = useMemo(
    () => STANDARD_POUCH_SIZES.filter((row) => row.doypack && row.boxPouch && row.tallGusset),
    []
  );

  const selectedRow = useMemo(
    () => selectableCalcRows.find((r) => r.id === calcRowId) ?? selectableCalcRows[2],
    [selectableCalcRows, calcRowId]
  );

  const calcResult = useMemo(() => {
    const bleed = 3;
    if (calcType === 'doypack' && selectedRow.doypack) {
      const d = selectedRow.doypack;
      const openBottom = d.bottomFold * 2;
      const unwrapWidth = d.frontW;
      const unwrapHeightPerFace = d.height;
      return {
        label: 'Stand-Up Pouch / Doypack (+ Zipper)',
        finishedDim: d.size,
        unwrapFormula: `Panel Depan (${d.frontW} × ${d.height} mm) + Belakang (${d.frontW} × ${d.height} mm) + Alas W (${d.frontW} × ${openBottom} mm terbuka)`,
        bleedDim: `${unwrapWidth + bleed * 2} × ${unwrapHeightPerFace + bleed * 2} mm per panel`,
        safeSummary: `Zipper & top seal ${d.zipperSafe} mm · Seal samping ${d.seal} mm · Valve ± ${d.valveTop} mm dari atas`,
        studioWeight: selectedRow.studioWeight,
        targetShape: 'doypack-valve' as PouchShapeId,
      };
    }

    const g = calcType === 'box-gusset' ? selectedRow.boxPouch! : selectedRow.tallGusset!;
    const unwrapW = g.frontW * 2 + g.gussetW * 2;
    return {
      label:
        calcType === 'box-gusset'
          ? 'Flat Bottom / Box Pouch (8-Side Seal)'
          : 'Side Gusset / Tall Gusset',
      finishedDim: g.size,
      unwrapFormula: `(2 × ${g.frontW} mm) + (2 × ${g.gussetW} mm) = ${unwrapW} × ${g.height} mm`,
      bleedDim: `${unwrapW + bleed * 2} × ${g.height + bleed * 2} mm (termasuk 3 mm bleed keliling)`,
      safeSummary: `Zipper / top fold ${g.zipperSafe} mm · Safe print margin 5 mm · Valve ± ${g.valveTop} mm dari atas`,
      studioWeight: selectedRow.studioWeight,
      targetShape:
        calcType === 'box-gusset'
          ? ('box-gusset' as PouchShapeId)
          : config.pouchShape.startsWith('tall-')
            ? config.pouchShape
            : ('tall-heritage' as PouchShapeId),
    };
  }, [calcType, selectedRow, config.pouchShape]);

  const activeShapeMeta = POUCH_SHAPES[config.pouchShape];

  return (
    <section id="panduan-ukuran" className="scroll-mt-16 py-20 border-t border-[#1A1412]/10 bg-[#ECE9E1]">
      <div className="max-w-[1360px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#8A6429]">
              Referensi Standar Industri Percetakan Fleksibel
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1A1412] leading-tight text-balance">
              Panduan Ukuran Pouch Kopi Berdasarkan Berat Bersih
            </h2>
            <p className="mt-3 text-[15px] text-[#574D47] leading-relaxed">
              Acuan dimensi umum kemasan kopi siap cetak (dalam milimeter) mulai dari sachet 10 gram hingga karung
              roastery 1 kg. Gunakan tolok ukur ini saat menyiapkan <em>dieline</em> atau berkonsultasi dengan vendor
              cetak seperti FlexyPack, Dikemas, maupun percetakan rotogravure/digital.
            </p>
          </div>

          {/* Interactive Fill Density Mode Toggle */}
          <div className="shrink-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#574D47] mb-1.5">
              Simulasi Volume Isian Kopi
            </p>
            <div className="inline-flex items-center gap-1 p-1 bg-[#DED9CE] rounded-lg">
              <button
                type="button"
                onClick={() => setFillMode('whole-bean')}
                className={`px-3.5 py-2 min-h-[44px] text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  fillMode === 'whole-bean'
                    ? 'bg-[#1A1412] text-[#FAF5EB]'
                    : 'text-[#574D47] hover:text-[#1A1412]'
                }`}
              >
                Biji Utuh (Whole Bean)
              </button>
              <button
                type="button"
                onClick={() => setFillMode('ground')}
                className={`px-3.5 py-2 min-h-[44px] text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  fillMode === 'ground'
                    ? 'bg-[#1A1412] text-[#FAF5EB]'
                    : 'text-[#574D47] hover:text-[#1A1412]'
                }`}
              >
                Kopi Bubuk (Ground)
              </button>
            </div>
          </div>
        </div>

        {/* Density Insight Note (no thick left border, clean hairline container) */}
        <div className="mt-6 bg-[#F6F5F2] rounded-xl px-5 py-4 border border-[#1A1412]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <Package className="w-4 h-4 text-[#8A6429] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs sm:text-[13px] text-[#574D47] leading-relaxed">
              {fillMode === 'whole-bean' ? (
                <>
                  <strong className="font-semibold text-[#1A1412]">Mode Biji Utuh Aktif:</strong> Biji kopi sangrai (
                  <em>medium–dark</em>) mengembang{' '}
                  <strong className="font-semibold text-[#1A1412]">± 15–20% lebih besar</strong> daripada bubuk. Jika
                  satu cetakan dipakai untuk biji dan bubuk sekaligus, selalu gunakan ukuran standar atau batas atas
                  agar <em>zipper</em> menutup rapat.
                </>
              ) : (
                <>
                  <strong className="font-semibold text-[#1A1412]">Mode Kopi Bubuk Aktif:</strong> Kopi giling lebih
                  padat sehingga menyisakan ruang atas (<em>headspace</em>) lebih longgar. Jaga jarak aman minimal{' '}
                  <strong className="font-semibold text-[#1A1412]">15–20 mm di bawah garis seal</strong> agar serbuk
                  halus tidak menempel di bibir <em>heat-seal</em>.
                </>
              )}
            </p>
          </div>
          <span className="font-mono text-[11px] text-[#8A6429] whitespace-nowrap shrink-0 tabular-nums">
            Aktif: {activeShapeMeta.code} · {config.netWeight}
          </span>
        </div>

        {/* Standard Size Reference Table */}
        <div className="mt-6 bg-[#F6F5F2] rounded-xl border border-[#1A1412]/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1A1412]/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-[#8A6429]" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#574D47]">
                Tabel Standar Ukuran Cetak Pouch Kopi (mm)
              </span>
            </div>
            <span className="text-xs text-[#574D47]">
              Format: <span className="font-mono text-[#1A1412]">Lebar × Tinggi × Gusset / Alas</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1A1412]/10 bg-[#EFECE6]/70 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#574D47]">
                  <th className="py-3.5 px-5">Berat Bersih</th>
                  <th className="py-3.5 px-4">Stand-Up Doypack (+ Zipper)</th>
                  <th className="py-3.5 px-4">Flat Bottom / Box Pouch</th>
                  <th className="py-3.5 px-4">Side / Tall Gusset</th>
                  <th className="py-3.5 px-5">
                    Catatan {fillMode === 'whole-bean' ? 'Biji Utuh' : 'Kopi Bubuk'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1412]/10 text-xs">
                {STANDARD_POUCH_SIZES.map((row) => {
                  const isStudioActive = row.studioWeight === config.netWeight;
                  const isStudioSupported = Boolean(row.studioWeight);

                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors ${
                        isStudioActive ? 'bg-[#E7E2D8]/55' : 'hover:bg-[#EFECE6]/55'
                      }`}
                    >
                      <td className="py-4 px-5 align-top">
                        <div className="font-serif text-base font-semibold text-[#1A1412] tabular-nums">
                          {row.weightLabel}
                        </div>
                        <div className="mt-0.5 text-[11px] text-[#574D47] tabular-nums">{row.servings}</div>
                        {isStudioSupported && (
                          <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                            {isStudioActive ? (
                              <span className="inline-flex items-center gap-1 font-semibold text-[#8A6429]">
                                <Check className="w-3 h-3" aria-hidden="true" />
                                Aktif di Studio
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onApplyPreset(config.pouchShape, row.studioWeight!)}
                                className="inline-flex items-center gap-1 font-semibold text-[#8A6429] hover:text-[#1A1412] hover:underline cursor-pointer"
                              >
                                Pakai di Studio ({row.studioWeight})
                                <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {row.sachetNote ? (
                        <td colSpan={3} className="py-4 px-4 align-top">
                          <p className="font-mono text-xs font-medium text-[#1A1412] tabular-nums">
                            {row.sachetNote}
                          </p>
                          <p className="mt-1 text-[11px] text-[#574D47]">
                            Tidak memakai alas berdiri maupun zipper; disegel keliling 3 atau 4 sisi.
                          </p>
                        </td>
                      ) : (
                        <>
                          <td className="py-4 px-4 align-top">
                            <p className="font-mono text-xs font-semibold text-[#1A1412] tabular-nums">
                              {row.doypack?.size}
                            </p>
                            {row.doypack?.note && (
                              <p className="mt-1 text-[11px] text-[#574D47] tabular-nums">{row.doypack.note}</p>
                            )}
                          </td>
                          <td className="py-4 px-4 align-top">
                            <p className="font-mono text-xs font-semibold text-[#1A1412] tabular-nums">
                              {row.boxPouch?.size}
                            </p>
                            <p className="mt-1 text-[11px] text-[#574D47]">Alas kotak datar (8-side seal)</p>
                          </td>
                          <td className="py-4 px-4 align-top">
                            <p className="font-mono text-xs font-semibold text-[#1A1412] tabular-nums">
                              {row.tallGusset?.size}
                            </p>
                            <p className="mt-1 text-[11px] text-[#574D47]">Profil tinggi ramping roastery</p>
                          </td>
                        </>
                      )}

                      <td className="py-4 px-5 align-top text-[#574D47] leading-relaxed max-w-[280px]">
                        {fillMode === 'whole-bean' ? row.beanVolumeNote : row.groundVolumeNote}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom 2-Column Split: Unwrap Dieline Calculator + 4 Pre-Press Safety Rules */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Dieline Unwrap Calculator */}
          <div className="lg:col-span-5 bg-[#F6F5F2] rounded-xl p-6 border border-[#1A1412]/10">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#8A6429]" aria-hidden="true" />
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6429]">
                Kalkulator Ukuran File Cetak (Unwrap Dieline)
              </p>
            </div>
            <h3 className="mt-2 font-serif text-xl font-semibold text-[#1A1412]">
              Hitung Lebar Bentangan &amp; Bleed Otomatis
            </h3>
            <p className="mt-1.5 text-xs text-[#574D47] leading-relaxed">
              Pilih gramasi dan tipe pouch untuk melihat dimensi mentah <em>unwrap</em> yang harus disiapkan dalam file
              artwork PDF/AI/PNG Anda.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="calc-weight" className="block text-xs font-semibold text-[#574D47] mb-1.5">
                  Pilih Berat Bersih
                </label>
                <select
                  id="calc-weight"
                  value={calcRowId}
                  onChange={(e) => setCalcRowId(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 text-base md:text-xs font-medium bg-white border border-[#1A1412]/15 rounded-md text-[#1A1412]"
                >
                  {selectableCalcRows.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.weightLabel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="calc-type" className="block text-xs font-semibold text-[#574D47] mb-1.5">
                  Tipe Konstruksi Pouch
                </label>
                <select
                  id="calc-type"
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value as GuidePouchType)}
                  className="w-full min-h-[44px] px-3 py-2 text-base md:text-xs font-medium bg-white border border-[#1A1412]/15 rounded-md text-[#1A1412]"
                >
                  <option value="doypack">Stand-Up Doypack (+ Valve)</option>
                  <option value="box-gusset">Flat Bottom / Box Pouch</option>
                  <option value="tall-gusset">Side / Tall Gusset</option>
                </select>
              </div>
            </div>

            <dl className="mt-5 divide-y divide-[#1A1412]/10 border-t border-[#1A1412]/10 text-xs">
              <div className="py-3 flex flex-col gap-1">
                <dt className="text-[#574D47]">Ukuran Jadi ({calcResult.label})</dt>
                <dd className="font-mono font-semibold text-sm text-[#1A1412] tabular-nums">
                  {calcResult.finishedDim}
                </dd>
              </div>
              <div className="py-3 flex flex-col gap-1">
                <dt className="text-[#574D47]">Dimensi Bentangan (Unwrap Artwork)</dt>
                <dd className="font-mono font-medium text-[#1A1412] tabular-nums leading-relaxed">
                  {calcResult.unwrapFormula}
                </dd>
              </div>
              <div className="py-3 flex flex-col gap-1">
                <dt className="text-[#574D47]">Ukuran Kanvas Kerja (+ 3 mm Bleed Keliling)</dt>
                <dd className="font-mono font-semibold text-[#8A6429] tabular-nums">{calcResult.bleedDim}</dd>
              </div>
              <div className="py-3 flex flex-col gap-1">
                <dt className="text-[#574D47]">Toleransi Zipper, Seal &amp; Katup</dt>
                <dd className="font-mono text-[#1A1412] tabular-nums leading-relaxed">{calcResult.safeSummary}</dd>
              </div>
            </dl>

            {calcResult.studioWeight && (
              <div className="mt-4 pt-4 border-t border-[#1A1412]/10 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-[#574D47]">
                  Tersedia langsung di editor visual PackagingStudio.
                </span>
                <button
                  type="button"
                  onClick={() => onApplyPreset(calcResult.targetShape, calcResult.studioWeight!)}
                  className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 text-xs font-semibold text-[#FAF5EB] bg-[#1A1412] hover:bg-[#31221B] rounded-md transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Terapkan ke Studio ({calcResult.studioWeight})</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D8B474]" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* 4 Pre-Press Safety Tolerances + First Production Recommendation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#F6F5F2] rounded-xl p-6 border border-[#1A1412]/10">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6429]">
                Aturan Teknis Wajib Sebelum Naik Cetak
              </p>
              <h3 className="mt-1.5 font-serif text-xl font-semibold text-[#1A1412]">
                4 Toleransi Pre-Press Agar Desain Tidak Terpotong Mesin
              </h3>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PREPRESS_RULES.map((rule) => (
                  <div
                    key={rule.number}
                    className="p-4 rounded-lg bg-[#EFECE6]/75 border border-[#1A1412]/10 flex flex-col justify-between"
                  >
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8A6429]">
                        {rule.number}. {rule.title}
                      </p>
                      <p className="mt-1 font-mono text-xs font-semibold text-[#1A1412] tabular-nums">{rule.spec}</p>
                      <p className="mt-2 text-xs text-[#574D47] leading-relaxed">{rule.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F6F5F2] rounded-xl p-6 border border-[#1A1412]/10">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8A6429]">
                Panduan Pemilihan untuk Produksi Pertama
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-[#574D47] leading-relaxed">
                <div>
                  <p className="font-semibold text-[#1A1412] mb-1">Opsi Efisien &amp; Paling Umum di Pasar</p>
                  <p>
                    Gunakan <strong className="font-semibold text-[#1A1412]">Doypack 250 g (150 × 220 mm)</strong> dan{' '}
                    <strong className="font-semibold text-[#1A1412]">100 g (120 × 185 mm)</strong> dengan bahan alufoil /
                    metalized laminasi matte + zipper + one-way valve. Biaya cetak paling ekonomis dan mudah diterima
                    pasar retail maupun marketplace.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[#1A1412] mb-1">Opsi Rak Premium &amp; Tampilan Kokoh</p>
                  <p>
                    Gunakan <strong className="font-semibold text-[#1A1412]">Box Pouch 250 g (130 × 210 × 70 mm)</strong>{' '}
                    atau <strong className="font-semibold text-[#1A1412]">Tall Gusset (100 × 240 × 65 mm)</strong>.
                    Selalu minta file pisau (<em>die-cut template PDF</em>) resmi dari pabrik cetak pilihan Anda karena
                    tiap mesin bisa berselisih ± 2–5 mm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
