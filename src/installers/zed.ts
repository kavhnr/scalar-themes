import fs from "node:fs";
import path from "node:path";

import { log } from "../log.js";
import { toolPaths } from "../paths.js";

/**
 * Strips JSONC features (trailing commas, comments) so JSON.parse works.
 * Zed's settings.json uses JSONC syntax.
 */
const stripJsonc = (input: string): string => {
  const withoutComments = input.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
  return withoutComments.replace(/,(\s*[}\]])/g, "$1");
};

/**
 * Installs the Scalar theme for Zed.
 *
 * Copies the theme JSON into Zed's local themes directory and updates
 * settings.json to use Scalar Dark / Scalar Light.
 * https://zed.dev/docs/themes#local-themes
 */
export const installZed = (): void => {
  const { themesDir, settings, source } = toolPaths.zed;

  fs.mkdirSync(themesDir, { recursive: true });
  fs.copyFileSync(source, path.join(themesDir, "scalar.json"));
  log.ok("Copied scalar.json to Zed themes");
  log.dim(themesDir);

  if (!fs.existsSync(settings)) {
    log.warn("Zed settings.json not found -- select Scalar from the theme picker");
    return;
  }

  try {
    const raw = fs.readFileSync(settings, "utf-8");
    const data = JSON.parse(stripJsonc(raw)) as Record<string, unknown>;

    data.theme = {
      mode: "system",
      light: "Scalar Light",
      dark: "Scalar Dark",
    };

    fs.writeFileSync(settings, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
    log.ok("Updated Zed settings");
  } catch {
    log.warn("Could not auto-update Zed settings");
    log.dim('Set theme to "Scalar Dark" / "Scalar Light" via the theme picker');
  }
};
