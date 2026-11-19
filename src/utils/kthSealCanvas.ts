/**
 * Shared high-clarity Canvas renderer for the official Green-Gold KTH Jawa Timur seal
 * matching <KthEastJavaSeal variant="original-green" /> across 2D Print Dielines, PDFs,
 * and Live Mockups.
 */
function drawArcText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  centerAngle: number,
  inward: boolean,
  letterStep: number
) {
  const chars = text.split('');
  const totalSpan = (chars.length - 1) * letterStep;
  for (let i = 0; i < chars.length; i++) {
    const angle = inward
      ? centerAngle + totalSpan / 2 - i * letterStep
      : centerAngle - totalSpan / 2 + i * letterStep;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + (inward ? -Math.PI / 2 : Math.PI / 2));
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
  }
}

export function drawKthGreenSealCanvas(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number
) {
  ctx.save();

  // Outer Forest Green Circle + Gold Rim
  ctx.fillStyle = '#2E4F1D';
  ctx.strokeStyle = '#D8B474';
  ctx.lineWidth = Math.max(1.2, r * 0.055);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Inner bright sage/olive field
  ctx.fillStyle = '#8BC34A';
  ctx.strokeStyle = '#EBF4D6';
  ctx.lineWidth = Math.max(0.8, r * 0.025);
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.65, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Twin Mountain Silhouette (Gunung Kawi)
  ctx.fillStyle = '#385E22';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.52, cy + r * 0.22);
  ctx.lineTo(cx - r * 0.16, cy - r * 0.3);
  ctx.lineTo(cx + r * 0.03, cy - r * 0.03);
  ctx.lineTo(cx + r * 0.23, cy - r * 0.36);
  ctx.lineTo(cx + r * 0.52, cy + r * 0.22);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(235, 244, 214, 0.3)';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.26, cy + r * 0.22);
  ctx.lineTo(cx, cy - r * 0.18);
  ctx.lineTo(cx + r * 0.28, cy + r * 0.22);
  ctx.closePath();
  ctx.fill();

  // JAWA TIMUR Banner Pill
  const banW = r * 1.04;
  const banH = r * 0.23;
  ctx.fillStyle = '#17280E';
  ctx.strokeStyle = '#D8B474';
  ctx.lineWidth = Math.max(0.7, r * 0.022);
  ctx.beginPath();
  ctx.roundRect(cx - banW / 2, cy + r * 0.16, banW, banH, banH * 0.24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#F4F8E6';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${Math.max(5, Math.round(r * 0.145))}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('JAWA TIMUR', cx, cy + r * 0.16 + banH * 0.52);

  // Curved Top & Bottom Ring Copy
  ctx.fillStyle = '#F4F8E6';
  ctx.font = `700 ${Math.max(5, Math.round(r * 0.155))}px "Plus Jakarta Sans", sans-serif`;
  drawArcText(ctx, 'PRODUK ASLI', cx, cy, r * 0.81, -Math.PI / 2, false, 0.175);

  ctx.font = `600 ${Math.max(4.5, Math.round(r * 0.125))}px "Plus Jakarta Sans", sans-serif`;
  drawArcText(ctx, 'KELOMPOK TANI HUTAN', cx, cy, r * 0.84, Math.PI / 2, true, 0.128);

  ctx.restore();
}
