import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton, Typography, Menu, Avatar, Tooltip, MenuItem } from "@mui/material";

import { setUserSettingsCotent, setNavView, setUserSettingsView } from 'reducers/CurrentContentReducer'
import { useAppSelector, useFetch, useLocalStorage, useAppDispatch } from "hooks";
import { path } from 'helpers/configs';

const Settings = (): JSX.Element => {
  const [settingsOpen, isSettingsOpen] = React.useState<null | HTMLElement>(null);
  const { userData } = useAppSelector((state) => state.userData);
  const [userImage, setUserImage] = React.useState<any>(null);
  const { clearLocalStorage } = useLocalStorage();
  const { getUserAvatar } = useFetch();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { homePage } = path;
  
  const { name, settings: { imageUrl } } = userData || { name: '' , settings: { imageUrl: null } };

  React.useEffect(() => {
    if(!imageUrl) return;
    const imageFilename = imageUrl?.split('/').pop();

    getUserAvatar(imageFilename).then( resp => {
        const img = URL.createObjectURL(resp as Blob);
        setUserImage(img)
    })
  },[userData])

  
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
    isSettingsOpen(event.currentTarget);
  };

  const handleCloseUserMenu = (): void => {
    isSettingsOpen(null);
  };

  const handleLogout = (): void => {
    clearLocalStorage()
    navigate(homePage);
    handleCloseUserMenu()
  }

  const handleUserSettingsDisplay = () => {
    handleCloseUserMenu();
    dispatch(setUserSettingsCotent(true))
    dispatch(setNavView(false))
    dispatch(setUserSettingsView(true))
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={name} src={userImage} sx={{ width: 36, height: 36, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}/>
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
          <MenuItem onClick={handleUserSettingsDisplay}>
            <Typography textAlign="center">Settings</Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Typography textAlign="center">Logout</Typography>
          </MenuItem>
      </Menu>
    </Box>
  );
};

export default Settings;
