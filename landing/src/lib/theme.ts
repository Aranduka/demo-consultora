"use client";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#0D47A1", dark: "#002171", light: "#5472D3", contrastText: "#fff" },
    secondary: { main: "#1976D2" },
    background: { default: "#F5F8FC", paper: "#FFFFFF" },
    text: { primary: "#1A2433" },
    success: { main: "#2E7D32" },
    error: { main: "#C62828" },
  },
  shape: { borderRadius: 8 },
  typography: { fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif', button: { textTransform: "none", fontWeight: 500 } },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCard: { defaultProps: { elevation: 1 } },
    MuiTextField: { defaultProps: { size: "small", fullWidth: true } },
  },
});
