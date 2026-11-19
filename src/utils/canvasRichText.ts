export interface RichTextRun {
  text: string;
  color: string;
  font: string;
}

/**
 * Draws centered, word-wrapped paragraph text supporting inline color/weight/italic runs
 * so Canvas print sheets and 3D mockups never overflow narrow panels (e.g. 100mm Tall Gusset).
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
