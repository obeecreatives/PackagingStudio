import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Laptop, Smartphone, Tablet, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'hero' | 'navbar';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'hero' }) => {
  const { isInstallable, isInstalled, platform, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'desktop' | 'android' | 'ios'>(() => {
    if (platform === 'ios') return 'ios';
    if (platform === 'android') return 'android';
    return 'desktop';
  });

  useEffect(() => {
    if (!showGuide) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowGuide(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showGuide]);

  if (isInstalled) {
    return null;
  }

  const handleTrigger = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuide(true);
      }
      return;
    }
    setActiveTab(platform === 'ios' ? 'ios' : platform === 'android' ? 'android' : 'desktop');
    setShowGuide(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleTrigger}
        title="Pasang PackagingStudio sebagai aplikasi mandiri di Laptop, PC, Tablet, atau Handphone"
        className={
          variant === 'navbar'
            ? 'inline-flex items-center justify-center gap-1.5 min-h-[44px] px-2.5 sm:px-3 py-2 text-xs font-semibold text-[#1A1412] bg-[#EFECE6] hover:bg-[#E5E0D7] border border-[#1A1412]/15 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A67B38]'
            : 'inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 text-sm font-semibold text-[#1A1412] bg-white hover:bg-[#EFECE6] border border-[#1A1412]/20 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A67B38]'
        }
      >
        {platform === 'ios' || platform === 'android' ? (
          <Smartphone className={variant === 'navbar' ? 'w-3.5 h-3.5 text-[#8A6429]' : 'w-4 h-4 text-[#8A6429]'} />
        ) : (
          <Download className={variant === 'navbar' ? 'w-3.5 h-3.5 text-[#8A6429]' : 'w-4 h-4 text-[#8A6429]'} />
        )}
        {variant === 'navbar' ? (
          <>
            <span className="sm:hidden">Pasang</span>
            <span className="hidden sm:inline">Pasang App</span>
          </>
        ) : (
          <span>
            {isInstallable ? 'Pasang Aplikasi (PC · Tablet · HP)' : 'Pasang di Laptop, Tablet & HP'}
          </span>
        )}
      </button>

      {showGuide &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pwa-install-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowGuide(false);
            }}
          >
            <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-xl bg-[#F6F5F2] border border-[#1A1412]/15 p-6 shadow-2xl text-[#1A1412]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A6429]">
                  Aplikasi Mandiri (Offline Ready)
                </p>
                <h3 id="pwa-install-title" className="mt-0.5 font-serif text-2xl font-semibold text-[#1A1412]">
                  Pasang PackagingStudio
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md hover:bg-[#E7E2D8] cursor-pointer shrink-0"
                aria-label="Tutup panduan pasang aplikasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-[#574D47] leading-relaxed">
              Jalankan studio desain langsung dari Start Menu, Desktop, Dock, atau Home Screen tanpa bilah browser dan
              tetap berfungsi saat offline.
            </p>

            {isInstallable && (
              <button
                type="button"
                onClick={async () => {
                  const ok = await install();
                  if (ok) setShowGuide(false);
                }}
                className="mt-4 w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg bg-[#8A6429] hover:bg-[#73511D] text-[#FAF5EB] text-sm font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Pasang Otomatis Sekarang</span>
              </button>
            )}

            {/* Platform Switcher Tabs */}
            <div className="mt-4 grid grid-cols-3 gap-1 p-1 bg-[#E7E2D8] rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'desktop' ? 'bg-[#1A1412] text-[#FAF5EB]' : 'text-[#574D47] hover:text-[#1A1412]'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Laptop / PC</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'android' ? 'bg-[#1A1412] text-[#FAF5EB]' : 'text-[#574D47] hover:text-[#1A1412]'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Android / Tab</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'ios' ? 'bg-[#1A1412] text-[#FAF5EB]' : 'text-[#574D47] hover:text-[#1A1412]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>
            </div>

            <div className="mt-4 rounded-lg bg-[#EFECE6] border border-[#1A1412]/10 p-4 text-xs text-[#574D47] leading-relaxed">
              {activeTab === 'desktop' && (
                <div className="space-y-2.5">
                  <p className="font-semibold text-[#1A1412]">Windows, Mac &amp; Linux (Chrome / Edge / Safari):</p>
                  <ol className="space-y-1.5 list-decimal list-inside">
                    <li>
                      <strong className="text-[#1A1412]">Google Chrome:</strong> Klik ikon{' '}
                      <strong className="text-[#1A1412]">Install / Layar + Panah</strong> di ujung kanan address bar
                      (atau menu <strong className="text-[#1A1412]">⋮ → Cast, save, and share → Install PackagingStudio</strong>).
                    </li>
                    <li>
                      <strong className="text-[#1A1412]">Microsoft Edge:</strong> Klik ikon{' '}
                      <strong className="text-[#1A1412]">Apps (+)</strong> di address bar atau menu{' '}
                      <strong className="text-[#1A1412]">⋯ → Apps → Install this site as an app</strong>.
                    </li>
                    <li>
                      <strong className="text-[#1A1412]">Safari macOS:</strong> Klik menu{' '}
                      <strong className="text-[#1A1412]">File → Add to Dock...</strong> untuk menyematkan aplikasi di
                      Dock &amp; Launchpad.
                    </li>
                  </ol>
                </div>
              )}

              {activeTab === 'android' && (
                <div className="space-y-2.5">
                  <p className="font-semibold text-[#1A1412]">Handphone &amp; Tablet Android:</p>
                  <ol className="space-y-1.5 list-decimal list-inside">
                    <li>
                      Buka alamat web ini di <strong className="text-[#1A1412]">Chrome</strong>,{' '}
                      <strong className="text-[#1A1412]">Edge</strong>, atau{' '}
                      <strong className="text-[#1A1412]">Samsung Internet</strong>.
                    </li>
                    <li>
                      Ketuk tombol menu <strong className="text-[#1A1412]">⋮</strong> (kanan atas) atau ikon panah
                      unduh.
                    </li>
                    <li>
                      Pilih <strong className="text-[#1A1412]">Add to Home screen / Install app</strong>, lalu ketuk{' '}
                      <strong className="text-[#1A1412]">Install</strong>.
                    </li>
                  </ol>
                </div>
              )}

              {activeTab === 'ios' && (
                <div className="space-y-2.5">
                  <p className="font-semibold text-[#1A1412]">iPhone &amp; iPad (Safari):</p>
                  <ol className="space-y-1.5 list-decimal list-inside">
                    <li>
                      Pastikan halaman dibuka menggunakan browser <strong className="text-[#1A1412]">Safari</strong>.
                    </li>
                    <li>
                      Ketuk tombol <strong className="text-[#1A1412]">Share</strong> (kotak dengan panah ke atas) di
                      toolbar Safari.
                    </li>
                    <li>
                      Gulir ke bawah dan ketuk <strong className="text-[#1A1412]">Add to Home Screen</strong>, lalu ketuk{' '}
                      <strong className="text-[#1A1412]">Add</strong>.
                    </li>
                  </ol>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full min-h-[44px] rounded-lg bg-[#1A1412] text-[#FAF5EB] text-sm font-semibold hover:bg-[#31221B] transition-colors cursor-pointer"
            >
              Tutup
            </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
