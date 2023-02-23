import React from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore, Add as AddIcon } from "@mui/icons-material";
import useMediaQuery  from '@mui/material/useMediaQuery';

import { useAppDispatch, useAppSelector } from "hooks";
import { setDirectMessagesListDisplay, toggleCreateDirectMessageModal } from 'reducers/DirectMessagesListReducer';

import DirectMessageItem from '../DirectMessageItem/DirectMessageItem';
import CreateDirectMessageModal from '../Modals/CreateDirectMessageModal/CreateDirectMessageModal';

const DirectMessagesList = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const { directMessagesListDisplay, directMessagesListData } = useAppSelector((state) => state.directMessages);
    const { usersData } = useAppSelector((state) => state.userData);
    const isMobile = useMediaQuery('(max-width: 600px)');

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

    if(usersData?.length === 1) return; 

    return (
        <List>
    
          { isMobile ? 
            <ListItemButton onClick={handleListCollapse} >
              <ListItemText primary="Direct Messages" />
              <ListItemIcon sx={{ pl: 2.5 }} >
                {directMessagesListDisplay ? <ExpandLess sx={{color: 'rgba(255, 255, 255, 0.7)'}} /> : <ExpandMore sx={{color: 'rgba(255, 255, 255, 0.7)'}} />}
              </ListItemIcon>
            </ListItemButton>
          :
            <ListItemButton onClick={handleListCollapse}>
              <ListItemIcon>
                {directMessagesListDisplay ? <ExpandLess sx={{color: 'rgba(255, 255, 255, 0.7)'}} /> : <ExpandMore sx={{color: 'rgba(255, 255, 255, 0.7)'}} />}
              </ListItemIcon>
              <ListItemText primary="Direct Messages" sx={{ marginLeft: '-15px', paddingRight: '15px' }} />
            </ListItemButton>
          }
    
          <Collapse in={directMessagesListDisplay} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {renderDirectMessages()}
            </List>

            <ListItemButton onClick={handleOpenDirectMessagesModal} sx={{ pl: 4 }} >
              <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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