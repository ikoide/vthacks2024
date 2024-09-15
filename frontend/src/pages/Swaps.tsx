import { Card, CardContent, ThemeProvider, Typography } from '@mui/material';
import { dark } from '@mui/material/styles/createPalette';

export const Swaps = () => {
  return (
    <ThemeProvider theme={dark}>
    <Card 
      sx={{ display: 'flex', flexDirection: 'row', border: '1px solid', borderColor: 'grey.500', padding: '16px' }} 
      variant="outlined"
    >
      <CardContent>
        <Typography variant="h6" color="text.primary">
          Swap Content
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is a description or content for the swap card.
        </Typography>
      </CardContent>
    </Card>
    </ThemeProvider>
  );
}

export default Swaps;
