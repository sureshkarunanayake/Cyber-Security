import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import SidebarC from './SidebarC'; 

export default function AppBarWithDrawer() {  
  const navigate = useNavigate();
  
  
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Function to toggle drawer state
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 1 }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left' }}>
            DashBoard
          </Typography>          
          
          <Button color="inherit" onClick={handleLoginClick}>Logout</Button>
        </Toolbar>
      </AppBar>
      <SidebarC drawerOpen={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
    </Box>
  );
}