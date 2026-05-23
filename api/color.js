export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "No URL" });

  try {
    // Fetch the image server-side to avoid CORS
    const response = await fetch(url);
    if (!response.ok) throw new Error("Image fetch failed");
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Decode JPEG pixel data
    // JPEG pixel data sits between FF DA (Start of Scan) markers
    // We'll use a simple approach: find all runs of valid RGB-like triplets
    // by sampling the raw bytes and quantizing into colour buckets

    // Colour quantization — group similar colours into buckets
    // by rounding each channel to nearest 32 (8 levels per channel)
    const BUCKET = 32;
    const colorMap = new Map();

    // Sample every Nth byte treating consecutive bytes as R,G,B
    // Skip the first 500 bytes (JPEG headers) and last 100
    const start = 500;
    const end = bytes.length - 100;
    const step = Math.max(3, Math.floor((end - start) / 4000)); // ~4000 samples

    for (let i = start; i < end; i += step * 3) {
      const r = bytes[i];
      const g = bytes[i + 1] || 0;
      const b = bytes[i + 2] || 0;

      // Skip near-black, near-white, and near-grey pixels
      // as they dominate most images and aren't interesting
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      const brightness = max / 255;

      if (brightness < 0.12 || brightness > 0.94) continue; // skip very dark/light
      if (saturation < 0.12) continue; // skip near-grey

      // Quantize to bucket
      const qr = Math.round(r / BUCKET) * BUCKET;
      const qg = Math.round(g / BUCKET) * BUCKET;
      const qb = Math.round(b / BUCKET) * BUCKET;
      const key = `${qr},${qg},${qb}`;

      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }

    // Sort by frequency
    const sorted = [...colorMap.entries()]
      .sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
      return res.status(200).json({ color1: "#C4885A", color2: "#7F77DD" });
    }

    // Pick the top colour
    const [top1Key] = sorted[0];
    const [r1, g1, b1] = top1Key.split(",").map(Number);
    const color1 = `rgb(${r1},${g1},${b1})`;

    // Pick a second colour that is visually distinct from the first
    // by ensuring minimum colour distance (Euclidean in RGB space)
    const MIN_DISTANCE = 120; // minimum RGB distance to be "different enough"
    let color2 = null;

    for (const [key] of sorted.slice(1)) {
      const [r2, g2, b2] = key.split(",").map(Number);
      const dist = Math.sqrt(
        Math.pow(r2 - r1, 2) +
        Math.pow(g2 - g1, 2) +
        Math.pow(b2 - b1, 2)
      );
      if (dist >= MIN_DISTANCE) {
        color2 = `rgb(${r2},${g2},${b2})`;
        break;
      }
    }

    // If no distinct second colour found, fall back to a complementary tone
    if (!color2) {
      const compR = Math.min(255, Math.max(0, 255 - r1));
      const compG = Math.min(255, Math.max(0, 255 - g1));
      const compB = Math.min(255, Math.max(0, 255 - b1));
      color2 = `rgb(${compR},${compG},${compB})`;
    }

    // Cache for 24 hours since album art doesn't change
    res.setHeader("Cache-Control", "no-cache, no-store");
    res.status(200).json({ color1, color2 });

  } catch (err) {
    console.error("Color extraction error:", err);
    res.status(500).json({ color1: "#C4885A", color2: "#7F77DD" });
  }
}
