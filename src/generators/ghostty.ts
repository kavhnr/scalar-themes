import { palette, type ThemeVariant } from "../palette.js";

const getBase16 = (variant: ThemeVariant): readonly string[] => {
  const p = palette[variant];

  const ansiBlack = variant === "dark" ? "#56514b" : "#1f1f1f";
  const ansiWhite = variant === "dark" ? "#b8b2a8" : "#7a7a7a";
  const ansiBrightBlack = variant === "dark" ? "#9b958b" : "#686868";
  const ansiBrightGreen = variant === "dark" ? "#26c466" : "#229267";
  const ansiBrightYellow = variant === "dark" ? "#ffd33a" : "#9a7410";
  const ansiBrightBlue = variant === "dark" ? "#6bc2f2" : "#1f89cc";
  const ansiBrightPurple = variant === "dark" ? "#c3a6fb" : "#6420d8";
  const ansiBrightCyan = variant === "dark" ? "#66cedf" : "#0f8698";
  const ansiBrightWhite = variant === "dark" ? "#d8d3ca" : "#767676";

  return [
    ansiBlack,
    p.red,
    p.green,
    p.yellow,
    p.blue,
    p.purple,
    p.cyan,
    ansiWhite,
    ansiBrightBlack,
    p.orange,
    ansiBrightGreen,
    ansiBrightYellow,
    ansiBrightBlue,
    ansiBrightPurple,
    ansiBrightCyan,
    ansiBrightWhite,
  ] as const;
};

export const createGhosttyTheme = (variant: ThemeVariant): string => {
  const p = palette[variant];
  const base16 = getBase16(variant);

  const lines: string[] = [
    `# Scalar ${variant === "dark" ? "Dark" : "Light"} - Ghostty Theme`,
    "",
    `background = ${p.background}`,
    `foreground = ${p.foreground}`,
    `cursor-color = ${p.foreground}`,
    `cursor-text = ${p.background}`,
    `selection-background = ${p.highlight}`,
    `selection-foreground = ${p.foreground}`,
    "",
    "# ANSI colors (0-15)",
  ];

  for (let i = 0; i < 16; i += 1) {
    lines.push(`palette = ${String(i)}=${base16[i]}`);
  }

  lines.push("");
  return lines.join("\n");
};
