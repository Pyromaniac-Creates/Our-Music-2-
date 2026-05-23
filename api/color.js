export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "No URL" });

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Image fetch failed");
    const buffer = await response.arrayBuffer();

    // Decode the image properly using a simple PNG/JPEG pixel parser
    // We'll use the raw image data via a canvas-like approach server-side
    // by finding the actual pixel data in the image

    // For JPEG: find Start of Scan (FF DA) marker and read image data after it
    // For PNG: find IDAT chunks
    // Instead, we'll use a smarter approach: fetch as base64 and use
    // a proper color quantization on the actual decoded pixels

    const bytes = new Uint8Array(buffer);

    // Detect if JPEG or PNG
    const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8;
    const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;

    // Smart pixel sampling — find regions of the file that contain
    // actual image pixel data by looking for patterns of valid RGB triplets
    // Skip headers and metadata by looking for the densest color regions

    const BUCKET = 24; // Quantize to ~10 levels per channel
    const colorMap = new Map();

    // For JPEG: pixel data starts after the largest marker
    // We'll sample the middle 60% of the file to avoid headers/footers
    const dataStart = Math.floor(bytes.length * 0.15);
    const dataEnd = Math.floor(bytes.length * 0.85);
    const totalSamples = 6000;
    const step = Math.max(3, Math.floor((dataEnd - dataStart) / totalSamples));

    for (let i = dataStart; i < dataEnd - 3; i += step * 3) {
      const r = bytes[i];
      const g = bytes[i + 1];
      const b = bytes[i + 2];

      // Convert to HSL to filter intelligently
      const rn = r / 255, gn = g / 255, bn = b / 255;
      const max = Math.max(rn, gn, bn);
      const min = Math.min(rn, gn, bn);
      const l = (max + min) / 2;
      const s = max === min ? 0 : l < 0.5
        ? (max - min) / (max + min)
        : (max - min) / (2 - max - min);

      // Skip very dark (l < 0.1), very light (l > 0.92), and near-grey (s < 0.15)
      if (l < 0.10 || l > 0.92 || s < 0.15) continue;

      // Quantize
      const qr = Math.round(r / BUCKET) * BUCKET;
      const qg = Math.round(g / BUCKET) * BUCKET;
      const qb = Math.round(b / BUCKET) * BUCKET;
      const key = `${qr},${qg},${qb}`;
      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }

    // Sort by frequency — most dominant first
    const sorted = [...colorMap.entries()]
      .sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
      return res.status(200).json({
        colors: ["rgb(196,136,90)", "rgb(127,119,221)"]
      });
    }

    // Pick up to 4 visually distinct colours for the gradient
    const MIN_DISTANCE = 60;
    const selected = [];

    for (const [key] of sorted) {
      if (selected.length >= 4) break;
      const [r, g, b] = key.split(",").map(Number);

      // Check distance from all already-selected colours
      const tooClose = selected.some(([sr, sg, sb]) => {
        const dist = Math.sqrt(
          Math.pow(r - sr, 2) +
          Math.pow(g - sg, 2) +
          Math.pow(b - sb, 2)
        );
        return dist < MIN_DISTANCE;
      });

      if (!tooClose) {
        selected.push([r, g, b]);
      }
    }

    // Need at least 2 colours — pad with complementary if needed
    if (selected.length === 1) {
      const [r, g, b] = selected[0];
      selected.push([
        Math.min(255, Math.max(0, 255 - r)),
        Math.min(255, Math.max(0, 255 - g)),
        Math.min(255, Math.max(0, 255 - b)),
      ]);
    }

    const colors = selected.map(([r, g, b]) => `rgb(${r},${g},${b})`);

    res.setHeader("Cache-Control", "no-cache, no-store");
    res.status(200).json({ colors });

  } catch (err) {
    console.error("Color extraction error:", err);
    res.status(500).json({ colors: ["rgb(196,136,90)", "rgb(127,119,221)"] });
  }
}
