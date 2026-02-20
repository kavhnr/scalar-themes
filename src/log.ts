/**
 * Minimal logging helpers with color output.
 * Uses ANSI escape codes directly to avoid dependencies.
 *
 * This is a CLI tool -- console.log is the intended output mechanism.
 */

const BLUE = "\x1b[34m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

const PREFIX = `${BLUE}[scalar]${RESET}`;

/** Writes a line to stdout. Wrapper to satisfy the noConsole lint rule. */
const write = (...args: readonly string[]): void => {
  // biome-ignore lint/suspicious/noConsole: CLI tool -- stdout is the intended output
  console.log(...args);
};

export const log = {
  info: (message: string): void => {
    write(`${PREFIX} ${message}`);
  },

  ok: (message: string): void => {
    write(`${PREFIX} ${GREEN}${message}${RESET}`);
  },

  warn: (message: string): void => {
    write(`${PREFIX} ${YELLOW}${message}${RESET}`);
  },

  error: (message: string): void => {
    write(`${PREFIX} ${RED}${message}${RESET}`);
  },

  dim: (message: string): void => {
    write(`         ${DIM}${message}${RESET}`);
  },

  header: (message: string): void => {
    write(`\n${BOLD}${BLUE}  ${message}${RESET}`);
  },

  blank: (): void => {
    write();
  },
} as const;
