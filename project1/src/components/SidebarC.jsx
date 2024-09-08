import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';

export default function SidebarC({ drawerOpen, handleDrawerToggle }) {
  const navigate = useNavigate();

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleDrawerToggle(); // Close the drawer after navigation
  };

  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={handleDrawerToggle}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={handleDrawerToggle}
        onKeyDown={handleDrawerToggle}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleMenuItemClick('/product')}>
              <ListItemText primary="Product" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleMenuItemClick('/bill')}>
              <ListItemText primary="Bill" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleMenuItemClick('/profile')}>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
}