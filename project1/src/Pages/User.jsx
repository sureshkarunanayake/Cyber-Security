import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Select, MenuItem, Paper } from '@mui/material';

export default function User() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from the backend when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = (index, newRole) => {
    const updatedUsers = [...users];
    updatedUsers[index].role = newRole;
    setUsers(updatedUsers);
  };

  const handleSave = async (user) => {
    console.log('Saving role for user:', user);
  
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user._id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: user.role }),
      });
  
      if (response.ok) {
        alert('Role updated successfully!');
      } else {
        const error = await response.json();
        console.error('Failed to update role:', error);
        alert('Failed to update role: ' + error.message);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error updating role');
    }
  };
  

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" fontWeight="bold" marginBottom="20px">Manage User Roles</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Telephone Number</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(index, e.target.value)}
                  >
                    <MenuItem value={1}>User</MenuItem>
                    <MenuItem value={2}>Cashier</MenuItem>
                    <MenuItem value={3}>Manager</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSave(user)}
                  >
                    Save
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

