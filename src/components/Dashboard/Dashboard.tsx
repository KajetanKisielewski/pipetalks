import React from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { io } from "socket.io-client";

import { setUserData, setUsersData } from "reducers/UserDataReducer";
import { useFetch, useAppDispatch, useAppSelector, useLocalStorage } from "hooks";
import { setAllChannelsListData } from "reducers/ChannelsListReducer";

import ChannelsList from "./ChannelsList/ChannelsList";
import DirectMessagesList from "./DirectMessagesList/DirectMessageLists";
import CurrentChannelContent from "./CurrentChannelContent/CurrentChannelContent";
import Settings from "./Settings/Settings";
import BrowseChannels from "./BrowseChannels/BrowseChannels";
import DirectMessage from "./DirectMessage/DirectMessage";
import UserSettings from "./UserSettings/UserSettings";

const Dashboard = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { getUserData, getAllUsersData, getAllChannelsData } = useFetch();
  const { getLocalStorage } = useLocalStorage();
  const { currentlyCreatedChannel } = useAppSelector((state) => state.channelsList);
  const { userSettingsContentDisplay, isCurrentChannelView, isNavView, isBrowseChannelsView, isDirectMessageView, isUserSettingsView, isCurrentChannelViewDesktop, isBrowseChannelsViewDesktop, isDirectMessageViewDesktop, isUserSettingsViewDesktop } = useAppSelector((state) => state.currentContent);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { access_token } = getLocalStorage();

  const socket = io("ws://localhost:8000", {
    path: "/sockets/",
      extraHeaders: {
        Authentication: access_token
      }
  });

  React.useEffect(() => {
    getUserData().then((resp) => dispatch(setUserData(resp)));
  }, []);

  React.useEffect(() => {
    getAllUsersDataData();
  }, []);

  React.useEffect(() => {
    getDataOfAllChannels();
  }, [currentlyCreatedChannel]);


  socket.on('notification', (data) => {
    console.log('data' , data)
  })


  const getDataOfAllChannels = async (): Promise<void> => {
    const data = await getAllChannelsData();
    const channelsData = data?.records;

    dispatch(setAllChannelsListData(channelsData));
  };

  const getAllUsersDataData = async (): Promise<void> => {
    const data = await getAllUsersData();
    const usersData = data?.records;

    usersData &&
      usersData.forEach((userData: UsersListData) =>
        dispatch(setUsersData(userData))
      );
  };

  console.log('userSettingsContentDisplay' , userSettingsContentDisplay)

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "rgba(255, 255, 255, 0.7)",
        maxHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <CssBaseline />

      <Toolbar
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          color: 'rgb(255, 255, 255)',
          height: "5vh",
          borderBottom: "1px solid rgba(255, 255, 255, 0.7)",
        }}
      >
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Pipetalks
        </Typography>
        <Settings />
      </Toolbar>

      <Box component="div" sx={{ display: "flex" }}>
        <List
          component="nav"
          sx={{
            display: isNavView ? "block" : "block",
            borderRight: "1px solid #ffffffb2",
            width: isMobile ? "100%" : 'inherit',
          }}
        >
          <ChannelsList />
          <Divider sx={{ my: 1, backgroundColor: '#ffffffb2' }} />
          <DirectMessagesList />
        </List>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "95vh",
            overflow: "auto",
            display: isMobile ? "none" : "block",
          }}
        >
          {isCurrentChannelViewDesktop && <CurrentChannelContent />}
          {isBrowseChannelsViewDesktop && <BrowseChannels />}
          {isDirectMessageViewDesktop && <DirectMessage />}
          {isUserSettingsViewDesktop && <UserSettings />}
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "95vh",
            overflow: "auto",
            display: isMobile ? "block" : "none",
          }}
        >
          {isCurrentChannelView && <CurrentChannelContent />}
          {isBrowseChannelsView && <BrowseChannels /> }
          {isDirectMessageView && <DirectMessage /> }
          {isUserSettingsView && <UserSettings />}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
