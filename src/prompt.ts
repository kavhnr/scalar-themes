import readline from "node:readline";

const BLUE = "\x1b[34m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

/** Writes a line to stdout. */
const write = (...args: readonly string[]): void => {
  // biome-ignore lint/suspicious/noConsole: CLI tool -- stdout is the intended output
  console.log(...args);
};

interface Choice {
  label: string;
  value: string;
  description: string;
}

/**
 * Renders an interactive multi-select prompt in the terminal.
 * Users toggle choices with Space and confirm with Enter.
 * Returns the selected values.
 */
export const multiSelect = (title: string, choices: readonly Choice[]): Promise<string[]> => {
  return new Promise((resolve) => {
    const selected = new Set<number>(choices.map((_, i) => i));
    let cursor = 0;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    /** Hides the terminal cursor during rendering. */
    const hideCursor = (): void => {
      process.stdout.write("\x1b[?25l");
    };

    /** Shows the terminal cursor after we are done. */
    const showCursor = (): void => {
      process.stdout.write("\x1b[?25h");
    };

    const render = (): void => {
      const lines = choices.length + 4;
      process.stdout.write(`\x1b[${String(lines)}A\x1b[J`);

      write(`\n${BOLD}  ${title}${RESET}`);
      write(`${DIM}  Space to toggle, Enter to confirm${RESET}\n`);

      for (const [i, choice] of choices.entries()) {
        const isSelected = selected.has(i);
        const isCursor = i === cursor;
        const checkbox = isSelected ? `${GREEN}[x]${RESET}` : "[ ]";
        const pointer = isCursor ? `${BLUE}>${RESET}` : " ";
        const label = isCursor ? `${BOLD}${choice.label}${RESET}` : choice.label;
        const desc = `${DIM}${choice.description}${RESET}`;
        write(`  ${pointer} ${checkbox} ${label} ${desc}`);
      }
    };

    hideCursor();

    /** Print blank lines first so the "move up" in render() works on first call. */
    const lineCount = choices.length + 4;
    for (let i = 0; i < lineCount; i += 1) {
      write();
    }
    render();

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();

    process.stdin.on("data", (data: Buffer) => {
      const key = data.toString();

      // Up arrow or k
      if (key === "\x1b[A" || key === "k") {
        cursor = (cursor - 1 + choices.length) % choices.length;
        render();
        return;
      }

      // Down arrow or j
      if (key === "\x1b[B" || key === "j") {
        cursor = (cursor + 1) % choices.length;
        render();
        return;
      }

      // Space -- toggle selection
      if (key === " ") {
        if (selected.has(cursor)) {
          selected.delete(cursor);
        } else {
          selected.add(cursor);
        }
        render();
        return;
      }

      // Enter -- confirm
      if (key === "\r" || key === "\n") {
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        showCursor();
        rl.close();
        const result = [...selected].sort().map((idx) => choices[idx].value);
        resolve(result);
        return;
      }

      // Ctrl+C -- abort
      if (key === "\x03") {
        showCursor();
        rl.close();
        process.exit(0);
      }
    });
  });
};
