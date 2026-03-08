import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf-8");

const requiredChecks = [
  {
    file: "themes/palette.jsonc",
    mustInclude: [
      '"muted": "#686868"',
      '"green": "#078657"',
      '"red": "#ef0006"',
      '"yellow": "#987100"',
      '"blue": "#007ac2"',
      '"orange": "#cc4700"',
    ],
  },
  {
    file: "src/palette.ts",
    mustInclude: [
      'muted: "#686868"',
      'green: "#078657"',
      'red: "#ef0006"',
      'yellow: "#987100"',
      'blue: "#007ac2"',
      'orange: "#cc4700"',
    ],
  },
  {
    file: "themes/zed/scalar.json",
    mustInclude: [
      '"editor.indent_guide": "#5f5b54"',
      '"editor.indent_guide_active": "#746f67"',
      '"editor.indent_guide": "#b5b5b5"',
      '"editor.indent_guide_active": "#9b9b9b"',
      '"warning": "#987100"',
    ],
  },
  {
    file: "themes/neovim/colors/scalar.lua",
    mustInclude: [
      'yellow    = "#987100"',
      'indent         = "#5f5b54"',
      'indent_active  = "#746f67"',
      'indent         = "#b5b5b5"',
      'indent_active  = "#9b9b9b"',
    ],
  },
  {
    file: "themes/opencode/scalar-adaptive.json",
    mustInclude: [
      '"lightMuted": "#686868"',
      '"lightGreen": "#078657"',
      '"lightYellow": "#987100"',
      '"lightBlue": "#007ac2"',
      '"lightOrange": "#cc4700"',
      '"darkRed": "#e53b39"',
    ],
  },
  {
    file: "themes/ghostty/scalar-light",
    mustInclude: ["palette = 0=#1f1f1f", "palette = 11=#ad840f", "palette = 15=#949494"],
  },
  {
    file: "themes/warp/scalar_light.yaml",
    mustInclude: ['yellow: "#987100"'],
  },
  {
    file: "themes/neovim/lua/lualine/themes/scalar.lua",
    mustInclude: ['yellow  = "#987100"'],
  },
];

const failures = [];

for (const check of requiredChecks) {
  const content = read(check.file);

  for (const token of check.mustInclude) {
    if (!content.includes(token)) {
      failures.push(`Missing token in ${check.file}: ${token}`);
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Theme consistency checks passed.");
