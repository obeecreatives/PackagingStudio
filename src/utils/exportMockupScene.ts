import { GENERATED_ASSETS, isTallGusset, PackagingConfig, PouchShapeId } from '../types/packaging';
import type { MockupSceneMode } from '../components/LiveMockupScene';
import { getWibDateKey } from './dateUtils';
import { loadImage, renderPrintSheetCanvas } from './exportPrintArtwork';
import { downloadCanvas } from './exportSingleElement';

function getStageAsset(shape: PouchShapeId): { src: string; baseBottomRatio: number } {
  switch (shape) {
    case 'box-gusset':
    case 'doypack-valve':
      return { src: GENERATED_ASSETS.sceneTravertineKawi, baseBottomRatio: 0.21 };
    case 'tall-heritage':
    case 'tall-copper':
      return { src: GENERATED_ASSETS.sceneCafeCounter, baseBottomRatio: 0.18 };
    case 'tall-botanical':
    case 'tall-minimal':
      return { src: GENERATED_ASSETS.sceneSlateDawn, baseBottomRatio: 0.22 };
  }
}

function drawRoundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radii: [number, number, number, number]) {
  const [tl, tr, br, bl] = radii;
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  ctx.lineTo(x + bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

function drawCroppedSheet(
  ctx: CanvasRenderingContext2D,
  sheetCanvas: HTMLCanvasElement,
  scale: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  isDoypack: boolean,
  isRightSideShadow = false
) {
  const bleedPx = 3 * scale;
  const sx = bleedPx;
  const sy = bleedPx;
  const sw = Math.max(1, sheetCanvas.width - bleedPx * 2);
  const sh = Math.max(1, sheetCanvas.height - bleedPx * 2);

  ctx.save();
  ctx.shadowColor = 'rgba(8, 4, 2, 0.55)';
  ctx.shadowBlur = Math.round(dw * 0.09);
  ctx.shadowOffsetX = Math.round(dw * 0.02);
  ctx.shadowOffsetY = Math.round(dw * 0.045);
  ctx.fillStyle = '#18100C';
  const rTop = isDoypack ? Math.round(dw * 0.03) : 4;
  const rBot = isDoypack ? Math.round(dw * 0.085) : 4;
  drawRoundedRectPath(ctx, dx, dy, dw, dh, [rTop, rTop, rBot, rBot]);
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawRoundedRectPath(ctx, dx, dy, dw, dh, [rTop, rTop, rBot, rBot]);
  ctx.clip();
  ctx.drawImage(sheetCanvas, sx, sy, sw, sh, dx, dy, dw, dh);

  // Subtle physical zipper groove
  const zipY = dy + dh * (isDoypack ? 0.095 : 0.075);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(dx, zipY, dw, 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.fillRect(dx, zipY + 2, dw, 1);

  // Soft directional specular lighting across bag surface
  const sheen = ctx.createLinearGradient(dx, dy, dx + dw, dy + dh * 0.45);
  if (isRightSideShadow) {
    sheen.addColorStop(0, 'rgba(255, 248, 234, 0.07)');
    sheen.addColorStop(0.35, 'rgba(255, 255, 255, 0)');
    sheen.addColorStop(1, 'rgba(0, 0, 0, 0.24)');
  } else {
    sheen.addColorStop(0, 'rgba(255, 248, 234, 0.10)');
    sheen.addColorStop(0.32, 'rgba(255, 255, 255, 0.02)');
    sheen.addColorStop(1, 'rgba(0, 0, 0, 0.19)');
  }
  ctx.fillStyle = sheen;
  ctx.fillRect(dx, dy, dw, dh);
  ctx.restore();
}

export async function renderMockupSceneCanvas(
  config: PackagingConfig,
  scene: MockupSceneMode = 'natural-kawi',
  width = 1080,
  height = 1440
): Promise<HTMLCanvasElement | null> {
  const scale = 5;
  const isDoypack = config.pouchShape === 'doypack-valve';
  const tall = isTallGusset(config.pouchShape);
  const scaleFactor = config.netWeight === '100 gram' ? 0.9 : 1;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const stage = getStageAsset(config.pouchShape);

  const [frontSheet, backSheet, stageImg] = await Promise.all([
    scene !== 'studio-rear' ? renderPrintSheetCanvas(config, 'front-only', scale) : Promise.resolve(null),
    scene !== 'studio-front' ? renderPrintSheetCanvas(config, 'back-only', scale) : Promise.resolve(null),
    scene === 'natural-kawi' ? loadImage(stage.src).catch(() => null) : Promise.resolve(null),
  ]);

  if (scene !== 'natural-kawi') {
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, '#FFFFFF');
    bg.addColorStop(0.75, '#FAF9F6');
    bg.addColorStop(1, '#EDE9E0');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Contact shadow
    ctx.save();
    const shGrad = ctx.createRadialGradient(width / 2, height * 0.89, 10, width / 2, height * 0.89, width * 0.3);
    shGrad.addColorStop(0, 'rgba(26, 20, 18, 0.30)');
    shGrad.addColorStop(1, 'rgba(26, 20, 18, 0)');
    ctx.fillStyle = shGrad;
    ctx.beginPath();
    ctx.ellipse(width / 2, height * 0.89, width * 0.28, height * 0.025, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const targetSheet = scene === 'studio-front' ? frontSheet : backSheet;
    if (targetSheet) {
      const pouchAspect = isDoypack ? 150 / 220 : tall ? 100 / 240 : 130 / 210;
      const drawH = Math.round(height * 0.77 * scaleFactor);
      const drawW = Math.round(drawH * pouchAspect);
      const dx = Math.round((width - drawW) / 2);
      const dy = Math.round(height * 0.89 - drawH);
      drawCroppedSheet(ctx, targetSheet.canvas, scale, dx, dy, drawW, drawH, isDoypack);
    }
    return canvas;
  }

  // Natural scenic backdrop
  if (stageImg) {
    const imgRatio = stageImg.naturalWidth / Math.max(1, stageImg.naturalHeight);
    const targetRatio = width / height;
    let sx = 0;
    let sy = 0;
    let sw = stageImg.naturalWidth;
    let sh = stageImg.naturalHeight;
    if (imgRatio > targetRatio) {
      sw = stageImg.naturalHeight * targetRatio;
      sx = (stageImg.naturalWidth - sw) / 2;
    } else {
      sh = stageImg.naturalWidth / targetRatio;
      sy = (stageImg.naturalHeight - sh) / 2;
    }
    ctx.drawImage(stageImg, sx, sy, sw, sh, 0, 0, width, height);
  } else {
    ctx.fillStyle = '#18100C';
    ctx.fillRect(0, 0, width, height);
  }

  const baseY = Math.round(height * (1 - stage.baseBottomRatio));
  ctx.save();
  const baseShadow = ctx.createRadialGradient(width / 2, baseY + 4, 15, width / 2, baseY + 4, width * 0.42);
  baseShadow.addColorStop(0, 'rgba(6, 3, 1, 0.82)');
  baseShadow.addColorStop(1, 'rgba(6, 3, 1, 0)');
  ctx.fillStyle = baseShadow;
  ctx.beginPath();
  ctx.ellipse(width / 2, baseY + 4, width * 0.4, height * 0.022, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const pouchAspect = isDoypack ? 150 / 220 : tall ? 100 / 240 : 130 / 210;
  const maxPairW = width * 0.84 * scaleFactor;
  const gap = Math.round(width * 0.045);
  let pouchW = Math.round((maxPairW - gap) / 2);
  let pouchH = Math.round(pouchW / pouchAspect);
  const maxH = Math.round(height * 0.64 * scaleFactor);
  if (pouchH > maxH) {
    pouchH = maxH;
    pouchW = Math.round(pouchH * pouchAspect);
  }

  const totalW = pouchW * 2 + gap;
  const leftX = Math.round((width - totalW) / 2);
  const rightX = leftX + pouchW + gap;
  const dy = baseY - pouchH;

  if (frontSheet) {
    drawCroppedSheet(ctx, frontSheet.canvas, scale, leftX, dy, pouchW, pouchH, isDoypack, false);
  }
  if (backSheet) {
    drawCroppedSheet(ctx, backSheet.canvas, scale, rightX, dy, pouchW, pouchH, isDoypack, true);
  }

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
