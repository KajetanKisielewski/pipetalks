import React from "react";

import { Box, IconButton, Typography, Menu, Avatar, Tooltip, MenuItem } from "@mui/material";
import { useAppSelector } from "hooks";

const settings = ["Settings", "Logout"];

const Settings = (): JSX.Element => {
  const [settingsOpen, isSettingsOpen] = React.useState<null | HTMLElement>(null);
  const { userData } = useAppSelector((state) => state.userData);

//   console.log('us' , userData)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    isSettingsOpen(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    isSettingsOpen(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="K" src="/static/images/avatar/2.jpg" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={settingsOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(settingsOpen)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem key={setting} onClick={handleCloseUserMenu}>
            <Typography textAlign="center">{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
export default Settings;
