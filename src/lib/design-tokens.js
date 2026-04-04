// ── DESIGN TOKENS ──────────────────────────────
// Centralized design system for consistent styling across the application

export const T = {
  bg:        "#0c0e14",
  surface:   "#12151f",
  surface2:  "#181c28",
  border:    "rgba(255,255,255,0.07)",
  borderHi:  "rgba(255,255,255,0.14)",
  accent:    "#7c3aed",
  accentLo:  "rgba(124,58,237,0.15)",
  accentGlow:"rgba(124,58,237,0.35)",
  accentHi:  "#9f6ef5",
  green:     "#10b981",
  greenLo:   "rgba(16,185,129,0.12)",
  amber:     "#f59e0b",
  amberLo:   "rgba(245,158,11,0.12)",
  red:       "#ef4444",
  redLo:     "rgba(239,68,68,0.12)",
  text:      "#f1f5f9",
  muted:     "#64748b",
  muted2:    "#334155",
  mono:      "'DM Mono', 'Fira Code', monospace",
  display:   "'Cabinet Grotesk', 'DM Sans', sans-serif",
};

// ── DIFFICULTY CONFIGURATIONS ──────────────────
export const DIFF = {
  Easy:    { color: T.green,  lo: T.greenLo, border: "rgba(16,185,129,0.3)",  xp: "5–20",   label: "Easy"    },
  Hard:    { color: T.amber,  lo: T.amberLo, border: "rgba(245,158,11,0.3)",  xp: "21–60",  label: "Hard"    },
  Extreme: { color: T.red,    lo: T.redLo,   border: "rgba(239,68,68,0.3)",   xp: "61–110", label: "Extreme" },
};

// ── LANGUAGE CONFIGURATIONS ────────────────────
export const LANG = {
  python:     { emoji: "🐍", name: "Python",     sub: "v3.10 · Stable" },
  javascript: { emoji: "⚡", name: "JavaScript",  sub: "Node 18 · Beta" },
};