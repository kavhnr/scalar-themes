import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf-8");

const requiredChecks = [
  {
    file: "themes/palette.jsonc",
    mustInclude: [
      '"muted": "#7d7d7d"',
      '"green": "#078657"',
      '"red": "#e53b39"',
      '"yellow": "#987100"',
      '"blue": "#007ac2"',
      '"orange": "#cc4700"',
    ],
  },
  {
    file: "src/palette.ts",
    mustInclude: [
      'muted: "#7d7d7d"',
      'green: "#078657"',
      'red: "#e53b39"',
      'yellow: "#987100"',
      'blue: "#007ac2"',
      'orange: "#cc4700"',
    ],
  },
  {
    file: "themes/zed/scalar.json",
    mustInclude: [
      '"editor.indent_guide": "#383838"',
      '"editor.indent_guide_active": "#585858"',
      '"editor.indent_guide": "#d7d7d7"',
      '"editor.indent_guide_active": "#b8b8b8"',
      '"warning": "#987100"',
    ],
  },
  {
    file: "themes/neovim/colors/scalar.lua",
    mustInclude: [
      'yellow    = "#987100"',
      'indent        = "#383838"',
      'indent_active = "#585858"',
      'indent        = "#d7d7d7"',
      'indent_active = "#b8b8b8"',
    ],
  },
  {
    file: "themes/opencode/scalar-adaptive.json",
    mustInclude: [
      '"lightMuted": "#7d7d7d"',
      '"lightGreen": "#078657"',
      '"lightYellow": "#987100"',
      '"lightBlue": "#007ac2"',
      '"lightOrange": "#cc4700"',
      '"darkRed": "#e53b39"',
    ],
  },
  {
    file: "themes/ghostty/scalar-light",
    mustInclude: ["palette = 3=#987100", "palette = 11=#987100"],
  },
  {
    file: "themes/warp/scalar_light.yaml",
    mustInclude: ['yellow: "#987100"'],
  },
  {
    file: "themes/neovim/lua/lualine/themes/scalar.lua",
    mustInclude: ['yellow  = "#987100"'],
  },
  {
    file: "README.md",
    mustInclude: ["`#7d7d7d`", "`#078657`", "`#987100`", "`#007ac2`", "`#cc4700`"],
  },
];

const deprecatedTokens = [
  "#edbe20",
  "#edbe2015",
  "#edbe2040",
  "#8e8e8e",
  "#069061",
  "#0082d0",
  "#ff5800",
  "#dc1b19",
];
const deprecatedTokenScanFiles = [
  "themes/palette.jsonc",
  "src/palette.ts",
  "themes/zed/scalar.json",
  "themes/neovim/colors/scalar.lua",
  "themes/opencode/scalar-adaptive.json",
  "themes/ghostty/scalar-light",
  "themes/warp/scalar_light.yaml",
  "themes/neovim/lua/lualine/themes/scalar.lua",
  "README.md",
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

for (const file of deprecatedTokenScanFiles) {
  const content = read(file);

  for (const token of deprecatedTokens) {
    if (content.includes(token)) {
      failures.push(`Deprecated token still present in ${file}: ${token}`);
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
