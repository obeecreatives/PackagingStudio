import React, { useState } from 'react';
import {
  ArtworkSourceMode,
  BEAN_VARIANTS,
  BeanVariantId,
  getDynamicShapeDescription,
  getWeightSpecs,
  isTallGusset,
  NATURAL_MOODS,
  NaturalMoodId,
  PackagingConfig,
  POUCH_SHAPES,
  PouchShapeId,
  PrintViewMode,
  ROAST_LEVELS,
  RoastLevelId,
  SealPlacement,
  WeightOption,
} from './types/packaging';
import { TopBar } from './components/TopBar';
import {
  BackPanel,
  FrontPanel,
  FullPrintDieline,
  InteractivePouch3D,
  SideGussetPanel,
} from './components/PackagingPanels';
import { LiveMockupScene, MockupSceneMode } from './components/LiveMockupScene';
import { DesignCritiqueSection } from './components/DesignCritiqueSection';
import { DesignElementsKit } from './components/DesignElementsKit';
import { PouchSizeGuideSection } from './components/PouchSizeGuideSection';
import { PrintSpecsSection } from './components/PrintSpecsSection';
import { PWAInstallButton } from './components/PWAInstallButton';
import { MobileBottomNav } from './components/MobileBottomNav';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { ExportScope, renderAndDownloadPrintSheet } from './utils/exportPrintArtwork';
import { exportSelectedDesignPdf } from './utils/exportPdfDossier';

const ALL_ALTERNATIVE_IDS: PouchShapeId[] = [
  'box-gusset',
  'doypack-valve',
  'tall-heritage',
  'tall-botanical',
  'tall-copper',
  'tall-minimal',
];

type CompareDisplayMode = MockupSceneMode | '3d-single';

export default function App() {
  const [config, setConfig] = useState<PackagingConfig>({
    pouchShape: 'doypack-valve',
    beanVariant: 'robusta-100',
    roastLevel: 'traditional',
    naturalMood: 'kawi-beans',
    sealPlacement: 'back',
    netWeight: '250 gram',
    showPrintMarks: true,
    artworkSource: 'uploaded-final',
  });

  const [viewMode, setViewMode] = useState<PrintViewMode>('compare');
  const [compareMode, setCompareMode] = useState<CompareDisplayMode>('natural-kawi');
  const [heroScene, setHeroScene] = useState<MockupSceneMode>('natural-kawi');
  const [previewBgOnly, setPreviewBgOnly] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const isOnline = useOnlineStatus();

  const handleExport = async (scope: ExportScope = 'full-dieline') => {
    setIsExporting(true);
    try {
      await renderAndDownloadPrintSheet(config, scope);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      await exportSelectedDesignPdf(config);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const isDoypack = config.pouchShape === 'doypack-valve';
  const tall = isTallGusset(config.pouchShape);
  const activeShapeMeta = POUCH_SHAPES[config.pouchShape];
  const activeWeightSpecs = getWeightSpecs(config.pouchShape, config.netWeight);
  const activeVariantMeta = BEAN_VARIANTS[config.beanVariant];
  const activeRoastMeta = ROAST_LEVELS[config.roastLevel];
  const activeMoodMeta = NATURAL_MOODS[config.naturalMood];
  const heroDynamicDescription = getDynamicShapeDescription(config.pouchShape, config);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#F6F5F2] text-[#1A1412]">
      <TopBar
        onDownloadClick={() => handleExport('full-dieline')}
        isExporting={isExporting}
        onExportPdfClick={handleExportPdf}
        isExportingPdf={isExportingPdf}
      />

      {!isOnline && (
        <div className="bg-[#2B1D16] text-[#FAF5EB] px-4 py-2 text-center text-xs font-medium">
          Mode Offline Aktif — Studio desain &amp; ekspor PNG tetap berjalan dari cache perangkat Anda.
        </div>
      )}

      <main className="flex-1">
        {/* Hero Split Showcase */}
        <section id="mockup-studio" className="pt-12 pb-16">
          <div className="max-w-[1360px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-between py-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#8A6429]">
                    <span>Arunika Kawi</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeShapeMeta.code}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{config.netWeight}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeVariantMeta.frontLabel}</span>
                  </div>

                  <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-semibold text-[#1A1412] leading-[1.08] tracking-tight text-balance">
                    {activeShapeMeta.code} · {activeShapeMeta.label}
                  </h1>

                  <p className="mt-4 text-[16px] text-[#574D47] leading-relaxed max-w-xl">
                    {heroDynamicDescription} Setiap perubahan berat, varian biji, sangrai, latar, maupun posisi stempel
                    langsung memperbarui seluruh mockup di halaman ini secara bersamaan.
                  </p>

                  {/* Quick 6-Alternative Switcher */}
                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#574D47] mb-2">
                      Pilih Fokus Pratinjau (6 Alternatif Tersedia)
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#E7E2D8] rounded-lg">
                      {(Object.keys(POUCH_SHAPES) as PouchShapeId[]).map((shapeId) => {
                        const meta = POUCH_SHAPES[shapeId];
                        const active = config.pouchShape === shapeId;
                        return (
                          <button
                            key={shapeId}
                            type="button"
                            onClick={() => setConfig((prev) => ({ ...prev, pouchShape: shapeId }))}
                            className={`px-3 py-2 min-h-[44px] text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              active
                                ? 'bg-[#1A1412] text-[#FAF5EB]'
                                : 'text-[#574D47] hover:text-[#1A1412]'
                            }`}
                          >
                            {meta.code} · {meta.shortLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={isExportingPdf}
                      onClick={handleExportPdf}
                      className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm font-semibold text-[#FAF5EB] bg-[#8A6429] hover:bg-[#73511D] disabled:opacity-60 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {isExportingPdf ? 'Menyusun PDF...' : 'Ekspor Dossier PDF (00–04)'}
                    </button>
                    <button
                      type="button"
                      disabled={isExporting}
                      onClick={() => handleExport('bg-full-dieline')}
                      className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm font-semibold text-[#FAF5EB] bg-[#1A1412] hover:bg-[#31221B] disabled:opacity-60 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Unduh Background Saja (PNG)
                    </button>
                    <a
                      href="#semua-alternatif"
                      className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm font-semibold text-[#1A1412] bg-[#EFECE6] hover:bg-[#E5E0D7] border border-[#1A1412]/15 rounded-md transition-colors whitespace-nowrap shrink-0"
                    >
                      Bandingkan Semua 6 Alternatif
                    </a>
                    <a
                      href="#full-print"
                      className="inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 text-sm font-semibold text-[#1A1412] bg-[#EFECE6] hover:bg-[#E5E0D7] border border-[#1A1412]/15 rounded-md transition-colors whitespace-nowrap shrink-0"
                    >
                      Buka Dieline Full Print
                    </a>
                    <PWAInstallButton />
                  </div>
                </div>

                {/* Key Design Pillars Strip */}
                <div className="mt-10 pt-6 border-t border-[#1A1412]/10 space-y-5">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="font-serif text-xl sm:text-2xl font-semibold text-[#1A1412] tabular-nums">
                        {activeWeightSpecs.dimensions}
                      </p>
                      <p className="mt-0.5 text-xs text-[#574D47]">
                        Dimensi Aktif · {config.netWeight}
                      </p>
                    </div>
                    <div>
                      <p className="font-serif text-xl sm:text-2xl font-semibold text-[#1A1412]">
                        {activeVariantMeta.frontLabel}
                      </p>
                      <p className="mt-0.5 text-xs text-[#574D47]">{activeRoastMeta.label}</p>
                    </div>
                    <div>
                      <p className="font-serif text-xl sm:text-2xl font-semibold text-[#1A1412]">
                        {activeMoodMeta.label}
                      </p>
                      <p className="mt-0.5 text-xs text-[#574D47]">{activeWeightSpecs.servings}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1A1412]/10">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A6429]">
                      Font yang Digunakan ({activeShapeMeta.code} · {activeShapeMeta.shortLabel})
                    </p>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-[#574D47] text-[11px]">Display &amp; Tagline</p>
                        <p className="font-serif text-sm font-bold text-[#1A1412]">Swash Serif / Cinzel</p>
                        <p className="text-[11px] text-[#574D47] leading-snug">{activeShapeMeta.fonts.display}</p>
                      </div>
                      <div>
                        <p className="text-[#574D47] text-[11px]">Sub-Judul &amp; Body</p>
                        <p className="font-sans text-xs font-semibold text-[#1A1412]">Plus Jakarta Sans</p>
                        <p className="text-[11px] text-[#574D47] leading-snug">
                          {activeShapeMeta.fonts.body.replace('Plus Jakarta Sans · ', '')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#574D47] text-[11px]">Data Teknis &amp; Elevasi</p>
                        <p className="font-mono text-xs font-medium text-[#1A1412]">IBM Plex Mono</p>
                        <p className="text-[11px] text-[#574D47] leading-snug">
                          {activeShapeMeta.fonts.mono.replace('IBM Plex Mono · ', '')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col">
                <div className="flex-1 flex flex-col rounded-xl overflow-hidden border border-[#1A1412]/12 bg-[#1D120D]">
                  <div className="px-3.5 py-2.5 bg-[#EFECE6] border-b border-[#1A1412]/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#574D47]">
                      Pratinjau Mockup · {activeShapeMeta.code} ({config.netWeight})
                    </span>
                    <div className="grid grid-cols-3 sm:inline-flex items-center gap-1 p-1 bg-[#E2DDD3] rounded-lg w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setHeroScene('natural-kawi')}
                        className={`px-1 sm:px-2.5 py-1.5 min-h-[38px] text-[10.5px] sm:text-xs font-medium rounded-md transition-colors whitespace-nowrap text-center cursor-pointer ${
                          heroScene === 'natural-kawi'
                            ? 'bg-[#1A1412] text-[#FAF5EB]'
                            : 'text-[#574D47] hover:text-[#1A1412]'
                        }`}
                      >
                        Suasana Natural
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroScene('studio-front')}
                        className={`px-1 sm:px-2.5 py-1.5 min-h-[38px] text-[10.5px] sm:text-xs font-medium rounded-md transition-colors whitespace-nowrap text-center cursor-pointer ${
                          heroScene === 'studio-front'
                            ? 'bg-[#1A1412] text-[#FAF5EB]'
                            : 'text-[#574D47] hover:text-[#1A1412]'
                        }`}
                      >
                        Studio Depan
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroScene('studio-rear')}
                        className={`px-1 sm:px-2.5 py-1.5 min-h-[38px] text-[10.5px] sm:text-xs font-medium rounded-md transition-colors whitespace-nowrap text-center cursor-pointer ${
                          heroScene === 'studio-rear'
                            ? 'bg-[#1A1412] text-[#FAF5EB]'
                            : 'text-[#574D47] hover:text-[#1A1412]'
                        }`}
                      >
                        Studio Belakang
                      </button>
                    </div>
                  </div>

                  <div
                    className={`relative w-full h-[430px] sm:h-[520px] lg:h-[580px] ${
                      heroScene !== 'natural-kawi' ? 'bg-white' : 'bg-[#1D120D]'
                    }`}
                  >
                    <LiveMockupScene
                      config={config}
                      scene={heroScene}
                      size="hero"
                      backgroundOnly={previewBgOnly}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* All 6 Alternatives Side-by-Side Comparison Gallery */}
            <div id="semua-alternatif" className="mt-14 pt-10 border-t border-[#1A1412]/10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#8A6429]">
                    Katalog Pembanding Lengkap · Live Sinkronisasi ({config.netWeight} · {activeVariantMeta.frontLabel})
                  </p>
                  <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-semibold text-[#1A1412]">
                    6 Alternatif Kemasan Arunika Kawi (Versi Awal hingga Terbaru)
                  </h2>
                </div>
                <p className="text-xs text-[#574D47]">
                  Klik salah satu kartu untuk mengaktifkan fokus desainnya di pratinjau utama dan studio cetak.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {ALL_ALTERNATIVE_IDS.map((shapeId) => {
                  const meta = POUCH_SHAPES[shapeId];
                  const cardWeightSpecs = getWeightSpecs(shapeId, config.netWeight);
                  const isActive = config.pouchShape === shapeId;
                  const cardConfig: PackagingConfig = { ...config, pouchShape: shapeId };

                  return (
                    <button
                      key={shapeId}
                      type="button"
                      onClick={() => {
                        setConfig((prev) => ({ ...prev, pouchShape: shapeId }));
                      }}
                      className={`text-left bg-[#EFECE6] rounded-xl overflow-hidden border transition-all cursor-pointer flex flex-col ${
                        isActive
                          ? 'border-[#8A6429] ring-1 ring-[#8A6429]'
                          : 'border-[#1A1412]/10 hover:border-[#1A1412]/30'
                      }`}
                    >
                      <div className="aspect-[3/4] w-full overflow-hidden bg-[#1D120D]">
                        <LiveMockupScene
                          config={cardConfig}
                          scene="natural-kawi"
                          size="card"
                          backgroundOnly={previewBgOnly}
                        />
                      </div>
                      <div className="p-3.5 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[11px] font-semibold text-[#8A6429] tabular-nums">
                            {meta.code} {isActive ? '· Aktif' : ''} · {config.netWeight}
                          </p>
                          <h3 className="mt-0.5 font-serif text-lg font-semibold text-[#1A1412] leading-snug">
                            {meta.shortLabel}
                          </h3>
                          <p className="mt-1 text-xs text-[#574D47] leading-relaxed">
                            {meta.description} ({activeVariantMeta.frontLabel} · {activeRoastMeta.label})
                          </p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-[#1A1412]/10 space-y-1.5">
                          <p className="text-[11px] font-medium text-[#8A6429] leading-snug">
                            {meta.fonts.tagline.replace('Plus Jakarta Sans · ', '')}
                          </p>
                          <p className="font-mono text-[10px] text-[#574D47] tabular-nums">
                            {cardWeightSpecs.dimensions}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Full-Print Studio & Dieline Section */}
        <section id="full-print" className="py-20 border-t border-[#1A1412]/10 bg-[#ECE9E1]">
          <div className="max-w-[1360px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-[#8A6429]">
                  Studio Desain Full Print · Sinkronisasi Real-Time ({config.netWeight})
                </p>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1A1412] leading-tight">
                  {viewMode === 'compare'
                    ? `Perbandingan Langsung 6 Bentuk Kemasan (${config.netWeight})`
                    : `${activeShapeMeta.code} · ${activeShapeMeta.label} (${config.netWeight})`}
                </h2>
                <p className="mt-2 text-[15px] text-[#574D47]">
                  Sesuaikan alternatif bentuk kemasan, varian biji, level sangrai, nuansa foto natural, posisi stempel
                  Kelompok Tani Hutan Jawa Timur, maupun berat bersih — seluruh mockup dan deskripsi langsung berubah.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#DED9CE] rounded-lg">
                  {[
                    { id: 'compare' as const, label: 'Bandingkan 6 Bentuk' },
                    { id: 'pouch-3d' as const, label: 'Mockup 3D' },
                    { id: 'dieline' as const, label: isDoypack ? 'Dieline Doypack' : 'Full Print 360°' },
                    { id: 'front' as const, label: 'Panel Depan' },
                    { id: 'back-gusset' as const, label: isDoypack ? 'Panel Belakang' : 'Belakang & Samping' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setViewMode(tab.id)}
                      className={`px-3 py-2 min-h-[44px] text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        viewMode === tab.id
                          ? 'bg-[#1A1412] text-[#FAF5EB]'
                          : 'text-[#574D47] hover:text-[#1A1412]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      artworkSource:
                        prev.artworkSource === 'uploaded-final'
                          ? ('studio-custom' as ArtworkSourceMode)
                          : ('uploaded-final' as ArtworkSourceMode),
                    }))
                  }
                  className={`px-3.5 py-2 min-h-[44px] text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    config.artworkSource === 'uploaded-final'
                      ? 'bg-[#1A1412] text-[#FAF5EB] border-[#1A1412]'
                      : 'bg-[#F6F5F2] text-[#1A1412] border-[#1A1412]/15 hover:bg-white'
                  }`}
                >
                  {config.artworkSource === 'uploaded-final'
                    ? 'Artwork: Desain Revisi Anda'
                    : 'Artwork: Template Dinamis'}
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewBgOnly((prev) => !prev)}
                  className={`px-3.5 py-2 min-h-[44px] text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    previewBgOnly
                      ? 'bg-[#8A6429] text-[#FAF5EB] border-[#8A6429]'
                      : 'bg-[#F6F5F2] text-[#1A1412] border-[#1A1412]/15 hover:bg-white'
                  }`}
                >
                  {previewBgOnly ? 'Mode: Background Saja' : 'Lihat Background Saja'}
                </button>
              </div>
            </div>

            {/* Interactive Controls Toolbar */}
            <div className="mt-8 bg-[#F6F5F2] rounded-xl p-5 border border-[#1A1412]/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label htmlFor="shape-select" className="block text-xs font-semibold text-[#574D47] mb-1.5">
                  Alternatif Kemasan
                </label>
                <select
                  id="shape-select"
                  value={config.pouchShape}
                  onChange={(e) => setConfig((prev) => ({ ...prev, pouchShape: e.target.value as PouchShapeId }))}
                  className="w-full min-h-[44px] px-3 py-2 text-base md:text-xs font-medium bg-white border border-[#1A1412]/15 rounded-md text-[#1A1412] focus-visible:outline-2 focus-visible:outline-[#A67B38]"
                >
                  {(Object.keys(POUCH_SHAPES) as PouchShapeId[]).map((key) => (
                    <option key={key} value={key}>
                      {POUCH_SHAPES[key].code} · {POUCH_SHAPES[key].shortLabel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="variant-select" className="block text-xs font-semibold text-[#574D47] mb-1.5">
                  Varian Biji Kopi
                </label>
                <select
                  id="variant-select"
                  value={config.beanVariant}
                  onChange={(e) => setConfig((prev) => ({ ...prev, beanVariant: e.target.value as BeanVariantId }))}
                  className="w-full min-h-[44px] px-3 py-2 text-base md:text-xs font-medium bg-white border border-[#1A1412]/15 rounded-md text-[#1A1412] focus-visible:outline-2 focus-visible:outline-[#A67B38]"
                >
                  {(Object.keys(BEAN_VARIANTS) as BeanVariantId[]).map((key) => (
                    <option key={key} value={key}>
                      {BEAN_VARIANTS[key].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="roast-select" className="block text-xs font-semibold text-[#574D47] mb-1.5">
                  Karakter Sangrai
                </label>
                <select
                  id="roast-select"
                  value={config.roastLevel}
                  onChange={(e) => setConfig((prev) => ({ ...prev, roastLevel: e.target.value as RoastLevelId }))}
                  className="w-full min-h-[44px] px-3 py-2 text-base md:text-xs font-medium bg-white border border-[#1A1412]/15 rounded-md text-[#1A1412] focus-visible:outline-2 focus-visible:outline-[#A67B38]"
                >
                  {(Object.keys(ROAST_LEVELS) as RoastLevelId[]).map((key) => (
                    <option key={key} value={key}>
                      {ROAST_LEVELS[key].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="mood-select" className="block text-xs font-semibold text-[#574D47] mb-1.5">
                  Komposisi Foto Natural
                </label>
                <select
                  id="mood-select"
                  value={config.naturalMood}
                  onChange={(e) => setConfig((prev) => ({ ...prev, naturalMood: e.target.value as NaturalMoodId }))}
                  className="w-full min-h-[44px] px-3 py-2 text-base md:text-xs font-medium bg-white border border-[#1A1412]/15 rounded-md text-[#1A1412] focus-visible:outline-2 focus-visible:outline-[#A67B38]"
                >
                  {(Object.keys(NATURAL_MOODS) as NaturalMoodId[]).map((key) => (
                    <option key={key} value={key}>
                      {NATURAL_MOODS[key].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="seal-select" className="block text-xs font-semibold text-[#574D47] mb-1.5">
                  Stempel KTH Jawa Timur
                </label>
                <select
                  id="seal-select"
                  value={config.sealPlacement}
                  onChange={(e) => setConfig((prev) => ({ ...prev, sealPlacement: e.target.value as SealPlacement }))}
                  className="w-full min-h-[44px] px-3 py-2 text-base md:text-xs font-medium bg-white border border-[#1A1412]/15 rounded-md text-[#1A1412] focus-visible:outline-2 focus-visible:outline-[#A67B38]"
                >
                  <option value="back">Panel Belakang (Elegan)</option>
                  <option value="front">Panel Depan (Seperti Draf 1)</option>
                  <option value="hidden">Sembunyikan (Seperti Draf 2)</option>
                </select>
              </div>

              <div className="flex flex-col justify-between">
                <span className="block text-xs font-semibold text-[#574D47] mb-1.5">Berat &amp; Garis Potong</span>
                <div className="flex items-center gap-2">
                  <select
                    aria-label="Berat Bersih"
                    value={config.netWeight}
                    onChange={(e) => setConfig((prev) => ({ ...prev, netWeight: e.target.value as WeightOption }))}
                    className="flex-1 min-h-[44px] px-2.5 py-2 text-base md:text-xs font-medium bg-white border border-[#1A1412]/15 rounded-md text-[#1A1412]"
                  >
                    <option value="250 gram">250 gram</option>
                    <option value="100 gram">100 gram</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setConfig((prev) => ({ ...prev, showPrintMarks: !prev.showPrintMarks }))}
                    className={`min-h-[44px] px-3 py-2 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      config.showPrintMarks
                        ? 'bg-[#1A1412] text-[#FAF5EB] border-[#1A1412]'
                        : 'bg-white text-[#574D47] border-[#1A1412]/15'
                    }`}
                  >
                    {config.showPrintMarks ? 'Bleed: ON' : 'Bleed: OFF'}
                  </button>
                </div>
              </div>
            </div>

            {/* Active Artwork Viewport */}
            <div className="mt-6">
              {viewMode === 'compare' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F6F5F2] px-4 py-2.5 rounded-lg border border-[#1A1412]/10">
                    <span className="text-xs font-medium text-[#574D47]">
                      Sudut Tampilan Pembanding (Selaras dengan Galeri Atas)
                    </span>
                    <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#E4DFD6] rounded-lg">
                      {(
                        [
                          { id: 'natural-kawi', label: 'Suasana Natural' },
                          { id: 'studio-front', label: 'Studio Depan' },
                          { id: 'studio-rear', label: 'Studio Belakang' },
                          { id: '3d-single', label: '3D Tunggal' },
                        ] as const
                      ).map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setCompareMode(mode.id)}
                          className={`px-3 py-1.5 min-h-[38px] text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                            compareMode === mode.id
                              ? 'bg-[#1A1412] text-[#FAF5EB]'
                              : 'text-[#574D47] hover:text-[#1A1412]'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ALL_ALTERNATIVE_IDS.map((shapeId) => {
                      const meta = POUCH_SHAPES[shapeId];
                      const specs = getWeightSpecs(shapeId, config.netWeight);
                      const isActive = config.pouchShape === shapeId;
                      return (
                        <div
                          key={shapeId}
                          className={`flex flex-col bg-[#F6F5F2] p-3 rounded-xl border transition-all ${
                            isActive ? 'border-[#8A6429] ring-1 ring-[#8A6429]' : 'border-[#1A1412]/10'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2.5 px-0.5 gap-2">
                            <button
                              type="button"
                              onClick={() => setConfig((prev) => ({ ...prev, pouchShape: shapeId }))}
                              className="min-w-0 text-left cursor-pointer"
                            >
                              <p className="text-xs font-semibold text-[#1A1412] leading-snug">
                                {meta.code} · {meta.shortLabel}
                                {isActive ? ' · Aktif' : ''}
                              </p>
                              <p className="font-mono text-[10px] text-[#574D47] tabular-nums">
                                {specs.dimensions} · {config.netWeight}
                              </p>
                              <p className="text-[10.5px] text-[#8A6429] leading-snug">
                                {meta.fonts.tagline.replace('Plus Jakarta Sans · ', '')}
                              </p>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setConfig((prev) => ({ ...prev, pouchShape: shapeId }));
                                setViewMode('dieline');
                              }}
                              className="min-h-[44px] px-2.5 flex items-center text-xs font-medium text-[#8A6429] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                            >
                              Lihat Dieline
                            </button>
                          </div>

                          {compareMode === '3d-single' ? (
                            <InteractivePouch3D
                              config={{ ...config, pouchShape: shapeId }}
                              backgroundOnly={previewBgOnly}
                            />
                          ) : (
                            <div
                              onClick={() => setConfig((prev) => ({ ...prev, pouchShape: shapeId }))}
                              className={`aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#C99C52]/20 cursor-pointer ${
                                compareMode === 'natural-kawi' ? 'bg-[#1D120D]' : 'bg-white'
                              }`}
                            >
                              <LiveMockupScene
                                config={{ ...config, pouchShape: shapeId }}
                                scene={compareMode}
                                size="card"
                                backgroundOnly={previewBgOnly}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {viewMode === 'dieline' && <FullPrintDieline config={config} backgroundOnly={previewBgOnly} />}

              {viewMode === 'front' && (
                <div className="bg-[#160F0C] rounded-xl p-8 border border-[#C99C52]/25 flex justify-center">
                  <div
                    className={`w-full ${
                      tall
                        ? 'max-w-[330px] aspect-[100/240] rounded-sm'
                        : isDoypack
                          ? 'max-w-[400px] aspect-[150/220] rounded-xl'
                          : 'max-w-[400px] aspect-[130/210] rounded-sm'
                    } overflow-hidden shadow-2xl ring-1 ring-[#D8B474]/30 origin-center transition-transform duration-200`}
                    style={{ transform: `scale(${activeWeightSpecs.visualScale})` }}
                  >
                    <FrontPanel
                      config={config}
                      showValveGraphic={isDoypack && !previewBgOnly}
                      compact={tall}
                      backgroundOnly={previewBgOnly}
                    />
                  </div>
                </div>
              )}

              {viewMode === 'back-gusset' && (
                <div className="bg-[#160F0C] rounded-xl p-6 sm:p-8 border border-[#C99C52]/25 flex flex-wrap items-center justify-center gap-6">
                  {!isDoypack && (
                    <div
                      className={`${
                        tall ? 'w-[155px] aspect-[65/240]' : 'w-[160px] aspect-[70/210]'
                      } rounded-sm overflow-hidden shadow-xl ring-1 ring-[#D8B474]/25`}
                    >
                      <SideGussetPanel config={config} side="left" backgroundOnly={previewBgOnly} />
                    </div>
                  )}
                  <div
                    className={`w-full ${
                      tall
                        ? 'max-w-[330px] aspect-[100/240] rounded-sm'
                        : isDoypack
                          ? 'max-w-[390px] aspect-[150/220] rounded-xl'
                          : 'max-w-[390px] aspect-[130/210] rounded-sm'
                    } overflow-hidden shadow-2xl ring-1 ring-[#D8B474]/30`}
                  >
                    <BackPanel config={config} backgroundOnly={previewBgOnly} />
                  </div>
                  {!isDoypack && (
                    <div
                      className={`${
                        tall ? 'w-[155px] aspect-[65/240]' : 'w-[160px] aspect-[70/210]'
                      } rounded-sm overflow-hidden shadow-xl ring-1 ring-[#D8B474]/25`}
                    >
                      <SideGussetPanel config={config} side="right" backgroundOnly={previewBgOnly} />
                    </div>
                  )}
                </div>
              )}

              {viewMode === 'pouch-3d' && <InteractivePouch3D config={config} backgroundOnly={previewBgOnly} />}
            </div>
          </div>
        </section>

        <DesignCritiqueSection config={config} />
        <DesignElementsKit config={config} onExport={handleExport} isExporting={isExporting} />
        <PouchSizeGuideSection
          config={config}
          onApplyPreset={(shape, weight) => {
            setConfig((prev) => ({
              ...prev,
              pouchShape: shape,
              netWeight: weight,
            }));
          }}
        />
        <PrintSpecsSection
          config={config}
          onExport={handleExport}
          isExporting={isExporting}
          onExportPdf={handleExportPdf}
          isExportingPdf={isExportingPdf}
        />
      </main>

      <footer className="border-t border-[#1A1412]/10 pt-8 pb-[calc(5.25rem+env(safe-area-inset-bottom))] md:pb-8 bg-[#F6F5F2]">
        <div className="max-w-[1360px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#574D47]">
          <p className="font-serif text-base font-semibold text-[#1A1412]">PackagingStudio</p>
          <p>
            Proyek Aktif: Arunika Kawi · Kemasan Full Print · {config.netWeight} · {activeVariantMeta.frontLabel}
          </p>
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
}
