import { createTheme } from '@mui/material/styles';

// Export a shared MUI theme for server-side style computations
const theme = createTheme({
  typography: {
    // Use the CSS variable for UntitledSans
    fontFamily: 'var(--font-untitled-sans, sans-serif)',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Ensure the root element uses the correct font
        '@global': {
          ':root': {
            '--font-untitled-sans': 'UntitledSans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          },
        },
      },
    },
    // Ensure all MUI components inherit the font
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'inherit',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'inherit',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: 'inherit',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'inherit',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: 'inherit',
        },
      },
    },
  },
});

export { theme };
