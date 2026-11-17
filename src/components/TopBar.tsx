import { Download } from 'lucide-react';

interface TopBarProps {
  onDownloadClick: () => void;
  isExporting: boolean;
}

export function TopBar({ onDownloadClick, isExporting }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#F6F5F2]/98 md:bg-[#F6F5F2]/92 md:backdrop-blur-md border-b border-[#1A1412]/10">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        <a
          href="#mockup-studio"
          className="font-serif text-xl font-semibold tracking-wide text-[#1A1412] whitespace-nowrap shrink-0 min-h-[44px] inline-flex items-center"
        >
          PackagingStudio
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5A4F48]">
          <a
            href="#mockup-studio"
            className="min-h-[44px] inline-flex items-center hover:text-[#1A1412] transition-colors whitespace-nowrap shrink-0"
          >
            Mockup Studio
          </a>
          <a
            href="#full-print"
            className="min-h-[44px] inline-flex items-center hover:text-[#1A1412] transition-colors whitespace-nowrap shrink-0"
          >
            Desain Full Print
          </a>
          <a
            href="#analisis-revisi"
            className="min-h-[44px] inline-flex items-center hover:text-[#1A1412] transition-colors whitespace-nowrap shrink-0"
          >
            Analisis Revisi
          </a>
          <a
            href="#kit-elemen"
            className="min-h-[44px] inline-flex items-center hover:text-[#1A1412] transition-colors whitespace-nowrap shrink-0"
          >
            Kit Elemen
          </a>
          <a
            href="#spesifikasi-cetak"
            className="min-h-[44px] inline-flex items-center hover:text-[#1A1412] transition-colors whitespace-nowrap shrink-0"
          >
            Spesifikasi Cetak
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onDownloadClick}
            disabled={isExporting}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 text-xs font-semibold tracking-wide text-[#F9F6F0] bg-[#1A1412] hover:bg-[#31221B] disabled:opacity-60 transition-colors rounded-md whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A67B38]"
          >
            <Download className="w-3.5 h-3.5 text-[#D8B474]" />
            <span>{isExporting ? 'Memproses...' : 'Unduh File Cetak'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
