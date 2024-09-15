import React from 'react';
import {
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./styles/styles.scss"

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const ThankYouPage: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box className="thank-you-page">
        <Paper className="section" elevation={3}>
          <Typography variant="h4" gutterBottom>
            Thank You!
          </Typography>
          <br></br>
          <Typography variant="body1" gutterBottom>
            Thank you for submitting your course swap request. You will receive an email when a match is found.
          </Typography>
        <br></br>
        <Typography variant="body2" gutterBottom>
            To continue editing your courses, click <Link href="https://hokieswap.com/add-drop">here</Link>.
          </Typography>
          <br></br>
          <br></br>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="faq-content"
              id="faq-header"
            >
              <Typography variant="h6">How do I complete my swap?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                To complete your swap, follow these steps:
                <ol>
                  <li>Install the Cookie Editor extension from the Chrome Web Store:  
                    <br />
                    <Link href="https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm" target="_blank" rel="noopener noreferrer">Cookie Editor</Link>.
                  </li>
                  <li>Log into Hokie Spa within 10 minutes of receiving the email notification.</li>
                  <li>Click on the Cookie Editor icon in your browser toolbar and press the bottom-right <strong>Export</strong> button to save your cookies as a JSON file.</li>
                  <li>Return to our website and paste in the JSON containing your cookies in the designated field.</li>
                  <li>Once the other people have completed same steps, the trade will be executed automatically.</li>
                </ol>
                If you need further assistance, please contact our support team.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default ThankYouPage;
