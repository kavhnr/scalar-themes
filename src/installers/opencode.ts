import fs from "node:fs";
import path from "node:path";

import { log } from "../log.js";
import { toolPaths } from "../paths.js";

/**
 * Installs the Scalar theme for OpenCode.
 *
 * Copies the adaptive theme JSON into OpenCode's themes directory
 * and updates the config to reference it.
 * Theme file uses { dark, light } variants per key so it auto-adapts.
 */
export const installOpencode = (): void => {
  const { themesDir, config, source } = toolPaths.opencode;

  fs.mkdirSync(themesDir, { recursive: true });
  fs.copyFileSync(source, path.join(themesDir, "scalar-adaptive.json"));
  log.ok("Copied scalar-adaptive.json to OpenCode themes");
  log.dim(themesDir);

  if (!fs.existsSync(config)) {
    log.warn("OpenCode config not found");
    log.dim(`Create ${config} with: { "theme": "scalar-adaptive" }`);
    return;
  }

  try {
    const data = JSON.parse(fs.readFileSync(config, "utf-8")) as Record<string, unknown>;
    data.theme = "scalar-adaptive";
    fs.writeFileSync(config, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
    log.ok("Updated OpenCode config");
  } catch {
    log.warn("Could not auto-update OpenCode config");
    log.dim('Set "theme": "scalar-adaptive" in your opencode.json');
  }
};
