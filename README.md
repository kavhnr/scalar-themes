<h1 align="center">
  <img src="assets/scalar-icon-light.svg#gh-light-mode-only" width="36" height="36" alt="Scalar" />
  <img src="assets/scalar-icon-dark.svg#gh-dark-mode-only" width="36" height="36" alt="Scalar" />
  Scalar Themes
</h1>

<p align="center">
  Unofficial color themes for your daily tools, derived from the
  <a href="https://github.com/scalar/scalar">Scalar</a> default palette.<br />
  Not affiliated with Scalar — I just like their default theme.
</p>

### Light

![Scalar Light theme](assets/scalar-theme-preview-light.avif)

### Dark

![Scalar Dark theme](assets/scalar-theme-preview-dark.avif)

## Install

One command to theme everything. Zero dependencies.

```bash
# pnpm (recommended)
pnpm dlx scalar-themes

# npx
npx scalar-themes

# yarn
yarn dlx scalar-themes

# bun
bunx scalar-themes
```

The interactive CLI lets you pick which tools to theme:

```
  Scalar Themes
  Scalar-based color themes for your terminal and editor

  Select tools to theme:
  Space to toggle, Enter to confirm

  > [x] Ghostty terminal emulator
    [x] Neovim editor (LazyVim compatible)
    [x] Zed text editor
    [x] OpenCode AI coding agent
    [x] Warp terminal emulator
```

Or install specific tools directly:

```bash
pnpm dlx scalar-themes ghostty zed
pnpm dlx scalar-themes --all
```

## Supported Tools

| Tool | Theme Files | Install Method |
|---|---|---|
| [Ghostty](https://ghostty.org) | `scalar-dark`, `scalar-light` | Generated from Scalar palette and written to Ghostty themes dir ([docs](https://ghostty.org/docs/config/reference#theme)) |
| [Neovim](https://neovim.io) | `scalar.lua`, `scalar-dark.lua`, `scalar-light.lua` | Copied to `~/.config/nvim/colors/` + lualine theme |
| [Zed](https://zed.dev) | `scalar.json` | Copied to `~/.config/zed/themes/` ([docs](https://zed.dev/docs/themes#local-themes)) |
| [OpenCode](https://opencode.ai) | `scalar-adaptive.json` | Copied to `~/.config/opencode/themes/` |
| [Warp](https://www.warp.dev) | `scalar_dark.yaml`, `scalar_light.yaml` | Copied to `~/.warp/themes/` |

## What It Does

Each installer follows the tool's idiomatic configuration method:

**Ghostty** -- Generates theme files from the Scalar palette and writes them into Ghostty's active config directory themes folder(s), then updates your config to use `theme = dark:scalar-dark,light:scalar-light`. On Ghostty `>= 1.3.0`, the installer uses `palette-generate = true` with ANSI colors (0-15). On older or unknown versions, it writes explicit palette entries `16-255` for compatibility.

**Neovim** -- Copies colorscheme files to `~/.config/nvim/colors/` and a lualine theme to `lua/lualine/themes/`. For LazyVim users, it also creates a plugin spec at `lua/plugins/scalar-theme.lua` that sets the colorscheme automatically. Works with standard Neovim too. Supports dark/light via `vim.o.background`, terminal ANSI colors, and optional `vim.g.scalar_theme_config` overrides.

**Zed** -- Copies `scalar.json` into Zed's local themes directory and sets `"dark": "Scalar Dark"` / `"light": "Scalar Light"` in your settings.

**OpenCode** -- Copies `scalar-adaptive.json` into OpenCode's themes directory. The file uses `{ "dark": ..., "light": ... }` per-key variants, so it auto-adapts to your terminal appearance.

**Warp** -- Copies `scalar_dark.yaml` and `scalar_light.yaml` into `~/.warp/themes/`. Warp auto-discovers themes in this directory. Select from Settings > Appearance > Themes.

## Manual Setup

<details>
<summary>Ghostty</summary>

Copy the theme files into Ghostty's custom themes directory:

```bash
# macOS + Linux (XDG path; Ghostty checks this on all platforms)
mkdir -p ~/.config/ghostty/themes
cp themes/ghostty/scalar-dark themes/ghostty/scalar-light ~/.config/ghostty/themes/
```

On macOS, Ghostty also supports `~/Library/Application Support/com.mitchellh.ghostty/` as a secondary config location.

On Ghostty `>= 1.3.0`, these files rely on `palette-generate` (enabled by default) to derive colors `16-255` from the base ANSI colors. If you use an older Ghostty build, prefer the installer command (`pnpm dlx scalar-themes ghostty`) so it can write an explicit compatibility palette.

Then add to your Ghostty config:

```
theme = dark:scalar-dark,light:scalar-light
```
</details>

<details>
<summary>Neovim / LazyVim</summary>

Copy the colorscheme and lualine theme:

```bash
cp themes/neovim/colors/scalar*.lua ~/.config/nvim/colors/
mkdir -p ~/.config/nvim/lua/lualine/themes
cp themes/neovim/lua/lualine/themes/scalar.lua ~/.config/nvim/lua/lualine/themes/
```

**LazyVim**: Create `~/.config/nvim/lua/plugins/scalar-theme.lua`:

```lua
return {
  { "LazyVim/LazyVim", opts = { colorscheme = "scalar" } },
}
```

**Standard Neovim**: Add to your `init.lua`:

```lua
vim.cmd.colorscheme("scalar")
```

Optional theme config (set before loading the colorscheme):

```lua
vim.g.scalar_theme_config = {
  transparent = false,
  transparent_floats = false,
  terminal_colors = true,
  dim_inactive = false,
  show_end_of_buffer = false,
  styles = {
    comments = { italic = true },
    keywords = {},
    functions = {},
    variables = {},
  },
}
vim.cmd.colorscheme("scalar")
```

Legacy compatibility toggle:

```lua
vim.g.scalar_transparent = true
```

Three colorscheme names are available:
- `scalar` -- respects `vim.o.background` (dark or light)
- `scalar-dark` -- forces dark
- `scalar-light` -- forces light
</details>

<details>
<summary>Zed</summary>

```bash
# macOS + Linux
cp themes/zed/scalar.json ~/.config/zed/themes/

# Windows (PowerShell)
Copy-Item themes/zed/scalar.json "$env:APPDATA\Zed\themes\scalar.json"
```

Then in your Zed `settings.json`:

```json
{
  "theme": {
    "mode": "system",
    "light": "Scalar Light",
    "dark": "Scalar Dark"
  }
}
```
</details>

<details>
<summary>OpenCode</summary>

```bash
mkdir -p ~/.config/opencode/themes
cp themes/opencode/scalar-adaptive.json ~/.config/opencode/themes/
```

Then in `~/.config/opencode/opencode.json`:

```json
{
  "theme": "scalar-adaptive"
}
```
</details>

<details>
<summary>Warp</summary>

```bash
mkdir -p ~/.warp/themes
cp themes/warp/scalar_dark.yaml themes/warp/scalar_light.yaml ~/.warp/themes/
```

Then open Warp Settings > Appearance > Themes and select "Scalar Dark" or "Scalar Light".
</details>

## Palette

All themes derive from the same colors defined in [`themes/palette.jsonc`](themes/palette.jsonc).
Run `npm run check:theme` to verify key contrast and palette updates were applied consistently across theme files.

<table>
<tr><th>Dark</th><th>Light</th></tr>
<tr><td>

| Role | Hex | |
|---|---|---|
| Background | `#0f0f0f` | ![](https://placehold.co/16x16/0f0f0f/0f0f0f) |
| Surface | `#1a1a1a` | ![](https://placehold.co/16x16/1a1a1a/1a1a1a) |
| Highlight | `#272727` | ![](https://placehold.co/16x16/272727/272727) |
| Foreground | `#d6d6d6` | ![](https://placehold.co/16x16/d6d6d6/d6d6d6) |
| Secondary | `#9a9a9a` | ![](https://placehold.co/16x16/9a9a9a/9a9a9a) |
| Muted | `#797979` | ![](https://placehold.co/16x16/797979/797979) |
| Green | `#00b648` | ![](https://placehold.co/16x16/00b648/00b648) |
| Red | `#e53b39` | ![](https://placehold.co/16x16/e53b39/e53b39) |
| Yellow | `#ffc90d` | ![](https://placehold.co/16x16/ffc90d/ffc90d) |
| Blue | `#4eb3ec` | ![](https://placehold.co/16x16/4eb3ec/4eb3ec) |
| Orange | `#ff8d4d` | ![](https://placehold.co/16x16/ff8d4d/ff8d4d) |
| Purple | `#b191f9` | ![](https://placehold.co/16x16/b191f9/b191f9) |

</td><td>

| Role | Hex | |
|---|---|---|
| Background | `#ffffff` | ![](https://placehold.co/16x16/ffffff/ffffff) |
| Surface | `#f6f6f6` | ![](https://placehold.co/16x16/f6f6f6/f6f6f6) |
| Highlight | `#e7e7e7` | ![](https://placehold.co/16x16/e7e7e7/e7e7e7) |
| Foreground | `#1b1b1b` | ![](https://placehold.co/16x16/1b1b1b/1b1b1b) |
| Secondary | `#757575` | ![](https://placehold.co/16x16/757575/757575) |
| Muted | `#7d7d7d` | ![](https://placehold.co/16x16/7d7d7d/7d7d7d) |
| Green | `#078657` | ![](https://placehold.co/16x16/078657/078657) |
| Red | `#ef0006` | ![](https://placehold.co/16x16/ef0006/ef0006) |
| Yellow | `#987100` | ![](https://placehold.co/16x16/987100/987100) |
| Blue | `#007ac2` | ![](https://placehold.co/16x16/007ac2/007ac2) |
| Orange | `#cc4700` | ![](https://placehold.co/16x16/cc4700/cc4700) |
| Purple | `#5203d1` | ![](https://placehold.co/16x16/5203d1/5203d1) |

</td></tr>
</table>

## Credits

Colors are derived from the [Scalar](https://github.com/scalar/scalar) default theme ([`packages/themes/src/presets/default.css`](https://github.com/scalar/scalar/tree/main/packages/themes/src/presets/default.css)) with small readability-focused contrast adjustments.

## License

[MIT](LICENSE)
