import fs from "node:fs";
import path from "node:path";

import { log } from "../log.js";
import { toolPaths } from "../paths.js";

export const installWarp = (): void => {
  const { themesDir, darkSource, lightSource } = toolPaths.warp;

  fs.mkdirSync(themesDir, { recursive: true });

  fs.copyFileSync(darkSource, path.join(themesDir, "scalar_dark.yaml"));
  fs.copyFileSync(lightSource, path.join(themesDir, "scalar_light.yaml"));

  log.ok("Copied Scalar themes to Warp");
  log.dim(themesDir);
  log.dim("Select 'Scalar Dark' or 'Scalar Light' in Warp Settings > Appearance > Themes");
};
