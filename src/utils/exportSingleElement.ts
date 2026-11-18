function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 15000);
}

export function downloadSvgElement(svgElement: SVGSVGElement | null, filename: string) {
  if (!svgElement) return;
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  if (!clone.getAttribute('width') && svgElement.viewBox?.baseVal?.width) {
    clone.setAttribute('width', String(svgElement.viewBox.baseVal.width * 4));
  }
  if (!clone.getAttribute('height') && svgElement.viewBox?.baseVal?.height) {
    clone.setAttribute('height', String(svgElement.viewBox.baseVal.height * 4));
  }
  const serializer = new XMLSerializer();
  const svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(clone);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  triggerBlobDownload(blob, `${filename}.svg`);
}

export function downloadSvgAsPng(
  svgElement: SVGSVGElement | null,
  filename: string,
  width = 1200,
  height = 1200
) {
  if (!svgElement) return;
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clone);
  const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((pngBlob) => {
        if (pngBlob) {
          triggerBlobDownload(pngBlob, `${filename}.png`);
        } else {
          const fallbackUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = fallbackUrl;
          link.download = `${filename}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }, 'image/png');
    }
  };
  img.src = dataUri;
}

export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  mime: 'image/png' | 'image/jpeg' = 'image/png',
  quality = 0.94
): Promise<void> {
  await new Promise<void>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          triggerBlobDownload(blob, filename);
        } else {
          const link = document.createElement('a');
          link.href = canvas.toDataURL(mime, quality);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        resolve();
      },
      mime,
      quality
    );
  });
}

export async function downloadImageAsset(src: string, filename: string): Promise<void> {
  const isJpeg = /\.jpe?g$/i.test(filename);
  const targetMime: 'image/png' | 'image/jpeg' = isJpeg ? 'image/jpeg' : 'image/png';

  try {
    const response = await fetch(src, { cache: 'no-cache' });
    if (response.ok) {
      const contentType = (response.headers.get('content-type') || '').toLowerCase();
      if (!contentType.includes('text/html')) {
        const blob = await response.blob();
        if (blob.size > 128 && !blob.type.includes('text/html')) {
          triggerBlobDownload(blob, filename);
          return;
        }
      }
    }
  } catch {
    // Fall back to canvas rasterization if fetch fails
  }

  await new Promise<void>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1200;
      canvas.height = img.naturalHeight || 1600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (isJpeg) {
          ctx.fillStyle = '#18100C';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        await downloadCanvas(canvas, filename, targetMime, 0.94);
      }
      resolve();
    };
    img.onerror = () => {
      const link = document.createElement('a');
      link.href = src;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve();
    };
    img.src = src;
  });
}
