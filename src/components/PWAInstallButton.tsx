import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 text-sm font-semibold text-[#1A1412] bg-white hover:bg-[#EFECE6] border border-[#1A1412]/20 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Download className="w-4 h-4 text-[#8A6429]" />
        <span>Pasang Aplikasi (PWA)</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 text-sm font-semibold text-[#1A1412] bg-white hover:bg-[#EFECE6] border border-[#1A1412]/20 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Smartphone className="w-4 h-4 text-[#8A6429]" />
          <span>Pasang di iPhone / iPad</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="w-full max-w-sm max-h-[90dvh] overflow-y-auto rounded-xl bg-[#F6F5F2] border border-[#1A1412]/15 p-6 shadow-xl text-[#1A1412]">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-serif text-xl font-semibold">Pasang di iPhone / iPad</h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md hover:bg-[#E7E2D8] cursor-pointer"
                  aria-label="Tutup panduan pasang"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="mt-3 space-y-2 text-sm text-[#574D47] list-decimal list-inside">
                <li>
                  Ketuk tombol <strong className="text-[#1A1412]">Share</strong> (kotak dengan panah ke atas) pada bilah
                  Safari.
                </li>
                <li>
                  Gulir ke bawah dan ketuk <strong className="text-[#1A1412]">Add to Home Screen</strong> (Tambah ke Layar
                  Utama).
                </li>
                <li>
                  Ketuk <strong className="text-[#1A1412]">Add</strong> untuk menjalankan studio desain seperti aplikasi
                  mandiri.
                </li>
              </ol>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full min-h-[44px] rounded-lg bg-[#1A1412] text-[#FAF5EB] text-sm font-semibold hover:bg-[#31221B] cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
