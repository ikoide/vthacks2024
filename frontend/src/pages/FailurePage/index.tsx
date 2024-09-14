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

const FailurePage: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box className="trade-expired-page">
        <Paper className="section" elevation={3}>
          <Typography variant="h4" gutterBottom>
            Trade Expired
          </Typography>
          <Typography variant="body1" gutterBottom>
            The trade has expired due to inactivity. Please try initiating the trade again.
          </Typography>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default FailurePage;
