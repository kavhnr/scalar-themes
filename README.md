<h1 align="center">
  <img src="assets/scalar-icon-light.svg#gh-light-mode-only" width="36" height="36" alt="Scalar" />
  <img src="assets/scalar-icon-dark.svg#gh-dark-mode-only" width="36" height="36" alt="Scalar" />
  Scalar Themes
</h1>

<p align="center">
  Scalar-inspired themes with comfort tuning for long coding sessions.<br />
  Softer backgrounds, calmer contrast, and one simple installer.
</p>

### Light

![Scalar Light theme](assets/scalar-theme-preview-light.avif)

### Dark

![Scalar Dark theme](assets/scalar-theme-preview-dark.avif)

## Install

```bash
pnpm dlx scalar-themes
```

Use `npx scalar-themes`, `yarn dlx scalar-themes`, or `bunx scalar-themes` if you prefer.

Install specific tools:

```bash
pnpm dlx scalar-themes ghostty zed
pnpm dlx scalar-themes --all
```

## Supported Tools

- [Ghostty](https://ghostty.org)
- [Neovim](https://neovim.io)
- [Zed](https://zed.dev)
- [OpenCode](https://opencode.ai)
- [Warp](https://www.warp.dev)

## What It Does

- Installs Scalar Dark/Light themes for each selected tool.
- Updates tool config where possible so switching works automatically.
- Keeps one shared palette across all tools.

## Manual Setup

### Ghostty

```bash
mkdir -p ~/.config/ghostty/themes
cp themes/ghostty/scalar-dark themes/ghostty/scalar-light ~/.config/ghostty/themes/
```

```conf
theme = dark:scalar-dark,light:scalar-light
```

### Neovim

```bash
cp themes/neovim/colors/scalar*.lua ~/.config/nvim/colors/
mkdir -p ~/.config/nvim/lua/lualine/themes
cp themes/neovim/lua/lualine/themes/scalar.lua ~/.config/nvim/lua/lualine/themes/
```

```lua
vim.cmd.colorscheme("scalar")
```

### Zed

```bash
cp themes/zed/scalar.json ~/.config/zed/themes/
```

```json
{
  "theme": {
    "mode": "system",
    "light": "Scalar Light",
    "dark": "Scalar Dark"
  }
}
```

### OpenCode

```bash
mkdir -p ~/.config/opencode/themes
cp themes/opencode/scalar-adaptive.json ~/.config/opencode/themes/
```

```json
{
  "theme": "scalar-adaptive"
}
```

### Warp

```bash
mkdir -p ~/.warp/themes
cp themes/warp/scalar_dark.yaml themes/warp/scalar_light.yaml ~/.warp/themes/
```

## Palette

Canonical colors are in `themes/palette.jsonc`.

<table>
<tr><th>Dark</th><th>Light</th></tr>
<tr><td>

| Role | Color |
|---|---|
| Background | `#2f2e2c` ![](https://placehold.co/16x16/2f2e2c/2f2e2c) |
| Surface | `#35342f` ![](https://placehold.co/16x16/35342f/35342f) |
| Highlight | `#4b4943` ![](https://placehold.co/16x16/4b4943/4b4943) |
| Foreground | `#d8d3ca` ![](https://placehold.co/16x16/d8d3ca/d8d3ca) |
| Secondary | `#b8b2a8` ![](https://placehold.co/16x16/b8b2a8/b8b2a8) |
| Muted | `#9b958b` ![](https://placehold.co/16x16/9b958b/9b958b) |
| Green | `#00b648` ![](https://placehold.co/16x16/00b648/00b648) |
| Red | `#e53b39` ![](https://placehold.co/16x16/e53b39/e53b39) |
| Yellow | `#ffc90d` ![](https://placehold.co/16x16/ffc90d/ffc90d) |
| Blue | `#4eb3ec` ![](https://placehold.co/16x16/4eb3ec/4eb3ec) |
| Cyan | `#42bfd3` ![](https://placehold.co/16x16/42bfd3/42bfd3) |
| Orange | `#ff8d4d` ![](https://placehold.co/16x16/ff8d4d/ff8d4d) |
| Purple | `#b191f9` ![](https://placehold.co/16x16/b191f9/b191f9) |

</td><td>

| Role | Color |
|---|---|
| Background | `#e6e6e6` ![](https://placehold.co/16x16/e6e6e6/e6e6e6) |
| Surface | `#e6e6e6` ![](https://placehold.co/16x16/e6e6e6/e6e6e6) |
| Highlight | `#d2d2d2` ![](https://placehold.co/16x16/d2d2d2/d2d2d2) |
| Foreground | `#1f1f1f` ![](https://placehold.co/16x16/1f1f1f/1f1f1f) |
| Secondary | `#5b5b5b` ![](https://placehold.co/16x16/5b5b5b/5b5b5b) |
| Muted | `#686868` ![](https://placehold.co/16x16/686868/686868) |
| Green | `#078657` ![](https://placehold.co/16x16/078657/078657) |
| Red | `#ef0006` ![](https://placehold.co/16x16/ef0006/ef0006) |
| Yellow | `#866300` ![](https://placehold.co/16x16/866300/866300) |
| Blue | `#007ac2` ![](https://placehold.co/16x16/007ac2/007ac2) |
| Cyan | `#00758a` ![](https://placehold.co/16x16/00758a/00758a) |
| Orange | `#cc4700` ![](https://placehold.co/16x16/cc4700/cc4700) |
| Purple | `#5203d1` ![](https://placehold.co/16x16/5203d1/5203d1) |

</td></tr>
</table>

```bash
npm run check:theme
```

## License

[MIT](LICENSE)
