import { createTheme } from '@mui/material/styles';

export const campusTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#102a43',
      contrastText: '#f8fafc',
    },
    secondary: {
      main: '#0f766e',
    },
    background: {
      default: '#f4f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#102a43',
      secondary: '#52647a',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: '"Segoe UI Variable", "Trebuchet MS", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    h3: {
      fontWeight: 750,
      letterSpacing: '-0.025em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.94))',
          border: '1px solid rgba(16, 42, 67, 0.08)',
          boxShadow: '0 16px 50px rgba(15, 23, 42, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 999,
        },
      },
    },
  },
});
