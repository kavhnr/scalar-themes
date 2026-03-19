import fs from "node:fs";
import path from "node:path";

import { parseJsonc } from "../jsonc.js";
import { log } from "../log.js";
import { toolPaths } from "../paths.js";

const writeTuiConfig = (configPath: string): void => {
  const next = {
    $schema: "https://opencode.ai/tui.json",
    theme: "scalar-adaptive",
  } as Record<string, unknown>;

  if (fs.existsSync(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, "utf-8");
      const data = parseJsonc(raw) as Record<string, unknown>;
      data.theme = "scalar-adaptive";
      if (!data.$schema) data.$schema = "https://opencode.ai/tui.json";
      fs.writeFileSync(configPath, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
      log.ok("Updated OpenCode TUI config");
      return;
    } catch {
      log.warn("Could not parse existing OpenCode TUI config; rewriting theme setting");
    }
  }

  fs.writeFileSync(configPath, `${JSON.stringify(next, null, 2)}\n`, "utf-8");
  log.ok("Created OpenCode TUI config");
};

export const installOpencode = (): void => {
  const { themesDir, config, tuiConfig, source } = toolPaths.opencode;

  fs.mkdirSync(themesDir, { recursive: true });
  fs.copyFileSync(source, path.join(themesDir, "scalar-adaptive.json"));
  log.ok("Copied scalar-adaptive.json to OpenCode themes");
  log.dim(themesDir);

  writeTuiConfig(tuiConfig);

  if (!fs.existsSync(config)) {
    log.warn("OpenCode runtime config not found");
    log.dim(`Create ${config} with: { "$schema": "https://opencode.ai/config.json" }`);
    return;
  }

  try {
    const raw = fs.readFileSync(config, "utf-8");
    const data = parseJsonc(raw) as Record<string, unknown>;
    if ("theme" in data) {
      delete data.theme;
      log.ok("Removed deprecated theme key from OpenCode runtime config");
    }
    if (!data.$schema) data.$schema = "https://opencode.ai/config.json";
    fs.writeFileSync(config, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
    log.ok("Updated OpenCode runtime config");
  } catch {
    log.warn("Could not auto-update OpenCode runtime config");
    log.dim(`Set theme in ${tuiConfig} with: { "theme": "scalar-adaptive" }`);
  }
};
