import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const home = os.homedir();
const platform = os.platform();
const xdgConfigHome = process.env.XDG_CONFIG_HOME ?? path.join(home, ".config");
const zedConfigDir =
  platform === "win32"
    ? path.join(process.env.APPDATA ?? path.join(home, "AppData", "Roaming"), "Zed")
    : path.join(xdgConfigHome, "zed");

/**
 * Resolves the root directory of this package.
 * Works both when running from source (dev) and when installed via npm.
 */
export const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Directory containing the theme asset files. */
export const themesDir = path.join(packageRoot, "themes");

/** Paths where each tool expects its config and theme files. */
export const toolPaths = {
  ghostty: {
    xdgConfigDir: path.join(xdgConfigHome, "ghostty"),
    macosConfigDir:
      platform === "darwin"
        ? path.join(home, "Library", "Application Support", "com.mitchellh.ghostty")
        : undefined,
  },

  zed: {
    themesDir: path.join(zedConfigDir, "themes"),
    settings: path.join(zedConfigDir, "settings.json"),
    source: path.join(themesDir, "zed", "scalar.json"),
  },

  opencode: {
    themesDir: path.join(
      process.env.XDG_CONFIG_HOME ?? path.join(home, ".config"),
      "opencode",
      "themes",
    ),
    config: path.join(
      process.env.XDG_CONFIG_HOME ?? path.join(home, ".config"),
      "opencode",
      "opencode.json",
    ),
    source: path.join(themesDir, "opencode", "scalar-adaptive.json"),
  },

  neovim: {
    configDir: path.join(xdgConfigHome, "nvim"),
    source: path.join(themesDir, "neovim"),
  },

  warp: {
    themesDir: path.join(home, ".warp", "themes"),
    darkSource: path.join(themesDir, "warp", "scalar_dark.yaml"),
    lightSource: path.join(themesDir, "warp", "scalar_light.yaml"),
  },
} as const;
