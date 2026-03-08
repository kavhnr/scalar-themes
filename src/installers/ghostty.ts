import fs from "node:fs";
import path from "node:path";

import { createGhosttyTheme } from "../generators/ghostty.js";
import { log } from "../log.js";
import { toolPaths } from "../paths.js";

const THEME_LINE_PATTERN = /^theme\s*=\s*.+$/m;

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

  const darkTheme = createGhosttyTheme("dark");
  const lightTheme = createGhosttyTheme("light");

  for (const configDir of themeInstallDirs) {
    const ghosttyThemesDir = path.join(configDir, "themes");
    fs.mkdirSync(ghosttyThemesDir, { recursive: true });

    fs.writeFileSync(path.join(ghosttyThemesDir, "scalar-dark"), darkTheme, "utf-8");
    fs.writeFileSync(path.join(ghosttyThemesDir, "scalar-light"), lightTheme, "utf-8");

    log.dim(`Installed in: ${ghosttyThemesDir}`);
  }

  log.ok("Copied Scalar themes to Ghostty");

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
