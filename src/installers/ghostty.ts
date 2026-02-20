import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

import { createGhosttyTheme } from "../generators/ghostty.js";
import { log } from "../log.js";
import { toolPaths } from "../paths.js";

/** Matches the `theme = ...` line in a Ghostty config file. */
const THEME_LINE_PATTERN = /^theme\s*=\s*.+$/m;

/**
 * Installs the Scalar theme for Ghostty.
 *
 * Generates theme files from the Scalar palette and writes them into
 * Ghostty's active config directory themes folder(s), so they can be
 * referenced by name (not absolute path).
 *
 * Then updates the config to use: theme = dark:scalar-dark,light:scalar-light
 * https://ghostty.org/docs/config/reference#theme
 */
export const installGhostty = (): void => {
  const { xdgConfigDir, macosConfigDir } = toolPaths.ghostty;
  const configDirs = [xdgConfigDir, macosConfigDir].filter(
    (dir): dir is string => typeof dir === "string",
  );
  const themeInstallDirs = Array.from(new Set([xdgConfigDir, ...configDirs]));
  const configPaths = configDirs.map((dir) => path.join(dir, "config"));
  const activeConfigDirs = configDirs.filter((dir) => fs.existsSync(path.join(dir, "config")));

  if (activeConfigDirs.length === 0) {
    log.warn("Ghostty config not found");
    for (const configPath of configPaths) {
      log.dim(`Expected: ${configPath}`);
    }
    log.dim("Create it and run this command again.");
    return;
  }

  /**
   * Ghostty 1.3.0+ can generate the 16-255 palette from the first 16 colors.
   * For older/unknown versions we write an explicit 256-color palette.
   */
  const supportsPaletteGenerate = detectGhosttyPaletteGenerateSupport();
  const useGeneratedMode = supportsPaletteGenerate === true;

  if (supportsPaletteGenerate === null) {
    log.warn("Could not detect Ghostty version; installing explicit 256-color theme files");
  }

  if (useGeneratedMode) {
    log.dim("Detected Ghostty 1.3.0+ (palette-generate supported)");
  } else {
    log.dim("Using compatibility mode (explicit 256-color palette entries)");
  }

  const darkTheme = createGhosttyTheme("dark", {
    includeExtendedPalette: !useGeneratedMode,
    enablePaletteGenerate: useGeneratedMode,
  });
  const lightTheme = createGhosttyTheme("light", {
    includeExtendedPalette: !useGeneratedMode,
    enablePaletteGenerate: useGeneratedMode,
  });

  /** Write theme files into XDG themes dir and active config themes dirs. */
  for (const configDir of themeInstallDirs) {
    const ghosttyThemesDir = path.join(configDir, "themes");
    fs.mkdirSync(ghosttyThemesDir, { recursive: true });

    fs.writeFileSync(path.join(ghosttyThemesDir, "scalar-dark"), darkTheme, "utf-8");
    fs.writeFileSync(path.join(ghosttyThemesDir, "scalar-light"), lightTheme, "utf-8");

    log.dim(`Installed in: ${ghosttyThemesDir}`);
  }

  log.ok("Copied Scalar themes to Ghostty");

  /** Update all active config files to reference themes by name. */
  const themeLine = "theme = dark:scalar-dark,light:scalar-light";

  for (const configDir of activeConfigDirs) {
    const config = path.join(configDir, "config");
    const content = fs.readFileSync(config, "utf-8");
    const updated = THEME_LINE_PATTERN.test(content)
      ? content.replace(THEME_LINE_PATTERN, themeLine)
      : `${content.trimEnd()}\n${themeLine}\n`;

    fs.writeFileSync(config, updated, "utf-8");
    log.dim(`Updated: ${config}`);
  }

  log.ok("Updated Ghostty config");
};

const parseSemver = (value: string): [number, number, number] | null => {
  const match = value.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    return null;
  }

  return [
    Number.parseInt(match[1], 10),
    Number.parseInt(match[2], 10),
    Number.parseInt(match[3], 10),
  ];
};

const semverGte = (
  current: readonly [number, number, number],
  minimum: readonly [number, number, number],
): boolean => {
  for (let i = 0; i < 3; i += 1) {
    if (current[i] > minimum[i]) {
      return true;
    }
    if (current[i] < minimum[i]) {
      return false;
    }
  }

  return true;
};

const detectGhosttyPaletteGenerateSupport = (): boolean | null => {
  const versionCommands: ReadonlyArray<readonly string[]> = [["+version"], ["--version"]];

  for (const args of versionCommands) {
    try {
      const output = execFileSync("ghostty", [...args], {
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "pipe"],
      });
      const version = parseSemver(output);
      if (!version) {
        continue;
      }

      return semverGte(version, [1, 3, 0]);
    } catch {
      continue;
    }
  }

  return null;
};
