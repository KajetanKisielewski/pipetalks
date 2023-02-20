import React from 'react';

import {Box, CssBaseline, Toolbar, List, Typography, Divider } from '@mui/material';

import { setUserData, setUsersData } from 'reducers/UserDataReducer'
import { useFetch, useAppDispatch, useAppSelector } from 'hooks'
import { setAllChannelsListData } from 'reducers/ChannelsListReducer'

import ChannelsList from './ChannelsList/ChannelsList';
import DirectMessagesList from './DirectMessagesList/DirectMessageLists';
import CurrentChannelContent from './CurrentChannelContent/CurrentChannelContent';
import Settings from './Settings/Settings';
import BrowseChannels from './BrowseChannels/BrowseChannels';
import DirectMessage from './DirectMessage/DirectMessage';

import UserSettings from './UserSettings/UserSettings';


const Dashboard = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { getUserData, getAllUsersData, getAllChannelsData  } = useFetch();
  const { currentlyCreatedChannel } = useAppSelector((state) => state.channelsList)
  const { userSettingsContentDisplay } = useAppSelector((state) => state.currentContent)

  React.useEffect(() => {
    getUserData().then(resp => dispatch(setUserData(resp)))
  },[])

  React.useEffect(() => {
    getAllUsersDataData();
  },[]);
  
  React.useEffect(() => {
    getDataOfAllChannels()
  },[currentlyCreatedChannel]);

const getDataOfAllChannels = async (): Promise<void> => {
    const data = await getAllChannelsData()
    const channelsData = data?.records;

    dispatch(setAllChannelsListData(channelsData))
}

  const getAllUsersDataData = async (): Promise<void> => {
    const data = await getAllUsersData()
    const usersData = data?.records;

    usersData && usersData.forEach( (userData: UsersListData) =>  dispatch(setUsersData(userData)) )
  } 

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#b3e5fc', height: '100vh', overflow: 'hidden' }}>
        <CssBaseline />
        
        <Toolbar sx={{ backgroundColor: '#448aff', height: '5vh', borderBottom: '2px solid #01579b' }}>
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

        <Box component='div' sx={{ display: 'flex' }}>

          <List component="nav" sx={{ backgroundColor: '#81d4fa', borderRight: '2px solid #01579b' }}>
            <ChannelsList />
            <Divider sx={{ my: 1 }} />
            <DirectMessagesList />
          </List>

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: '95vh',
              overflow: 'auto',
            }}
          >
            {!userSettingsContentDisplay && <CurrentChannelContent /> }
            {!userSettingsContentDisplay && <BrowseChannels /> }
            {!userSettingsContentDisplay && <DirectMessage /> }
            {userSettingsContentDisplay && <UserSettings />}
          </Box>

        </Box>
      </Box>
  );
}

export default Dashboard;
