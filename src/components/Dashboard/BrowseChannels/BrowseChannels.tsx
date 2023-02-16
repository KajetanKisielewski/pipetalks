import React from 'react';
import { Box, Button, Container, List, ListItem , ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Lock as LockIcon, LockOpen as LockOpenIcon } from '@mui/icons-material';

import { toggleCreateChannelModal } from "reducers/ChannelsListReducer";
import { setCurrentChannelContent } from 'reducers/CurrentContentReducer';
import { useAppDispatch, useAppSelector, useFetch } from "hooks";

const BrowseChannels = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const { editChannelUsers, getChannelData, leaveChannel } = useFetch();
    const { browseChannelsContent } = useAppSelector((state) => state.currentContent);
    const { userData } = useAppSelector((state) => state.userData);

    if(!browseChannelsContent) return;

    const handleCreateChannel = (): void => {
        dispatch(toggleCreateChannelModal(true));
    }

    const handleJoinChannel = (channelName: string): void => {
        const { email } = userData
        const usersEmails = { userEmails: [email] };
        editChannelUsers(channelName, usersEmails);
    }

    const handleLeaveChannel = (channelName: string): void => {
        leaveChannel(channelName);
    }

    const handleChannelContentDisplay = (channelName: string): void => {
        getChannelData(channelName)
            .then( resp => dispatch( setCurrentChannelContent(resp) ) )
    }

    const whetherUserBelongsToChannel = (usersList: UsersListData[]): boolean => {
        const { name } = userData
        if (usersList.some( (user) => user.name === name )) return true
    }


    const renderChannelList = () => {
        return browseChannelsContent.map( channel => {
            const { isPublic, name, users  } = channel;
            const isBelongs = whetherUserBelongsToChannel(users)

            return (
                <ListItem key={name} component="div" disablePadding sx={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid black' } }>
                    <ListItemButton >
                        <ListItemIcon>
                            { isPublic ? <LockOpenIcon /> : <LockIcon /> }
                        </ListItemIcon>
                        <ListItemText primary={name} sx={{ marginLeft: '-20px', paddingRight: '15px' }} />
                    </ListItemButton>
                    <Box>
                        <Button sx={{backgroundColor: 'white', mr: 2  }} onClick={() => handleChannelContentDisplay(name)} >
                            View
                        </Button>
                        {isBelongs ? 
                            <Button sx={{backgroundColor: 'black', mr: 2 }} onClick={() => handleLeaveChannel(name)} >
                                Leave
                            </Button>
                            :
                            <Button sx={{backgroundColor: 'black', mr: 2 }} onClick={() => handleJoinChannel(name)} >
                                Join
                            </Button>
                        }
                    </Box>
                </ListItem>
            )
        })
    }


return (
    <Container component="main" sx={{ maxWidth: '1920px !important', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginLeft: '0', marginRight: '0' }}>
        <Box sx={{ textAlign: 'center' }} >

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5px', borderBottom: '2px solid #01579b' }}>
                <Typography component="h2" variant="body1">
                    All Channels
                </Typography>
                <Button variant="contained" onClick={handleCreateChannel} >
                    Create Channel
                </Button>
            </Box>
        
            <Box>
                <List>
                    {renderChannelList()}
                </List>
            </Box>

        </Box>
    </Container>
    )
}

export default BrowseChannels;
