import React from 'react';
import { Layers, LayoutGrid, Package, SlidersHorizontal } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const items = [
    { href: '#mockup-studio', label: 'Hero', icon: Package },
    { href: '#semua-alternatif', label: '5 Desain', icon: LayoutGrid },
    { href: '#full-print', label: 'Studio', icon: SlidersHorizontal },
    { href: '#spesifikasi-cetak', label: 'Cetak', icon: Layers },
  ];

  return (
    <nav
      aria-label="Navigasi cepat mobile"
      className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-[#F6F5F2] border-t border-[#1A1412]/12 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-4 px-2 py-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className="min-h-[44px] flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-[#574D47] active:text-[#1A1412] rounded-md whitespace-nowrap"
            >
              <Icon className="w-4 h-4 text-[#8A6429]" aria-hidden="true" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};
