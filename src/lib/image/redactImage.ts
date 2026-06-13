export type RedactionMode = "blur" | "mosaic" | "black" | "white" | "red";
export type Rect = { x: number; y: number; width: number; height: number };

export function normalizeRect(startX: number, startY: number, endX: number, endY: number): Rect {
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  return { x, y, width: Math.abs(endX - startX), height: Math.abs(endY - startY) };
}

export function clampRect(rect: Rect, maxWidth: number, maxHeight: number): Rect {
  const x = Math.max(0, Math.min(rect.x, maxWidth));
  const y = Math.max(0, Math.min(rect.y, maxHeight));
  return { x, y, width: Math.max(1, Math.min(rect.width, maxWidth - x)), height: Math.max(1, Math.min(rect.height, maxHeight - y)) };
}

export function scaleRectToCanvas(rect: Rect, displayWidth: number, displayHeight: number, canvasWidth: number, canvasHeight: number): Rect {
  if (displayWidth <= 0 || displayHeight <= 0) return rect;
  const scaleX = canvasWidth / displayWidth;
  const scaleY = canvasHeight / displayHeight;
  return {
    x: Math.round(rect.x * scaleX),
    y: Math.round(rect.y * scaleY),
    width: Math.round(rect.width * scaleX),
    height: Math.round(rect.height * scaleY)
  };
}

export function getMosaicBlockSize(width: number, height: number) {
  const shortest = Math.max(1, Math.min(width, height));
  return Math.max(6, Math.min(18, Math.round(shortest / 18)));
}

export function averageBlockColor(data: Uint8ClampedArray, imageWidth: number, startX: number, startY: number, width: number, height: number) {
  let red = 0;
  let green = 0;
  let blue = 0;
  let alpha = 0;
  let count = 0;

  for (let y = startY; y < startY + height; y += 1) {
    for (let x = startX; x < startX + width; x += 1) {
      const index = (y * imageWidth + x) * 4;
      const pixelAlpha = data[index + 3];
      red += data[index] * pixelAlpha;
      green += data[index + 1] * pixelAlpha;
      blue += data[index + 2] * pixelAlpha;
      alpha += pixelAlpha;
      count += 1;
    }
  }

  if (alpha === 0 || count === 0) return { red: 0, green: 0, blue: 0, alpha: 0 };
  return {
    red: Math.round(red / alpha),
    green: Math.round(green / alpha),
    blue: Math.round(blue / alpha),
    alpha: Number((alpha / (count * 255)).toFixed(3))
  };
}

export function drawRedaction(ctx: CanvasRenderingContext2D, rect: Rect, mode: RedactionMode) {
  const safe = clampRect(rect, ctx.canvas.width, ctx.canvas.height);
  if (mode === "black" || mode === "white" || mode === "red") {
    ctx.fillStyle = mode === "black" ? "#000" : mode === "white" ? "#fff" : "#ef4444";
    ctx.fillRect(safe.x, safe.y, safe.width, safe.height);
    return;
  }
  if (mode === "mosaic") {
    const step = getMosaicBlockSize(safe.width, safe.height);
    const image = ctx.getImageData(safe.x, safe.y, safe.width, safe.height);
    for (let y = 0; y < safe.height; y += step) {
      for (let x = 0; x < safe.width; x += step) {
        const width = Math.min(step, safe.width - x);
        const height = Math.min(step, safe.height - y);
        const color = averageBlockColor(image.data, safe.width, x, y, width, height);
        if (color.alpha === 0) {
          ctx.clearRect(safe.x + x, safe.y + y, width, height);
        } else {
          ctx.fillStyle = `rgba(${color.red},${color.green},${color.blue},${color.alpha})`;
          ctx.fillRect(safe.x + x, safe.y + y, width, height);
        }
      }
    }
    return;
  }
  const image = ctx.getImageData(safe.x, safe.y, safe.width, safe.height);
  const offscreen = document.createElement("canvas");
  offscreen.width = safe.width;
  offscreen.height = safe.height;
  const offscreenCtx = offscreen.getContext("2d");
  if (!offscreenCtx) {
    ctx.putImageData(image, safe.x, safe.y);
    return;
  }
  offscreenCtx.putImageData(image, 0, 0);
  ctx.save();
  ctx.beginPath();
  ctx.rect(safe.x, safe.y, safe.width, safe.height);
  ctx.clip();
  ctx.filter = `blur(${Math.max(6, Math.round(Math.min(safe.width, safe.height) / 16))}px)`;
  ctx.drawImage(offscreen, safe.x, safe.y);
  ctx.filter = "none";
  ctx.restore();
}
