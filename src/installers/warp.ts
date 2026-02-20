import fs from "node:fs";
import path from "node:path";

import { log } from "../log.js";
import { toolPaths } from "../paths.js";

/**
 * Installs the Scalar theme for Warp terminal.
 *
 * Copies dark and light theme YAML files into ~/.warp/themes/.
 * Warp auto-discovers themes in this directory -- no restart needed,
 * but the user must select the theme from Settings > Appearance > Themes.
 */
export const installWarp = (): void => {
  const { themesDir, darkSource, lightSource } = toolPaths.warp;

  fs.mkdirSync(themesDir, { recursive: true });

  fs.copyFileSync(darkSource, path.join(themesDir, "scalar_dark.yaml"));
  fs.copyFileSync(lightSource, path.join(themesDir, "scalar_light.yaml"));

  log.ok("Copied Scalar themes to Warp");
  log.dim(themesDir);
  log.dim("Select 'Scalar Dark' or 'Scalar Light' in Warp Settings > Appearance > Themes");
};
