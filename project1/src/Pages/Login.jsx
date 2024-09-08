import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false); // Flag to toggle OTP input
  const navigate = useNavigate();
  const { login } = useAuth(); // Use the login method from the context

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Login successful, OTP sent:', result);
        setOtpSent(true); // Show OTP input
      } else {
        const error = await response.json();
        console.error('Login failed:', error.message);
        alert('Login failed: ' + error.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Error during login: ' + error.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, otp }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('OTP verification successful:', result);

        login(result.user); // Call login with user details

        setUsername('');
        setPassword('');
        setOtp('');

        // Redirect based on role
        if (result.user.role === 1) {
          navigate('/dashboard-user');
        } else if (result.user.role === 2) {
          navigate('/dashboard-cashier');
        } else if (result.user.role === 3) {
          navigate('/dashboard');
        }
      } else {
        const error = await response.json();
        console.error('OTP verification failed:', error.message);
        alert('OTP verification failed: ' + error.message);
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      alert('Error during OTP verification: ' + error.message);
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '50px',
        '& > :not(style)': { m: 1, width: '35ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h4" fontWeight="bold" fontFamily="arial" align="center">
        {otpSent ? 'Enter OTP' : 'Login'}
      </Typography>

      {!otpSent ? (
        <>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Button variant="contained" color="primary" size="large" onClick={handleLogin}>
            Login
          </Button>

          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
        Don't have an account?{' '}
        <Button color="primary" onClick={handleSignupRedirect}>
          Sign up
        </Button>
      </Typography>
        </>
      ) : (
        <>
          <TextField
            id="otp"
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button variant="contained" color="primary" size="large" onClick={handleOtpSubmit}>
            Submit OTP
          </Button>
        </>
      )}
    </Box>
  );
}
