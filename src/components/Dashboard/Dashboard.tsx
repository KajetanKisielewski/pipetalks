import React from 'react';

import {Box, CssBaseline, Toolbar, List, Typography, Divider } from '@mui/material';

import { setUserData } from 'reducers/UserDataReducer'
import { useFetch, useAppDispatch } from 'hooks'

import ChannelsList from './ChannelsList/ChannelsList';
import DirectMessagesList from './DirectMessagesList/DirectMessageLists';
import CurrentContent from './CurrentContent/CurrentContent';
import Settings from './Settings/Settings';


const Dashboard = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { getUserData } = useFetch();

  React.useEffect(() => {
    getUserData().then(resp => dispatch(setUserData(resp)))
  },[])

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

          <List component="nav" sx={{ backgroundColor: '#81d4fa', borderRight: '2px solid #01579b', overflowY: 'scroll' }}>
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
            <CurrentContent />
          </Box>

        </Box>
      </Box>
  );
}

export default Dashboard;
