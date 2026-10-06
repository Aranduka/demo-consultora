"use client";
import { createTheme } from "@mui/material/styles";

// Tokens (guía ui-ux-pro-max: azul/marino de confianza, contraste AA, ritmo de 8px, objetivos táctiles ≥44px)
export const brand = {
  navy: "#0B1B3A",
  blue: "#0D47A1",
  blueSoft: "#E8F0FE",
  accent: "#0369A1",
  bg: "#F4F7FB",
  line: "#E3E8F0",
  ink: "#0F172A",
  muted: "#475569",
};

export const theme = createTheme({
  palette: {
    primary: { main: brand.blue, dark: "#0A2E6E", light: "#3B6FD4", contrastText: "#fff" },
    secondary: { main: brand.accent },
    background: { default: brand.bg, paper: "#FFFFFF" },
    text: { primary: brand.ink, secondary: brand.muted },
    divider: brand.line,
    success: { main: "#15803D" },
    warning: { main: "#B45309" },
    error: { main: "#B91C1C" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'var(--font-jakarta), "Plus Jakarta Sans", Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700, letterSpacing: "-0.01em" },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { overscrollBehaviorY: "contain", WebkitFontSmoothing: "antialiased" },
        "@media (prefers-reduced-motion: reduce)": { "*, *::before, *::after": { animation: "none !important", transition: "none !important" } },
      },
    },
    MuiButtonBase: { defaultProps: { disableRipple: false }, styleOverrides: { root: { "&.Mui-focusVisible": { outline: `3px solid ${brand.blue}55`, outlineOffset: 2 } } } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { minHeight: 44, borderRadius: 12, paddingInline: 20, transition: "all .15s ease" }, sizeLarge: { minHeight: 52, fontSize: "1rem" }, sizeSmall: { minHeight: 36 } },
    },
    MuiIconButton: { styleOverrides: { root: { width: 40, height: 40 } } },
    MuiCard: { defaultProps: { elevation: 0 }, styleOverrides: { root: { borderRadius: 16, border: `1px solid ${brand.line}`, boxShadow: "0 1px 2px rgba(15,23,42,.04), 0 4px 16px rgba(15,23,42,.04)" } } },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: 16 } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiTextField: { defaultProps: { fullWidth: true } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 12, backgroundColor: "#fff", minHeight: 48 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 20 } } },
    MuiTableCell: { styleOverrides: { root: { borderColor: brand.line, paddingBlock: 14 }, head: { fontWeight: 700, color: brand.muted, fontSize: ".75rem", letterSpacing: ".04em", textTransform: "uppercase", backgroundColor: "#F8FAFD" } } },
    MuiTableRow: { styleOverrides: { root: { "&:last-child td": { borderBottom: 0 } } } },
    MuiTab: { styleOverrides: { root: { minHeight: 48, fontWeight: 600 } } },
    MuiToggleButton: { styleOverrides: { root: { textTransform: "none", borderRadius: 12 } } },
  },
});
