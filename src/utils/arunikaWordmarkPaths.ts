export interface VectorPathGlyph {
  d: string;
  evenOdd?: boolean;
}

export const ARUNIKA_WORDMARK_VIEWBOX = '0 0 490 132';
export const ARUNIKA_WORDMARK_W = 490;
export const ARUNIKA_WORDMARK_H = 132;

// Optical aspect ratio (height / width)
export const ARUNIKA_WORDMARK_ASPECT = ARUNIKA_WORDMARK_H / ARUNIKA_WORDMARK_W;

// Bespoke flared swash serif paths for "ARUNIKA" matching arunika-referensi-revised-final
export const ARUNIKA_GLYPHS: VectorPathGlyph[] = [
  // First A (top-left flared beak + sweeping right calligraphic swash tail)
  {
    evenOdd: true,
    d: [
      'M 31 10',
      'C 36 10.6, 41 10, 46.5 10',
      'L 63 50',
      'C 68.5 63.5, 75 72.5, 86.5 74',
      'C 80 78, 71.5 77.5, 65 73',
      'C 59 68, 56 59, 53.5 51',
      'L 30.5 51',
      'L 24.5 65.2',
      'C 25 66.8, 27 67.2, 29.8 67.4',
      'L 29.8 68.6',
      'L 12 68.6',
      'L 12 67.4',
      'C 15.5 67.1, 17.5 66, 18.8 63',
      'L 37.5 17.5',
      'C 36 13.5, 34 11.5, 31 11.2',
      'Z',
      'M 42.2 22.5 L 32 47.5 L 52.2 47.5 Z',
    ].join(' '),
  },
  // R (flared serif bowl + graceful sweeping S-curve leg)
  {
    evenOdd: true,
    d: [
      'M 82 10',
      'L 114 10',
      'C 127.5 10, 134.5 16.5, 134.5 25.5',
      'C 134.5 34.2, 127 39.8, 114.5 40.6',
      'C 120.5 46, 126.5 55, 132 63.5',
      'C 136 69, 140.5 71.2, 146.5 70.5',
      'C 142.5 74.2, 135 74.8, 129 70.8',
      'C 122 65.8, 115 53.5, 104 41.2',
      'L 97 41.2',
      'L 97 62',
      'C 97 65.5, 99.5 67, 104 67.3',
      'L 104 68.6',
      'L 82 68.6',
      'L 82 67.3',
      'C 86.5 67, 89 65.5, 89 62',
      'L 89 16.5',
      'C 89 13, 86.5 11.5, 82 11.2',
      'Z',
      'M 97 13.8 L 112 13.8 C 121.8 13.8, 125.8 18.5, 125.8 25.5 C 125.8 32.5, 121.2 37.2, 111.5 37.2 L 97 37.2 Z',
    ].join(' '),
  },
  // U (high-contrast flared wedge serifs)
  {
    d: [
      'M 142.5 10',
      'L 166 10',
      'L 166 11.2',
      'C 161.5 11.5, 159 13, 159 16.5',
      'L 159 47',
      'C 159 59.5, 166 65, 177 65',
      'C 188 65, 194 59.5, 194 47',
      'L 194 16.5',
      'C 194 13, 191.5 11.5, 187.5 11.2',
      'L 187.5 10',
      'L 206.5 10',
      'L 206.5 11.2',
      'C 202 11.5, 199.5 13, 199.5 16.5',
      'L 199.5 47',
      'C 199.5 62.5, 189.5 69.5, 176 69.5',
      'C 162 69.5, 150.5 62, 150.5 47',
      'L 150.5 16.5',
      'C 150.5 13, 148 11.5, 142.5 11.2',
      'Z',
    ].join(' '),
  },
  // N (top-left Roman beak + bold diagonal + sharp lower vertex)
  {
    d: [
      'M 212.5 10',
      'L 227 10',
      'L 267 57.5',
      'L 267 16.5',
      'C 267 13, 264.5 11.5, 260 11.2',
      'L 260 10',
      'L 279 10',
      'L 279 11.2',
      'C 274.5 11.5, 272 13, 272 16.5',
      'L 272 69.5',
      'L 269 69.5',
      'L 225 19.5',
      'L 225 62',
      'C 225 65.5, 227.5 67, 232 67.3',
      'L 232 68.6',
      'L 214 68.6',
      'L 214 67.3',
      'C 218 67, 220.5 65.5, 220.5 62',
      'L 220.5 16',
      'C 220.5 12.5, 217.5 11.2, 212.5 11.2',
      'Z',
    ].join(' '),
  },
  // I (sculpted stem with crisp wedge serifs)
  {
    d: [
      'M 287.5 10',
      'L 309.5 10',
      'L 309.5 11.2',
      'C 305 11.5, 302.5 13, 302.5 16.5',
      'L 302.5 62',
      'C 302.5 65.5, 305 67, 309.5 67.3',
      'L 309.5 68.6',
      'L 287.5 68.6',
      'L 287.5 67.3',
      'C 292 67, 294.5 65.5, 294.5 62',
      'L 294.5 16.5',
      'C 294.5 13, 292 11.5, 287.5 11.2',
      'Z',
    ].join(' '),
  },
  // K (sturdy stem + flared arm + gracefully curved sweeping lower leg)
  {
    d: [
      'M 318.5 10',
      'L 340.5 10',
      'L 340.5 11.2',
      'C 336 11.5, 333.5 13, 333.5 16.5',
      'L 333.5 38',
      'L 363.5 14.5',
      'C 365.5 12.5, 364 11.4, 359 11.2',
      'L 359 10',
      'L 379 10',
      'L 379 11.2',
      'C 374 11.5, 370.5 13, 366.5 16.5',
      'L 344 34.5',
      'C 355 44.5, 364.5 55.5, 373.5 62.5',
      'C 378 66.5, 382 67.2, 387.5 67.3',
      'L 387.5 68.6',
      'L 364.5 68.6',
      'L 364.5 67.3',
      'C 367 67.1, 367.2 66, 364 62.5',
      'L 338.5 38.5',
      'L 333.5 42.5',
      'L 333.5 62',
      'C 333.5 65.5, 336 67, 340.5 67.3',
      'L 340.5 68.6',
      'L 318.5 68.6',
      'L 318.5 67.3',
      'C 323 67, 325.5 65.5, 325.5 62',
      'L 325.5 16.5',
      'C 325.5 13, 323 11.5, 318.5 11.2',
      'Z',
    ].join(' '),
  },
  // Second A (matching top-left beak + extended sweeping right calligraphic swash tail)
  {
    evenOdd: true,
    d: [
      'M 412 10',
      'C 417 10.6, 422 10, 427.5 10',
      'L 444.5 50',
      'C 450.5 64, 458 73.2, 471 74.5',
      'C 464 78.8, 454.5 78.2, 447.5 73.4',
      'C 441 68.5, 437.5 59.5, 434.5 51',
      'L 411.5 51',
      'L 405.5 65.2',
      'C 406 66.8, 408 67.2, 410.8 67.4',
      'L 410.8 68.6',
      'L 393 68.6',
      'L 393 67.4',
      'C 396.5 67.1, 398.5 66, 399.8 63',
      'L 418.5 17.5',
      'C 417 13.5, 415 11.5, 412 11.2',
      'Z',
      'M 423.2 22.5 L 413 47.5 L 433.2 47.5 Z',
    ].join(' '),
  },
];

// Bold geometric sans-serif paths for "KAWI" centered directly beneath ARUNIKA
export const KAWI_GLYPHS: VectorPathGlyph[] = [
  // K
  {
    d: 'M 145 81 L 153.5 81 L 153.5 99.5 L 172.5 81 L 183 81 L 164.5 99.5 L 184 123 L 173 123 L 158 104.5 L 153.5 109 L 153.5 123 L 145 123 Z',
  },
  // A
  {
    evenOdd: true,
    d: [
      'M 205.5 81 L 214 81 L 232 123 L 223 123 L 219.2 113.5 L 200.3 113.5 L 196.5 123 L 187.5 123 Z',
      'M 209.8 90.5 L 203 106.5 L 216.5 106.5 Z',
    ].join(' '),
  },
  // W
  {
    d: 'M 235.5 81 L 244.2 81 L 254.2 111.5 L 264.8 81 L 274.2 81 L 284.8 111.5 L 294.8 81 L 303.5 81 L 289.2 123 L 280.2 123 L 269.5 93 L 258.8 123 L 249.8 123 Z',
  },
  // I
  {
    d: 'M 314.5 81 L 323.5 81 L 323.5 123 L 314.5 123 Z',
  },
];

export function drawArunikaKawiWordmarkCanvas(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  topY: number,
  targetWidth: number,
  options?: { withShadow?: boolean }
): number {
  const scale = targetWidth / ARUNIKA_WORDMARK_W;
  const height = ARUNIKA_WORDMARK_H * scale;
  const startX = centerX - targetWidth / 2;

  ctx.save();
  ctx.translate(startX, topY);
  ctx.scale(scale, scale);

  if (options?.withShadow !== false) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = Math.max(3, 6 / Math.max(scale, 0.25));
    ctx.shadowOffsetY = 1.5 / Math.max(scale, 0.25);
  }

  const goldGrad = ctx.createLinearGradient(0, 10, ARUNIKA_WORDMARK_W, 123);
  goldGrad.addColorStop(0, '#B98A42');
  goldGrad.addColorStop(0.28, '#E4C482');
  goldGrad.addColorStop(0.5, '#F6E4BB');
  goldGrad.addColorStop(0.75, '#D2A55B');
  goldGrad.addColorStop(1, '#AE7F39');
  ctx.fillStyle = goldGrad;

  const allGlyphs = [...ARUNIKA_GLYPHS, ...KAWI_GLYPHS];
  for (const glyph of allGlyphs) {
    const p = new Path2D(glyph.d);
    ctx.fill(p, glyph.evenOdd ? 'evenodd' : 'nonzero');
  }

  ctx.restore();
  return height;
}
