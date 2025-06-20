import { createTheme } from '@mui/material/styles';

// Export a shared MUI theme for server-side style computations
const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-untitled-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--font-untitled-sans': 'UntitledSans',
        },
        body: {
          fontFamily: 'var(--font-untitled-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      },
    },
  },
});
export { theme };
