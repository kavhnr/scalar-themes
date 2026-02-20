-- Scalar lualine theme
-- Auto-discovered by lualine when scalar colorscheme is active.
-- Derives colors from the same Scalar palette as the main colorscheme.

local palettes = {
  dark = {
    bg      = "#0f0f0f",
    surface = "#1a1a1a",
    fg      = "#e7e7e7",
    muted   = "#797979",
    green   = "#00b648",
    red     = "#e53b39",
    yellow  = "#ffc90d",
    blue    = "#4eb3ec",
    orange  = "#ff8d4d",
    purple  = "#b191f9",
  },
  light = {
    bg      = "#ffffff",
    surface = "#f6f6f6",
    fg      = "#1b1b1b",
    muted   = "#7d7d7d",
    green   = "#078657",
    red     = "#ef0006",
    yellow  = "#987100",
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
