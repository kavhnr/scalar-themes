export const palette = {
  light: {
    background: "#e6e6e6",
    surface: "#efefef",
    highlight: "#cecece",
    foreground: "#1f1f1f",
    secondary: "#5b5b5b",
    muted: "#686868",
    green: "#078657",
    red: "#ef0006",
    yellow: "#987100",
    blue: "#007ac2",
    cyan: "#0a94a8",
    orange: "#cc4700",
    purple: "#5203d1",
  },
  dark: {
    background: "#2f2e2c",
    surface: "#35342f",
    highlight: "#4b4943",
    foreground: "#d8d3ca",
    secondary: "#b8b2a8",
    muted: "#9b958b",
    green: "#00b648",
    red: "#e53b39",
    yellow: "#ffc90d",
    blue: "#4eb3ec",
    cyan: "#42bfd3",
    orange: "#ff8d4d",
    purple: "#b191f9",
  },
} as const;

export type Palette = typeof palette;
export type ThemeVariant = keyof Palette;
