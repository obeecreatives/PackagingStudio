export interface Point2D {
  x: number;
  y: number;
}

export interface HomographyResult {
  cssMatrix3d: string;
  project: (u: number, v: number) => Point2D;
}

/**
 * Computes the exact 2D projective homography mapping the rectangle
 * (0,0) -> tl, (srcW,0) -> tr, (srcW,srcH) -> br, (0,srcH) -> bl.
 */
export function computeQuadHomography(
  srcW: number,
  srcH: number,
  tl: Point2D,
  tr: Point2D,
  br: Point2D,
  bl: Point2D
): HomographyResult {
  const x0 = tl.x;
  const y0 = tl.y;
  const x1 = tr.x;
  const y1 = tr.y;
  const x2 = br.x;
  const y2 = br.y;
  const x3 = bl.x;
  const y3 = bl.y;

  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;

  const det = dx1 * dy2 - dx2 * dy1 || 1e-6;
  const g = (dx3 * dy2 - dx2 * dy3) / det;
  const h = (dx1 * dy3 - dx3 * dy1) / det;

  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + h * x3;
  const c = x0;
  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + h * y3;
  const f = y0;

  const sw = Math.max(1, srcW);
  const sh = Math.max(1, srcH);
  const ap = a / sw;
  const bp = b / sh;
  const dp = d / sw;
  const ep = e / sh;
  const gp = g / sw;
  const hp = h / sh;

  // CSS column-major 4x4 matrix3d
  const cssMatrix3d = `matrix3d(${ap.toFixed(6)}, ${dp.toFixed(6)}, 0, ${gp.toFixed(8)}, ${bp.toFixed(6)}, ${ep.toFixed(6)}, 0, ${hp.toFixed(8)}, 0, 0, 1, 0, ${c.toFixed(3)}, ${f.toFixed(3)}, 0, 1)`;

  const project = (u: number, v: number): Point2D => {
    const denom = g * u + h * v + 1 || 1e-6;
    return {
      x: (a * u + b * v + c) / denom,
      y: (d * u + e * v + f) / denom,
    };
  };

  return { cssMatrix3d, project };
}

function drawTexturedTriangle(
  ctx: CanvasRenderingContext2D,
  img: HTMLCanvasElement,
  sx0: number,
  sy0: number,
  sx1: number,
  sy1: number,
  sx2: number,
  sy2: number,
  dx0: number,
  dy0: number,
  dx1: number,
  dy1: number,
  dx2: number,
  dy2: number
) {
  const denom = sx0 * (sy1 - sy2) + sx1 * (sy2 - sy0) + sx2 * (sy0 - sy1);
  if (Math.abs(denom) < 1e-4) return;

  // Slightly expand triangle outward from centroid by ~0.55px to prevent subpixel hairlines between grid triangles
  const cx = (dx0 + dx1 + dx2) / 3;
  const cy = (dy0 + dy1 + dy2) / 3;
  const expand = (px: number, py: number): [number, number] => {
    const vx = px - cx;
    const vy = py - cy;
    const len = Math.hypot(vx, vy) || 1;
    return [px + (vx / len) * 0.55, py + (vy / len) * 0.55];
  };
  const [ex0, ey0] = expand(dx0, dy0);
  const [ex1, ey1] = expand(dx1, dy1);
  const [ex2, ey2] = expand(dx2, dy2);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(ex0, ey0);
  ctx.lineTo(ex1, ey1);
  ctx.lineTo(ex2, ey2);
  ctx.closePath();
  ctx.clip();

  const m11 = (dx0 * (sy1 - sy2) + dx1 * (sy2 - sy0) + dx2 * (sy0 - sy1)) / denom;
  const m12 = (dy0 * (sy1 - sy2) + dy1 * (sy2 - sy0) + dy2 * (sy0 - sy1)) / denom;
  const m21 = (dx0 * (sx2 - sx1) + dx1 * (sx0 - sx2) + dx2 * (sx1 - sx0)) / denom;
  const m22 = (dy0 * (sx2 - sx1) + dy1 * (sx0 - sx2) + dy2 * (sx1 - sx0)) / denom;
  const m31 =
    (dx0 * (sx1 * sy2 - sx2 * sy1) + dx1 * (sx2 * sy0 - sx0 * sy2) + dx2 * (sx0 * sy1 - sx1 * sy0)) / denom;
  const m32 =
    (dy0 * (sx1 * sy2 - sx2 * sy1) + dy1 * (sx2 * sy0 - sx0 * sy2) + dy2 * (sx0 * sy1 - sx1 * sy0)) / denom;

  ctx.transform(m11, m12, m21, m22, m31, m32);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

/**
 * Warps an offscreen transparent canvas cleanly into an arbitrary 4-corner quadrilateral
 * using projective homography subdivision so top, middle, and bottom lines each match
 * true 3D surface perspective.
 */
export function drawCanvasQuadWarp(
  ctx: CanvasRenderingContext2D,
  srcCanvas: HTMLCanvasElement,
  tl: Point2D,
  tr: Point2D,
  br: Point2D,
  bl: Point2D,
  cols = 12,
  rows = 20
) {
  const sw = srcCanvas.width;
  const sh = srcCanvas.height;
  const { project } = computeQuadHomography(sw, sh, tl, tr, br, bl);

  for (let r = 0; r < rows; r++) {
    const v0 = r / rows;
    const v1 = (r + 1) / rows;
    const sy0 = v0 * sh;
    const sy1 = v1 * sh;

    for (let c = 0; c < cols; c++) {
      const u0 = c / cols;
      const u1 = (c + 1) / cols;
      const sx0 = u0 * sw;
      const sx1 = u1 * sw;

      const p00 = project(u0, v0);
      const p10 = project(u1, v0);
      const p11 = project(u1, v1);
      const p01 = project(u0, v1);

      drawTexturedTriangle(ctx, srcCanvas, sx0, sy0, sx1, sy0, sx1, sy1, p00.x, p00.y, p10.x, p10.y, p11.x, p11.y);
      drawTexturedTriangle(ctx, srcCanvas, sx0, sy0, sx1, sy1, sx0, sy1, p00.x, p00.y, p11.x, p11.y, p01.x, p01.y);
    }
  }
}
