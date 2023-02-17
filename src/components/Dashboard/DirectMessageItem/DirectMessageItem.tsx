import React from 'react'
import { ListItemButton, ListItemText } from "@mui/material";

import { setDirectmessageContent } from 'reducers/CurrentContentReducer';
import { useAppDispatch } from 'hooks';

const DirectMessageItem = (props: DirectMessageItemProps): JSX.Element => {
    const { name } = props;
    const dispatch = useAppDispatch()


    const handleDirectMessageContentDisplay = (): void => {
        dispatch(setDirectmessageContent(props));
    }

    return (
        <ListItemButton sx={{ pl: 4 }} onClick={handleDirectMessageContentDisplay} >
            <ListItemText primary={name} />
        </ListItemButton>
    )
}

export default DirectMessageItem;
