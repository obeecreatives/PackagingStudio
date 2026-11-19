import React, { useId } from 'react';
import {
  ARUNIKA_GLYPHS,
  ARUNIKA_WORDMARK_VIEWBOX,
  KAWI_GLYPHS,
} from '../utils/arunikaWordmarkPaths';
import {
  BOTANICAL_CHERRIES,
  BOTANICAL_LEAF_SPECS,
  BOTANICAL_STEM_PATHS,
  BOTANICAL_VIEWBOX,
} from '../utils/botanicalPaths';

export function ArunikaKawiWordmark({
  className = 'w-[62cqi] h-auto',
  tone = 'gold-foil',
}: {
  className?: string;
  tone?: 'gold-foil' | 'dark-ink';
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const gradId = `arunikaWordmark-${uid}`;
  const shadowId = `arunikaShadow-${uid}`;

  return (
    <svg
      viewBox={ARUNIKA_WORDMARK_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="ARUNIKA KAWI"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="10" x2="490" y2="123" gradientUnits="userSpaceOnUse">
          {tone === 'dark-ink' ? (
            <>
              <stop offset="0%" stopColor="#1E130D" />
              <stop offset="50%" stopColor="#3B2518" />
              <stop offset="100%" stopColor="#1A110B" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#B98A42" />
              <stop offset="28%" stopColor="#E4C482" />
              <stop offset="50%" stopColor="#F6E4BB" />
              <stop offset="75%" stopColor="#D2A55B" />
              <stop offset="100%" stopColor="#AE7F39" />
            </>
          )}
        </linearGradient>
        <filter id={shadowId} x="-6%" y="-10%" width="112%" height="128%">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2.5"
            floodColor={tone === 'dark-ink' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.85)'}
          />
        </filter>
      </defs>
      <g filter={tone === 'dark-ink' ? undefined : `url(#${shadowId})`}>
        {ARUNIKA_GLYPHS.map((glyph, idx) => (
          <path
            key={`a-${idx}`}
            d={glyph.d}
            fill={`url(#${gradId})`}
            fillRule={glyph.evenOdd ? 'evenodd' : 'nonzero'}
          />
        ))}
        {KAWI_GLYPHS.map((glyph, idx) => (
          <path
            key={`k-${idx}`}
            d={glyph.d}
            fill={`url(#${gradId})`}
            fillRule={glyph.evenOdd ? 'evenodd' : 'nonzero'}
          />
        ))}
      </g>
    </svg>
  );
}

export function ArunikaSunBeanCrest({ className = 'w-11 h-11' }: { className?: string }) {
  const gradId = `sunbean-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="10" y1="8" x2="70" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F2DFB3" />
          <stop offset="48%" stopColor="#C99C52" />
          <stop offset="100%" stopColor="#8C6429" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="42" r="29" stroke={`url(#${gradId})`} strokeWidth="1.6" />
      <circle cx="40" cy="42" r="25.5" stroke={`url(#${gradId})`} strokeWidth="0.6" strokeOpacity="0.55" />

      <path
        d="M40 7V12M25.5 11.5L28 15.5M54.5 11.5L52 15.5"
        stroke={`url(#${gradId})`}
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M36 33C36 27 42 25 39 19"
        stroke={`url(#${gradId})`}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M44 33C44 28 48 26.5 46.5 22"
        stroke={`url(#${gradId})`}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />

      <g transform="translate(22 36) rotate(-22 10 12)">
        <ellipse cx="10" cy="12" rx="7.5" ry="10.5" fill={`url(#${gradId})`} fillOpacity="0.22" stroke={`url(#${gradId})`} strokeWidth="1.5" />
        <path d="M10 3C8.2 8.5 11.8 15.5 10 21" stroke={`url(#${gradId})`} strokeWidth="1.3" strokeLinecap="round" />
      </g>
      <g transform="translate(38 36) rotate(22 10 12)">
        <ellipse cx="10" cy="12" rx="7.5" ry="10.5" fill={`url(#${gradId})`} fillOpacity="0.22" stroke={`url(#${gradId})`} strokeWidth="1.5" />
        <path d="M10 3C11.8 8.5 8.2 15.5 10 21" stroke={`url(#${gradId})`} strokeWidth="1.3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function RoastProfileCrest({
  topText,
  bottomText,
  className = '',
}: {
  topText: string;
  bottomText: string;
  className?: string;
}) {
  const crestGradId = `roast-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg viewBox="0 0 180 108" fill="none" className={className} aria-label={`${topText} ${bottomText}`}>
      <defs>
        <linearGradient id={crestGradId} x1="0" y1="0" x2="180" y2="108" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EBD39F" />
          <stop offset="50%" stopColor="#C69A50" />
          <stop offset="100%" stopColor="#9A6F2E" />
        </linearGradient>
      </defs>
      <path
        d="M42 26C52 14 69 9 90 9C111 9 128 14 138 26C155 28 167 40 167 54C167 68 155 80 138 82C128 93 111 99 90 99C69 99 52 93 42 82C25 80 13 68 13 54C13 40 25 28 42 26Z"
        fill="rgba(20, 11, 7, 0.55)"
        stroke={`url(#${crestGradId})`}
        strokeWidth="1.6"
      />
      <path
        d="M46 30C55 20 71 15 90 15C109 15 125 20 134 30C148 32 159 42 159 54C159 66 148 76 134 78C125 88 109 93 90 93C71 93 55 88 46 78C32 76 21 66 21 54C21 42 32 32 46 30Z"
        stroke={`url(#${crestGradId})`}
        strokeWidth="0.6"
        strokeOpacity="0.55"
      />
      <text
        x="90"
        y="47"
        textAnchor="middle"
        fill="#F4E6C8"
        fontSize="11.5"
        fontWeight="600"
        fontFamily="Plus Jakarta Sans, sans-serif"
        letterSpacing="2.4"
      >
        {topText}
      </text>
      <text
        x="90"
        y="71"
        textAnchor="middle"
        fill="#D8B474"
        fontSize="21"
        fontWeight="700"
        fontFamily="Cormorant Garamond, Georgia, serif"
        letterSpacing="2.6"
      >
        {bottomText}
      </text>
    </svg>
  );
}

export function MandalaHeritageCrest({
  label,
  className = 'w-32 h-32',
  compact = false,
}: {
  label: string;
  className?: string;
  compact?: boolean;
}) {
  const gradId = `mandala-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  const words = label.split(' ');
  const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');

  return (
    <svg viewBox="0 0 160 160" fill="none" className={className} aria-label={label}>
      <defs>
        <linearGradient id={gradId} x1="16" y1="16" x2="144" y2="144" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F2DFB3" />
          <stop offset="50%" stopColor="#C99C52" />
          <stop offset="100%" stopColor="#8C6429" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="80" r="72" fill="rgba(22, 12, 8, 0.72)" stroke={`url(#${gradId})`} strokeWidth="1.5" />
      <circle cx="80" cy="80" r="56" stroke={`url(#${gradId})`} strokeWidth="1.2" />
      <circle cx="80" cy="80" r="51" stroke={`url(#${gradId})`} strokeWidth="0.6" strokeOpacity="0.6" />
      {petals.map((deg) => (
        <g key={deg} transform={`rotate(${deg} 80 80)`}>
          <path
            d="M80 10C84 16 84 22 80 24C76 22 76 16 80 10Z"
            stroke={`url(#${gradId})`}
            strokeWidth="0.9"
            fill="rgba(214, 179, 115, 0.14)"
          />
          <circle cx="80" cy="19" r="1.2" fill={`url(#${gradId})`} />
        </g>
      ))}
      <text
        x="80"
        y={line2 ? '74' : '84'}
        textAnchor="middle"
        fill="#FAF5EB"
        fontSize={compact ? '11.5' : '13.5'}
        fontWeight="600"
        fontFamily="Cormorant Garamond, Georgia, serif"
      >
        {line1}
      </text>
      {line2 && (
        <text
          x="80"
          y="92"
          textAnchor="middle"
          fill="#E9C98E"
          fontSize={compact ? '11.5' : '13.5'}
          fontWeight="600"
          fontFamily="Cormorant Garamond, Georgia, serif"
        >
          {line2}
        </text>
      )}
    </svg>
  );
}

export function BotanicalCornerArt({ className = '' }: { className?: string }) {
  const gradId = `botanical-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg viewBox={BOTANICAL_VIEWBOX} fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="140" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F5E4BC" />
          <stop offset="45%" stopColor="#D8B474" />
          <stop offset="100%" stopColor="#9E7334" />
        </linearGradient>
      </defs>

      {BOTANICAL_STEM_PATHS.map((d, idx) => (
        <path
          key={`stem-${idx}`}
          d={d}
          stroke={`url(#${gradId})`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {BOTANICAL_LEAF_SPECS.map((leaf, idx) => (
        <g key={`leaf-${idx}`}>
          <path
            d={leaf.outline}
            fill="rgba(216, 180, 116, 0.11)"
            stroke={`url(#${gradId})`}
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
          <path d={leaf.midrib} stroke={`url(#${gradId})`} strokeWidth="0.9" strokeLinecap="round" />
          {leaf.veins.map((v, vIdx) => (
            <path
              key={vIdx}
              d={v}
              stroke={`url(#${gradId})`}
              strokeWidth="0.65"
              strokeOpacity="0.7"
              strokeLinecap="round"
            />
          ))}
        </g>
      ))}

      {BOTANICAL_CHERRIES.map((ch, idx) => (
        <g key={`cherry-${idx}`}>
          {ch.stem && (
            <path d={ch.stem} stroke={`url(#${gradId})`} strokeWidth="1.05" strokeLinecap="round" />
          )}
          <circle
            cx={ch.cx}
            cy={ch.cy}
            r={ch.r}
            fill="rgba(216, 180, 116, 0.2)"
            stroke={`url(#${gradId})`}
            strokeWidth="1.25"
          />
          <circle cx={ch.cx + ch.r * 0.34} cy={ch.cy + ch.r * 0.32} r={Math.max(0.9, ch.r * 0.16)} fill="#EBD39F" />
        </g>
      ))}
    </svg>
  );
}

export function KthEastJavaSeal({
  className = 'w-16 h-16',
  variant = 'gold-heritage',
}: {
  className?: string;
  variant?: 'gold-heritage' | 'original-green';
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const topArcId = `topArc-${uid}`;
  const bottomArcId = `bottomArc-${uid}`;
  const strokeColor = variant === 'gold-heritage' ? '#D6B373' : '#7BA63F';
  const fillBg = variant === 'gold-heritage' ? '#1E140E' : '#2E4F1D';
  const mountainFill = variant === 'gold-heritage' ? '#5E4B2C' : '#58812B';
  const textColor = variant === 'gold-heritage' ? '#F1DEC0' : '#EBF4D6';

  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-label="Produk Asli Kelompok Tani Hutan Jawa Timur">
      <circle cx="60" cy="60" r="56" fill={fillBg} stroke={strokeColor} strokeWidth="2.5" />
      <circle cx="60" cy="60" r="39" fill="#2A1D14" stroke={strokeColor} strokeWidth="1.2" />

      <defs>
        <path id={topArcId} d="M 16,60 A 44,44 0 1,1 104,60" />
        <path id={bottomArcId} d="M 107,60 A 47,47 0 1,1 13,60" />
      </defs>

      <text fill={textColor} fontSize="8.3" fontWeight="700" letterSpacing="1.6">
        <textPath href={`#${topArcId}`} xlinkHref={`#${topArcId}`} startOffset="50%" textAnchor="middle">
          PRODUK ASLI
        </textPath>
      </text>

      <text fill={textColor} fontSize="6.7" fontWeight="600" letterSpacing="0.85">
        <textPath href={`#${bottomArcId}`} xlinkHref={`#${bottomArcId}`} startOffset="50%" textAnchor="middle">
          KELOMPOK TANI HUTAN
        </textPath>
      </text>

      <path d="M25 74L48 41L60 55L73 37L95 74H25Z" fill={mountainFill} opacity="0.9" />
      <path d="M40 74L60 47L80 74H40Z" fill={strokeColor} opacity="0.35" />

      <ellipse cx="20" cy="61" rx="2.5" ry="4.5" transform="rotate(-25 20 61)" fill={strokeColor} />
      <ellipse cx="100" cy="61" rx="2.5" ry="4.5" transform="rotate(25 100 61)" fill={strokeColor} />

      <rect x="31" y="69" width="58" height="11" rx="2" fill="#170F0A" stroke={strokeColor} strokeWidth="0.9" />
      <text
        x="60"
        y="77"
        textAnchor="middle"
        fill={textColor}
        fontSize="6.8"
        fontWeight="700"
        letterSpacing="1.2"
      >
        JAWA TIMUR
      </text>
    </svg>
  );
}

export function Ean13Barcode({ className = 'w-28 h-12' }: { className?: string }) {
  const bars = [2, 1, 2, 1, 3, 1, 1, 2, 1, 4, 1, 1, 2, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 1, 1, 2];
  let x = 16.2;
  return (
    <svg viewBox="0 0 130 56" className={className} aria-label="Barcode 8997024192504">
      <rect x="0" y="0" width="130" height="56" rx="2" fill="#F7F2E8" />
      {bars.map((w, idx) => {
        const currentX = x;
        x += w + (idx % 2 === 0 ? 1.5 : 1.1);
        if (idx % 2 === 0) {
          return <rect key={idx} x={currentX} y="6" width={w * 1.1} height="34" fill="#1A120D" />;
        }
        return null;
      })}
      <text
        x="65"
        y="50"
        textAnchor="middle"
        fill="#1A120D"
        fontSize="8.5"
        fontFamily="IBM Plex Mono, monospace"
        letterSpacing="2"
      >
        8 997024 192504
      </text>
    </svg>
  );
}
