import React from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore, Add as AddIcon } from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "hooks";
import { setDirectMessagesListDisplay, toggleCreateDirectMessageModal } from 'reducers/DirectMessagesListReducer';

import DirectMessageItem from '../DirectMessageItem/DirectMessageItem';
import CreateDirectMessageModal from '../Modals/CreateDirectMessageModal/CreateDirectMessageModal';

const DirectMessagesList = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const { directMessagesListDisplay, directMessagesListData } = useAppSelector((state) => state.directMessages);
    const { usersData } = useAppSelector((state) => state.userData);

    const handleListCollapse = (): void => {
        dispatch(setDirectMessagesListDisplay(!directMessagesListDisplay) )
    };

    const renderDirectMessages = () => {
        if(!directMessagesListData) return;

        return directMessagesListData.map( directMessage => {
            const { id, recordings, users, createdAt } = directMessage;
            const direstMessageName = [ users[0].name , users[1].name ].join()
            return <DirectMessageItem key={id} name={direstMessageName} recordings={recordings} users={users} createdAt={createdAt}/>
        })
    }

    const handleOpenDirectMessagesModal = (): void => {
      dispatch(toggleCreateDirectMessageModal(true));
    };

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

            <ListItemButton onClick={handleOpenDirectMessagesModal}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText
                primary="Create DM Instance"
                sx={{ marginLeft: "-15px", paddingRight: "15px" }}
              />
            </ListItemButton>

            <CreateDirectMessageModal />
          </Collapse>
        </List>
      );
}

export default DirectMessagesList;