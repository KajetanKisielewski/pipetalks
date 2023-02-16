import React from 'react';

import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "hooks";
import { setDirectMessagesListDisplay } from 'reducers/DirectMessagesListReducer';
import { setUsersData } from 'reducers/UserDataReducer';

import DirectMessageItem from '../DirectMessageItem/DirectMessageItem';

const DirectMessagesList = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const { directMessagesListDisplay } = useAppSelector((state) => state.directMessagesList);
    const { usersData } = useAppSelector((state) => state.userData);

    const handleListCollapse = (): void => {
        dispatch(setDirectMessagesListDisplay(!directMessagesListDisplay) )
    };

    const renderDirectMessages = () => {
        if(!usersData) return;

        return usersData.map( userData => {
            const { name } = userData;

            return <DirectMessageItem key={name} name={name}/>
        })
    }

    return (
        <List>
    
          <ListItemButton onClick={handleListCollapse}>
            <ListItemIcon>
                {directMessagesListDisplay ? <ExpandLess /> : <ExpandMore />}
            </ListItemIcon>
            <ListItemText primary="Direct Messages" sx={{ marginLeft: '-15px', paddingRight: '15px' }} />
          </ListItemButton>
    
          <Collapse in={directMessagesListDisplay} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {renderDirectMessages()}
            </List>
          </Collapse>
        </List>
      );
}

export default DirectMessagesList;