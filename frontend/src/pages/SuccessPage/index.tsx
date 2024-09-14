import React from 'react';
import {
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
  Box,
} from '@mui/material';
import '../../components/styles/styles.scss';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const SuccessPage: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box className="trade-success-page">
        <Paper className="section" elevation={3}>
          <Typography variant="h4" gutterBottom>
            Trade Complete
          </Typography>
          <Typography variant="body1" gutterBottom>
            Your trade has been successfully completed. Please verify the changes on Hokie Spa.
          </Typography>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default SuccessPage;
