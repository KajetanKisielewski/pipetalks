import React from 'react'
import { ListItemButton, ListItemText } from "@mui/material";

const DirectMessageItem = (props: DirectMessageItemProps): JSX.Element => {
    const { name } = props;

    return (
        <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary={name} />
        </ListItemButton>
    )
}

export default DirectMessageItem;
