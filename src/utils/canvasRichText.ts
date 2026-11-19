export interface RichTextRun {
  text: string;
  color: string;
  font: string;
}

/**
 * Draws centered, word-wrapped paragraph text supporting inline color/weight/italic runs
 * so Canvas print sheets and 3D mockups never overflow narrow panels (e.g. 100mm Tall Gusset).
 * Preserves run boundaries without inserting extra spaces inside parentheses like `(Goreng Kreweng)`.
 * Returns the baseline Y coordinate below the final rendered line (lastLineBaseline + lineHeight).
 */
export function drawRichCenteredParagraph(
  ctx: CanvasRenderingContext2D,
  runs: RichTextRun[],
  cx: number,
  startY: number,
  maxWidth: number,
  lineHeight: number
): number {
  interface Segment {
    text: string;
    color: string;
    font: string;
    width: number;
  }

  type WordGroup = Segment[];

  const groups: WordGroup[] = [];
  let currentGroup: WordGroup = [];

  for (const run of runs) {
    ctx.font = run.font;
    const parts = run.text.split(/(\s+)/);
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      } else {
        currentGroup.push({
          text: part,
          color: run.color,
          font: run.font,
          width: ctx.measureText(part).width,
        });
      }
    }
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  const groupWidth = (g: WordGroup) => g.reduce((sum, seg) => sum + seg.width, 0);

  const spaceW = ctx.measureText(' ').width;
  const lines: WordGroup[][] = [];
  let currentLine: WordGroup[] = [];
  let currentWidth = 0;

  for (const g of groups) {
    const gw = groupWidth(g);
    const addW = currentLine.length > 0 ? spaceW + gw : gw;
    if (currentWidth + addW > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [g];
      currentWidth = gw;
    } else {
      currentLine.push(g);
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
      totalW += groupWidth(line[i]) + (i > 0 ? spaceW : 0);
    }
    let cursorX = cx - totalW / 2;
    for (let i = 0; i < line.length; i++) {
      const grp = line[i];
      for (const seg of grp) {
        ctx.font = seg.font;
        ctx.fillStyle = seg.color;
        ctx.fillText(seg.text, cursorX, y);
        cursorX += seg.width;
      }
      cursorX += spaceW;
    }
    y += lineHeight;
  }
  ctx.restore();
  return y;
}
