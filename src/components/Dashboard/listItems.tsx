import React from 'react';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


export const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <ArrowDropDownIcon />
      </ListItemIcon>
      <ListItemText primary="Channels" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <ArrowDropDownIcon />
      </ListItemIcon>
      <ListItemText primary="Direct messages" />
    </ListItemButton>
  </React.Fragment>
);
