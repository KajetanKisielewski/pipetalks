import React from 'react';

import {Box, CssBaseline, Toolbar, List, Typography, Divider } from '@mui/material';

import { setUserData } from 'reducers/UserDataReducer'
import { useFetch, useAppDispatch } from 'hooks'
import { setUsersData } from 'reducers/UserDataReducer';

import ChannelsList from './ChannelsList/ChannelsList';
import DirectMessagesList from './DirectMessagesList/DirectMessageLists';
import CurrentChannelContent from './CurrentChannelContent/CurrentChannelContent';
import Settings from './Settings/Settings';
import BrowseChannels from './BrowseChannels/BrowseChannels';


const Dashboard = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { getUserData, getAllUsersData } = useFetch();

  React.useEffect(() => {
    getUserData().then(resp => dispatch(setUserData(resp)))
  },[])

  React.useEffect(() => {
    getAllUsersDataData();
  },[]);  

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
            <CurrentChannelContent />
            <BrowseChannels />
          </Box>

        </Box>
      </Box>
  );
}

export default Dashboard;
