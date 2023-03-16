import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
  palette: {
    mode: 'dark', // Set the Material UI palette to dark mode
    primary: {
      main: '#2b3945', // Set your primary color
    },
  },
});

export default customTheme;