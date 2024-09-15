import { Card, CardContent, createTheme, ThemeProvider, Typography, Box } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const Swaps: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{
        mt: 6,
          display: 'flex',
          justifyContent: 'center', // Centers the card horizontally
        }}>
      <Box
        sx={{
          flexDirection: 'row',
          width: 600,
          padding: "0.5rem"
        }}
      >
        <Typography sx={{color: "white", fontWeight: 600, pb: 3}} variant='h3'>Hello, Imran 🫣</Typography>
        <Card
          variant="elevation"
        >
          <CardContent>
          <Typography variant="body2" color='text.secondary'>SWAP: 19c42ca7-c08b-40f5-9213-e0e1fb972a97</Typography>
            <Typography variant="h6" color="text.primary" sx={{mb: -1}}>
              CS 2104 {`→`} CHEM 1035
            </Typography>
          </CardContent>
        </Card>
      </Box>
      </Box>
    </ThemeProvider>
  );
}
