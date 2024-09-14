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
          <Typography variant="body1" gutterBottom>
            Thank you for submitting your course swap request. You will receive an email when a match is found.
          </Typography>
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
                To complete your swap:
                <ol>
                  <li>Log into Hokie Spa within 10 minutes of receiving the email notification.</li>
                  <li>Copy your session cookies:
                    <ol type="a">
                      <li>Open your web browser and navigate to Hokie Spa.</li>
                      <li>Open the developer tools by pressing <strong>F12</strong> or right-clicking and selecting <strong>Inspect</strong>.</li>
                      <li>Go to the <strong>Application</strong> (Chrome) or <strong>Storage</strong> (Firefox) tab.</li>
                      <li>In the left sidebar, under <strong>Storage</strong>, click on <strong>Cookies</strong>, then select the Hokie Spa website.</li>
                      <li>Locate the relevant session cookies (e.g., <strong>JSESSIONID</strong>), and copy their values.</li>
                    </ol>
                  </li>
                  <li>Return to our website and paste the copied cookies into the designated field.</li>
                  <li>Once your swap partner completes the same steps, the trade will be executed automatically.</li>
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
