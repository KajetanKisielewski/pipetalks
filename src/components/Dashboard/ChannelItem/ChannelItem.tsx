import React from 'react'
import { ListItemButton, ListItemText } from "@mui/material";

const ChannelItem = (props: ChannelItemProps): JSX.Element => {
    const { name } = props;

    return (
        <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary={name} />
        </ListItemButton>
    )
}

export default ChannelItem;
