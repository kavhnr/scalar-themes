-- Scalar lualine theme
-- Auto-discovered by lualine when scalar colorscheme is active.
-- Derives colors from the same Scalar palette as the main colorscheme.

local palettes = {
  dark = {
    bg      = "#2f2e2c",
    surface = "#35342f",
    fg      = "#d8d3ca",
    muted   = "#9b958b",
    green   = "#00b648",
    red     = "#e53b39",
    yellow  = "#ffc90d",
    blue    = "#4eb3ec",
    orange  = "#ff8d4d",
    purple  = "#b191f9",
  },
  light = {
    bg      = "#e6e6e6",
    surface = "#d2d2d2",
    fg      = "#1f1f1f",
    muted   = "#686868",
    green   = "#078657",
    red     = "#ef0006",
    yellow  = "#866300",
    blue    = "#007ac2",
    orange  = "#cc4700",
    purple  = "#5203d1",
  },
}

local p = palettes[vim.o.background] or palettes.dark

return {
  normal = {
    a = { fg = p.bg, bg = p.blue, gui = "bold" },
    b = { fg = p.fg, bg = p.surface },
    c = { fg = p.muted, bg = p.bg },
  },
  insert = {
    a = { fg = p.bg, bg = p.green, gui = "bold" },
  },
  visual = {
    a = { fg = p.bg, bg = p.purple, gui = "bold" },
  },
  replace = {
    a = { fg = p.bg, bg = p.red, gui = "bold" },
  },
  command = {
    a = { fg = p.bg, bg = p.orange, gui = "bold" },
  },
  inactive = {
    a = { fg = p.muted, bg = p.surface },
    b = { fg = p.muted, bg = p.surface },
    c = { fg = p.muted, bg = p.bg },
  },
}

-- vim: set ts=2 sw=2 et:
