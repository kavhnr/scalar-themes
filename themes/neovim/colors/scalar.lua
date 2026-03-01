-- Scalar colorscheme for Neovim
-- Derived from the Scalar default theme palette
-- https://github.com/scalar/scalar
--
-- Supports both dark and light variants via vim.o.background.
-- Usage: :colorscheme scalar

vim.cmd("hi clear")

if vim.fn.exists("syntax_on") then
  vim.cmd("syntax reset")
end

vim.g.colors_name = "scalar"

-- ---------------------------------------------------------------------------
-- Palette
-- ---------------------------------------------------------------------------

local palettes = {
  dark = {
    bg        = "#0f0f0f",
    surface   = "#1a1a1a",
    highlight = "#272727",
    fg        = "#d6d6d6",
    secondary = "#9a9a9a",
    muted     = "#797979",
    green     = "#00b648",
    red       = "#e53b39",
    yellow    = "#ffc90d",
    blue      = "#4eb3ec",
    orange    = "#ff8d4d",
    purple    = "#b191f9",

    -- Derived colors for UI depth
    float_bg      = "#1a1a1a",
    float_border  = "#272727",
    visual        = "#2a2a3a",
    cursor_line   = "#1a1a1a",
    indent        = "#383838",
    indent_active = "#585858",
    line_nr       = "#797979",
    line_nr_cur   = "#d6d6d6",
    diff_add_bg   = "#0a2e1a",
    diff_change_bg = "#2a2a0a",
    diff_delete_bg = "#2e0a0a",
    search_bg     = "#3a3a0a",
    inc_search_bg = "#ffc90d",
    inc_search_fg = "#0f0f0f",
  },

  light = {
    bg        = "#ffffff",
    surface   = "#f6f6f6",
    highlight = "#e7e7e7",
    fg        = "#1b1b1b",
    secondary = "#757575",
    muted     = "#7d7d7d",
    green     = "#078657",
    red       = "#ef0006",
    yellow    = "#987100",
    blue      = "#007ac2",
    orange    = "#cc4700",
    purple    = "#5203d1",

    -- Derived colors for UI depth
    float_bg      = "#f6f6f6",
    float_border  = "#e7e7e7",
    visual        = "#d8d8e8",
    cursor_line   = "#f6f6f6",
    indent        = "#d7d7d7",
    indent_active = "#b8b8b8",
    line_nr       = "#7d7d7d",
    line_nr_cur   = "#1b1b1b",
    diff_add_bg   = "#d4f5e0",
    diff_change_bg = "#f5f0d4",
    diff_delete_bg = "#f5d4d4",
    search_bg     = "#f5f0d4",
    inc_search_bg = "#987100",
    inc_search_fg = "#1b1b1b",
  },
}

local defaults = {
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

---@param base table
---@param over table
---@return table
local function merge(base, over)
  local out = vim.deepcopy(base)
  for k, v in pairs(over or {}) do
    if type(v) == "table" and type(out[k]) == "table" then
      out[k] = merge(out[k], v)
    else
      out[k] = v
    end
  end
  return out
end

local opts = merge(defaults, vim.g.scalar_theme_config or {})

if type(vim.g.scalar_transparent) == "boolean" then
  opts.transparent = vim.g.scalar_transparent
end

local p = vim.deepcopy(palettes[vim.o.background] or palettes.dark)

local bg_main = opts.transparent and "NONE" or p.bg
local bg_surface = opts.transparent and "NONE" or p.surface
local bg_float = (opts.transparent and opts.transparent_floats) and "NONE" or p.float_bg
local bg_main_nc = (opts.dim_inactive and not opts.transparent) and p.surface or bg_main
local picker_path = vim.o.background == "light" and "#616161" or p.secondary
local picker_path_hidden = vim.o.background == "light" and "#707070" or p.muted

---@param name string
---@param fallback table
---@return table
local function style(name, fallback)
  local s = opts.styles and opts.styles[name]
  if s == false then
    return fallback
  end
  if type(s) == "table" then
    return vim.tbl_extend("force", fallback, s)
  end
  return fallback
end

-- ---------------------------------------------------------------------------
-- Helper
-- ---------------------------------------------------------------------------

--- Sets a highlight group.
--- @param group string
--- @param opts vim.api.keyset.highlight
local function hi(group, opts)
  vim.api.nvim_set_hl(0, group, opts)
end

-- ---------------------------------------------------------------------------
-- Core editor UI
-- ---------------------------------------------------------------------------

hi("Normal",        { fg = p.fg, bg = bg_main })
hi("NormalFloat",   { fg = p.fg, bg = bg_float })
hi("NormalNC",      { fg = p.fg, bg = bg_main_nc })
hi("NormalSB",      { fg = p.fg, bg = bg_surface })
hi("FloatBorder",   { fg = p.float_border, bg = bg_float })
hi("FloatTitle",    { fg = p.blue, bg = bg_float, bold = true })
hi("FloatFooter",   { fg = p.muted, bg = bg_float })
hi("FloatShadow",   { bg = p.bg, blend = 70 })
hi("FloatShadowThrough", { bg = p.bg, blend = 100 })

hi("CursorLine",    { bg = p.cursor_line })
hi("CursorLineNr",  { fg = p.line_nr_cur, bold = true })
hi("CursorColumn",  { bg = p.cursor_line })
hi("ColorColumn",   { bg = p.surface })

hi("LineNr",        { fg = p.line_nr })
hi("LineNrAbove",   { fg = p.line_nr })
hi("LineNrBelow",   { fg = p.line_nr })
hi("SignColumn",    { fg = p.muted, bg = bg_main })
hi("SignColumnSB",  { fg = p.muted, bg = bg_surface })
hi("FoldColumn",    { fg = p.muted, bg = bg_main })
hi("Folded",        { fg = p.secondary, bg = p.surface })

hi("Visual",        { bg = p.visual })
hi("VisualNOS",     { bg = p.visual })

hi("Search",        { fg = p.fg, bg = p.search_bg, reverse = false })
hi("IncSearch",     { fg = p.inc_search_fg, bg = p.inc_search_bg })
hi("CurSearch",     { fg = p.inc_search_fg, bg = p.orange })
hi("Substitute",    { fg = p.inc_search_fg, bg = p.red })

hi("MatchParen",    { fg = p.orange, bold = true, underline = true })

hi("Pmenu",         { fg = p.fg, bg = p.surface })
hi("PmenuSel",      { fg = p.fg, bg = p.highlight })
hi("PmenuSbar",     { bg = p.highlight })
hi("PmenuThumb",    { bg = p.muted })
hi("PmenuMatch",    { fg = p.blue, bold = true })
hi("PmenuMatchSel", { fg = p.blue, bg = p.highlight, bold = true })
hi("PmenuKind",     { fg = p.purple, bg = p.surface })
hi("PmenuKindSel",  { fg = p.purple, bg = p.highlight })
hi("PmenuBorder",   { fg = p.float_border, bg = p.surface })
hi("PmenuExtra",    { fg = p.secondary, bg = p.surface })
hi("PmenuExtraSel", { fg = p.secondary, bg = p.highlight })

hi("StatusLine",    { fg = p.fg, bg = p.surface })
hi("StatusLineNC",  { fg = p.muted, bg = p.surface })
hi("StatusLineTerm", { fg = p.fg, bg = p.surface })
hi("StatusLineTermNC", { fg = p.muted, bg = p.surface })
hi("TabLine",       { fg = p.muted, bg = bg_surface })
hi("TabLineFill",   { bg = bg_main })
hi("TabLineSel",    { fg = p.fg, bg = bg_main, bold = true })
hi("WinSeparator",  { fg = p.highlight })
hi("VertSplit",     { fg = p.highlight })
hi("WinBar",        { fg = p.fg, bg = bg_main, bold = true })
hi("WinBarNC",      { fg = p.muted, bg = bg_main })
hi("MsgSeparator",  { fg = p.highlight, bg = bg_main })

hi("Title",         { fg = p.blue, bold = true })
hi("ModeMsg",       { fg = p.blue, bold = true })
hi("MsgArea",       { fg = p.fg })
hi("MoreMsg",       { fg = p.green })
hi("Question",      { fg = p.green })
hi("ErrorMsg",      { fg = p.red, bold = true })
hi("WarningMsg",    { fg = p.yellow })

hi("NonText",       { fg = p.highlight })
hi("SpecialKey",    { fg = p.highlight })
hi("Whitespace",    { fg = p.highlight })
hi("EndOfBuffer",   { fg = opts.show_end_of_buffer and p.highlight or bg_main })
hi("Conceal",       { fg = p.muted })
hi("Directory",     { fg = p.blue })
hi("Cursor",        { fg = p.bg, bg = p.fg })
hi("CursorIM",      { link = "Cursor" })
hi("TermCursor",    { fg = p.bg, bg = p.fg })
hi("TermCursorNC",  { fg = p.bg, bg = p.secondary })

hi("SpellBad",      { undercurl = true, sp = p.red })
hi("SpellCap",      { undercurl = true, sp = p.yellow })
hi("SpellLocal",    { undercurl = true, sp = p.blue })
hi("SpellRare",     { undercurl = true, sp = p.purple })

hi("WildMenu",      { fg = p.fg, bg = p.highlight })
hi("QuickFixLine",  { bg = p.visual })
hi("SnippetTabstop", { bg = p.visual })

-- ---------------------------------------------------------------------------
-- Syntax baseline groups for broad plugin compatibility.
-- ---------------------------------------------------------------------------

hi("Comment",        style("comments", { fg = p.muted }))
hi("String",         { fg = p.blue })
hi("Character",      { fg = p.blue })
hi("Number",         { fg = p.orange })
hi("Boolean",        { fg = p.orange })
hi("Float",          { fg = p.orange })

hi("Identifier",     style("variables", { fg = p.fg }))
hi("Function",       style("functions", { fg = p.orange }))

hi("Statement",      { fg = p.purple })
hi("Conditional",    { fg = p.purple })
hi("Repeat",         { fg = p.purple })
hi("Label",          { fg = p.purple })
hi("Operator",       { fg = p.secondary })
hi("Keyword",        style("keywords", { fg = p.purple }))
hi("Exception",      { fg = p.purple })

hi("PreProc",        { fg = p.purple })
hi("Include",        { fg = p.purple })
hi("Define",         { fg = p.purple })
hi("Macro",          { fg = p.purple })
hi("PreCondit",      { fg = p.purple })

hi("Type",           { fg = p.green })
hi("StorageClass",   { fg = p.green })
hi("Structure",      { fg = p.green })
hi("Typedef",        { fg = p.green })

hi("Special",        { fg = p.orange })
hi("SpecialChar",    { fg = p.orange })
hi("Tag",            { fg = p.purple })
hi("Delimiter",      { fg = p.secondary })
hi("SpecialComment", style("comments", { fg = p.muted }))
hi("Debug",          { fg = p.orange })

hi("Underlined",     { fg = p.blue, underline = true })
hi("Ignore",         { fg = p.muted })
hi("Error",          { fg = p.red })
hi("Todo",           { fg = p.yellow, bold = true })
hi("Added",          { fg = p.green })
hi("Changed",        { fg = p.yellow })
hi("Removed",        { fg = p.red })

-- ---------------------------------------------------------------------------
-- Treesitter
--
-- Most groups fall back to the baseline syntax groups above.
-- We only override where Scalar's mapping differs.
-- ---------------------------------------------------------------------------

hi("@variable",            style("variables", { fg = p.fg }))
hi("@variable.builtin",    { fg = p.purple, italic = true })
hi("@variable.parameter",  style("variables", { fg = p.fg }))
hi("@variable.member",     style("variables", { fg = p.fg }))

hi("@constant",            { fg = p.fg, bold = true })
hi("@constant.builtin",    { fg = p.orange })
hi("@constant.macro",      { fg = p.purple })

hi("@module",              { fg = p.fg })
hi("@label",               { fg = p.purple })

hi("@string",              { fg = p.blue })
hi("@string.escape",       { fg = p.orange })
hi("@string.regexp",       { fg = p.orange })
hi("@string.special",      { fg = p.orange })
hi("@string.special.url",  { fg = p.blue, underline = true })

hi("@character",           { fg = p.blue })
hi("@boolean",             { fg = p.orange })
hi("@number",              { fg = p.orange })
hi("@number.float",        { fg = p.orange })

hi("@type",                { fg = p.green })
hi("@type.builtin",        { fg = p.green, italic = true })
hi("@type.definition",     { fg = p.green })

hi("@attribute",           { fg = p.purple })
hi("@attribute.builtin",   { fg = p.purple, italic = true })
hi("@property",            { fg = p.fg })

hi("@function",            style("functions", { fg = p.orange }))
hi("@function.builtin",    { fg = p.orange, italic = true })
hi("@function.call",       style("functions", { fg = p.orange }))
hi("@function.macro",      { fg = p.purple })
hi("@function.method",     style("functions", { fg = p.orange }))
hi("@function.method.call", style("functions", { fg = p.orange }))
hi("@constructor",         { fg = p.green })

hi("@operator",            { fg = p.secondary })

hi("@keyword",             style("keywords", { fg = p.purple }))
hi("@keyword.coroutine",   { fg = p.purple, italic = true })
hi("@keyword.function",    style("keywords", { fg = p.purple }))
hi("@keyword.operator",    { fg = p.secondary })
hi("@keyword.import",      style("keywords", { fg = p.purple }))
hi("@keyword.type",        { fg = p.green })
hi("@keyword.modifier",    style("keywords", { fg = p.purple }))
hi("@keyword.repeat",      style("keywords", { fg = p.purple }))
hi("@keyword.return",      style("keywords", { fg = p.purple }))
hi("@keyword.debug",       { fg = p.orange })
hi("@keyword.exception",   style("keywords", { fg = p.purple }))
hi("@keyword.conditional",          style("keywords", { fg = p.purple }))
hi("@keyword.conditional.ternary",  { fg = p.secondary })
hi("@keyword.directive",            style("keywords", { fg = p.purple }))
hi("@keyword.directive.define",     style("keywords", { fg = p.purple }))

hi("@punctuation.delimiter",  { fg = p.secondary })
hi("@punctuation.bracket",    { fg = p.secondary })
hi("@punctuation.special",    { fg = p.secondary })

hi("@comment",             style("comments", { fg = p.muted }))
hi("@comment.documentation", style("comments", { fg = p.muted }))
hi("@comment.error",       { fg = p.red, bold = true })
hi("@comment.warning",     { fg = p.yellow, bold = true })
hi("@comment.todo",        { fg = p.yellow, bold = true })
hi("@comment.note",        { fg = p.blue, bold = true })

hi("@markup.strong",       { bold = true })
hi("@markup.italic",       { italic = true })
hi("@markup.strikethrough", { strikethrough = true })
hi("@markup.underline",    { underline = true })
hi("@markup.heading",      { fg = p.blue, bold = true })
hi("@markup.quote",        { fg = p.muted, italic = true })
hi("@markup.math",         { fg = p.orange })
hi("@markup.link",         { fg = p.blue })
hi("@markup.link.label",   { fg = p.blue, underline = true })
hi("@markup.link.url",     { fg = p.blue, underline = true })
hi("@markup.raw",          { fg = p.green })
hi("@markup.raw.block",    { fg = p.fg })
hi("@markup.list",         { fg = p.secondary })
hi("@markup.list.checked", { fg = p.green })
hi("@markup.list.unchecked", { fg = p.muted })

hi("@diff.plus",           { fg = p.green })
hi("@diff.minus",          { fg = p.red })
hi("@diff.delta",          { fg = p.yellow })

hi("@tag",                 { fg = p.purple })
hi("@tag.builtin",         { fg = p.purple })
hi("@tag.attribute",       { fg = p.orange })
hi("@tag.delimiter",       { fg = p.secondary })

-- LSP semantic token defaults
hi("@lsp.type.class",          { link = "@type" })
hi("@lsp.type.comment",        { link = "@comment" })
hi("@lsp.type.decorator",      { link = "@attribute" })
hi("@lsp.type.enum",           { link = "@type" })
hi("@lsp.type.enumMember",     { link = "@constant" })
hi("@lsp.type.event",          { link = "@type" })
hi("@lsp.type.function",       { link = "@function" })
hi("@lsp.type.interface",      { link = "@type" })
hi("@lsp.type.keyword",        { link = "@keyword" })
hi("@lsp.type.macro",          { link = "@function.macro" })
hi("@lsp.type.method",         { link = "@function.method" })
hi("@lsp.type.modifier",       { link = "@keyword.modifier" })
hi("@lsp.type.namespace",      { link = "@module" })
hi("@lsp.type.number",         { link = "@number" })
hi("@lsp.type.operator",       { link = "@operator" })
hi("@lsp.type.parameter",      { link = "@variable.parameter" })
hi("@lsp.type.property",       { link = "@property" })
hi("@lsp.type.regexp",         { link = "@string.regexp" })
hi("@lsp.type.string",         { link = "@string" })
hi("@lsp.type.struct",         { link = "@type" })
hi("@lsp.type.type",           { link = "@type" })
hi("@lsp.type.typeParameter",  { link = "@type.definition" })
hi("@lsp.type.variable",       { link = "@variable" })

-- ---------------------------------------------------------------------------
-- LSP diagnostics
-- ---------------------------------------------------------------------------

hi("DiagnosticError",             { fg = p.red })
hi("DiagnosticWarn",              { fg = p.yellow })
hi("DiagnosticInfo",              { fg = p.blue })
hi("DiagnosticHint",              { fg = p.muted })
hi("DiagnosticOk",                { fg = p.green })

hi("DiagnosticVirtualTextError",  { fg = p.red, italic = true })
hi("DiagnosticVirtualTextWarn",   { fg = p.yellow, italic = true })
hi("DiagnosticVirtualTextInfo",   { fg = p.blue, italic = true })
hi("DiagnosticVirtualTextHint",   { fg = p.muted, italic = true })
hi("DiagnosticVirtualLinesError", { fg = p.red })
hi("DiagnosticVirtualLinesWarn",  { fg = p.yellow })
hi("DiagnosticVirtualLinesInfo",  { fg = p.blue })
hi("DiagnosticVirtualLinesHint",  { fg = p.muted })

hi("DiagnosticUnderlineError",    { undercurl = true, sp = p.red })
hi("DiagnosticUnderlineWarn",     { undercurl = true, sp = p.yellow })
hi("DiagnosticUnderlineInfo",     { undercurl = true, sp = p.blue })
hi("DiagnosticUnderlineHint",     { undercurl = true, sp = p.muted })
hi("DiagnosticUnderlineOk",       { undercurl = true, sp = p.green })

hi("DiagnosticFloatingError",     { fg = p.red })
hi("DiagnosticFloatingWarn",      { fg = p.yellow })
hi("DiagnosticFloatingInfo",      { fg = p.blue })
hi("DiagnosticFloatingHint",      { fg = p.muted })

hi("DiagnosticSignError",         { fg = p.red })
hi("DiagnosticSignWarn",          { fg = p.yellow })
hi("DiagnosticSignInfo",          { fg = p.blue })
hi("DiagnosticSignHint",          { fg = p.muted })
hi("DiagnosticSignOk",            { fg = p.green })

-- LSP references
hi("LspReferenceText",            { bg = p.highlight })
hi("LspReferenceRead",            { bg = p.highlight })
hi("LspReferenceWrite",           { bg = p.highlight, bold = true })
hi("LspSignatureActiveParameter", { fg = p.orange, bold = true })
hi("LspCodeLens",                 { fg = p.muted })
hi("LspCodeLensSeparator",        { fg = p.highlight })
hi("LspInlayHint",                { fg = p.muted, italic = true })

-- ---------------------------------------------------------------------------
-- Diff
-- ---------------------------------------------------------------------------

hi("DiffAdd",      { bg = p.diff_add_bg })
hi("DiffChange",   { bg = p.diff_change_bg })
hi("DiffDelete",   { bg = p.diff_delete_bg })
hi("DiffText",     { bg = p.diff_change_bg, bold = true })

-- ---------------------------------------------------------------------------
-- Git signs (gitsigns.nvim)
-- ---------------------------------------------------------------------------

hi("GitSignsAdd",          { fg = p.green })
hi("GitSignsChange",       { fg = p.yellow })
hi("GitSignsDelete",       { fg = p.red })
hi("GitSignsAddNr",        { fg = p.green })
hi("GitSignsChangeNr",     { fg = p.yellow })
hi("GitSignsDeleteNr",     { fg = p.red })
hi("GitSignsAddLn",        { bg = p.diff_add_bg })
hi("GitSignsChangeLn",     { bg = p.diff_change_bg })
hi("GitSignsDeleteLn",     { bg = p.diff_delete_bg })

-- ---------------------------------------------------------------------------
-- Telescope
-- ---------------------------------------------------------------------------

hi("TelescopeNormal",        { fg = p.fg, bg = bg_float })
hi("TelescopeBorder",        { fg = p.float_border, bg = bg_float })
hi("TelescopeTitle",         { fg = p.blue, bold = true })
hi("TelescopePromptNormal",  { fg = p.fg, bg = p.surface })
hi("TelescopePromptBorder",  { fg = p.float_border, bg = p.surface })
hi("TelescopePromptTitle",   { fg = p.blue, bg = p.surface, bold = true })
hi("TelescopeResultsNormal", { fg = p.fg, bg = bg_float })
hi("TelescopeResultsBorder", { fg = p.float_border, bg = bg_float })
hi("TelescopeResultsComment", { fg = picker_path })
hi("TelescopeResultsSpecialComment", { fg = picker_path })
hi("TelescopePreviewNormal", { fg = p.fg, bg = p.bg })
hi("TelescopePreviewBorder", { fg = p.float_border, bg = p.bg })
hi("TelescopeMatching",      { fg = p.blue, bold = true })
hi("TelescopeSelection",     { bg = p.highlight })

-- ---------------------------------------------------------------------------
-- Neo-tree
-- ---------------------------------------------------------------------------

hi("NeoTreeNormal",         { fg = p.fg, bg = p.surface })
hi("NeoTreeNormalNC",       { fg = p.fg, bg = p.surface })
hi("NeoTreeDimText",        { fg = p.muted })
hi("NeoTreeFileName",       { fg = p.fg })
hi("NeoTreeGitModified",    { fg = p.yellow })
hi("NeoTreeGitAdded",       { fg = p.green })
hi("NeoTreeGitDeleted",     { fg = p.red })
hi("NeoTreeGitConflict",    { fg = p.red, bold = true })
hi("NeoTreeGitUntracked",   { fg = p.orange })
hi("NeoTreeIndentMarker",   { fg = p.highlight })
hi("NeoTreeRootName",       { fg = p.blue, bold = true })

-- ---------------------------------------------------------------------------
-- Bufferline
-- ---------------------------------------------------------------------------

hi("BufferLineBackground",       { fg = p.muted, bg = p.surface })
hi("BufferLineFill",              { bg = p.bg })
hi("BufferLineSelected",         { fg = p.fg, bg = p.bg, bold = true })
hi("BufferLineVisible",          { fg = p.muted, bg = p.surface })
hi("BufferLineSeparator",        { fg = p.bg, bg = p.surface })
hi("BufferLineIndicatorSelected", { fg = p.blue, bg = p.bg })
hi("BufferLineModified",         { fg = p.yellow })
hi("BufferLineTab",              { fg = p.muted, bg = p.surface })
hi("BufferLineTabSelected",      { fg = p.fg, bg = p.bg, bold = true })

-- ---------------------------------------------------------------------------
-- Which-key
-- ---------------------------------------------------------------------------

hi("WhichKey",          { fg = p.orange })
hi("WhichKeyGroup",     { fg = p.blue })
hi("WhichKeyDesc",      { fg = p.fg })
hi("WhichKeySeparator",  { fg = p.muted })
hi("WhichKeyFloat",     { bg = bg_float })
hi("WhichKeyBorder",    { fg = p.float_border, bg = bg_float })
hi("WhichKeyValue",     { fg = p.secondary })

-- ---------------------------------------------------------------------------
-- Indent blankline
-- ---------------------------------------------------------------------------

hi("IblIndent",                  { fg = p.indent })
hi("IblScope",                   { fg = p.indent_active })
hi("IndentBlanklineChar",        { fg = p.indent })
hi("IndentBlanklineContextChar", { fg = p.indent_active })

-- ---------------------------------------------------------------------------
-- Noice
-- ---------------------------------------------------------------------------

hi("NoiceCmdline",             { fg = p.fg, bg = bg_float })
hi("NoiceCmdlineIcon",         { fg = p.blue })
hi("NoiceCmdlinePopup",        { fg = p.fg, bg = bg_float })
hi("NoiceCmdlinePopupBorder",  { fg = p.float_border, bg = bg_float })
hi("NoiceConfirm",             { fg = p.fg, bg = bg_float })
hi("NoiceConfirmBorder",       { fg = p.float_border, bg = bg_float })
hi("NoiceMini",                { fg = p.fg, bg = p.surface })
hi("NoiceFormatProgressDone",  { fg = p.bg, bg = p.blue })
hi("NoiceFormatProgressTodo",  { fg = p.fg, bg = p.surface })

-- ---------------------------------------------------------------------------
-- Notify
-- ---------------------------------------------------------------------------

hi("NotifyERRORBorder", { fg = p.red })
hi("NotifyWARNBorder",  { fg = p.yellow })
hi("NotifyINFOBorder",  { fg = p.blue })
hi("NotifyDEBUGBorder", { fg = p.muted })
hi("NotifyTRACEBorder", { fg = p.purple })
hi("NotifyERRORIcon",   { fg = p.red })
hi("NotifyWARNIcon",    { fg = p.yellow })
hi("NotifyINFOIcon",    { fg = p.blue })
hi("NotifyDEBUGIcon",   { fg = p.muted })
hi("NotifyTRACEIcon",   { fg = p.purple })
hi("NotifyERRORTitle",  { fg = p.red, bold = true })
hi("NotifyWARNTitle",   { fg = p.yellow, bold = true })
hi("NotifyINFOTitle",   { fg = p.blue, bold = true })
hi("NotifyDEBUGTitle",  { fg = p.muted, bold = true })
hi("NotifyTRACETitle",  { fg = p.purple, bold = true })
hi("NotifyERRORBody",   { fg = p.fg })
hi("NotifyWARNBody",    { fg = p.fg })
hi("NotifyINFOBody",    { fg = p.fg })
hi("NotifyDEBUGBody",   { fg = p.fg })
hi("NotifyTRACEBody",   { fg = p.fg })

-- ---------------------------------------------------------------------------
-- Mini
-- ---------------------------------------------------------------------------

hi("MiniCursorword",             { bg = p.highlight })
hi("MiniIndentscopeSymbol",      { fg = p.purple })
hi("MiniIconsAzure",             { fg = p.blue })
hi("MiniIconsBlue",              { fg = p.blue })
hi("MiniIconsCyan",              { fg = p.blue })
hi("MiniIconsGreen",             { fg = p.green })
hi("MiniIconsGrey",              { fg = p.muted })
hi("MiniIconsOrange",            { fg = p.orange })
hi("MiniIconsPurple",            { fg = p.purple })
hi("MiniIconsRed",               { fg = p.red })
hi("MiniIconsYellow",            { fg = p.yellow })

hi("MiniStatuslineFilename",     { fg = p.fg, bg = p.surface })
hi("MiniStatuslineDevinfo",      { fg = p.secondary, bg = p.surface })
hi("MiniStatuslineFileinfo",     { fg = p.secondary, bg = p.surface })
hi("MiniStatuslineModeNormal",   { fg = p.bg, bg = p.blue, bold = true })
hi("MiniStatuslineModeInsert",   { fg = p.bg, bg = p.green, bold = true })
hi("MiniStatuslineModeVisual",   { fg = p.bg, bg = p.purple, bold = true })
hi("MiniStatuslineModeCommand",  { fg = p.bg, bg = p.orange, bold = true })
hi("MiniStatuslineModeReplace",  { fg = p.bg, bg = p.red, bold = true })
hi("MiniStatuslineModeOther",    { fg = p.bg, bg = p.muted, bold = true })

-- ---------------------------------------------------------------------------
-- Flash
-- ---------------------------------------------------------------------------

hi("FlashBackdrop",  { fg = p.muted })
hi("FlashMatch",     { fg = p.fg, bg = p.highlight })
hi("FlashCurrent",   { fg = p.fg, bg = p.visual })
hi("FlashLabel",     { fg = p.bg, bg = p.orange, bold = true })

-- ---------------------------------------------------------------------------
-- Trouble
-- ---------------------------------------------------------------------------

hi("TroubleNormal",   { fg = p.fg, bg = p.surface })
hi("TroubleNormalNC", { fg = p.fg, bg = p.surface })
hi("TroubleText",     { fg = p.fg })
hi("TroubleCount",    { fg = p.purple, bold = true })

-- ---------------------------------------------------------------------------
-- Snacks (LazyVim dashboard, notifications, etc.)
-- ---------------------------------------------------------------------------

hi("SnacksDashboardHeader",  { fg = p.blue })
hi("SnacksDashboardKey",     { fg = p.orange })
hi("SnacksDashboardDesc",    { fg = p.fg })
hi("SnacksDashboardIcon",    { fg = p.blue })
hi("SnacksDashboardFooter",  { fg = p.muted, italic = true })
hi("SnacksNotifierHistory",  { fg = p.fg, bg = p.surface })

hi("SnacksPickerFile",       { fg = p.fg, bold = true })
hi("SnacksPickerDirectory",  { fg = p.blue })
hi("SnacksPickerDir",        { fg = picker_path })
hi("SnacksPickerPathHidden", { fg = picker_path_hidden })
hi("SnacksPickerPathIgnored", { fg = picker_path_hidden })
hi("SnacksPickerComment",    { fg = picker_path })
hi("SnacksPickerDesc",       { fg = picker_path })
hi("SnacksPickerDelim",      { fg = p.secondary })
hi("SnacksPickerPrompt",     { fg = p.orange, bold = true })
hi("SnacksPickerInputSearch", { fg = p.purple })
hi("SnacksPickerMatch",      { fg = p.blue, bold = true })

-- ---------------------------------------------------------------------------
-- blink.cmp (completion)
-- ---------------------------------------------------------------------------

hi("BlinkCmpMenu",           { fg = p.fg, bg = p.surface })
hi("BlinkCmpMenuBorder",     { fg = p.float_border, bg = p.surface })
hi("BlinkCmpMenuSelection",  { bg = p.highlight })
hi("BlinkCmpLabel",          { fg = p.fg })
hi("BlinkCmpLabelMatch",     { fg = p.blue, bold = true })
hi("BlinkCmpKind",           { fg = p.purple })
hi("BlinkCmpDoc",            { fg = p.fg, bg = bg_float })
hi("BlinkCmpDocBorder",      { fg = p.float_border, bg = bg_float })

-- ---------------------------------------------------------------------------
-- nvim-cmp
-- ---------------------------------------------------------------------------

hi("CmpItemAbbr",              { fg = p.fg })
hi("CmpItemAbbrMatch",         { fg = p.blue, bold = true })
hi("CmpItemAbbrMatchFuzzy",    { fg = p.blue, underline = true })
hi("CmpItemAbbrDeprecated",    { fg = p.muted, strikethrough = true })
hi("CmpItemMenu",              { fg = p.secondary })
hi("CmpItemKind",              { fg = p.purple })
hi("CmpGhostText",             { fg = p.muted, italic = true })

hi("CmpItemKindText",          { fg = p.secondary })
hi("CmpItemKindMethod",        { fg = p.orange })
hi("CmpItemKindFunction",      { fg = p.orange })
hi("CmpItemKindConstructor",   { fg = p.green })
hi("CmpItemKindField",         { fg = p.fg })
hi("CmpItemKindVariable",      { fg = p.fg })
hi("CmpItemKindClass",         { fg = p.green })
hi("CmpItemKindInterface",     { fg = p.green })
hi("CmpItemKindModule",        { fg = p.blue })
hi("CmpItemKindProperty",      { fg = p.fg })
hi("CmpItemKindUnit",          { fg = p.secondary })
hi("CmpItemKindValue",         { fg = p.orange })
hi("CmpItemKindEnum",          { fg = p.green })
hi("CmpItemKindKeyword",       { fg = p.purple })
hi("CmpItemKindSnippet",       { fg = p.blue })
hi("CmpItemKindColor",         { fg = p.orange })
hi("CmpItemKindFile",          { fg = p.blue })
hi("CmpItemKindReference",     { fg = p.secondary })
hi("CmpItemKindFolder",        { fg = p.blue })
hi("CmpItemKindEnumMember",    { fg = p.orange })
hi("CmpItemKindConstant",      { fg = p.orange })
hi("CmpItemKindStruct",        { fg = p.green })
hi("CmpItemKindEvent",         { fg = p.purple })
hi("CmpItemKindOperator",      { fg = p.secondary })
hi("CmpItemKindTypeParameter", { fg = p.green })

-- ---------------------------------------------------------------------------
-- lazy.nvim and mason.nvim
-- ---------------------------------------------------------------------------

hi("LazyNormal",               { fg = p.fg, bg = bg_float })
hi("LazyButton",               { fg = p.fg, bg = p.surface })
hi("LazyButtonActive",         { fg = p.fg, bg = p.highlight, bold = true })
hi("LazyComment",              { fg = p.muted, italic = true })
hi("LazyReasonPlugin",         { fg = p.purple })
hi("LazyReasonRuntime",        { fg = p.blue })
hi("LazyReasonEvent",          { fg = p.orange })
hi("LazyReasonKeys",           { fg = p.yellow })
hi("LazyReasonStart",          { fg = p.green })
hi("LazyProgressDone",         { fg = p.green })
hi("LazyProgressTodo",         { fg = p.muted })

hi("MasonNormal",              { fg = p.fg, bg = bg_float })
hi("MasonHeader",              { fg = p.bg, bg = p.blue, bold = true })
hi("MasonHeaderSecondary",     { fg = p.bg, bg = p.purple, bold = true })
hi("MasonHighlight",           { fg = p.blue })
hi("MasonHighlightBlock",      { fg = p.bg, bg = p.blue })
hi("MasonHighlightBlockBold",  { fg = p.bg, bg = p.blue, bold = true })
hi("MasonMuted",               { fg = p.muted })
hi("MasonMutedBlock",          { fg = p.muted, bg = p.surface })

-- ---------------------------------------------------------------------------
-- Navic and treesitter-context
-- ---------------------------------------------------------------------------

hi("NavicText",                { fg = p.secondary })
hi("NavicSeparator",           { fg = p.muted })
hi("NavicIconsFile",           { fg = p.blue })
hi("NavicIconsModule",         { fg = p.blue })
hi("NavicIconsNamespace",      { fg = p.blue })
hi("NavicIconsPackage",        { fg = p.blue })
hi("NavicIconsClass",          { fg = p.green })
hi("NavicIconsMethod",         { fg = p.orange })
hi("NavicIconsProperty",       { fg = p.fg })
hi("NavicIconsField",          { fg = p.fg })
hi("NavicIconsConstructor",    { fg = p.green })
hi("NavicIconsEnum",           { fg = p.green })
hi("NavicIconsInterface",      { fg = p.green })
hi("NavicIconsFunction",       { fg = p.orange })
hi("NavicIconsVariable",       { fg = p.fg })
hi("NavicIconsConstant",       { fg = p.orange })
hi("NavicIconsString",         { fg = p.blue })
hi("NavicIconsNumber",         { fg = p.orange })
hi("NavicIconsBoolean",        { fg = p.orange })
hi("NavicIconsArray",          { fg = p.green })
hi("NavicIconsObject",         { fg = p.green })
hi("NavicIconsKey",            { fg = p.purple })
hi("NavicIconsNull",           { fg = p.muted })
hi("NavicIconsEnumMember",     { fg = p.orange })
hi("NavicIconsStruct",         { fg = p.green })
hi("NavicIconsEvent",          { fg = p.purple })
hi("NavicIconsOperator",       { fg = p.secondary })
hi("NavicIconsTypeParameter",  { fg = p.green })

hi("TreesitterContext",        { bg = p.cursor_line })
hi("TreesitterContextLineNumber", { fg = p.secondary, bg = p.cursor_line })
hi("TreesitterContextBottom",  { sp = p.highlight, underline = true })

if opts.terminal_colors then
  local tc = {
    p.surface,
    p.red,
    p.green,
    p.yellow,
    p.blue,
    p.purple,
    p.blue,
    p.secondary,
    p.muted,
    p.orange,
    p.green,
    p.yellow,
    p.blue,
    p.purple,
    p.blue,
    p.fg,
  }

  for i, color in ipairs(tc) do
    vim.g["terminal_color_" .. tostring(i - 1)] = color
  end
end

-- vim: set ts=2 sw=2 et:
