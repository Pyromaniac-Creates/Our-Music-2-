import Vibrant from "node-vibrant";

function enhanceColor(rgb) {
  const nums = rgb.match(/\d+/g)?.map(Number);

  if (!nums || nums.length < 3) {
    return rgb;
  }

  let [r, g, b] = nums;

  // Increase vibrancy slightly
  r = Math.min(255, r * 1.08);
  g = Math.min(255, g * 1.08);
  b = Math.min(255, b * 1.08);

  // Slight cinematic softening
  r = Math.round((r + 12) * 0.96);
  g = Math.round((g + 12) * 0.96);
  b = Math.round((b + 12) * 0.96);

  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

function isGoodColor(rgb) {
  const nums = rgb.match(/\d+/g)?.map(Number);

  if (!nums || nums.length < 3) {
    return false;
  }

  const [r, g, b] = nums;

  const brightness = (r + g + b) / 3;

  const saturation =
    Math.max(r, g, b) - Math.min(r, g, b);

  // Reject muddy/dull colors
  if (saturation < 45) return false;

  // Reject too dark
  if (brightness < 50) return false;

  // Reject too bright
  if (brightness > 235) return false;

  return true;
}

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      error: "No URL provided"
    });
  }

  try {
    const palette = await Vibrant.from(url).getPalette();

    const rawColors = [
      palette.Vibrant,
      palette.LightVibrant,
      palette.DarkVibrant,
      palette.Muted,
      palette.LightMuted,
    ]
      .filter(Boolean)
      .map(c => c.rgb)
      .map(([r, g, b]) =>
        `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`
      );

    let colors = rawColors
      .filter(isGoodColor)
      .map(enhanceColor);

    // Fallbacks
    if (colors.length < 2) {
      colors = [
        "rgb(196,136,90)",
        "rgb(127,119,221)"
      ];
    }

    // Keep only best 2 colors
    colors = colors.slice(0, 2);

    res.setHeader(
      "Cache-Control",
      "public, max-age=86400"
    );

    return res.status(200).json({
      colors
    });

  } catch (err) {
    console.error("Palette extraction error:", err);

    return res.status(200).json({
      colors: [
        "rgb(196,136,90)",
        "rgb(127,119,221)"
      ]
    });
  }
}
