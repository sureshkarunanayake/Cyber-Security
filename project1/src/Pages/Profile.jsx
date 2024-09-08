import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

export default function Profile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    username: ''
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  useEffect(() => {
    // Fetch user info from the backend
    const fetchUser = async () => {
      const token = localStorage.getItem('token'); // Assuming you are using token-based authentication
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const userData = await response.json();
        if (response.ok) {
          setUser(userData);
        } else {
          alert(userData.message || 'Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        alert('Error fetching user data');
      }
    };
    fetchUser();
  }, []);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
  };

  const handleSaveUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        const error = await response.json();
        alert('Failed to update profile: ' + error.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmNewPassword } = passwords;
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match!');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/profile/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        alert('Password changed successfully!');
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      } else {
        const error = await response.json();
        alert('Failed to change password: ' + error.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('An error occurred while changing your password.');
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" fontWeight={"bold"} fontFamily={"arial"} align='left'>
        Profile
      </Typography>

      <Box sx={{ marginTop: 3 }}>
        <TextField
          label="Name"
          variant="outlined"
          name="name"
          value={user.name}
          onChange={handleUserChange}
          fullWidth
          sx={{ marginBottom: 2, maxWidth: '400px' }} // Reduced width
        />
        <TextField
          label="Email"
          variant="outlined"
          name="email"
          value={user.email}
          onChange={handleUserChange}
          fullWidth
          sx={{ marginBottom: 2, maxWidth: '400px' }} // Reduced width
        />
        <TextField
          label="Phone"
          variant="outlined"
          name="phone"
          value={user.phone}
          onChange={handleUserChange}
          fullWidth
          sx={{ marginBottom: 2, maxWidth: '400px' }} // Reduced width
        />
        <TextField
          label="Username"
          variant="outlined"
          name="username"
          value={user.username}
          disabled
          fullWidth
          sx={{ marginBottom: 2, maxWidth: '400px' }} // Reduced width
        />
      </Box>

      <Button variant="contained" color="primary" onClick={handleSaveUser}>
        Save Changes
      </Button>

      <Box sx={{ marginTop: 5 }}>
        <Typography variant="h5" fontWeight={"bold"} fontFamily={"arial"} align='left'>
          Change Password
        </Typography>
        <TextField
          label="Current Password"
          variant="outlined"
          name="currentPassword"
          type="password"
          value={passwords.currentPassword}
          onChange={handlePasswordChange}
          fullWidth
          sx={{ marginBottom: 2, maxWidth: '400px' }} // Reduced width
        />
        <TextField
          label="New Password"
          variant="outlined"
          name="newPassword"
          type="password"
          value={passwords.newPassword}
          onChange={handlePasswordChange}
          fullWidth
          sx={{ marginBottom: 2, maxWidth: '400px' }} // Reduced width
        />
        <TextField
          label="Confirm New Password"
          variant="outlined"
          name="confirmNewPassword"
          type="password"
          value={passwords.confirmNewPassword}
          onChange={handlePasswordChange}
          fullWidth
          sx={{ marginBottom: 2, maxWidth: '400px' }} // Reduced width
        />
        <Button variant="contained" color="secondary" onClick={handleChangePassword}>
          Change Password
        </Button>
      </Box>
    </Box>
  );
}
