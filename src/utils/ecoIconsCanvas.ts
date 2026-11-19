/**
 * Shared high-clarity Canvas renderer for the 3-icon Eco / Packaging Disposal Row
 * (Tidy Man + PP 5 + Respect/Recycle) matching the revised Arunika Kawi Rear Master.
 */
export function drawEcoRecyclingRowCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  color = '#FAF5EB'
): number {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  const s = height / 36;
  ctx.translate(x, y);
  ctx.scale(s, s);

  // ------------------------------------------------------------------
  // 1. Tidy Man / Keep Clean (0..32 x 0..36)
  // ------------------------------------------------------------------
  // Wastebasket frame (trapezoid)
  ctx.lineWidth = 1.15;
  ctx.beginPath();
  ctx.moveTo(2.5, 16.5);
  ctx.lineTo(11.5, 16.5);
  ctx.lineTo(10.3, 33.5);
  ctx.lineTo(3.7, 33.5);
  ctx.closePath();
  ctx.stroke();

  // Mesh grid lines inside basket
  ctx.lineWidth = 0.85;
  ctx.beginPath();
  ctx.moveTo(5.2, 16.5);
  ctx.lineTo(5.6, 33.5);
  ctx.moveTo(8.8, 16.5);
  ctx.lineTo(8.4, 33.5);
  ctx.moveTo(3.0, 22.0);
  ctx.lineTo(11.0, 22.0);
  ctx.moveTo(3.3, 27.6);
  ctx.lineTo(10.7, 27.6);
  ctx.stroke();

  // Dropped wrapper square
  ctx.save();
  ctx.translate(7.4, 10.6);
  ctx.rotate(-0.42);
  ctx.fillRect(-2.1, -1.7, 4.2, 3.4);
  ctx.restore();

  // Person head
  ctx.beginPath();
  ctx.arc(21.5, 6.2, 2.7, 0, Math.PI * 2);
  ctx.fill();

  // Person torso + extended arm + legs
  ctx.beginPath();
  ctx.moveTo(19.2, 9.6);
  ctx.lineTo(24.0, 9.8);
  ctx.lineTo(26.6, 33.5);
  ctx.lineTo(23.9, 33.5);
  ctx.lineTo(21.4, 21.8);
  ctx.lineTo(19.3, 33.5);
  ctx.lineTo(16.8, 33.5);
  ctx.lineTo(18.6, 15.6);
  ctx.lineTo(11.6, 11.4);
  ctx.lineTo(12.8, 9.4);
  ctx.lineTo(19.2, 12.2);
  ctx.closePath();
  ctx.fill();

  // ------------------------------------------------------------------
  // 2. PP 5 Resin Triangle (37..69 x 0..36)
  // ------------------------------------------------------------------
  const drawTriArrow = (rotDeg: number) => {
    ctx.save();
    ctx.translate(53, 14.5);
    ctx.rotate((rotDeg * Math.PI) / 180);
    ctx.lineWidth = 2.0;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-6.2, -5.8);
    ctx.quadraticCurveTo(0, -13.2, 6.2, -5.8);
    ctx.stroke();

    // Arrowhead on right end
    ctx.beginPath();
    ctx.moveTo(7.4, -4.4);
    ctx.lineTo(2.4, -5.4);
    ctx.lineTo(6.4, -9.2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  drawTriArrow(0);
  drawTriArrow(120);
  drawTriArrow(240);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 11.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('5', 53, 15.2);

  ctx.font = '700 7.4px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PP', 53, 31.2);

  // ------------------------------------------------------------------
  // 3. Respect Recycle Symbol + Label (74..166 x 0..36)
  // ------------------------------------------------------------------
  const drawRecycleArm = (rotDeg: number) => {
    ctx.save();
    ctx.translate(91, 17);
    ctx.rotate((rotDeg * Math.PI) / 180);

    // Bold ribbon arc + arrow tip
    ctx.beginPath();
    ctx.moveTo(-7.2, -9.8);
    ctx.lineTo(2.5, -13.6);
    ctx.lineTo(7.8, -6.5);
    ctx.lineTo(10.0, -7.8);
    ctx.lineTo(7.8, -0.5);
    ctx.lineTo(0.4, -1.8);
    ctx.lineTo(2.6, -3.2);
    ctx.lineTo(-1.0, -7.8);
    ctx.lineTo(-5.2, -5.6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  drawRecycleArm(0);
  drawRecycleArm(120);
  drawRecycleArm(240);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = '700 10.5px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('RESPECT', 110, 15.5);
  ctx.fillText('RECYCLE', 110, 27.8);

  ctx.restore();
  return 166 * s;
}
