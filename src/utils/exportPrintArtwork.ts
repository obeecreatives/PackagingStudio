import {
  BEAN_VARIANTS,
  GENERATED_ASSETS,
  getWeightSpecs,
  isTallGusset,
  ORIGINAL_UPLOADS,
  PackagingConfig,
  ROAST_LEVELS,
} from '../types/packaging';
import { getWibDateKey } from './dateUtils';

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  alignY: 'top' | 'center' | 'bottom' = 'center'
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const targetRatio = dw / dh;
  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;

  if (imgRatio > targetRatio) {
    sw = img.naturalHeight * targetRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = img.naturalWidth / targetRatio;
    sy =
      alignY === 'top'
        ? 0
        : alignY === 'bottom'
          ? img.naturalHeight - sh
          : (img.naturalHeight - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function drawFeatheredImage(
  targetCtx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  stops: Array<{ offset: number; alpha: number }>,
  globalOpacity = 1,
  alignY: 'top' | 'center' | 'bottom' = 'center'
) {
  const tmp = document.createElement('canvas');
  tmp.width = Math.max(1, Math.round(dw));
  tmp.height = Math.max(1, Math.round(dh));
  const tctx = tmp.getContext('2d');
  if (!tctx) return;

  drawCoverImage(tctx, img, 0, 0, tmp.width, tmp.height, alignY);

  tctx.globalCompositeOperation = 'destination-in';
  const mask = tctx.createLinearGradient(0, 0, 0, tmp.height);
  stops.forEach((s) => mask.addColorStop(s.offset, `rgba(0, 0, 0, ${s.alpha})`));
  tctx.fillStyle = mask;
  tctx.fillRect(0, 0, tmp.width, tmp.height);

  targetCtx.save();
  targetCtx.globalAlpha = globalOpacity;
  targetCtx.drawImage(tmp, dx, dy, dw, dh);
  targetCtx.restore();
}

function drawGoldGradient(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, '#9F7637');
  grad.addColorStop(0.28, '#D6B373');
  grad.addColorStop(0.5, '#F2DFB3');
  grad.addColorStop(0.75, '#C99C52');
  grad.addColorStop(1, '#8C6429');
  return grad;
}

function drawArunikaCrest(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.save();
  ctx.strokeStyle = '#D6B373';
  ctx.lineWidth = radius * 0.08;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(214, 179, 115, 0.5)';
  ctx.lineWidth = radius * 0.03;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.86, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#EBD39F';
  ctx.lineWidth = radius * 0.06;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy - radius * 1.25);
  ctx.lineTo(cx, cy - radius * 1.07);
  ctx.moveTo(cx - radius * 0.5, cy - radius * 1.1);
  ctx.lineTo(cx - radius * 0.4, cy - radius * 0.95);
  ctx.moveTo(cx + radius * 0.5, cy - radius * 1.1);
  ctx.lineTo(cx + radius * 0.4, cy - radius * 0.95);
  ctx.stroke();

  const drawBean = (bx: number, by: number, angle: number) => {
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(angle);
    ctx.fillStyle = 'rgba(214, 179, 115, 0.25)';
    ctx.strokeStyle = '#D6B373';
    ctx.lineWidth = radius * 0.065;
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 0.24, radius * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -radius * 0.28);
    ctx.quadraticCurveTo(radius * 0.06, 0, 0, radius * 0.28);
    ctx.stroke();
    ctx.restore();
  };
  drawBean(cx - radius * 0.27, cy + radius * 0.12, -0.35);
  drawBean(cx + radius * 0.27, cy + radius * 0.12, 0.35);

  ctx.beginPath();
  ctx.moveTo(cx - radius * 0.1, cy - radius * 0.26);
  ctx.quadraticCurveTo(cx + radius * 0.1, cy - radius * 0.48, cx - radius * 0.04, cy - radius * 0.66);
  ctx.stroke();
  ctx.restore();
}

function drawMandalaRing(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, label: string) {
  ctx.save();
  ctx.fillStyle = 'rgba(22, 12, 8, 0.72)';
  ctx.strokeStyle = '#D6B373';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8;
    const px = cx + Math.cos(angle) * (r * 0.89);
    const py = cy + Math.sin(angle) * (r * 0.89);
    ctx.fillStyle = '#D6B373';
    ctx.beginPath();
    ctx.arc(px, py, r * 0.035, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#FAF5EB';
  ctx.textAlign = 'center';
  ctx.font = `600 ${Math.round(r * 0.22)}px "Cormorant Garamond", Georgia, serif`;
  ctx.fillText(label, cx, cy + r * 0.06);
  ctx.restore();
}

function drawKthSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.fillStyle = '#1E140E';
  ctx.strokeStyle = '#D6B373';
  ctx.lineWidth = r * 0.06;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#2A1D14';
  ctx.lineWidth = r * 0.03;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#5E4B2C';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.55, cy + r * 0.22);
  ctx.lineTo(cx - r * 0.18, cy - r * 0.32);
  ctx.lineTo(cx + r * 0.02, cy - r * 0.05);
  ctx.lineTo(cx + r * 0.24, cy - r * 0.38);
  ctx.lineTo(cx + r * 0.55, cy + r * 0.22);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#F1DEC0';
  ctx.font = `700 ${Math.round(r * 0.18)}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('PRODUK ASLI', cx, cy - r * 0.77);
  ctx.font = `600 ${Math.round(r * 0.15)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('JAWA TIMUR', cx, cy + r * 0.42);
  ctx.font = `600 ${Math.round(r * 0.13)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('KELOMPOK TANI HUTAN', cx, cy + r * 0.87);
  ctx.restore();
}

export type ExportScope =
  | 'full-dieline'
  | 'front-only'
  | 'back-only'
  | 'bg-full-dieline'
  | 'bg-front-only'
  | 'bg-back-only';

export interface RenderedPrintSheet {
  canvas: HTMLCanvasElement;
  widthMm: number;
  heightMm: number;
  isBackgroundOnly: boolean;
  baseScope: 'full-dieline' | 'front-only' | 'back-only';
}

export async function renderPrintSheetCanvas(
  config: PackagingConfig,
  scope: ExportScope = 'full-dieline',
  scale = 8
): Promise<RenderedPrintSheet | null> {
  const isBackgroundOnly = scope.startsWith('bg-');
  const baseScope = (isBackgroundOnly ? scope.replace('bg-', '') : scope) as
    | 'full-dieline'
    | 'front-only'
    | 'back-only';

  const isDoypack = config.pouchShape === 'doypack-valve';
  const tall = isTallGusset(config.pouchShape);
  const isHeritage = config.pouchShape === 'tall-heritage';
  const isCopper = config.pouchShape === 'tall-copper';
  const weightSpecs = getWeightSpecs(config.pouchShape, config.netWeight);
  const bleedPx = 3 * scale;

  const panelH = weightSpecs.panelHmm * scale;
  const frontW = weightSpecs.frontWmm * scale;
  const gussetW = (weightSpecs.gussetWmm || (tall ? 65 : 70)) * scale;
  const gapPx = isDoypack ? 12 * scale : 0;

  const contentW =
    baseScope === 'full-dieline'
      ? isDoypack
        ? frontW * 2 + gapPx
        : gussetW + frontW + gussetW + frontW
      : frontW;

  const canvas = document.createElement('canvas');
  canvas.width = contentW + bleedPx * 2;
  canvas.height = panelH + bleedPx * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const [beansImg, mistImg, cherriesImg, revisedFrontImg, revisedRearImg] = await Promise.all([
    loadImage(GENERATED_ASSETS.beansCluster).catch(() => null),
    loadImage(GENERATED_ASSETS.kawiMist).catch(() => null),
    loadImage(GENERATED_ASSETS.coffeeCherries).catch(() => null),
    config.artworkSource === 'uploaded-final' && !isBackgroundOnly
      ? loadImage(
          config.netWeight === '100 gram' ? ORIGINAL_UPLOADS.revisedFront100 : ORIGINAL_UPLOADS.revisedFront250
        ).catch(() => null)
      : Promise.resolve(null),
    config.artworkSource === 'uploaded-final' && !isBackgroundOnly
      ? loadImage(ORIGINAL_UPLOADS.revisedRear).catch(() => null)
      : Promise.resolve(null),
  ]);

  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];

  ctx.fillStyle = '#180E0A';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const drawPanelBase = (px: number, py: number, pw: number, ph: number, isBack: boolean) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pw, ph);
    ctx.clip();

    const bgGrad = ctx.createLinearGradient(px, py, px + pw * 0.4, py + ph);
    bgGrad.addColorStop(0, '#2B1912');
    bgGrad.addColorStop(0.55, '#1C100B');
    bgGrad.addColorStop(1, '#140B07');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(px, py, pw, ph);

    if (config.naturalMood === 'kawi-beans' && mistImg) {
      drawFeatheredImage(
        ctx,
        mistImg,
        px,
        py,
        pw,
        ph * 0.56,
        [
          { offset: 0, alpha: 0.72 },
          { offset: 0.55, alpha: 0.38 },
          { offset: 1, alpha: 0 },
        ],
        0.42,
        'center'
      );
    }

    if (config.naturalMood === 'cherries-beans' && cherriesImg) {
      drawFeatheredImage(
        ctx,
        cherriesImg,
        px - pw * 0.08,
        py + ph * 0.25,
        pw * 1.15,
        ph * 0.48,
        [
          { offset: 0, alpha: 0 },
          { offset: 0.35, alpha: 0.75 },
          { offset: 0.7, alpha: 0.6 },
          { offset: 1, alpha: 0 },
        ],
        0.38,
        'center'
      );
    }

    if (isCopper && !isBack) {
      ctx.save();
      ctx.fillStyle = '#9C4F2B';
      ctx.beginPath();
      ctx.moveTo(px, py + ph * 0.9);
      ctx.lineTo(px + pw, py + ph * 0.64);
      ctx.lineTo(px + pw, py + ph);
      ctx.lineTo(px, py + ph);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = drawGoldGradient(ctx, px + pw * 0.075, py, 3, ph);
      ctx.fillRect(px + pw * 0.075, py, 3, ph);
      ctx.restore();
    }

    // Seamless feathered roasted coffee beans (zero horizontal seam)
    if (!isBack && beansImg) {
      const bh = ph * 0.38;
      const by = py + ph - ph * 0.115 - bh;
      drawFeatheredImage(
        ctx,
        beansImg,
        px,
        by,
        pw,
        bh,
        [
          { offset: 0, alpha: 0 },
          { offset: 0.28, alpha: 0.35 },
          { offset: 0.58, alpha: 0.95 },
          { offset: 1, alpha: 1 },
        ],
        isCopper ? 0.72 : 1,
        'bottom'
      );
    }

    const bandH = ph * 0.118;
    const bandY = py + ph - bandH;
    if (isCopper) {
      ctx.fillStyle = 'rgba(32, 18, 12, 0.88)';
      ctx.fillRect(px, bandY, pw, bandH);
      ctx.strokeStyle = 'rgba(230, 184, 154, 0.55)';
    } else {
      ctx.fillStyle = drawGoldGradient(ctx, px, bandY, pw, bandH);
      ctx.fillRect(px, bandY, pw, bandH);
      ctx.strokeStyle = 'rgba(247, 232, 198, 0.7)';
    }
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, bandY);
    ctx.lineTo(px + pw, bandY);
    ctx.stroke();

    ctx.restore();
  };

  const drawFrontContent = (px: number, py: number, pw: number, ph: number) => {
    const hasTextOverride = config.beanVariant !== 'robusta-100' || config.roastLevel !== 'traditional';

    if (config.artworkSource === 'uploaded-final' && !isBackgroundOnly && revisedFrontImg) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(px, py, pw, ph);
      ctx.clip();
      drawCoverImage(ctx, revisedFrontImg, px, py, pw, ph, 'center');

      if (config.naturalMood === 'cherries-beans' && cherriesImg) {
        drawFeatheredImage(
          ctx,
          cherriesImg,
          px,
          py,
          pw,
          ph * 0.52,
          [
            { offset: 0, alpha: 0.45 },
            { offset: 0.5, alpha: 0.35 },
            { offset: 1, alpha: 0 },
          ],
          0.55,
          'center'
        );
      }

      if (config.naturalMood === 'espresso-matte') {
        const darkOverlay = ctx.createLinearGradient(px, py, px, py + ph * 0.48);
        darkOverlay.addColorStop(0, 'rgba(22, 12, 8, 0.82)');
        darkOverlay.addColorStop(0.55, 'rgba(28, 16, 11, 0.58)');
        darkOverlay.addColorStop(1, 'rgba(28, 16, 11, 0)');
        ctx.fillStyle = darkOverlay;
        ctx.fillRect(px, py, pw, ph * 0.48);
      }

      if (isHeritage) {
        ctx.strokeStyle = 'rgba(216, 180, 116, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(px + pw * 0.03, py + ph * 0.03, pw * 0.94, ph * 0.94);
      }

      if (isCopper) {
        ctx.fillStyle = 'rgba(156, 79, 43, 0.9)';
        ctx.beginPath();
        ctx.moveTo(px + pw * 0.3, py + ph * 0.895);
        ctx.lineTo(px + pw, py + ph * 0.59);
        ctx.lineTo(px + pw, py + ph * 0.895);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = drawGoldGradient(ctx, px + pw * 0.075, py, 3, ph);
        ctx.fillRect(px + pw * 0.075, py, 3, ph);
      }

      if (hasTextOverride) {
        const bx = px + pw * 0.08;
        const by = py + ph * 0.482;
        const bw = pw * 0.84;
        const bh = ph * 0.115;
        const patchGrad = ctx.createRadialGradient(
          bx + bw / 2,
          by + bh / 2,
          bh * 0.15,
          bx + bw / 2,
          by + bh / 2,
          bw * 0.56
        );
        patchGrad.addColorStop(0, 'rgba(34, 21, 14, 0.99)');
        patchGrad.addColorStop(0.68, 'rgba(28, 17, 11, 0.95)');
        patchGrad.addColorStop(1, 'rgba(28, 17, 11, 0)');
        ctx.fillStyle = patchGrad;
        ctx.fillRect(bx, by, bw, bh);
        ctx.fillStyle = '#FAF5EB';
        ctx.textAlign = 'center';
        ctx.font = `600 ${Math.round(pw * 0.036)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(roast.subtitle, px + pw / 2, py + ph * 0.53);
        ctx.fillText(variant.frontLabel, px + pw / 2, py + ph * 0.575);
      }

      if (config.sealPlacement === 'front') {
        drawKthSeal(ctx, px + pw * 0.84, py + ph * 0.8, pw * 0.085);
      }

      if (isDoypack && config.showPrintMarks) {
        ctx.save();
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px + pw / 2, py + ph * 0.27, pw * 0.052, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (isCopper) {
        const bandH = ph * 0.096;
        const bandY = py + ph - bandH;
        ctx.fillStyle = 'rgba(32, 18, 12, 0.94)';
        ctx.fillRect(px, bandY, pw, bandH);
        ctx.strokeStyle = 'rgba(230, 184, 154, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(px, bandY, pw, 2);
        ctx.fillStyle = '#FAF5EB';
        ctx.textAlign = 'center';
        ctx.font = `700 ${Math.round(pw * 0.035)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(`Isi Bersih : ${config.netWeight}`, px + pw / 2, bandY + bandH * 0.62);
      }

      ctx.restore();
      return;
    }

    drawPanelBase(px, py, pw, ph, false);
    if (isBackgroundOnly) return;

    const cx = px + pw / 2;

    if (isDoypack) {
      drawArunikaCrest(ctx, cx, py + ph * 0.16, pw * 0.052);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#D8B474';
      ctx.font = `700 ${Math.round(pw * 0.025)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText('COFFE BEAN', cx, py + ph * 0.218);
      ctx.fillStyle = '#FAF5EB';
      ctx.font = `500 ${Math.round(pw * 0.019)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText('EST 2024', cx, py + ph * 0.245);

      if (config.showPrintMarks) {
        ctx.save();
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, py + ph * 0.285, pw * 0.052, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.fillStyle = '#D8B474';
      ctx.font = `700 ${Math.round(pw * 0.088)}px "Cormorant Garamond", Georgia, serif`;
      ctx.fillText('ARUNIKA', cx, py + ph * 0.405);
      ctx.fillText('KAWI', cx, py + ph * 0.472);

      ctx.fillStyle = '#FAF5EB';
      ctx.font = `600 ${Math.round(pw * 0.032)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText(roast.subtitle, cx, py + ph * 0.538);
      ctx.fillText(variant.frontLabel, cx, py + ph * 0.585);
    } else if (tall) {
      drawArunikaCrest(ctx, cx, py + ph * 0.14, pw * 0.068);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#D8B474';
      ctx.font = `700 ${Math.round(pw * 0.029)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText('COFFE BEAN', cx, py + ph * 0.205);
      ctx.fillStyle = '#FAF5EB';
      ctx.font = `500 ${Math.round(pw * 0.021)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText('EST 2024', cx, py + ph * 0.232);

      ctx.fillStyle = '#D8B474';
      ctx.font = `700 ${Math.round(pw * 0.11)}px "Cormorant Garamond", Georgia, serif`;
      ctx.fillText('ARUNIKA', cx, py + ph * 0.315);
      ctx.fillText('KAWI', cx, py + ph * 0.385);

      ctx.fillStyle = '#FAF5EB';
      ctx.font = `600 ${Math.round(pw * 0.035)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText(roast.subtitle, cx, py + ph * 0.445);

      if (isHeritage) {
        drawMandalaRing(ctx, cx, py + ph * 0.56, pw * 0.22, variant.frontLabel);
      } else {
        ctx.fillText(variant.frontLabel, cx, py + ph * 0.485);
      }
    } else {
      drawArunikaCrest(ctx, cx, py + ph * 0.155, pw * 0.068);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#D8B474';
      ctx.font = `700 ${Math.round(pw * 0.027)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText('COFFE BEAN', cx, py + ph * 0.235);
      ctx.fillStyle = '#FAF5EB';
      ctx.font = `500 ${Math.round(pw * 0.02)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText('EST 2024', cx, py + ph * 0.268);

      ctx.strokeStyle = 'rgba(250, 245, 235, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - pw * 0.24, py + ph * 0.262);
      ctx.lineTo(cx - pw * 0.09, py + ph * 0.262);
      ctx.moveTo(cx + pw * 0.09, py + ph * 0.262);
      ctx.lineTo(cx + pw * 0.24, py + ph * 0.262);
      ctx.stroke();

      ctx.fillStyle = '#D8B474';
      ctx.font = `700 ${Math.round(pw * 0.095)}px "Cormorant Garamond", Georgia, serif`;
      ctx.fillText('ARUNIKA', cx, py + ph * 0.36);
      ctx.fillText('KAWI', cx, py + ph * 0.43);

      ctx.fillStyle = '#FAF5EB';
      ctx.font = `600 ${Math.round(pw * 0.034)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText(roast.subtitle, cx, py + ph * 0.505);
      ctx.fillText(variant.frontLabel, cx, py + ph * 0.55);
    }

    if (config.sealPlacement === 'front') {
      drawKthSeal(ctx, px + pw * 0.84, py + ph * 0.8, pw * 0.085);
    }

    const bandCenterY = py + ph * 0.945;
    ctx.fillStyle = isCopper ? '#FAF5EB' : '#1E130D';
    ctx.textAlign = 'left';
    ctx.font = `600 ${Math.round(pw * 0.021)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('GUNUNG KAWI · JAWA TIMUR', px + pw * 0.06, bandCenterY);
    ctx.textAlign = 'right';
    ctx.font = `700 ${Math.round(pw * 0.026)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(`Isi Bersih : ${config.netWeight}`, px + pw * 0.94, bandCenterY);
  };

  const drawGussetContent = (px: number, py: number, pw: number, ph: number, side: 'left' | 'right') => {
    drawPanelBase(px, py, pw, ph, true);
    if (isBackgroundOnly) return;

    const cx = px + pw / 2;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#D8B474';
    ctx.font = `600 ${Math.round(pw * 0.042)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(side === 'left' ? 'ORIGIN' : 'TASTING PROFILE', cx, py + ph * 0.14);

    ctx.fillStyle = '#F5ECD9';
    ctx.font = `500 ${Math.round(pw * 0.038)}px "Plus Jakarta Sans", sans-serif`;
    if (side === 'left') {
      ctx.fillText(variant.altitude, cx, py + ph * 0.21);
      ctx.fillText(variant.process, cx, py + ph * 0.26);
      ctx.fillText('Petik Merah Selektif', cx, py + ph * 0.31);
    } else {
      ctx.fillText(`Body : ${roast.bodyScore}/5`, cx, py + ph * 0.21);
      ctx.fillText(`Aroma : ${roast.aromaScore}/5`, cx, py + ph * 0.26);
      ctx.fillText(`Boldness : ${roast.bitternessScore}/5`, cx, py + ph * 0.31);
    }

    ctx.translate(cx, py + ph * 0.62);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = 'rgba(228, 197, 138, 0.72)';
    ctx.font = `600 ${Math.round(pw * 0.08)}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillText('A R U N I K A   K A W I', 0, 0);
    ctx.restore();

    ctx.fillStyle = isCopper ? '#FAF5EB' : '#1E130D';
    ctx.textAlign = 'center';
    ctx.font = `700 ${Math.round(pw * 0.035)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('JAWA TIMUR · INDONESIA', cx, py + ph * 0.945);
  };

  const drawBackContent = (px: number, py: number, pw: number, ph: number) => {
    const hasTextOverride = config.beanVariant !== 'robusta-100' || config.roastLevel !== 'traditional';

    if (config.artworkSource === 'uploaded-final' && !isBackgroundOnly && revisedRearImg) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(px, py, pw, ph);
      ctx.clip();
      drawCoverImage(ctx, revisedRearImg, px, py, pw, ph, 'center');

      if (config.naturalMood === 'espresso-matte') {
        const darkOverlay = ctx.createLinearGradient(px, py, px, py + ph * 0.5);
        darkOverlay.addColorStop(0, 'rgba(22, 12, 8, 0.72)');
        darkOverlay.addColorStop(0.55, 'rgba(28, 16, 11, 0.45)');
        darkOverlay.addColorStop(1, 'rgba(28, 16, 11, 0)');
        ctx.fillStyle = darkOverlay;
        ctx.fillRect(px, py, pw, ph * 0.5);
      }

      if (isHeritage) {
        ctx.strokeStyle = 'rgba(216, 180, 116, 0.45)';
        ctx.lineWidth = 2;
        ctx.strokeRect(px + pw * 0.03, py + ph * 0.03, pw * 0.94, ph * 0.94);
      }

      if (config.sealPlacement !== 'back') {
        const sx = px + pw * 0.125;
        const sy = py + ph * 0.802;
        const sr = pw * 0.085;
        const sealCover = ctx.createRadialGradient(sx, sy, sr * 0.55, sx, sy, sr);
        sealCover.addColorStop(0, 'rgba(24, 14, 9, 0.99)');
        sealCover.addColorStop(0.78, 'rgba(24, 14, 9, 0.92)');
        sealCover.addColorStop(1, 'rgba(24, 14, 9, 0)');
        ctx.fillStyle = sealCover;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      if (hasTextOverride) {
        const bx = px + pw * 0.06;
        const by = py + ph * 0.242;
        const bw = pw * 0.88;
        const bh = ph * 0.345;
        const rearPatch = ctx.createRadialGradient(
          bx + bw / 2,
          by + bh / 2,
          bh * 0.2,
          bx + bw / 2,
          by + bh / 2,
          bw * 0.58
        );
        rearPatch.addColorStop(0, 'rgba(34, 21, 14, 0.99)');
        rearPatch.addColorStop(0.72, 'rgba(28, 17, 11, 0.96)');
        rearPatch.addColorStop(1, 'rgba(28, 17, 11, 0)');
        ctx.fillStyle = rearPatch;
        ctx.fillRect(bx, by, bw, bh);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FAF5EB';
        ctx.font = `400 ${Math.round(pw * 0.0235)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText('Diolah secara tradisional (Goreng Kreweng) oleh Kelompok Tani Hutan.', px + pw / 2, py + ph * 0.3);
        ctx.fillText('Dipetik langsung dari lereng Gunung Kawi. Setiap seduhan menghadirkan', px + pw / 2, py + ph * 0.335);
        ctx.fillStyle = '#C9A35E';
        ctx.font = `600 ${Math.round(pw * 0.0235)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(`karakter ${variant.storyCharacter}`, px + pw / 2, py + ph * 0.37);
        ctx.fillStyle = '#FAF5EB';
        ctx.font = `400 ${Math.round(pw * 0.0235)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(roast.storyRoast, px + pw / 2, py + ph * 0.405);
        ctx.fillStyle = '#C9A35E';
        ctx.font = `700 ${Math.round(pw * 0.025)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText('Arunika Kawi Coffee Harum dan Nikmat', px + pw / 2, py + ph * 0.455);
        ctx.fillStyle = '#FAF5EB';
        ctx.font = `700 ${Math.round(pw * 0.024)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText(`KOMPOSISI ${variant.frontLabel.toUpperCase()}`, px + pw / 2, py + ph * 0.545);
      }

      if (isCopper) {
        const bandH = ph * 0.118;
        const bandY = py + ph - bandH;
        ctx.fillStyle = 'rgba(32, 18, 12, 0.94)';
        ctx.fillRect(px, bandY, pw, bandH);
        ctx.strokeStyle = 'rgba(230, 184, 154, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(px, bandY, pw, 2);
        ctx.fillStyle = '#FAF5EB';
        ctx.textAlign = 'center';
        ctx.font = `700 ${Math.round(pw * 0.032)}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillText('100 % KOPI ASLI INDONESIA', px + pw / 2, bandY + bandH * 0.62);
      }

      ctx.restore();
      return;
    }

    drawPanelBase(px, py, pw, ph, true);
    if (isBackgroundOnly) return;

    const cx = px + pw / 2;

    const cw = pw * 0.28;
    const ch = cw * 0.56;
    const cy = py + ph * 0.12;
    ctx.save();
    ctx.fillStyle = 'rgba(20, 11, 7, 0.65)';
    ctx.strokeStyle = '#D6B373';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(cx - cw / 2, cy - ch / 2, cw, ch, ch * 0.48);
    ctx.fill();
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F4E6C8';
    ctx.font = `600 ${Math.round(pw * 0.017)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(roast.crestTop, cx, cy - ch * 0.06);
    ctx.fillStyle = '#D8B474';
    ctx.font = `700 ${Math.round(pw * 0.032)}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillText(roast.crestBottom, cx, cy + ch * 0.28);
    ctx.restore();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#C9A35E';
    ctx.font = `700 ${Math.round(pw * 0.045)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('Arunika Kawi Coffee', cx, py + ph * 0.21);

    ctx.fillStyle = '#F4ECE0';
    ctx.font = `400 ${Math.round(pw * 0.021)}px "Plus Jakarta Sans", sans-serif`;
    const lines = [
      'Diolah secara tradisional (Goreng Kreweng) oleh Kelompok Tani Hutan.',
      'Dipetik langsung dari lereng Gunung Kawi. Setiap seduhan menghadirkan',
      `karakter ${variant.storyCharacter}`,
      roast.storyRoast,
    ];
    lines.forEach((line, i) => ctx.fillText(line, cx, py + ph * (0.28 + i * 0.032)));

    ctx.fillStyle = '#C9A35E';
    ctx.font = `700 ${Math.round(pw * 0.023)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('Arunika Kawi Coffee Harum dan Nikmat', cx, py + ph * 0.44);

    ctx.fillStyle = '#FAF5EB';
    ctx.font = `700 ${Math.round(pw * 0.023)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(
      `KOMPOSISI ${config.beanVariant === 'robusta-100' ? '100 % BIJI KOPI ROBUSTA' : variant.frontLabel.toUpperCase()}`,
      cx,
      py + ph * 0.54
    );

    if (config.sealPlacement === 'back') {
      drawKthSeal(ctx, px + pw * 0.13, py + ph * 0.77, pw * 0.068);
      ctx.fillStyle = '#FAF5EB';
      ctx.textAlign = 'center';
      ctx.font = `600 ${Math.round(pw * 0.018)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText('PIRT', px + pw * 0.13, py + ph * 0.848);
    }

    const prodX = config.sealPlacement === 'back' ? px + pw * 0.22 : px + pw * 0.08;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#C9A35E';
    ctx.font = `700 ${Math.round(pw * 0.024)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('Diproduksi Oleh', prodX, py + ph * 0.745);
    ctx.fillStyle = '#FAF5EB';
    ctx.font = `600 ${Math.round(pw * 0.019)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('KUPS Himatarian Blitar', prodX, py + ph * 0.778);
    ctx.fillText('Jawa Timur – INDONESIA', prodX, py + ph * 0.806);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(prodX, py + ph * 0.822, pw * 0.31, ph * 0.036);

    const boxX = px + pw * 0.61;
    const boxW = pw * 0.31;
    ctx.fillStyle = '#FAF5EB';
    ctx.font = `600 ${Math.round(pw * 0.018)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('Kode Produksi', boxX, py + ph * 0.74);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(boxX, py + ph * 0.752, boxW, ph * 0.036);

    ctx.fillStyle = '#FAF5EB';
    ctx.fillText('Baik Digunakan Sebelum', boxX, py + ph * 0.81);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(boxX, py + ph * 0.822, boxW, ph * 0.036);

    const bandCenterY = py + ph * 0.945;
    ctx.fillStyle = isCopper ? '#FAF5EB' : '#140B07';
    ctx.textAlign = 'center';
    ctx.font = `700 ${Math.round(pw * 0.026)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('100 % KOPI ASLI INDONESIA', cx, bandCenterY);
  };

  if (baseScope === 'full-dieline') {
    if (isDoypack) {
      drawFrontContent(bleedPx, bleedPx, frontW, panelH);
      drawBackContent(bleedPx + frontW + gapPx, bleedPx, frontW, panelH);
    } else {
      drawGussetContent(bleedPx, bleedPx, gussetW, panelH, 'left');
      drawFrontContent(bleedPx + gussetW, bleedPx, frontW, panelH);
      drawGussetContent(bleedPx + gussetW + frontW, bleedPx, gussetW, panelH, 'right');
      drawBackContent(bleedPx + gussetW * 2 + frontW, bleedPx, frontW, panelH);
    }
  } else if (baseScope === 'front-only') {
    drawFrontContent(bleedPx, bleedPx, frontW, panelH);
  } else {
    drawBackContent(bleedPx, bleedPx, frontW, panelH);
  }

  if (config.showPrintMarks && !isBackgroundOnly) {
    ctx.strokeStyle = '#EC4899';
    ctx.lineWidth = 2;
    ctx.strokeRect(bleedPx, bleedPx, contentW, panelH);

    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    const len = bleedPx * 0.85;
    const corners = [
      [bleedPx, bleedPx],
      [bleedPx + contentW, bleedPx],
      [bleedPx, bleedPx + panelH],
      [bleedPx + contentW, bleedPx + panelH],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.moveTo(cx - len, cy);
      ctx.lineTo(cx + len, cy);
      ctx.moveTo(cx, cy - len);
      ctx.lineTo(cx, cy + len);
      ctx.stroke();
    });
  }

  return {
    canvas,
    widthMm: Math.round(canvas.width / scale),
    heightMm: Math.round(canvas.height / scale),
    isBackgroundOnly,
    baseScope,
  };
}

export async function renderAndDownloadPrintSheet(
  config: PackagingConfig,
  scope: ExportScope = 'full-dieline'
): Promise<void> {
  const rendered = await renderPrintSheetCanvas(config, scope, 8);
  if (!rendered) return;

  const { canvas, isBackgroundOnly, baseScope } = rendered;
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  const suffix = isBackgroundOnly
    ? baseScope === 'full-dieline'
      ? 'BackgroundSaja-Full'
      : baseScope === 'front-only'
        ? 'BackgroundSaja-Depan'
        : 'BackgroundSaja-Belakang'
    : baseScope === 'full-dieline'
      ? 'FullPrint'
      : baseScope === 'front-only'
        ? 'PanelDepan'
        : 'PanelBelakang';
  const wibDate = getWibDateKey();
  link.download = `PackagingStudio-${config.pouchShape}-${suffix}-${config.netWeight.replace(/\s+/g, '')}-${wibDate}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
