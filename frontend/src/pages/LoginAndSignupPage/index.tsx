import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  ThemeProvider,
  createTheme,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './assets/style.scss';

// Import the image
import logoImage from './hokieSwap.png';

enum Page {
  EMAIL = 'EMAIL',
  PASSWORD = 'PASSWORD',
  SIGNUP = 'SIGNUP',
}

const API_URL = import.meta.env.VITE_API_URL;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

interface LoginPageAndSignUpProps {
  setUserData: (data: any) => void;
}

const LoginPageAndSignUp: React.FC<LoginPageAndSignUpProps> = ({ setUserData }) => {
  const navigate = useNavigate();

  // State variables
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [page, setPage] = useState<Page>(Page.EMAIL);

  // Refs for input fields
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Focus the appropriate input field when the page changes
  useEffect(() => {
    if (page === Page.EMAIL) {
      emailInputRef.current?.focus();
    } else if (page === Page.PASSWORD) {
      passwordInputRef.current?.focus();
    } else if (page === Page.SIGNUP) {
      nameInputRef.current?.focus();
    }
  }, [page]);

  // Handle input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  // Handle "Next" button click and Enter key presses
  const handleNext = () => {
    if (page === Page.EMAIL) {
      const emailRegex = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9.-]+\.)?[a-zA-Z]{2,6}$/;

      if (!emailRegex.test(email)) {
        alert('Please enter a valid email');
        return;
      }

      if (!email.includes('@vt.edu')) {
        alert('Please enter a valid vt.edu email');
        return;
      }

      fetch(`${API_URL}/users?email=${email}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length === 0) {
            setPage(Page.SIGNUP);
          } else {
            setPage(Page.PASSWORD);
          }
        });
    } else if (page === Page.PASSWORD) {
      fetch(`${API_URL}/users/${email}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem('session', data);

          fetch(`${API_URL}/users/${data}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then((data) => {
              setUserData(data);
              localStorage.setItem('session', data.sess_id);
              navigate('/add-drop');
            });
        });
    } else if (page === Page.SIGNUP) {
      if (name === '' || email === '' || password === '') {
        alert('Please fill out all fields');
        return;
      }

      fetch(`${API_URL}/users/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Data when creating new user: ', data);
          localStorage.setItem('session', data.sess_id);
          data.courses_to_add = [];
          data.courses_to_drop = [];
          setUserData(data);
          console.log(data);
          navigate('/add-drop');
        });
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        className="login-page"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Paper elevation={3} className="login-container" sx={{ padding: 3 }}>
          <AnimatePresence>
            <motion.div
              key="login-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ overflow: 'hidden' }}
              layout // Enable layout animations
            >
              <Grid container spacing={3}>
                <Grid item xs={13}>
                  <Box
                    display="flex"
                    alignItems="center" // Changed from "center" to "baseline"
                    justifyContent="space-between"
                    mb={-1}
                  >
                    {/* HokieSWAP text */}
                    <Box>
                      <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        HokieSWAP
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#c4c4c4', margin: '0.2rem 0rem' }}
                      >
                        Login or signup below
                      </Typography>
                    </Box>
                    {/* Image */}
                    <Box>
                      <img
                        src={logoImage}
                        alt="Logo"
                        style={{
                          width: '90px',
                          height: 'auto',
                          marginBottom: '20px', // Added marginTop to move the image up
                        }}
                      />
                    </Box>
                  </Box>
                  <Box className="login-input-field" display="flex" flexDirection="column" gap={2}>
                    <AnimatePresence initial={false}>
                      {page === Page.SIGNUP && (
                        <motion.div
                          key="name-field"
                          initial={{ opacity: 0, y: 20 }} // Enters from below
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                          layout // Animate layout changes
                        >
                          <TextField
                            label="Name"
                            variant="outlined"
                            value={name}
                            onChange={handleNameChange}
                            fullWidth
                            inputRef={nameInputRef}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                passwordInputRef.current?.focus();
                              }
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <TextField
                      label="Email"
                      variant="outlined"
                      value={email}
                      onChange={handleEmailChange}
                      disabled={page !== Page.EMAIL}
                      fullWidth
                      inputRef={emailInputRef}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && page === Page.EMAIL) {
                          handleNext();
                        }
                      }}
                    />
                    <AnimatePresence initial={false}>
                      {(page === Page.PASSWORD || page === Page.SIGNUP) && (
                        <motion.div
                          key="password-field"
                          initial={{ opacity: 0, y: -20 }} // Enters from above
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          layout // Animate layout changes
                        >
                          <TextField
                            label="Password"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            fullWidth
                            inputRef={passwordInputRef}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleNext();
                              }
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                  <Box mt={3} textAlign="center">
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        width: '100%',
                        backgroundColor: '#1976d2',
                        '&:hover': { backgroundColor: '#13599e' },
                      }}
                    >
                      Next
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </motion.div>
          </AnimatePresence>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPageAndSignUp;