import { palette, type ThemeVariant } from "../palette.js";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface LAB {
  l: number;
  a: number;
  b: number;
}

const REFERENCE_WHITE = {
  x: 0.95047,
  y: 1,
  z: 1.08883,
} as const;

const f = (t: number): number => {
  return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
};

const fInverse = (t: number): number => {
  const t3 = t * t * t;
  return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787;
};

const srgbToLinear = (v: number): number => {
  const normalized = v / 255;
  return normalized > 0.04045
    ? ((normalized + 0.055) / 1.055) ** 2.4
    : normalized / 12.92;
};

const linearToSrgb = (v: number): number => {
  const companded =
    v > 0.0031308 ? 1.055 * Math.pow(v, 1 / 2.4) - 0.055 : 12.92 * v;
  const clamped = Math.max(0, Math.min(1, companded));
  return Math.round(clamped * 255);
};

const rgbToLab = (rgb: RGB): LAB => {
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);

  const x =
    (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) /
    REFERENCE_WHITE.x;
  const y =
    (r * 0.2126729 + g * 0.7151522 + b * 0.072175) / REFERENCE_WHITE.y;
  const z =
    (r * 0.0193339 + g * 0.119192 + b * 0.9503041) / REFERENCE_WHITE.z;

  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
};

const labToRgb = (lab: LAB): RGB => {
  const fy = (lab.l + 16) / 116;
  const fx = lab.a / 500 + fy;
  const fz = fy - lab.b / 200;

  const x = fInverse(fx) * REFERENCE_WHITE.x;
  const y = fInverse(fy) * REFERENCE_WHITE.y;
  const z = fInverse(fz) * REFERENCE_WHITE.z;

  const rLinear = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  const gLinear = x * -0.969266 + y * 1.8760108 + z * 0.041556;
  const bLinear = x * 0.0556434 + y * -0.2040259 + z * 1.0572252;

  return {
    r: linearToSrgb(rLinear),
    g: linearToSrgb(gLinear),
    b: linearToSrgb(bLinear),
  };
};

const lerpLab = (t: number, start: LAB, end: LAB): LAB => {
  return {
    l: start.l + t * (end.l - start.l),
    a: start.a + t * (end.a - start.a),
    b: start.b + t * (end.b - start.b),
  };
};

const hexToRgb = (hex: string): RGB => {
  const raw = hex.startsWith("#") ? hex.slice(1) : hex;
  return {
    r: Number.parseInt(raw.slice(0, 2), 16),
    g: Number.parseInt(raw.slice(2, 4), 16),
    b: Number.parseInt(raw.slice(4, 6), 16),
  };
};

const rgbToHex = (rgb: RGB): string => {
  const toHex = (value: number): string => value.toString(16).padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
};

const getBase16 = (variant: ThemeVariant): readonly string[] => {
  const p = palette[variant];

  return [
    p.surface,
    p.red,
    p.green,
    p.yellow,
    p.blue,
    p.purple,
    p.blue,
    p.secondary,
    p.muted,
    p.orange,
    p.green,
    p.yellow,
    p.blue,
    p.purple,
    p.blue,
    p.foreground,
  ] as const;
};

const generate256Palette = (base16: readonly string[], bg: string, fg: string): string[] => {
  const palette256 = [...base16];

  const base8Lab = base16.slice(0, 8).map((hex) => rgbToLab(hexToRgb(hex)));
  const bgLab = rgbToLab(hexToRgb(bg));
  const fgLab = rgbToLab(hexToRgb(fg));

  for (let r = 0; r < 6; r += 1) {
    const tr = r / 5;
    const c0 = lerpLab(tr, bgLab, base8Lab[1]);
    const c1 = lerpLab(tr, base8Lab[2], base8Lab[3]);
    const c2 = lerpLab(tr, base8Lab[4], base8Lab[5]);
    const c3 = lerpLab(tr, base8Lab[6], fgLab);

    for (let g = 0; g < 6; g += 1) {
      const tg = g / 5;
      const c4 = lerpLab(tg, c0, c1);
      const c5 = lerpLab(tg, c2, c3);

      for (let b = 0; b < 6; b += 1) {
        const c6 = lerpLab(b / 5, c4, c5);
        palette256.push(rgbToHex(labToRgb(c6)));
      }
    }
  }

  for (let i = 0; i < 24; i += 1) {
    const t = (i + 1) / 25;
    palette256.push(rgbToHex(labToRgb(lerpLab(t, bgLab, fgLab))));
  }

  return palette256;
};

export interface GhosttyThemeOptions {
  includeExtendedPalette: boolean;
  enablePaletteGenerate: boolean;
}

export const createGhosttyTheme = (
  variant: ThemeVariant,
  options: GhosttyThemeOptions,
): string => {
  const p = palette[variant];
  const base16 = getBase16(variant);
  const paletteValues = options.includeExtendedPalette
    ? generate256Palette(base16, p.background, p.foreground)
    : [...base16];

  const lines: string[] = [
    `# Scalar ${variant === "dark" ? "Dark" : "Light"} - Ghostty Theme`,
    "# Based on the Scalar default theme palette",
    "# https://github.com/scalar/scalar",
    "",
    `background = ${p.background}`,
    `foreground = ${p.foreground}`,
    `cursor-color = ${p.foreground}`,
    `cursor-text = ${p.background}`,
    `selection-background = ${p.highlight}`,
    `selection-foreground = ${p.foreground}`,
  ];

  if (options.enablePaletteGenerate) {
    lines.push("palette-generate = true");
  }

  lines.push("");
  lines.push("# ANSI colors (0-15)");

  for (let i = 0; i < 16; i += 1) {
    lines.push(`palette = ${String(i)}=${paletteValues[i]}`);
  }

  if (options.includeExtendedPalette) {
    lines.push("");
    lines.push("# Extended colors (16-255), generated from ANSI colors in CIELAB");
    for (let i = 16; i < 256; i += 1) {
      lines.push(`palette = ${String(i)}=${paletteValues[i]}`);
    }
  }

  lines.push("");
  return lines.join("\n");
};
