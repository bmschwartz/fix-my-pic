import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#f0f4f8', // grayish blue color
    },
    primary: {
      main: '#000000', // Set primary color to black
    },
    secondary: {
      main: '#ffffff', // Optional: Set secondary color to white or any other color
    },
    info: {
      main: '#e7e7e7', // Optional: Set info color to black or any other color
    },
  },
});

export default theme;
