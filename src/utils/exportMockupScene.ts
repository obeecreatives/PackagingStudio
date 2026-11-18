import {
  BEAN_VARIANTS,
  isTallGusset,
  PackagingConfig,
  ROAST_LEVELS,
} from '../types/packaging';
import type { MockupSceneMode } from '../components/LiveMockupScene';
import {
  NATURAL_MOCKUP_LAYOUTS,
  PanelOverlayRect,
  STUDIO_DOYPACK_LAYOUT,
} from '../data/mockupSceneLayouts';
import { getWibDateKey } from './dateUtils';
import { loadImage, renderPrintSheetCanvas } from './exportPrintArtwork';
import { downloadCanvas } from './exportSingleElement';

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  const imgRatio = img.naturalWidth / Math.max(1, img.naturalHeight);
  const targetRatio = dw / Math.max(1, dh);
  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;
  if (imgRatio > targetRatio) {
    sw = img.naturalHeight * targetRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = img.naturalWidth / targetRatio;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function drawSunBeanCrest(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.strokeStyle = '#D8B474';
  ctx.lineWidth = Math.max(1.2, r * 0.085);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(216, 180, 116, 0.52)';
  ctx.lineWidth = Math.max(0.8, r * 0.035);
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#EBD39F';
  ctx.lineWidth = Math.max(1, r * 0.065);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 1.24);
  ctx.lineTo(cx, cy - r * 1.07);
  ctx.moveTo(cx - r * 0.48, cy - r * 1.08);
  ctx.lineTo(cx - r * 0.38, cy - r * 0.94);
  ctx.moveTo(cx + r * 0.48, cy - r * 1.08);
  ctx.lineTo(cx + r * 0.38, cy - r * 0.94);
  ctx.stroke();

  const bean = (bx: number, by: number, angle: number) => {
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(angle);
    ctx.fillStyle = 'rgba(216, 180, 116, 0.25)';
    ctx.strokeStyle = '#D8B474';
    ctx.lineWidth = Math.max(1, r * 0.07);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.23, r * 0.33, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.26);
    ctx.quadraticCurveTo(r * 0.06, 0, 0, r * 0.26);
    ctx.stroke();
    ctx.restore();
  };
  bean(cx - r * 0.26, cy + r * 0.12, -0.35);
  bean(cx + r * 0.26, cy + r * 0.12, 0.35);
  ctx.restore();
}

function drawRoastBadge(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  w: number,
  topText: string,
  bottomText: string
) {
  const h = w * 0.52;
  ctx.save();
  ctx.fillStyle = 'rgba(22, 12, 8, 0.55)';
  ctx.strokeStyle = '#D8B474';
  ctx.lineWidth = Math.max(1, w * 0.018);
  ctx.beginPath();
  ctx.roundRect(cx - w / 2, cy - h / 2, w, h, h * 0.42);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#E8CCA0';
  ctx.textAlign = 'center';
  ctx.font = `600 ${Math.max(8, Math.round(h * 0.22))}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(topText, cx, cy - h * 0.06);

  ctx.fillStyle = '#D8B474';
  ctx.font = `700 ${Math.max(10, Math.round(h * 0.34))}px "Cormorant Garamond", Georgia, serif`;
  ctx.fillText(bottomText, cx, cy + h * 0.3);
  ctx.restore();
}

function drawKthGreenSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.save();
  ctx.fillStyle = '#3F6A2B';
  ctx.strokeStyle = '#D8B474';
  ctx.lineWidth = Math.max(1, r * 0.07);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#8BC34A';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.65, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#2E4C1E';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.45, cy + r * 0.22);
  ctx.lineTo(cx - r * 0.12, cy - r * 0.26);
  ctx.lineTo(cx + r * 0.06, cy - r * 0.02);
  ctx.lineTo(cx + r * 0.24, cy - r * 0.3);
  ctx.lineTo(cx + r * 0.45, cy + r * 0.22);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawMandalaCrest(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, label: string) {
  ctx.save();
  ctx.fillStyle = 'rgba(20, 11, 7, 0.72)';
  ctx.strokeStyle = '#D8B474';
  ctx.lineWidth = Math.max(1.2, r * 0.04);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.lineWidth = Math.max(0.8, r * 0.02);
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8;
    ctx.fillStyle = '#D8B474';
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * r * 0.89, cy + Math.sin(a) * r * 0.89, r * 0.032, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#FAF5EB';
  ctx.textAlign = 'center';
  ctx.font = `600 ${Math.max(8, Math.round(r * 0.22))}px "Cormorant Garamond", Georgia, serif`;
  ctx.fillText(label, cx, cy + r * 0.06);
  ctx.restore();
}

function applyRectTransform(
  ctx: CanvasRenderingContext2D,
  sceneW: number,
  sceneH: number,
  rect: PanelOverlayRect,
  fn: (boxW: number, boxH: number) => void
) {
  const bx = (rect.x / 100) * sceneW;
  const by = (rect.y / 100) * sceneH;
  const bw = (rect.w / 100) * sceneW;
  const bh = (rect.h / 100) * sceneH;

  const cx = bx + bw / 2;
  const cy = by + bh / 2;
  const scaleX = rect.rotateYDeg ? Math.cos((rect.rotateYDeg * Math.PI) / 180) : 1;
  const skewY = rect.skewYDeg ? Math.tan((rect.skewYDeg * Math.PI) / 180) : 0;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.transform(scaleX, skewY, 0, 1, 0, 0);
  ctx.translate(-bw / 2, -bh / 2);
  fn(bw, bh);
  ctx.restore();
}

function wrapCenteredText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(/\s+/);
  let line = '';
  let y = startY;
  for (let i = 0; i < words.length; i++) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, cx, y);
      line = words[i];
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, cx, y);
    y += lineHeight;
  }
  return y;
}

function drawFrontOverlayCanvas(
  ctx: CanvasRenderingContext2D,
  config: PackagingConfig,
  sceneW: number,
  sceneH: number,
  rect: PanelOverlayRect,
  variantStyle: 'classic' | 'doypack' | 'heritage-mandala' | 'botanical' | 'copper' | 'minimal'
) {
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const hasValve = Boolean(rect.valveClearCenterRatio);
  const isCopper = variantStyle === 'copper';
  const isDoypack = variantStyle === 'doypack';
  const isHeritage = variantStyle === 'heritage-mandala';

  applyRectTransform(ctx, sceneW, sceneH, rect, (bw, bh) => {
    const cx = bw / 2;
    const cqi = bw / 100;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = Math.max(4, cqi * 1.8);
    ctx.shadowOffsetY = 1;

    const crestY = (isDoypack ? 0.115 : isCopper ? 0.21 : 0.15) * bh;
    const crestR = (isCopper ? 7.6 : isDoypack ? 6.2 : 7.0) * cqi;
    drawSunBeanCrest(ctx, cx, crestY, crestR);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#D8B474';
    ctx.font = `700 ${Math.round((isCopper ? 6.0 : isDoypack ? 4.5 : 5.1) * cqi)}px "Plus Jakarta Sans", sans-serif`;
    const coffeY = crestY + crestR + 4.0 * cqi;
    ctx.fillText('COFFE BEAN', cx, coffeY);

    ctx.fillStyle = '#FAF5EB';
    ctx.font = `500 ${Math.round((isCopper ? 3.8 : isDoypack ? 3.0 : 3.3) * cqi)}px "Plus Jakarta Sans", sans-serif`;
    const estY = coffeY + 4.2 * cqi;
    ctx.fillText('EST 2024', cx, estY);

    const lineHalf = bw * 0.28;
    const estTextW = ctx.measureText('EST 2024').width;
    ctx.strokeStyle = 'rgba(250, 245, 235, 0.55)';
    ctx.lineWidth = Math.max(1, cqi * 0.35);
    ctx.beginPath();
    ctx.moveTo(cx - lineHalf, estY - 1.2 * cqi);
    ctx.lineTo(cx - estTextW * 0.72, estY - 1.2 * cqi);
    ctx.moveTo(cx + estTextW * 0.72, estY - 1.2 * cqi);
    ctx.lineTo(cx + lineHalf, estY - 1.2 * cqi);
    ctx.stroke();

    const valveSkip = hasValve ? bh * 0.125 : bh * 0.045;
    const titleSize = Math.round((isDoypack ? 14.2 : isCopper ? 16.0 : 14.8) * cqi);
    const arunikaY = estY + valveSkip + titleSize * 0.85;
    ctx.fillStyle = '#D8B474';
    ctx.font = `700 ${titleSize}px "Cormorant Garamond", Georgia, serif`;
    ctx.fillText('ARUNIKA', cx, arunikaY);
    const kawiY = arunikaY + titleSize * 0.94;
    ctx.fillText('KAWI', cx, kawiY);

    const subSize = Math.round((isDoypack ? 4.5 : isCopper ? 5.2 : 4.7) * cqi);
    ctx.fillStyle = '#FAF5EB';
    ctx.font = `600 ${subSize}px "Plus Jakarta Sans", sans-serif`;
    const sub1Y = kawiY + (hasValve ? 7.5 : 8.5) * cqi;
    ctx.fillText(roast.subtitle, cx, sub1Y);
    ctx.fillText(variant.frontLabel, cx, sub1Y + subSize * 1.32);

    if (isHeritage) {
      drawMandalaCrest(ctx, cx, sub1Y + subSize * 1.32 + 15 * cqi, 12.5 * cqi, variant.frontLabel);
    }

    if (config.sealPlacement === 'front') {
      drawKthGreenSeal(ctx, bw * 0.82, bh * rect.bandRatioTop - 10 * cqi, 7.5 * cqi);
    }
    ctx.restore();

    // Bottom band text
    const bandCenterY = bh * (rect.bandRatioTop + rect.bandRatioH * 0.56);
    ctx.fillStyle = rect.bandTextColor;
    ctx.textAlign = 'center';
    ctx.font = `700 ${Math.round((isCopper ? 5.5 : 5.0) * cqi)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(`Isi Bersih : ${config.netWeight}`, cx, bandCenterY);
  });
}

function drawRearOverlayCanvas(
  ctx: CanvasRenderingContext2D,
  config: PackagingConfig,
  sceneW: number,
  sceneH: number,
  rect: PanelOverlayRect,
  variantStyle: 'classic' | 'doypack' | 'heritage-mandala' | 'botanical' | 'copper' | 'minimal'
) {
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const isCopper = variantStyle === 'copper';
  const isDoypack = variantStyle === 'doypack';

  applyRectTransform(ctx, sceneW, sceneH, rect, (bw, bh) => {
    const cx = bw / 2;
    const cqi = bw / 100;
    const usableH = bh * rect.bandRatioTop;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = Math.max(4, cqi * 1.6);
    ctx.shadowOffsetY = 1;

    const badgeY = usableH * (isDoypack ? 0.17 : 0.16);
    drawRoastBadge(ctx, cx, badgeY, bw * 0.32, roast.crestTop, roast.crestBottom);

    ctx.fillStyle = '#D8B474';
    ctx.textAlign = 'center';
    ctx.font = `700 ${Math.round((isCopper ? 6.5 : 5.9) * cqi)}px "Plus Jakarta Sans", sans-serif`;
    const headY = badgeY + bw * 0.13;
    ctx.fillText('Arunika Kawi Coffee', cx, headY);

    const bodySize = Math.round((isCopper ? 3.65 : 3.35) * cqi);
    ctx.fillStyle = '#F4ECE0';
    ctx.font = `400 ${bodySize}px "Plus Jakarta Sans", sans-serif`;
    const copy = `Diolah secara tradisional (Goreng Kreweng) oleh Kelompok Tani Hutan. Dipetik langsung dari lereng Gunung Kawi. Setiap seduhan menghadirkan karakter ${variant.storyCharacter} ${roast.storyRoast}`;
    const afterStoryY = wrapCenteredText(ctx, copy, cx, headY + 6.5 * cqi, bw * 0.86, bodySize * 1.34);

    ctx.fillStyle = '#D8B474';
    ctx.font = `600 ${Math.round((isCopper ? 3.8 : 3.5) * cqi)}px "Plus Jakarta Sans", sans-serif`;
    const tagY = afterStoryY + 2.5 * cqi;
    ctx.fillText('Arunika Kawi Coffee Harum dan Nikmat', cx, tagY);

    ctx.fillStyle = '#FAF5EB';
    ctx.font = `600 ${Math.round((isCopper ? 3.3 : 3.05) * cqi)}px "Plus Jakarta Sans", sans-serif`;
    const compLabel =
      config.beanVariant === 'robusta-100'
        ? 'KOMPOSISI 100 % BIJI KOPI ROBUSTA'
        : `KOMPOSISI ${variant.frontLabel.toUpperCase()}`;
    ctx.fillText(compLabel, cx, tagY + 7.5 * cqi);

    // Legal Footer
    const footTop = usableH * 0.8;
    const padX = bw * 0.07;

    if (config.sealPlacement === 'back') {
      const sealR = 5.8 * cqi;
      drawKthGreenSeal(ctx, padX + sealR, footTop + sealR, sealR);
      ctx.fillStyle = '#FAF5EB';
      ctx.textAlign = 'center';
      ctx.font = `500 ${Math.round(2.4 * cqi)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText('PIRT', padX + sealR, footTop + sealR * 2 + 2.6 * cqi);
    }

    const infoX = config.sealPlacement === 'back' ? padX + 14 * cqi : padX;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#D8B474';
    ctx.font = `600 ${Math.round(3.1 * cqi)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('Diproduksi Oleh', infoX, footTop + 2.5 * cqi);

    ctx.fillStyle = '#FAF5EB';
    ctx.font = `400 ${Math.round(2.45 * cqi)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('KUPS Himatarian Blitar', infoX, footTop + 5.8 * cqi);
    ctx.fillText('Jawa Timur – INDONESIA', infoX, footTop + 8.8 * cqi);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(infoX, footTop + 10.6 * cqi, bw * 0.32, 3 * cqi);

    const rightX = bw * 0.56;
    ctx.shadowBlur = Math.max(3, cqi);
    ctx.fillStyle = '#FAF5EB';
    ctx.font = `500 ${Math.round(2.4 * cqi)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('Kode Produksi', rightX, footTop + 2.5 * cqi);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(rightX, footTop + 3.6 * cqi, bw * 0.37, 2.8 * cqi);

    ctx.shadowBlur = Math.max(3, cqi);
    ctx.fillStyle = '#FAF5EB';
    ctx.font = `500 ${Math.round(2.2 * cqi)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('Baik Digunakan Sebelum', rightX, footTop + 9.2 * cqi);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(rightX, footTop + 10.4 * cqi, bw * 0.37, 2.8 * cqi);
    ctx.restore();

    // Bottom Band (NO net weight on Rear)
    const bandCenterY = bh * (rect.bandRatioTop + rect.bandRatioH * 0.56);
    ctx.fillStyle = rect.bandTextColor;
    ctx.textAlign = 'center';
    ctx.font = `700 ${Math.round((isCopper ? 4.3 : 3.9) * cqi)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('100 % KOPI ASLI INDONESIA', cx, bandCenterY);
  });
}

export async function renderMockupSceneCanvas(
  config: PackagingConfig,
  scene: MockupSceneMode = 'natural-kawi',
  width = 1080,
  height = 1440
): Promise<HTMLCanvasElement | null> {
  const isDoypack = config.pouchShape === 'doypack-valve';
  const tall = isTallGusset(config.pouchShape);
  const scaleFactor = config.netWeight === '100 gram' ? 0.93 : 1;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  if (scene !== 'natural-kawi') {
    const showFront = scene === 'studio-front';

    if (isDoypack) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      const studioSrc = showFront ? STUDIO_DOYPACK_LAYOUT.frontImage : STUDIO_DOYPACK_LAYOUT.rearImage;
      const overlayRect = showFront ? STUDIO_DOYPACK_LAYOUT.front : STUDIO_DOYPACK_LAYOUT.rear;
      const studioImg = await loadImage(studioSrc).catch(() => null);

      const boxSide = Math.round(Math.min(width, height) * scaleFactor);
      const ox = Math.round((width - boxSide) / 2);
      const oy = Math.round(height - boxSide * scaleFactor - (height - boxSide) * 0.5);

      if (studioImg) {
        ctx.drawImage(studioImg, ox, oy, boxSide, boxSide);
      }

      ctx.save();
      ctx.translate(ox, oy);
      if (showFront) {
        drawFrontOverlayCanvas(ctx, config, boxSide, boxSide, overlayRect, 'doypack');
      } else {
        drawRearOverlayCanvas(ctx, config, boxSide, boxSide, overlayRect, 'doypack');
      }
      ctx.restore();
      return canvas;
    }

    // Studio Gusset Bag (Box Pouch or Tall Gusset) with Pinched-Top Side Gusset
    const scale = 5;
    const sheetScope = showFront ? 'front-only' : 'back-only';
    const sheet = await renderPrintSheetCanvas(config, sheetScope, scale);

    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#FFFFFF');
    bg.addColorStop(0.75, '#FAF9F6');
    bg.addColorStop(1, '#EDE9E0');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    const shGrad = ctx.createRadialGradient(width / 2, height * 0.89, 10, width / 2, height * 0.89, width * 0.3);
    shGrad.addColorStop(0, 'rgba(26, 20, 18, 0.30)');
    shGrad.addColorStop(1, 'rgba(26, 20, 18, 0)');
    ctx.fillStyle = shGrad;
    ctx.beginPath();
    ctx.ellipse(width / 2, height * 0.89, width * 0.28, height * 0.025, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (sheet) {
      const pouchH = Math.round(height * 0.77 * scaleFactor);
      const frontAspect = tall ? 100 / 240 : 130 / 210;
      const gussetAspect = tall ? 42 / 240 : 48 / 210;
      const frontW = Math.round(pouchH * frontAspect);
      const gussetW = Math.round(pouchH * gussetAspect);
      const totalW = gussetW + frontW;
      const gx = Math.round((width - totalW) / 2);
      const gy = Math.round(height * 0.89 - pouchH);
      const fx = gx + gussetW;

      // Pinched-top V-fold side gusset
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(gx + gussetW * 0.78, gy);
      ctx.lineTo(fx, gy);
      ctx.lineTo(fx, gy + pouchH);
      ctx.lineTo(gx, gy + pouchH);
      ctx.lineTo(gx, gy + pouchH * 0.16);
      ctx.closePath();
      ctx.clip();

      const gusGrad = ctx.createLinearGradient(gx, gy, fx, gy);
      if (config.pouchShape === 'tall-heritage') {
        gusGrad.addColorStop(0, '#A88446');
        gusGrad.addColorStop(0.48, '#DFC389');
        gusGrad.addColorStop(0.52, '#8F6D36');
        gusGrad.addColorStop(1, '#C9A96A');
      } else {
        gusGrad.addColorStop(0, '#1E130E');
        gusGrad.addColorStop(0.46, '#312018');
        gusGrad.addColorStop(0.52, '#140B07');
        gusGrad.addColorStop(1, '#261811');
      }
      ctx.fillStyle = gusGrad;
      ctx.fillRect(gx, gy, gussetW, pouchH);

      // Center V-fold crease
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(gx + gussetW * 0.48, gy + pouchH * 0.16, 2, pouchH * 0.84);

      // Bottom band wrap on gusset
      if (config.pouchShape === 'tall-copper') {
        ctx.fillStyle = '#180E0A';
        ctx.fillRect(gx, gy + pouchH * 0.89, gussetW, pouchH * 0.11);
      } else {
        const bandG = ctx.createLinearGradient(gx, gy + pouchH * 0.89, fx, gy + pouchH);
        bandG.addColorStop(0, '#9F7637');
        bandG.addColorStop(0.5, '#F2DFB3');
        bandG.addColorStop(1, '#8C6429');
        ctx.fillStyle = bandG;
        ctx.fillRect(gx, gy + pouchH * 0.888, gussetW, pouchH * 0.112);
      }
      ctx.restore();

      // Main front/rear panel
      const bleedPx = 3 * scale;
      ctx.save();
      ctx.shadowColor = 'rgba(26, 20, 18, 0.35)';
      ctx.shadowBlur = 28;
      ctx.shadowOffsetX = 8;
      ctx.shadowOffsetY = 16;
      ctx.drawImage(
        sheet.canvas,
        bleedPx,
        bleedPx,
        sheet.canvas.width - bleedPx * 2,
        sheet.canvas.height - bleedPx * 2,
        fx,
        gy,
        frontW,
        pouchH
      );
      ctx.restore();
    }
    return canvas;
  }

  // Natural Scenic Presentation (Exact Original 6 Blank Mockup Bases)
  const layout = NATURAL_MOCKUP_LAYOUTS[config.pouchShape];
  const baseImg = await loadImage(layout.baseImage).catch(() => null);

  ctx.fillStyle = '#18100C';
  ctx.fillRect(0, 0, width, height);

  if (baseImg) {
    drawCover(ctx, baseImg, 0, 0, width, height);
  }

  drawFrontOverlayCanvas(ctx, config, width, height, layout.front, layout.variantStyle);
  drawRearOverlayCanvas(ctx, config, width, height, layout.rear, layout.variantStyle);

  return canvas;
}

export async function renderAndDownloadMockup(
  config: PackagingConfig,
  scene: MockupSceneMode = 'natural-kawi',
  customFilename?: string,
  mime: 'image/png' | 'image/jpeg' = 'image/png'
): Promise<void> {
  const isSquareStudio = scene !== 'natural-kawi';
  const canvas = await renderMockupSceneCanvas(
    config,
    scene,
    isSquareStudio ? 1200 : 1080,
    isSquareStudio ? 1200 : 1440
  );
  if (!canvas) return;
  const ext = mime === 'image/jpeg' ? 'jpg' : 'png';
  const sceneSlug = scene === 'natural-kawi' ? 'Natural' : scene === 'studio-front' ? 'StudioDepan' : 'StudioBelakang';
  const filename =
    customFilename ||
    `PackagingStudio-${config.pouchShape}-Mockup-${sceneSlug}-${config.netWeight.replace(/\s+/g, '')}-${getWibDateKey()}.${ext}`;
  await downloadCanvas(canvas, filename, mime, 0.94);
}
