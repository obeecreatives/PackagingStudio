/**
 * Shared high-clarity Canvas renderer for the official Green-Gold KTH Jawa Timur seal
 * matching the revised <KthEastJavaSeal variant="original-green" /> (with Kawi peaks,
 * 3 farmers wearing woven caping hats, leaf sprigs, and curved KTH typography).
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

  // Outer Forest/Olive Green Ring
  ctx.fillStyle = '#6C9B3A';
  ctx.strokeStyle = '#9BC65E';
  ctx.lineWidth = Math.max(1.0, r * 0.045);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Inner Sunlit Kawi Scene Circle
  const innerR = r * 0.68;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.clip();

  const skyGrad = ctx.createRadialGradient(cx, cy - r * 0.16, r * 0.05, cx, cy, innerR);
  skyGrad.addColorStop(0, '#FFF6A3');
  skyGrad.addColorStop(0.55, '#DCE67B');
  skyGrad.addColorStop(1, '#9CC654');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(cx - innerR, cy - innerR, innerR * 2, innerR * 2);

  // Layered Gunung Kawi Peaks
  ctx.fillStyle = '#53862D';
  ctx.beginPath();
  ctx.moveTo(cx - innerR * 1.05, cy + r * 0.25);
  ctx.lineTo(cx - r * 0.42, cy - r * 0.28);
  ctx.lineTo(cx - r * 0.18, cy - r * 0.12);
  ctx.lineTo(cx, cy - r * 0.56);
  ctx.lineTo(cx + r * 0.22, cy - r * 0.14);
  ctx.lineTo(cx + r * 0.44, cy - r * 0.30);
  ctx.lineTo(cx + innerR * 1.05, cy + r * 0.25);
  ctx.closePath();
  ctx.fill();

  // Stylized Farmers wearing woven Caping hats (Left Adult, Right Adult, Center Child)
  const drawFarmer = (fx: number, fy: number, scale: number, shirtColor: string) => {
    ctx.save();
    ctx.translate(fx, fy);
    ctx.scale(scale, scale);

    // Shoulders / Shirt
    ctx.fillStyle = shirtColor;
    ctx.beginPath();
    ctx.moveTo(-r * 0.24, r * 0.26);
    ctx.quadraticCurveTo(-r * 0.22, r * 0.02, 0, r * 0.02);
    ctx.quadraticCurveTo(r * 0.22, r * 0.02, r * 0.24, r * 0.26);
    ctx.closePath();
    ctx.fill();

    // Face / Head
    ctx.fillStyle = '#F2C9A5';
    ctx.beginPath();
    ctx.arc(0, -r * 0.06, r * 0.11, 0, Math.PI * 2);
    ctx.fill();

    // Caping Hat (Conical woven hat)
    ctx.fillStyle = '#CFA358';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.14, r * 0.19, r * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#DFBA73';
    ctx.beginPath();
    ctx.moveTo(-r * 0.15, -r * 0.14);
    ctx.lineTo(0, -r * 0.26);
    ctx.lineTo(r * 0.15, -r * 0.14);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  drawFarmer(cx - r * 0.27, cy + r * 0.03, 0.88, '#6DA33E');
  drawFarmer(cx + r * 0.27, cy + r * 0.03, 0.88, '#7CB24B');
  drawFarmer(cx, cy + r * 0.11, 0.72, '#4F7D2C');

  // Foreground Green Hill & JAWA TIMUR Banner Text
  ctx.fillStyle = '#4B7D2B';
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.44, innerR * 1.15, r * 0.32, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${Math.max(4.5, Math.round(r * 0.145))}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('JAWA TIMUR', cx, cy + r * 0.30);

  // Subtle decorative horizontal lines below JAWA TIMUR
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = Math.max(0.6, r * 0.02);
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.18, cy + r * 0.41);
  ctx.lineTo(cx + r * 0.18, cy + r * 0.41);
  ctx.moveTo(cx - r * 0.11, cy + r * 0.46);
  ctx.lineTo(cx + r * 0.11, cy + r * 0.46);
  ctx.stroke();

  ctx.restore();

  // Inner Circle Crisp Rim
  ctx.strokeStyle = '#DCE8A6';
  ctx.lineWidth = Math.max(0.7, r * 0.022);
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.stroke();

  // White Side Leaf Sprigs (9 o'clock & 3 o'clock)
  const drawSprig = (sx: number, dir: number) => {
    ctx.save();
    ctx.translate(sx, cy);
    ctx.scale(dir, 1);
    ctx.fillStyle = '#FAFBE8';
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.055, r * 0.032, r * 0.055, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-r * 0.028, r * 0.015, r * 0.026, r * 0.045, -0.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(r * 0.024, r * 0.015, r * 0.026, r * 0.045, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  drawSprig(cx - r * 0.83, 1);
  drawSprig(cx + r * 0.83, -1);

  // Curved Top & Bottom Ring Copy
  ctx.fillStyle = '#EFF4A8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${Math.max(4.5, Math.round(r * 0.155))}px "Plus Jakarta Sans", sans-serif`;
  drawArcText(ctx, 'PRODUK ASLI', cx, cy, r * 0.825, -Math.PI / 2, false, 0.185);

  ctx.font = `700 ${Math.max(4.2, Math.round(r * 0.125))}px "Plus Jakarta Sans", sans-serif`;
  drawArcText(ctx, 'KELOMPOK TANI HUTAN', cx, cy, r * 0.85, Math.PI / 2, true, 0.13);

  ctx.restore();
}
