export const BOTANICAL_VIEWBOX = '0 0 180 200';

export interface BotanicalLeafSpec {
  /** Leaf outline path (closed) */
  outline: string;
  /** Central midrib vein path */
  midrib: string;
  /** Secondary lateral feather veins */
  veins: string[];
}

export interface BotanicalCherrySpec {
  cx: number;
  cy: number;
  r: number;
  stem?: string;
}

/**
 * Rich gold-foil coffee botanical branch & cherry corner motif (180x200).
 * Designed anchored at the top-left corner (0, 0) and cleanly mirrored for
 * top-right, bottom-left, bottom-right, and lower gusset corners.
 */
export const BOTANICAL_STEM_PATHS: string[] = [
  // Primary sweeping diagonal stem
  'M 4 2 C 24 28, 50 64, 72 108 C 82 128, 92 148, 102 172',
  // Upper horizontal branch toward top margin
  'M 18 18 C 44 20, 74 26, 114 40',
  // Secondary top-edge twig
  'M 56 22 C 74 14, 96 12, 122 18',
  // Outer-edge descending branch
  'M 24 38 C 16 68, 14 102, 22 146',
  // Inner mid-twig
  'M 52 74 C 72 78, 92 90, 110 108',
];

export const BOTANICAL_LEAF_SPECS: BotanicalLeafSpec[] = [
  // 1. Large top-right sweeping coffee leaf
  {
    outline: 'M 72 24 C 86 10, 114 10, 134 22 C 116 36, 90 36, 72 24 Z',
    midrib: 'M 72 24 C 94 21, 114 21, 133 22',
    veins: [
      'M 86 22 Q 94 16 102 14',
      'M 100 21 Q 108 16 116 15',
      'M 88 24 Q 95 30 103 31',
      'M 102 23 Q 110 28 118 29',
    ],
  },
  // 2. Top-center upper accent leaf
  {
    outline: 'M 36 14 C 46 2, 70 2, 86 12 C 70 22, 48 22, 36 14 Z',
    midrib: 'M 37 14 C 54 12, 70 12, 85 12',
    veins: [
      'M 48 13 Q 54 8 61 6',
      'M 61 12 Q 67 8 73 7',
      'M 50 14 Q 56 19 63 19',
      'M 63 13 Q 69 17 75 18',
    ],
  },
  // 3. Upper-mid diagonal leaf pointing inward
  {
    outline: 'M 56 72 C 74 56, 102 58, 120 74 C 102 88, 74 88, 56 72 Z',
    midrib: 'M 57 72 C 78 70, 99 71, 119 74',
    veins: [
      'M 70 71 Q 79 64 88 62',
      'M 86 71 Q 95 65 104 65',
      'M 72 73 Q 81 80 90 82',
      'M 88 73 Q 96 79 105 80',
    ],
  },
  // 4. Outer-left descending large leaf
  {
    outline: 'M 22 60 C 4 74, 4 104, 18 122 C 34 106, 34 78, 22 60 Z',
    midrib: 'M 22 61 C 19 82, 18 102, 18 121',
    veins: [
      'M 20 74 Q 14 82 11 90',
      'M 19 90 Q 13 98 12 106',
      'M 21 75 Q 27 83 28 92',
      'M 20 91 Q 25 98 25 107',
    ],
  },
  // 5. Lower-mid sweeping leaf
  {
    outline: 'M 72 108 C 92 98, 114 106, 126 126 C 106 132, 84 124, 72 108 Z',
    midrib: 'M 73 109 C 92 114, 109 119, 125 126',
    veins: [
      'M 85 112 Q 94 107 103 107',
      'M 99 116 Q 108 112 115 113',
      'M 84 114 Q 91 121 98 124',
      'M 98 118 Q 105 124 111 126',
    ],
  },
  // 6. Terminal tapered leaf at branch tip
  {
    outline: 'M 94 146 C 106 156, 112 178, 102 194 C 88 182, 84 162, 94 146 Z',
    midrib: 'M 94 147 C 98 164, 100 179, 102 193',
    veins: [
      'M 96 158 Q 102 164 105 170',
      'M 98 171 Q 104 176 105 182',
      'M 95 160 Q 90 166 90 173',
      'M 97 173 Q 93 178 94 184',
    ],
  },
  // 7. Outer bottom bud leaf
  {
    outline: 'M 22 132 C 8 144, 10 166, 24 178 C 36 164, 34 144, 22 132 Z',
    midrib: 'M 22 133 C 22 149, 22 163, 24 177',
    veins: [
      'M 22 145 Q 16 151 15 158',
      'M 23 158 Q 18 164 18 170',
      'M 23 146 Q 28 152 29 159',
      'M 24 159 Q 28 164 28 169',
    ],
  },
];

export const BOTANICAL_CHERRIES: BotanicalCherrySpec[] = [
  // Cluster 1 near upper node
  { cx: 38, cy: 36, r: 6.2, stem: 'M 32 30 L 38 36' },
  { cx: 49, cy: 43, r: 6.8, stem: 'M 38 34 L 49 43' },
  { cx: 34, cy: 49, r: 5.8, stem: 'M 32 39 L 34 49' },
  { cx: 46, cy: 56, r: 6.0, stem: 'M 42 48 L 46 56' },
  // Cluster 2 near mid stem junction
  { cx: 58, cy: 90, r: 6.2, stem: 'M 54 81 L 58 90' },
  { cx: 69, cy: 95, r: 6.6, stem: 'M 62 86 L 69 95' },
  { cx: 52, cy: 103, r: 5.6, stem: 'M 55 96 L 52 103' },
  { cx: 64, cy: 108, r: 5.8, stem: 'M 63 100 L 64 108' },
  // Cluster 3 along top horizontal branch
  { cx: 92, cy: 38, r: 5.2, stem: 'M 86 32 L 92 38' },
  { cx: 103, cy: 44, r: 5.5, stem: 'M 94 35 L 103 44' },
  { cx: 88, cy: 49, r: 4.8, stem: 'M 88 41 L 88 49' },
];

export function drawBotanicalCornerCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  options: {
    flipX?: boolean;
    flipY?: boolean;
    opacity?: number;
  } = {}
) {
  const { flipX = false, flipY = false, opacity = 0.9 } = options;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(flipX ? x + w : x, flipY ? y + h : y);
  ctx.scale((flipX ? -1 : 1) * (w / 180), (flipY ? -1 : 1) * (h / 200));

  const goldGrad = ctx.createLinearGradient(0, 0, 140, 180);
  goldGrad.addColorStop(0, '#F5E4BC');
  goldGrad.addColorStop(0.45, '#D8B474');
  goldGrad.addColorStop(1, '#9E7334');

  // 1. Branching stems
  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const d of BOTANICAL_STEM_PATHS) {
    ctx.stroke(new Path2D(d));
  }

  // 2. Coffee leaves with central midribs & lateral veins
  for (const leaf of BOTANICAL_LEAF_SPECS) {
    const outlinePath = new Path2D(leaf.outline);
    ctx.fillStyle = 'rgba(216, 180, 116, 0.11)';
    ctx.fill(outlinePath);

    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 1.25;
    ctx.stroke(outlinePath);

    ctx.lineWidth = 0.9;
    ctx.stroke(new Path2D(leaf.midrib));

    ctx.save();
    ctx.globalAlpha = opacity * 0.68;
    ctx.lineWidth = 0.65;
    for (const vein of leaf.veins) {
      ctx.stroke(new Path2D(vein));
    }
    ctx.restore();
  }

  // 3. Coffee cherry clusters with pedicels, highlight & calyx dot
  for (const ch of BOTANICAL_CHERRIES) {
    if (ch.stem) {
      ctx.strokeStyle = goldGrad;
      ctx.lineWidth = 1.05;
      ctx.stroke(new Path2D(ch.stem));
    }
    ctx.fillStyle = 'rgba(216, 180, 116, 0.2)';
    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.arc(ch.cx, ch.cy, ch.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner specular crescent
    ctx.save();
    ctx.strokeStyle = '#F9ECCD';
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.arc(ch.cx - ch.r * 0.22, ch.cy - ch.r * 0.22, ch.r * 0.45, Math.PI * 0.9, Math.PI * 1.65);
    ctx.stroke();
    ctx.restore();

    // Calyx tip dimple
    ctx.fillStyle = '#EBD39F';
    ctx.beginPath();
    ctx.arc(ch.cx + ch.r * 0.34, ch.cy + ch.r * 0.32, Math.max(0.9, ch.r * 0.16), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
