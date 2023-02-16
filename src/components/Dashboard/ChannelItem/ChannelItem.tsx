import React from 'react'
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Lock as LockIcon, LockOpen as LockOpenIcon } from '@mui/icons-material';

import { useFetch, useAppDispatch }from 'hooks';
import { setCurrentChannelContent } from 'reducers/CurrentContentReducer';

const ChannelItem = (props: ChannelItemProps): JSX.Element => {
    const dispatch = useAppDispatch();
    const { getChannelData } = useFetch();
    const { name, isPublic } = props;

    const handleChannelContentDisplay = (): void => {
        getChannelData(name)
            .then( resp => dispatch( setCurrentChannelContent(resp) ) )
    }

    return (
        <ListItemButton sx={{ pl: 4 }} onClick={handleChannelContentDisplay}>
            <ListItemIcon>
                { isPublic ? <LockOpenIcon /> : <LockIcon /> }
            </ListItemIcon>
            <ListItemText primary={name} sx={{ marginLeft: '-15px', paddingRight: '15px' }}/>
        </ListItemButton>
    )
}

export default ChannelItem;
