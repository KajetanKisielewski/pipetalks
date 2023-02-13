import React from 'react'
import { ListItemButton, ListItemText } from "@mui/material";

import { useFetch, useAppDispatch }from 'hooks';
import { setCurrentContent } from 'reducers/CurrentContentReducer';

const ChannelItem = (props: ChannelItemProps): JSX.Element => {
    const dispatch = useAppDispatch();
    const { getChannelData } = useFetch();
    const { name } = props;

    const handleChannelContentDisplay = (): void => {
        getChannelData(name)
            .then( resp => dispatch( setCurrentContent(resp) ) )
    }

    return (
        <ListItemButton sx={{ pl: 4 }} onClick={handleChannelContentDisplay}>
            <ListItemText primary={name} />
        </ListItemButton>
    )
}

export default ChannelItem;
