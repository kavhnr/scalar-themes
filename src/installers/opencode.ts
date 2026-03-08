import fs from "node:fs";
import path from "node:path";

import { log } from "../log.js";
import { toolPaths } from "../paths.js";

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
