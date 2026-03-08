import readline from "node:readline";

const BLUE = "\x1b[34m";
const GREEN = "\x1b[32m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

const write = (...args: readonly string[]): void => {
  console.log(...args);
};

interface Choice {
  label: string;
  value: string;
  description: string;
}

export const multiSelect = (
  title: string,
  choices: readonly Choice[],
): Promise<string[]> => {
  return new Promise((resolve) => {
    const selected = new Set<number>(choices.map((_, i) => i));
    let cursor = 0;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    const hideCursor = (): void => {
      process.stdout.write("\x1b[?25l");
    };

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
        const label = isCursor
          ? `${BOLD}${choice.label}${RESET}`
          : choice.label;
        const desc = `${DIM}${choice.description}${RESET}`;
        write(`  ${pointer} ${checkbox} ${label} ${desc}`);
      }
    };

    hideCursor();

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

      if (key === "\x1b[A" || key === "k") {
        cursor = (cursor - 1 + choices.length) % choices.length;
        render();
        return;
      }

      if (key === "\x1b[B" || key === "j") {
        cursor = (cursor + 1) % choices.length;
        render();
        return;
      }

      if (key === " ") {
        if (selected.has(cursor)) {
          selected.delete(cursor);
        } else {
          selected.add(cursor);
        }
        render();
        return;
      }

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

      if (key === "\x03") {
        showCursor();
        rl.close();
        process.exit(0);
      }
    });
  });
};
