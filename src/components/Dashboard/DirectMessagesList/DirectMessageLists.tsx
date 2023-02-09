import React from 'react';

import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

import { useAppDispatch, useAppSelector, useFetch } from "hooks";
import { setDirectMessagesListDisplay, setDirectMessagesListData } from 'reducers/DirectMessagesListReducer';

import DirectMessageItem from '../DirectMessageItem/DirectMessageItem';

const DirectMessagesList = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const { getAllUsers } = useFetch();
    const { directMessagesListDisplay, directMessagesListData } = useAppSelector((state) => state.directMessagesList);
    
    React.useEffect(() => {
        getAllUsersData();
    },[]);

    const getAllUsersData = async (): Promise<void> => {
        const data = await getAllUsers()
        const usersData = data.records;

        usersData.forEach( (userData: DirectMessageListData) =>  dispatch(setDirectMessagesListData(userData)) )
    }

    const handleListCollapse = (): void => {
        dispatch(setDirectMessagesListDisplay(!directMessagesListDisplay) )
    };

    const renderDirectMessages = () => {
        if(!directMessagesListData) return;

        return directMessagesListData.map( directMessage => {
            const { name } = directMessage;

            return <DirectMessageItem key={name} name={name}/>
        })
    }

    return (
        <List>
    
          <ListItemButton onClick={handleListCollapse}>
            <ListItemIcon>
                {directMessagesListDisplay ? <ExpandLess /> : <ExpandMore />}
            </ListItemIcon>
            <ListItemText primary="Direct Messages" />
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