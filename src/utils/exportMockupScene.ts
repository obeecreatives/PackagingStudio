import {
  BEAN_VARIANTS,
  isTallGusset,
  ORIGINAL_UPLOADS,
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
import { drawArunikaKawiWordmarkCanvas } from './arunikaWordmarkPaths';
import { renderPrintSheetCanvas, loadImage } from './exportPrintArtwork';
import { downloadCanvas } from './exportSingleElement';
import { drawCanvasQuadWarp } from './perspectiveHomography';

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
  const h = w * 0.6;
  const sx = w / 180;
  const sy = h / 108;

  const drawBaroquePath = (inset = 0) => {
    const ox = cx - w / 2;
    const oy = cy - h / 2;
    const p = (x: number, y: number): [number, number] => [
      ox + (90 + (x - 90) * (1 - inset)) * sx,
      oy + (54 + (y - 54) * (1 - inset)) * sy,
    ];
    ctx.beginPath();
    ctx.moveTo(...p(42, 26));
    ctx.bezierCurveTo(...p(52, 14), ...p(69, 9), ...p(90, 9));
    ctx.bezierCurveTo(...p(111, 9), ...p(128, 14), ...p(138, 26));
    ctx.bezierCurveTo(...p(155, 28), ...p(167, 40), ...p(167, 54));
    ctx.bezierCurveTo(...p(167, 68), ...p(155, 80), ...p(138, 82));
    ctx.bezierCurveTo(...p(128, 93), ...p(111, 99), ...p(90, 99));
    ctx.bezierCurveTo(...p(69, 99), ...p(52, 93), ...p(42, 82));
    ctx.bezierCurveTo(...p(25, 80), ...p(13, 68), ...p(13, 54));
    ctx.bezierCurveTo(...p(13, 40), ...p(25, 28), ...p(42, 26));
    ctx.closePath();
  };

  ctx.save();
  drawBaroquePath(0);
  ctx.fillStyle = 'rgba(20, 11, 7, 0.56)';
  ctx.fill();
  ctx.strokeStyle = '#D8B474';
  ctx.lineWidth = Math.max(1.2, sx * 1.8);
  ctx.stroke();

  drawBaroquePath(0.09);
  ctx.strokeStyle = 'rgba(216, 180, 116, 0.55)';
  ctx.lineWidth = Math.max(0.8, sx * 0.8);
  ctx.stroke();

  ctx.fillStyle = '#F4E6C8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `600 ${Math.max(8, Math.round(12 * sy))}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(topText, cx, cy - 8 * sy);

  ctx.fillStyle = '#D8B474';
  ctx.font = `700 ${Math.max(11, Math.round(21 * sy))}px "Cormorant Garamond", Georgia, serif`;
  ctx.fillText(bottomText, cx, cy + 12 * sy);
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

interface RichRun {
  text: string;
  color: string;
  font: string;
}

/**
 * Draws centered wrapped text supporting inline color/weight spans (e.g. gold highlight on rasa kopi robusta).
 */
function drawRichCenteredParagraph(
  ctx: CanvasRenderingContext2D,
  runs: RichRun[],
  cx: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
): number {
  interface WordToken {
    word: string;
    color: string;
    font: string;
    width: number;
  }

  const tokens: WordToken[] = [];
  for (const run of runs) {
    ctx.font = run.font;
    const words = run.text.trim().split(/\s+/);
    for (const w of words) {
      if (!w) continue;
      tokens.push({
        word: w,
        color: run.color,
        font: run.font,
        width: ctx.measureText(w).width,
      });
    }
  }

  const spaceW = ctx.measureText(' ').width;
  const lines: WordToken[][] = [];
  let currentLine: WordToken[] = [];
  let currentWidth = 0;

  for (const t of tokens) {
    const addW = currentLine.length > 0 ? spaceW + t.width : t.width;
    if (currentWidth + addW > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [t];
      currentWidth = t.width;
    } else {
      currentLine.push(t);
      currentWidth += addW;
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  let y = startY;
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  for (const line of lines) {
    let totalW = 0;
    for (let i = 0; i < line.length; i++) {
      totalW += line[i].width + (i > 0 ? spaceW : 0);
    }
    let cursorX = cx - totalW / 2;
    for (let i = 0; i < line.length; i++) {
      const tok = line[i];
      ctx.font = tok.font;
      ctx.fillStyle = tok.color;
      ctx.fillText(tok.word, cursorX, y);
      cursorX += tok.width + spaceW;
    }
    y += lineHeight;
  }
  ctx.restore();
  return y;
}

function warpOverlayRect(
  destCtx: CanvasRenderingContext2D,
  sceneW: number,
  sceneH: number,
  rect: PanelOverlayRect,
  drawFn: (offCtx: CanvasRenderingContext2D, bw: number, bh: number) => void
) {
  const offW = 720;
  const offH = Math.max(420, Math.round((offW * rect.h * sceneH) / (Math.max(1, rect.w) * sceneW)));

  const offCanvas = document.createElement('canvas');
  offCanvas.width = offW;
  offCanvas.height = offH;
  const offCtx = offCanvas.getContext('2d');
  if (!offCtx) return;

  drawFn(offCtx, offW, offH);

  const [tlPct, trPct, brPct, blPct] = rect.quad;
  const tl = { x: (tlPct.x / 100) * sceneW, y: (tlPct.y / 100) * sceneH };
  const tr = { x: (trPct.x / 100) * sceneW, y: (trPct.y / 100) * sceneH };
  const br = { x: (brPct.x / 100) * sceneW, y: (brPct.y / 100) * sceneH };
  const bl = { x: (blPct.x / 100) * sceneW, y: (blPct.y / 100) * sceneH };

  drawCanvasQuadWarp(destCtx, offCanvas, tl, tr, br, bl, 14, 24);
}

function drawMasterBeansOverlay(
  ctx: CanvasRenderingContext2D,
  beanRefImg: HTMLImageElement,
  bw: number,
  bh: number,
  bandRatioTop: number,
  isCopper: boolean
) {
  const dstTop = bh * 0.485;
  const dstH = Math.max(40, bh * (bandRatioTop - 0.485 - 0.014));

  const temp = document.createElement('canvas');
  temp.width = bw;
  temp.height = Math.round(dstH);
  const tctx = temp.getContext('2d');
  if (!tctx) return;

  tctx.fillStyle = '#150C08';
  tctx.fillRect(0, 0, temp.width, temp.height);

  const sw = beanRefImg.naturalWidth;
  const sh = beanRefImg.naturalHeight;
  tctx.drawImage(beanRefImg, 0, sh * 0.5, sw, sh * 0.382, 0, 0, temp.width, temp.height);

  // Matte cylindrical lighting sheen matching pouch face
  const sheen = tctx.createLinearGradient(0, 0, temp.width, temp.height * 0.25);
  sheen.addColorStop(0, 'rgba(255, 248, 234, 0.08)');
  sheen.addColorStop(0.36, 'rgba(255, 255, 255, 0)');
  sheen.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
  tctx.fillStyle = sheen;
  tctx.fillRect(0, 0, temp.width, temp.height);

  // Smooth top-edge fade so the bean bed blends seamlessly into dark espresso gradient
  tctx.globalCompositeOperation = 'destination-in';
  const maskGrad = tctx.createLinearGradient(0, 0, 0, temp.height);
  maskGrad.addColorStop(0, 'rgba(0,0,0,0)');
  maskGrad.addColorStop(0.2, 'rgba(0,0,0,0.88)');
  maskGrad.addColorStop(0.34, 'rgba(0,0,0,1)');
  maskGrad.addColorStop(1, 'rgba(0,0,0,1)');
  tctx.fillStyle = maskGrad;
  tctx.fillRect(0, 0, temp.width, temp.height);

  ctx.save();
  if (isCopper) {
    ctx.beginPath();
    ctx.moveTo(bw * 0.075, dstTop);
    ctx.lineTo(bw, dstTop);
    ctx.lineTo(bw, dstTop + dstH * 0.24);
    ctx.lineTo(bw * 0.25, dstTop + dstH);
    ctx.lineTo(bw * 0.075, dstTop + dstH);
    ctx.closePath();
    ctx.clip();
  }
  ctx.drawImage(temp, 0, dstTop);
  ctx.restore();
}

function drawFrontOverlayCanvas(
  destCtx: CanvasRenderingContext2D,
  config: PackagingConfig,
  sceneW: number,
  sceneH: number,
  rect: PanelOverlayRect,
  variantStyle: 'classic' | 'doypack' | 'heritage-mandala' | 'botanical' | 'copper' | 'minimal',
  beanRefImg?: HTMLImageElement | null
) {
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const hasValve = Boolean(rect.valveClearCenterRatio);
  const isCopper = variantStyle === 'copper';
  const isBotanical = variantStyle === 'botanical';
  const isDoypack = variantStyle === 'doypack';
  const isHeritage = variantStyle === 'heritage-mandala';

  const topPadPct = hasValve ? 5.5 : isBotanical ? 14.5 : isCopper ? 14.0 : 12.2;
  const titleGapPct = hasValve ? 14.5 : isBotanical ? 9.0 : isCopper ? 10.0 : 9.5;
  const subGapPct = hasValve ? 5.2 : isCopper ? 8.5 : 8.4;

  warpOverlayRect(destCtx, sceneW, sceneH, rect, (ctx, bw, bh) => {
    const cx = bw / 2;
    const cqi = bw / 100;
    const usableH = bh * rect.bandRatioTop;

    if (rect.useMasterBeans && beanRefImg) {
      drawMasterBeansOverlay(ctx, beanRefImg, bw, bh, rect.bandRatioTop, isCopper);
    }

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = Math.max(4, cqi * 1.8);
    ctx.shadowOffsetY = 1;

    const crestR = (isCopper ? 6.6 : isDoypack ? 5.5 : 6.1) * cqi;
    const crestY = usableH * (topPadPct / 100) + crestR;
    drawSunBeanCrest(ctx, cx, crestY, crestR);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#D8B474';
    ctx.font = `700 ${Math.round((isCopper ? 6.0 : isDoypack ? 4.5 : 5.1) * cqi)}px "Plus Jakarta Sans", sans-serif`;
    const coffeY = crestY + crestR + 4.4 * cqi;
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

    const wordmarkW = (isDoypack ? 58 : isCopper ? 65 : 62) * cqi;
    const wordmarkTopY = estY + usableH * (titleGapPct / 100) + 1.5 * cqi;
    const wordmarkH = drawArunikaKawiWordmarkCanvas(ctx, cx, wordmarkTopY, wordmarkW);

    const subSize = Math.round((isDoypack ? 4.5 : isCopper ? 5.2 : 4.7) * cqi);
    ctx.fillStyle = '#FAF5EB';
    ctx.font = `600 ${subSize}px "Plus Jakarta Sans", sans-serif`;
    const sub1Y = wordmarkTopY + wordmarkH + usableH * (subGapPct / 100) + subSize * 0.75;
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
  destCtx: CanvasRenderingContext2D,
  config: PackagingConfig,
  sceneW: number,
  sceneH: number,
  rect: PanelOverlayRect,
  variantStyle: 'classic' | 'doypack' | 'heritage-mandala' | 'botanical' | 'copper' | 'minimal'
) {
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const isCopper = variantStyle === 'copper';
  const topPad = rect.topPadPct ?? 9.5;

  warpOverlayRect(destCtx, sceneW, sceneH, rect, (ctx, bw, bh) => {
    const cx = bw / 2;
    const cqi = bw / 100;
    const usableH = bh * rect.bandRatioTop;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.88)';
    ctx.shadowBlur = Math.max(4, cqi * 1.6);
    ctx.shadowOffsetY = 1;

    // 1. Top Baroque Roast Crest cleanly below zipper/top-fin
    const badgeW = (isCopper ? 32 : 30) * cqi;
    const badgeH = badgeW * 0.6;
    const badgeY = (topPad / 100) * usableH + badgeH * 0.5;
    drawRoastBadge(ctx, cx, badgeY, badgeW, roast.crestTop, roast.crestBottom);

    // 2. Arunika Kawi Coffee sub-headline
    const headFontPx = Math.round((isCopper ? 6.1 : 5.7) * cqi);
    ctx.fillStyle = '#D8B474';
    ctx.textAlign = 'center';
    ctx.font = `700 ${headFontPx}px "Plus Jakarta Sans", sans-serif`;
    const headY = badgeY + badgeH * 0.5 + 7.2 * cqi;
    ctx.fillText('Arunika Kawi Coffee', cx, headY);

    // 3. Story Paragraph with Gold Highlighted Bean Character
    const bodySize = Math.round((isCopper ? 3.35 : 3.2) * cqi);
    const normalFont = `400 ${bodySize}px "Plus Jakarta Sans", sans-serif`;
    const italicFont = `italic 400 ${bodySize}px "Plus Jakarta Sans", sans-serif`;
    const goldBoldFont = `600 ${bodySize}px "Plus Jakarta Sans", sans-serif`;

    const afterStoryY = drawRichCenteredParagraph(
      ctx,
      [
        { text: 'Diolah secara tradisional (', color: '#F4ECE0', font: normalFont },
        { text: 'Goreng Kreweng', color: '#F4ECE0', font: italicFont },
        {
          text: ') oleh Kelompok Tani Hutan, dipetik langsung dari lereng Gunung Kawi. Setiap seduhannya menghadirkan karakter',
          color: '#F4ECE0',
          font: normalFont,
        },
        { text: variant.storyCharacter, color: '#D8B474', font: goldBoldFont },
        { text: roast.storyRoast, color: '#F4ECE0', font: normalFont },
      ],
      cx,
      headY + 6.2 * cqi,
      bw * 0.84,
      bodySize * 1.3
    );

    // 4. Tagline
    const tagSize = Math.round((isCopper ? 3.45 : 3.3) * cqi);
    const afterTagY = drawRichCenteredParagraph(
      ctx,
      [
        { text: 'Arunika Kawi Coffee', color: '#D8B474', font: `600 ${tagSize}px "Plus Jakarta Sans", sans-serif` },
        { text: 'harum dan nikmat', color: '#FAF5EB', font: `600 ${tagSize}px "Plus Jakarta Sans", sans-serif` },
      ],
      cx,
      afterStoryY + 2.8 * cqi,
      bw * 0.86,
      tagSize * 1.25
    );

    // 5. Legal Footer (reserve bottom ~20.5% of usable height)
    const footTop = usableH - 17.5 * cqi;

    // Center KOMPOSISI cleanly halfway between afterTagY and footTop (eliminates middle void!)
    const compY = afterTagY + Math.max(4.5 * cqi, (footTop - afterTagY - 2 * cqi) * 0.48);
    ctx.fillStyle = '#FAF5EB';
    ctx.textAlign = 'center';
    ctx.font = `600 ${Math.round((isCopper ? 3.15 : 2.95) * cqi)}px "Plus Jakarta Sans", sans-serif`;
    const compLabel =
      config.beanVariant === 'robusta-100'
        ? 'KOMPOSISI 100 % BIJI KOPI ROBUSTA'
        : `KOMPOSISI ${variant.frontLabel.toUpperCase()}`;
    ctx.fillText(compLabel, cx, compY);

    // Footer Columns with clean 8% horizontal margin
    const padX = bw * 0.08;
    const rightMargin = bw * 0.92;

    if (config.sealPlacement === 'back') {
      const sealR = 5.6 * cqi;
      drawKthGreenSeal(ctx, padX + sealR, footTop + sealR, sealR);
      ctx.fillStyle = '#FAF5EB';
      ctx.textAlign = 'center';
      ctx.font = `500 ${Math.round(2.3 * cqi)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText('PIRT', padX + sealR, footTop + sealR * 2 + 2.5 * cqi);
    }

    const infoX = config.sealPlacement === 'back' ? padX + 13.5 * cqi : padX;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#D8B474';
    ctx.font = `600 ${Math.round(2.95 * cqi)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('Diproduksi Oleh', infoX, footTop + 2.4 * cqi);

    ctx.fillStyle = '#FAF5EB';
    ctx.font = `400 ${Math.round(2.4 * cqi)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('KUPS Himatarian Blitar', infoX, footTop + 5.6 * cqi);
    ctx.fillText('Jawa Timur – INDONESIA', infoX, footTop + 8.5 * cqi);

    const leftBoxW = bw * 0.54 - infoX - 2.5 * cqi;
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(infoX, footTop + 10.3 * cqi, Math.max(12 * cqi, leftBoxW), 2.8 * cqi);

    const rightX = bw * 0.56;
    const rightBoxW = rightMargin - rightX;
    ctx.shadowBlur = Math.max(3, cqi);
    ctx.fillStyle = '#FAF5EB';
    ctx.font = `500 ${Math.round(2.3 * cqi)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('Kode Produksi', rightX, footTop + 2.4 * cqi);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(rightX, footTop + 3.5 * cqi, rightBoxW, 2.6 * cqi);

    ctx.shadowBlur = Math.max(3, cqi);
    ctx.fillStyle = '#FAF5EB';
    ctx.font = `500 ${Math.round(2.1 * cqi)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText('Baik Digunakan Sebelum', rightX, footTop + 9.0 * cqi);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(rightX, footTop + 10.1 * cqi, rightBoxW, 2.6 * cqi);
    ctx.restore();

    // 6. Bottom Band (NO net weight on Rear)
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
  const [baseImg, beanRefImg] = await Promise.all([
    loadImage(layout.baseImage).catch(() => null),
    layout.front.useMasterBeans ? loadImage(ORIGINAL_UPLOADS.revisedFront250).catch(() => null) : Promise.resolve(null),
  ]);

  ctx.fillStyle = '#18100C';
  ctx.fillRect(0, 0, width, height);

  if (baseImg) {
    drawCover(ctx, baseImg, 0, 0, width, height);
  }

  drawFrontOverlayCanvas(ctx, config, width, height, layout.front, layout.variantStyle, beanRefImg);
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
