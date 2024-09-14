import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './assets/style.scss';

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

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [page, setPage] = useState<Page>(Page.EMAIL);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

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
    }

    if (page === Page.PASSWORD) {
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
    }

    if (page === Page.SIGNUP) {
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
        <Paper elevation={3} className="login-container">
          <Box className="logo" mb={3} textAlign="center">
            <Typography variant="h3">HokieSwap</Typography>
          </Box>
          <Box className="login-input-field" display="flex" flexDirection="column" gap={2}>
            {page === Page.SIGNUP && (
              <TextField
                label="Name"
                variant="outlined"
                value={name}
                onChange={handleNameChange}
                fullWidth
              />
            )}
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              disabled={page !== Page.EMAIL}
              fullWidth
              onKeyDown={(e) => {
                if (e.key === 'Enter' && page === Page.EMAIL) {
                  handleNext();
                }
              }}
            />
            {(page === Page.PASSWORD || page === Page.SIGNUP) && (
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                fullWidth
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNext();
                  }
                }}
              />
            )}
          </Box>
          <Box mt={3} textAlign="center">
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPageAndSignUp;
