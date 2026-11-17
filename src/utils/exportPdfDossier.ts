import { jsPDF } from 'jspdf';
import {
  COLOR_TOKENS,
  getNaturalMockupAssetForShape,
  getPrintSpecificationRows,
  PHOTO_ASSETS,
  VECTOR_ELEMENTS_META,
} from '../data/packagingSpecs';
import {
  BEAN_VARIANTS,
  GENERATED_ASSETS,
  getDynamicShapeDescription,
  getWeightSpecs,
  NATURAL_MOODS,
  ORIGINAL_UPLOADS,
  PackagingConfig,
  POUCH_SHAPES,
  ROAST_LEVELS,
} from '../types/packaging';
import { getWibBatchAndExpiry, getWibDateKey, getWibFormattedDateTime } from './dateUtils';
import { loadImage, renderPrintSheetCanvas } from './exportPrintArtwork';

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 14;
const CONTENT_W = PAGE_W - MARGIN * 2;

function pdfSafe(text: string): string {
  return text
    .replace(/\u2192/g, '->')
    .replace(/\u2022/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF\u2013\u2014]/g, '');
}

function canvasToJpegDataUrl(canvas: HTMLCanvasElement, quality = 0.88): string {
  return canvas.toDataURL('image/jpeg', quality);
}

async function imageUrlToJpegData(
  src: string,
  maxWidth = 960,
  bgHex = '#18100C'
): Promise<{ dataUrl: string; width: number; height: number } | null> {
  try {
    const img = await loadImage(src);
    const ratio = img.naturalWidth / Math.max(1, img.naturalHeight);
    const targetW = Math.min(maxWidth, img.naturalWidth);
    const targetH = Math.max(1, Math.round(targetW / ratio));

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(img, 0, 0, targetW, targetH);

    return {
      dataUrl: canvasToJpegDataUrl(canvas, 0.88),
      width: targetW,
      height: targetH,
    };
  } catch {
    return null;
  }
}

async function rasterizeSvgBySlug(slug: string, sizePx = 320): Promise<string | null> {
  if (typeof document === 'undefined') return null;
  const svg = document.querySelector(`[data-vector-slug="${slug}"] svg`) as SVGSVGElement | null;
  if (!svg) return null;

  try {
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    clone.setAttribute('width', String(sizePx));
    clone.setAttribute('height', String(sizePx));

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = reject;
        el.src = url;
      });

      const canvas = document.createElement('canvas');
      canvas.width = sizePx;
      canvas.height = sizePx;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = '#18100C';
      ctx.fillRect(0, 0, sizePx, sizePx);

      const pad = Math.round(sizePx * 0.12);
      const boxSize = sizePx - pad * 2;
      const viewBox = svg.viewBox?.baseVal;
      const aspect =
        viewBox && viewBox.width > 0 && viewBox.height > 0
          ? viewBox.width / viewBox.height
          : (img.naturalWidth || 1) / Math.max(1, img.naturalHeight || 1);

      let drawW = boxSize;
      let drawH = boxSize;
      if (aspect > 1) {
        drawH = Math.round(boxSize / aspect);
      } else if (aspect < 1) {
        drawW = Math.round(boxSize * aspect);
      }
      const dx = Math.round((sizePx - drawW) / 2);
      const dy = Math.round((sizePx - drawH) / 2);
      ctx.drawImage(img, dx, dy, drawW, drawH);

      return canvasToJpegDataUrl(canvas, 0.9);
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    return null;
  }
}

function drawContainedImage(
  doc: jsPDF,
  dataUrl: string,
  imgW: number,
  imgH: number,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number,
  bgRgb: [number, number, number] = [24, 16, 12]
) {
  doc.setFillColor(...bgRgb);
  doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, 'F');

  const pad = 2;
  const innerW = boxW - pad * 2;
  const innerH = boxH - pad * 2;
  const scale = Math.min(innerW / Math.max(1, imgW), innerH / Math.max(1, imgH));
  const drawW = imgW * scale;
  const drawH = imgH * scale;
  const drawX = boxX + (boxW - drawW) / 2;
  const drawY = boxY + (boxH - drawH) / 2;

  doc.addImage(dataUrl, 'JPEG', drawX, drawY, drawW, drawH, undefined, 'FAST');
}

function addPageChrome(
  doc: jsPDF,
  shapeLabel: string,
  weight: string,
  pageNum: number,
  totalPages: number,
  timestampWib: string
) {
  // Subtle parchment canvas header strip
  doc.setFillColor(26, 20, 18);
  doc.rect(0, 0, PAGE_W, 13, 'F');

  doc.setTextColor(216, 180, 116);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(pdfSafe('PackagingStudio · Dossier Desain & Produksi'), MARGIN, 8.2);

  doc.setTextColor(250, 245, 235);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(pdfSafe(`${shapeLabel} · ${weight}`), PAGE_W - MARGIN, 8.2, { align: 'right' });

  // Footer
  doc.setDrawColor(210, 202, 188);
  doc.setLineWidth(0.25);
  doc.line(MARGIN, PAGE_H - 11, PAGE_W - MARGIN, PAGE_H - 11);

  doc.setTextColor(87, 77, 71);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(pdfSafe(`Diekspor pada ${timestampWib}`), MARGIN, PAGE_H - 6);
  doc.text(pdfSafe(`Halaman ${pageNum} dari ${totalPages}`), PAGE_W - MARGIN, PAGE_H - 6, {
    align: 'right',
  });
}

function drawSectionHeading(doc: jsPDF, y: number, eyebrow: string, title: string): number {
  doc.setTextColor(138, 100, 41);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(pdfSafe(eyebrow.toUpperCase()), MARGIN, y);

  doc.setTextColor(26, 20, 18);
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.text(pdfSafe(title), MARGIN, y + 5.5);

  doc.setDrawColor(26, 20, 18);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y + 8, PAGE_W - MARGIN, y + 8);
  return y + 12;
}

export async function exportSelectedDesignPdf(config: PackagingConfig): Promise<void> {
  const shapeMeta = POUCH_SHAPES[config.pouchShape];
  const weightSpecs = getWeightSpecs(config.pouchShape, config.netWeight);
  const variant = BEAN_VARIANTS[config.beanVariant];
  const roast = ROAST_LEVELS[config.roastLevel];
  const mood = NATURAL_MOODS[config.naturalMood];
  const timestampWib = getWibFormattedDateTime();
  const { batchCode, expiryCompact } = getWibBatchAndExpiry(12);
  const naturalMockup = getNaturalMockupAssetForShape(config.pouchShape);

  // Render high-res sheets & load images in parallel
  const [
    fullSheet,
    frontSheet,
    backSheet,
    bgFrontSheet,
    bgBackSheet,
    naturalMockupImg,
    frontMasterImg,
    rearMasterImg,
    beansImg,
    kawiOrCherryImg,
    vectorThumbs,
  ] = await Promise.all([
    renderPrintSheetCanvas(config, 'full-dieline', 5),
    renderPrintSheetCanvas(config, 'front-only', 5),
    renderPrintSheetCanvas(config, 'back-only', 5),
    renderPrintSheetCanvas(config, 'bg-front-only', 4),
    renderPrintSheetCanvas(config, 'bg-back-only', 4),
    imageUrlToJpegData(naturalMockup.src, 900),
    imageUrlToJpegData(
      config.netWeight === '100 gram' ? ORIGINAL_UPLOADS.revisedFront100 : ORIGINAL_UPLOADS.revisedFront250,
      700
    ),
    imageUrlToJpegData(ORIGINAL_UPLOADS.revisedRear, 700),
    imageUrlToJpegData(GENERATED_ASSETS.beansCluster, 700),
    imageUrlToJpegData(
      config.naturalMood === 'cherries-beans' ? GENERATED_ASSETS.coffeeCherries : GENERATED_ASSETS.kawiMist,
      700
    ),
    Promise.all(VECTOR_ELEMENTS_META.map((v) => rasterizeSvgBySlug(v.slug, 280))),
  ]);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const totalPages = 5;
  const shapeHeading = `${shapeMeta.code} · ${shapeMeta.shortLabel}`;

  // ============================================================================
  // PAGE 1: RINGKASAN DESAIN ALTERNATIF TERPILIH & MOCKUP
  // ============================================================================
  addPageChrome(doc, shapeHeading, config.netWeight, 1, totalPages, timestampWib);
  let y = 22;

  doc.setTextColor(138, 100, 41);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(pdfSafe(`ARUNIKA KAWI · ${shapeMeta.code.toUpperCase()} · ${config.netWeight.toUpperCase()}`), MARGIN, y);

  doc.setTextColor(26, 20, 18);
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.text(pdfSafe(`${shapeMeta.code} · ${shapeMeta.label}`), MARGIN, y + 7.5);

  const summaryDesc = `${getDynamicShapeDescription(config.pouchShape, config)} Keterangan berat bersih (${config.netWeight}) ditampilkan khusus pada halaman depan.`;
  doc.setTextColor(87, 77, 71);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.2);
  const descLines = doc.splitTextToSize(pdfSafe(summaryDesc), CONTENT_W);
  doc.text(descLines, MARGIN, y + 14);
  y += 14 + descLines.length * 4.3 + 4;

  // Quick configuration pills box
  doc.setFillColor(239, 236, 230);
  doc.roundedRect(MARGIN, y, CONTENT_W, 20, 2, 2, 'F');
  const colW = CONTENT_W / 4;
  const quickMeta = [
    { k: 'DIMENSI AKTIF', v: `${weightSpecs.dimensions}` },
    { k: 'VARIAN BIJI', v: `${variant.frontLabel}` },
    { k: 'KARAKTER SANGRAI', v: `${roast.label}` },
    { k: 'NUANSA FOTO', v: `${mood.label}` },
  ];
  quickMeta.forEach((item, idx) => {
    const qx = MARGIN + 3.5 + idx * colW;
    doc.setTextColor(138, 100, 41);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.text(pdfSafe(item.k), qx, y + 5.6);
    doc.setTextColor(26, 20, 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const valLines = doc.splitTextToSize(pdfSafe(item.v), colW - 5).slice(0, 2);
    doc.text(valLines, qx, y + 10.4);
  });
  y += 24.5;

  // Visual Showcase: Left = Natural Mockup, Right = Front + Back Panels
  const showcaseH = 92;
  const leftBoxW = 72;
  const rightBoxW = CONTENT_W - leftBoxW - 6;

  if (naturalMockupImg) {
    drawContainedImage(
      doc,
      naturalMockupImg.dataUrl,
      naturalMockupImg.width,
      naturalMockupImg.height,
      MARGIN,
      y,
      leftBoxW,
      showcaseH
    );
  }
  doc.setTextColor(87, 77, 71);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.text(pdfSafe(`Mockup Natural · ${shapeMeta.shortLabel} (${config.netWeight})`), MARGIN, y + showcaseH + 4);

  const panelBoxW = (rightBoxW - 4) / 2;
  if (frontSheet) {
    drawContainedImage(
      doc,
      canvasToJpegDataUrl(frontSheet.canvas, 0.9),
      frontSheet.canvas.width,
      frontSheet.canvas.height,
      MARGIN + leftBoxW + 6,
      y,
      panelBoxW,
      showcaseH,
      [22, 15, 12]
    );
  }
  if (backSheet) {
    drawContainedImage(
      doc,
      canvasToJpegDataUrl(backSheet.canvas, 0.9),
      backSheet.canvas.width,
      backSheet.canvas.height,
      MARGIN + leftBoxW + 6 + panelBoxW + 4,
      y,
      panelBoxW,
      showcaseH,
      [22, 15, 12]
    );
  }
  doc.text(pdfSafe(`Panel Depan (Isi Bersih : ${config.netWeight})`), MARGIN + leftBoxW + 6, y + showcaseH + 4);
  doc.text(
    pdfSafe('Panel Belakang (Tanpa Berat Bersih)'),
    MARGIN + leftBoxW + 6 + panelBoxW + 4,
    y + showcaseH + 4
  );

  y += showcaseH + 11;

  // Copywriting & Typography Official Block
  y = drawSectionHeading(doc, y, 'Ringkasan Teks & Tipografi Resmi', 'Copywriting Kemasan & Identitas Font');

  const copyBlocks = [
    {
      label: 'DEPAN (JUDUL & VARIAN)',
      val: `ARUNIKA KAWI · COFFEE BEAN EST. 2024 · ${roast.subtitle} · ${variant.frontLabel} · Isi Bersih : ${config.netWeight} (Depan Saja)`,
    },
    {
      label: 'BELAKANG (NARASI GORENG KREWENG)',
      val: `Diolah secara tradisional (Goreng Kreweng) oleh Kelompok Tani Hutan, dipetik langsung dari lereng Gunung Kawi. Setiap seduhannya menghadirkan karakter ${variant.storyCharacter} ${roast.storyRoast} Arunika Kawi Coffee harum dan nikmat`,
    },
    {
      label: 'KOMPOSISI, PRODUSEN & PITA BAWAH BELAKANG',
      val: `${config.beanVariant === 'robusta-100' ? 'KOMPOSISI 100 % BIJI KOPI ROBUSTA' : `KOMPOSISI ${variant.frontLabel.toUpperCase()}`} · KUPS Himatarian Blitar, Jawa Timur - INDONESIA · Kotak PIRT · Kode ${batchCode} / EXP ${expiryCompact} (WIB) · Pita Bawah: 100 % KOPI ASLI INDONESIA`,
    },
    {
      label: 'SISTEM TIPOGRAFI',
      val: `${shapeMeta.fonts.display} | ${shapeMeta.fonts.body} | ${shapeMeta.fonts.mono}`,
    },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const measuredBlocks = copyBlocks.map((b) => {
    const wrapped = doc.splitTextToSize(pdfSafe(b.val), CONTENT_W - 8);
    return { ...b, wrapped };
  });
  const totalBlockH = measuredBlocks.reduce((acc, item) => acc + 3.8 + item.wrapped.length * 3.7 + 3, 6);

  doc.setFillColor(246, 245, 242);
  doc.setDrawColor(222, 217, 206);
  doc.roundedRect(MARGIN, y, CONTENT_W, totalBlockH, 2, 2, 'FD');

  let cy = y + 6;
  measuredBlocks.forEach((b) => {
    doc.setTextColor(138, 100, 41);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(pdfSafe(b.label), MARGIN + 4, cy);

    doc.setTextColor(26, 20, 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(b.wrapped, MARGIN + 4, cy + 3.8);
    cy += 3.8 + b.wrapped.length * 3.7 + 3;
  });

  // ============================================================================
  // PAGE 2: FULL PRINT DIELINE 360° & 00. FILE BACKGROUND MURNI
  // ============================================================================
  doc.addPage();
  addPageChrome(doc, shapeHeading, config.netWeight, 2, totalPages, timestampWib);
  y = 21;

  y = drawSectionHeading(
    doc,
    y,
    'Layout Produksi Full Print',
    `Dieline Lengkap ${shapeMeta.code} (${weightSpecs.unwrapDim})`
  );

  const dielineBoxH = 88;
  if (fullSheet) {
    drawContainedImage(
      doc,
      canvasToJpegDataUrl(fullSheet.canvas, 0.9),
      fullSheet.canvas.width,
      fullSheet.canvas.height,
      MARGIN,
      y,
      CONTENT_W,
      dielineBoxH,
      [22, 15, 12]
    );
  }
  y += dielineBoxH + 4;
  doc.setTextColor(87, 77, 71);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.text(
    pdfSafe(
      `Ukuran Sheet (+ 3 mm Bleed Keliling): ${fullSheet ? `${fullSheet.widthMm} x ${fullSheet.heightMm} mm` : weightSpecs.unwrapDim} · Status Garis Potong: ${config.showPrintMarks ? 'Aktif (Magenta Trim & Cyan Crop)' : 'Nonaktif'}`
    ),
    MARGIN,
    y
  );

  y += 10;
  y = drawSectionHeading(
    doc,
    y,
    '00. File Background',
    '00. File Background Murni (Tanpa Teks, Logo, Stempel & Barcode)'
  );

  const bgDesc =
    config.pouchShape === 'tall-copper'
      ? `Kanvas background murni khusus ${shapeMeta.code} (${config.netWeight} · ${weightSpecs.dimensions}) berisi gradasi Deep Espresso Matte (#1C100B -> #2B1912), lapisan atmosfer ${mood.label}, foto makro klaster biji kopi Robusta tanpa sambungan horizontal, garis vertikal gold foil, bidang diagonal Copper Terracotta (#9C4F2B), serta pita bawah bersih siap cetak ulang teks.`
      : `Kanvas background murni untuk ${shapeMeta.code} (${config.netWeight} · ${weightSpecs.dimensions}) berisi dasar Deep Espresso Matte (#1C100B -> #2B1912), atmosfer ${mood.label}, taburan biji kopi Robusta sangrai bergradasi halus tanpa garis sambungan, serta pita Champagne Gold Foil (#D6B373) bawah yang sepenuhnya bersih tanpa teks, logo, stempel, maupun barcode.`;

  doc.setTextColor(87, 77, 71);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const bgDescLines = doc.splitTextToSize(pdfSafe(bgDesc), CONTENT_W);
  doc.text(bgDescLines, MARGIN, y);
  y += bgDescLines.length * 4 + 4;

  const bgPreviewH = 92;
  const halfW = (CONTENT_W - 6) / 2;
  if (bgFrontSheet) {
    drawContainedImage(
      doc,
      canvasToJpegDataUrl(bgFrontSheet.canvas, 0.9),
      bgFrontSheet.canvas.width,
      bgFrontSheet.canvas.height,
      MARGIN,
      y,
      halfW,
      bgPreviewH,
      [22, 15, 12]
    );
  }
  if (bgBackSheet) {
    drawContainedImage(
      doc,
      canvasToJpegDataUrl(bgBackSheet.canvas, 0.9),
      bgBackSheet.canvas.width,
      bgBackSheet.canvas.height,
      MARGIN + halfW + 6,
      y,
      halfW,
      bgPreviewH,
      [22, 15, 12]
    );
  }
  doc.setTextColor(26, 20, 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(pdfSafe('00A. Background Panel Depan (Murni)'), MARGIN, y + bgPreviewH + 4.5);
  doc.text(pdfSafe('00B. Background Panel Belakang (Murni)'), MARGIN + halfW + 6, y + bgPreviewH + 4.5);

  // ============================================================================
  // PAGE 3: 01. ELEMEN VEKTOR, EMBLEM, STEMPEL & BARCODE
  // ============================================================================
  doc.addPage();
  addPageChrome(doc, shapeHeading, config.netWeight, 3, totalPages, timestampWib);
  y = 21;

  y = drawSectionHeading(
    doc,
    y,
    '01. Aset Vektor Skalabel',
    '01. Elemen Vektor, Emblem, Stempel & Barcode'
  );

  doc.setTextColor(87, 77, 71);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    pdfSafe(
      'Seluruh 7 komponen vektor di bawah ini tersedia untuk diunduh langsung dalam format SVG Vektor & PNG Transparan di bagian Kit Elemen.'
    ),
    MARGIN,
    y
  );
  y += 7;

  const vecCardH = 30;
  VECTOR_ELEMENTS_META.forEach((vec, idx) => {
    const thumb = vectorThumbs[idx];
    doc.setFillColor(246, 245, 242);
    doc.setDrawColor(222, 217, 206);
    doc.roundedRect(MARGIN, y, CONTENT_W, vecCardH, 2, 2, 'FD');

    const thumbSize = 24;
    const tx = MARGIN + 3;
    const ty = y + 3;
    doc.setFillColor(24, 16, 12);
    doc.roundedRect(tx, ty, thumbSize, thumbSize, 1.5, 1.5, 'F');
    if (thumb) {
      doc.addImage(thumb, 'JPEG', tx + 0.5, ty + 0.5, thumbSize - 1, thumbSize - 1, undefined, 'FAST');
    } else {
      doc.setTextColor(216, 180, 116);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('SVG', tx + thumbSize / 2, ty + thumbSize / 2 + 1, { align: 'center' });
    }

    const textX = tx + thumbSize + 5;
    const textW = CONTENT_W - thumbSize - 12;
    doc.setTextColor(26, 20, 18);
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text(pdfSafe(`01.${idx + 1} ${vec.title}`), textX, y + 8.5);

    doc.setTextColor(138, 100, 41);
    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.text(pdfSafe(vec.format), PAGE_W - MARGIN - 4, y + 8.5, { align: 'right' });

    doc.setTextColor(87, 77, 71);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.3);
    const vLines = doc.splitTextToSize(pdfSafe(vec.description), textW);
    doc.text(vLines, textX, y + 14.5);

    y += vecCardH + 3.5;
  });

  // ============================================================================
  // PAGE 4: 02. ELEMEN FOTOGRAFI NATURAL & MOCKUP PRODUK
  // ============================================================================
  doc.addPage();
  addPageChrome(doc, shapeHeading, config.netWeight, 4, totalPages, timestampWib);
  y = 21;

  y = drawSectionHeading(
    doc,
    y,
    '02. Fotografi & Mockup Studio',
    '02. Elemen Fotografi Natural & Mockup Produk'
  );

  const selectedFrontId = config.netWeight === '100 gram' ? 'revised-front-100' : 'revised-front-250';
  const activeMockupId =
    config.pouchShape === 'box-gusset'
      ? 'mockup-box'
      : config.pouchShape === 'doypack-valve'
        ? 'mockup-doypack-natural'
        : config.pouchShape === 'tall-heritage'
          ? 'mockup-tall-heritage'
          : config.pouchShape === 'tall-botanical'
            ? 'mockup-tall-botanical'
            : 'mockup-tall-copper';

  const curatedPhotoEntries = [
    {
      meta: PHOTO_ASSETS.find((p) => p.id === selectedFrontId)!,
      img: frontMasterImg,
      note: 'Varian berat bersih aktif ditampilkan eksklusif pada panel depan.',
    },
    {
      meta: PHOTO_ASSETS.find((p) => p.id === 'revised-rear')!,
      img: rearMasterImg,
      note: 'Digunakan bersama untuk varian 100 gram & 250 gram (tanpa berat bersih).',
    },
    {
      meta: PHOTO_ASSETS.find((p) => p.id === 'beans-cluster')!,
      img: beansImg,
      note: 'Elemen fotografi makro biji kopi Robusta sangrai di bagian bawah kemasan.',
    },
    {
      meta:
        config.naturalMood === 'cherries-beans'
          ? {
              id: 'coffee-cherries',
              title: 'Foto Ranting Ceri Kopi Gunung Kawi',
              usage: 'Latar atmosfer ceri merah berembun untuk mode Ceri Merah & Biji Sangrai.',
              src: GENERATED_ASSETS.coffeeCherries,
              filename: 'natural_coffee_cherries_branch.jpg',
              dims: '1200 × 896 px',
            }
          : PHOTO_ASSETS.find((p) => p.id === 'kawi-mist')!,
      img: kawiOrCherryImg,
      note: 'Atmosfer natural lereng Gunung Kawi ("Arunika") pada bagian atas kemasan.',
    },
    {
      meta: PHOTO_ASSETS.find((p) => p.id === activeMockupId)!,
      img: naturalMockupImg,
      note: `Mockup utama untuk alternatif terpilih: ${shapeMeta.code} (${shapeMeta.label}).`,
    },
  ];

  const pCardH = 42;
  curatedPhotoEntries.forEach((entry, idx) => {
    doc.setFillColor(246, 245, 242);
    doc.setDrawColor(222, 217, 206);
    doc.roundedRect(MARGIN, y, CONTENT_W, pCardH, 2, 2, 'FD');

    const imgW = 46;
    const imgH = 36;
    if (entry.img) {
      drawContainedImage(
        doc,
        entry.img.dataUrl,
        entry.img.width,
        entry.img.height,
        MARGIN + 3,
        y + 3,
        imgW,
        imgH
      );
    }

    const tx = MARGIN + imgW + 7;
    const tw = CONTENT_W - imgW - 11;
    doc.setTextColor(26, 20, 18);
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text(pdfSafe(`02.${idx + 1} ${entry.meta.title}`), tx, y + 8.5);

    doc.setTextColor(138, 100, 41);
    doc.setFont('courier', 'bold');
    doc.setFontSize(7.5);
    doc.text(pdfSafe(`${entry.meta.dims} · ${entry.meta.filename}`), tx, y + 14);

    doc.setTextColor(87, 77, 71);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    const pLines = doc.splitTextToSize(pdfSafe(`${entry.meta.usage}. ${entry.note}`), tw);
    doc.text(pLines, tx, y + 20);

    y += pCardH + 3.5;
  });

  // Catalog note for all 12 assets
  doc.setFillColor(239, 236, 230);
  doc.roundedRect(MARGIN, y + 1, CONTENT_W, 18, 2, 2, 'F');
  doc.setTextColor(26, 20, 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(pdfSafe('Daftar Lengkap Aset Studio Tersedia (12 Aset Master & Mockup):'), MARGIN + 4, y + 6.5);
  doc.setTextColor(87, 77, 71);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.3);
  const allAssetNames = PHOTO_ASSETS.map((p) => p.title.replace('Mockup Final · ', '').replace('Master Revisi Terbaru · ', '')).join(' · ');
  const allAssetLines = doc.splitTextToSize(pdfSafe(allAssetNames), CONTENT_W - 8);
  doc.text(allAssetLines, MARGIN + 4, y + 11);

  // ============================================================================
  // PAGE 5: 03. PALET WARNA & FINISHING + 04. SPESIFIKASI TEKNIS FULL PRINT
  // ============================================================================
  doc.addPage();
  addPageChrome(doc, shapeHeading, config.netWeight, 5, totalPages, timestampWib);
  y = 21;

  y = drawSectionHeading(
    doc,
    y,
    '03. Standar Warna & Material',
    '03. Palet Warna & Finishing Percetakan'
  );

  // 2-column grid for 6 color swatches
  const swW = (CONTENT_W - 4) / 2;
  const swH = 22;
  COLOR_TOKENS.forEach((token, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const sx = MARGIN + col * (swW + 4);
    const sy = y + row * (swH + 3);

    doc.setFillColor(246, 245, 242);
    doc.setDrawColor(222, 217, 206);
    doc.roundedRect(sx, sy, swW, swH, 1.5, 1.5, 'FD');

    doc.setFillColor(...token.rgb);
    doc.setDrawColor(190, 182, 168);
    doc.roundedRect(sx + 3, sy + 4, 14, 14, 1.5, 1.5, 'FD');

    doc.setTextColor(26, 20, 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.text(pdfSafe(token.name), sx + 20, sy + 6.2);

    doc.setTextColor(138, 100, 41);
    doc.setFont('courier', 'bold');
    doc.setFontSize(7.2);
    doc.text(pdfSafe(`${token.hex} · ${token.cmyk}`), sx + 20, sy + 10.6);

    doc.setTextColor(87, 77, 71);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.9);
    const finishLines = doc.splitTextToSize(pdfSafe(`${token.role} · ${token.finish}`), swW - 23).slice(0, 2);
    doc.text(finishLines, sx + 20, sy + 14.8);
  });

  y += Math.ceil(COLOR_TOKENS.length / 2) * (swH + 3) + 5;

  y = drawSectionHeading(
    doc,
    y,
    '04. Panduan Produksi Percetakan',
    `04. Spesifikasi Teknis Full Print (${shapeMeta.code} · ${config.netWeight})`
  );

  const specRows = getPrintSpecificationRows(config);

  specRows.forEach((row, idx) => {
    doc.setFont('courier', 'normal');
    doc.setFontSize(7.6);
    const valLines = doc.splitTextToSize(pdfSafe(row.value), 108).slice(0, 2);
    const rowH = valLines.length > 1 ? 12.2 : 9.4;

    doc.setFillColor(idx % 2 === 0 ? 246 : 239, idx % 2 === 0 ? 245 : 236, idx % 2 === 0 ? 242 : 230);
    doc.rect(MARGIN, y, CONTENT_W, rowH, 'F');
    doc.setDrawColor(222, 217, 206);
    doc.line(MARGIN, y + rowH, PAGE_W - MARGIN, y + rowH);

    doc.setTextColor(87, 77, 71);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.text(pdfSafe(row.label), MARGIN + 3, y + 6);

    doc.setTextColor(26, 20, 18);
    doc.setFont('courier', 'normal');
    doc.setFontSize(7.6);
    doc.text(valLines, PAGE_W - MARGIN - 3, y + 5.6, { align: 'right' });

    y += rowH;
  });

  const wibDate = getWibDateKey();
  const filename = `PackagingStudio-${config.pouchShape}-DossierLengkap-${config.netWeight.replace(/\s+/g, '')}-${wibDate}.pdf`;
  doc.save(filename);
}
