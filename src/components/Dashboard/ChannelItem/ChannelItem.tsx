import React from 'react'
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Lock as LockIcon, LockOpen as LockOpenIcon } from '@mui/icons-material';
import useMediaQuery  from '@mui/material/useMediaQuery';


import { useFetch, useAppDispatch }from 'hooks';
import { setBrowseChannelsViewDesktop, setCurrentChannelContent, setCurrentChannelView, setCurrentChannelViewDesktop, setDirectMessageViewDesktop, setNavView, setUserSettingsViewDesktop } from 'reducers/CurrentContentReducer';

const ChannelItem = (props: ChannelItemProps): JSX.Element => {
    const dispatch = useAppDispatch();
    const { getChannelData } = useFetch();
    const { name, isPublic } = props;
    const isMobile = useMediaQuery('(max-width: 600px)');

    const handleChannelContentDisplay = (): void => {
        getChannelData(name)
            .then( resp => dispatch( setCurrentChannelContent(resp) ) );
        
        if(isMobile) {
            dispatch(setNavView(false))
            dispatch(setCurrentChannelView(true))
        }

        if(!isMobile) {
            dispatch(setCurrentChannelViewDesktop(true))      
            dispatch(setBrowseChannelsViewDesktop(false))
            dispatch(setDirectMessageViewDesktop(false))      
            dispatch(setUserSettingsViewDesktop(false))
        }
    }

    return (
        <ListItemButton sx={{ pl: 4 }} onClick={handleChannelContentDisplay}>
            <ListItemIcon>
                { isPublic ? <LockOpenIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} /> : <LockIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} /> }
            </ListItemIcon>
            <ListItemText primary={name} sx={{ marginLeft: '-25px', paddingRight: '15px' }}/>
        </ListItemButton>
    )
}

export default ChannelItem;
