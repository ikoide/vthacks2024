import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
  Box,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

const WEBSOCKET_URL = import.meta.env.VITE_SOCKET_URL;

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import '../../components/styles/styles.scss';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const TradePage: React.FC = () => {
  // State variables
  const [pairStatus, setPairStatus] = useState<'Offline' | 'Online' | 'Entered Cookies'>('Offline');
  const [cookies, setCookies] = useState<string>('');
  const [hasSubmittedCookies, setHasSubmittedCookies] = useState<boolean>(false);
  const [pairHasSubmittedCookies, setPairHasSubmittedCookies] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes in seconds
  const navigate = useNavigate();

  const socket = new WebSocket(WEBSOCKET_URL);

  // Start the countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      // Time's up, navigate to expired page
      navigate('/trade-expired');
    }

    const timerId = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, navigate]);

  // Check if both users have submitted cookies
  useEffect(() => {
    if (hasSubmittedCookies && pairHasSubmittedCookies) {
      // Both have submitted cookies, navigate to success page
      navigate('/trade-success');
    }
  }, [hasSubmittedCookies, pairHasSubmittedCookies, navigate]);

  // Simulate the pair's status and actions
  useEffect(() => {
    // Simulate the pair coming online after 2 seconds
    setTimeout(() => {
      setPairStatus('Online');
    }, 2000);

    // Simulate the pair submitting cookies after 5 seconds
    setTimeout(() => {
      setPairHasSubmittedCookies(true);
      setPairStatus('Entered Cookies');
    }, 5000);
  }, []);

  const handleSubmitCookies = () => {
    setHasSubmittedCookies(true);
  };

  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box className="trade-page">
        <Paper className="section" elevation={3}>
          <Typography variant="h4" gutterBottom>
            Trade In Progress
          </Typography>
          <Typography variant="body1" gutterBottom>
            Time remaining: {formatTimeLeft(timeLeft)}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Your pair's status: <strong>{pairStatus}</strong>
          </Typography>
          <Box mt={2}>
            <TextField
              label="Enter your cookies"
              variant="outlined"
              value={cookies}
              onChange={(e) => setCookies(e.target.value)}
              fullWidth
              multiline
              rows={4}
              disabled={hasSubmittedCookies}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitCookies}
              disabled={hasSubmittedCookies}
              style={{ marginTop: '10px' }}
              fullWidth
            >
              Submit
            </Button>
          </Box>
        </Paper>
        {/* FAQ Accordion */}
        <Paper className="section" elevation={3}>
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

export default TradePage;
