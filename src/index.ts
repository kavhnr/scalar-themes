#!/usr/bin/env node

import {
  installGhostty,
  installNeovim,
  installOpencode,
  installWarp,
  installZed,
} from "./installers/index.js";
import { log } from "./log.js";
import { multiSelect } from "./prompt.js";

interface Tool {
  id: string;
  label: string;
  description: string;
  install: () => void;
}

const tools: readonly Tool[] = [
  { id: "ghostty", label: "Ghostty", description: "terminal emulator", install: installGhostty },
  {
    id: "neovim",
    label: "Neovim",
    description: "editor (LazyVim compatible)",
    install: installNeovim,
  },
  { id: "zed", label: "Zed", description: "text editor", install: installZed },
  { id: "opencode", label: "OpenCode", description: "AI coding agent", install: installOpencode },
  { id: "warp", label: "Warp", description: "terminal emulator", install: installWarp },
] as const;

const run = async (): Promise<void> => {
  const args = process.argv.slice(2);

  log.header("Scalar Themes");
  log.dim("Scalar-based color themes for your terminal and editor\n");

  let selectedIds: string[];

  /**
   * If CLI args are provided, use them directly.
   * e.g. `npx scalar-themes ghostty zed`
   * Use `--all` or no args (interactive) to install everything.
   */
  if (args.includes("--all")) {
    selectedIds = tools.map((t) => t.id);
  } else if (args.length > 0) {
    const validIds = new Set(tools.map((t) => t.id));
    const invalid = args.filter((a) => !validIds.has(a) && a !== "--all");

    if (invalid.length > 0) {
      log.error(`Unknown tool(s): ${invalid.join(", ")}`);
      log.dim(`Valid options: ${[...validIds].join(", ")}, --all`);
      process.exit(1);
    }

    selectedIds = args.filter((a) => validIds.has(a));
  } else {
    /** Interactive mode -- show multi-select prompt. */
    const choices = tools.map((t) => ({
      label: t.label,
      value: t.id,
      description: t.description,
    }));

    selectedIds = await multiSelect("Select tools to theme:", choices);
  }

  if (selectedIds.length === 0) {
    log.warn("No tools selected");
    process.exit(0);
  }

  log.blank();

  for (const id of selectedIds) {
    const tool = tools.find((t) => t.id === id);
    if (tool) {
      log.info(`Installing ${tool.label}...`);
      tool.install();
      log.blank();
    }
  }

  log.ok("Done. Restart your apps to see the changes.");
  log.blank();
};

run().catch((error: unknown) => {
  log.error(String(error));
  process.exit(1);
});
