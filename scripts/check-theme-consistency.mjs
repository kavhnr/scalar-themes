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
      '"yellow": "#866300"',
      '"surface": "#e6e6e6"',
      '"highlight": "#d2d2d2"',
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
      'yellow: "#866300"',
      'surface: "#e6e6e6"',
      'highlight: "#d2d2d2"',
      'blue: "#007ac2"',
      'orange: "#cc4700"',
    ],
  },
  {
    file: "themes/zed/scalar.json",
    mustInclude: [
      '"editor.indent_guide": "#5c5851"',
      '"editor.indent_guide_active": "#746f67"',
      '"editor.indent_guide": "#b2b2b2"',
      '"editor.indent_guide_active": "#9b9b9b"',
      '"warning": "#866300"',
    ],
  },
  {
    file: "themes/neovim/colors/scalar.lua",
    mustInclude: [
      'yellow    = "#866300"',
      'indent         = "#5c5851"',
      'indent_active  = "#746f67"',
      'indent         = "#b2b2b2"',
      'indent_active  = "#9b9b9b"',
    ],
  },
  {
    file: "themes/opencode/scalar-adaptive.json",
    mustInclude: [
      '"lightMuted": "#686868"',
      '"lightGreen": "#078657"',
      '"lightYellow": "#866300"',
      '"lightSurface": "#e6e6e6"',
      '"lightHighlight": "#d2d2d2"',
      '"lightBlue": "#007ac2"',
      '"lightOrange": "#cc4700"',
      '"darkRed": "#e53b39"',
    ],
  },
  {
    file: "themes/ghostty/scalar-light",
    mustInclude: ["palette = 0=#1f1f1f", "palette = 11=#9a7410", "palette = 15=#767676"],
  },
  {
    file: "themes/warp/scalar_light.yaml",
    mustInclude: ['yellow: "#866300"'],
  },
  {
    file: "themes/neovim/lua/lualine/themes/scalar.lua",
    mustInclude: ['yellow  = "#866300"'],
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
