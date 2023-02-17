import React from 'react';
import { Box, Button, Container, List, ListItem , ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Lock as LockIcon, LockOpen as LockOpenIcon } from '@mui/icons-material';

import { toggleCreateChannelModal, setAllChannelsListData } from "reducers/ChannelsListReducer";
import { setCurrentChannelContent, setBrowseChannelsContent } from 'reducers/CurrentContentReducer';
import { useAppDispatch, useAppSelector, useFetch } from "hooks";

const BrowseChannels = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const { editChannelUsers, getChannelData, leaveChannel, getAllChannelsData } = useFetch();
    const { browseChannelsContent } = useAppSelector((state) => state.currentContent);
    const { allChannelsListData } = useAppSelector((state) => state.channelsList)
    const { userData } = useAppSelector((state) => state.userData);

    React.useEffect(() => {
        dispatch( setBrowseChannelsContent(allChannelsListData) )
    },[allChannelsListData])

    const handleCreateChannel = (): void => {
        dispatch(toggleCreateChannelModal(true));
    }

    const handleJoinChannel = (channelName: string): void => {
        const usersEmails: { userEmails: string[] } = { userEmails: [] } ;
        editChannelUsers(channelName, usersEmails);
        getDataOfAllChannels()
    }

    const handleLeaveChannel = async (channelName: string): Promise<void> => {
        leaveChannel(channelName)
        getDataOfAllChannels()
    }

    const handleChannelContentDisplay = (channelName: string): void => {
        getChannelData(channelName)
            .then( resp => dispatch( setCurrentChannelContent(resp) ) )
    }

    const whetherUserBelongsToChannel = (usersList: UsersListData[]): boolean => {
        if(!usersList || !userData) return;

        const { name } = userData
        if (usersList.some( (user) => user.name === name )) return true
    }

    const getDataOfAllChannels = async (): Promise<void> => {
        const data = await getAllChannelsData()
        const channelsData = data?.records;
    
        dispatch(setAllChannelsListData(channelsData))
    }


    const renderChannelList = (): JSX.Element[] => {
        return browseChannelsContent?.map( channel => {
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
