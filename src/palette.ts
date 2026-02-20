/**
 * Scalar-derived theme palette.
 * Base color values are sourced from the Scalar default CSS preset:
 * https://github.com/scalar/scalar/blob/main/packages/themes/src/presets/default.css
 *
 * Light warning yellow is slightly darkened for readability.
 */
export const palette = {
  light: {
    background: "#ffffff",
    surface: "#f6f6f6",
    highlight: "#e7e7e7",
    foreground: "#1b1b1b",
    secondary: "#757575",
    muted: "#7d7d7d",
    green: "#078657",
    red: "#ef0006",
    yellow: "#987100",
    blue: "#007ac2",
    orange: "#cc4700",
    purple: "#5203d1",
  },
  dark: {
    background: "#0f0f0f",
    surface: "#1a1a1a",
    highlight: "#272727",
    foreground: "#e7e7e7",
    secondary: "#a4a4a4",
    muted: "#797979",
    green: "#00b648",
    red: "#e53b39",
    yellow: "#ffc90d",
    blue: "#4eb3ec",
    orange: "#ff8d4d",
    purple: "#b191f9",
  },
} as const;

export type Palette = typeof palette;
export type ThemeVariant = keyof Palette;
