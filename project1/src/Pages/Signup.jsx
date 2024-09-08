import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const commonPasswords = [
    '123456',
    'password',
    '12345678',
    'welcome',
    'abc123',
    'iloveyou',
    '111111',
    '123123',
  ];

  const validateName = (name) => /^[A-Za-z\s]+$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateName(name)) {
      alert("Name cannot contain numbers or special characters.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!validatePhone(phone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    if (commonPasswords.includes(password)) {
      alert("The password you entered is too common. Please choose a stronger password.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ name, email, phone, username, password }) 
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Signup successful:', result);

        setName('');
        setEmail('');
        setPhone('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');

        alert('Signup successful!');
        navigate('/login');
      } else {
        const error = await response.json();
        console.error('Signup failed:', error.message);
        alert('Signup failed: ' + error.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('Error during signup: ' + error.message);
    }
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
      autoComplete="off">
      <Typography variant="h4" fontWeight={"bold"} fontFamily={"arial"} align='center'>
        Signup
      </Typography>
      <TextField 
        id="name"
        label="Name" 
        variant="outlined" 
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField 
        id="email"
        label="Email" 
        variant="outlined" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField 
        id="phone"
        label="Phone Number" 
        variant="outlined" 
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
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
      />
      <TextField
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" size="large" type='submit' onClick={handleSignup}>
        Signup
      </Button>
    </Box>
  );
}
