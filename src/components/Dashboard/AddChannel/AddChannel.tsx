import React from "react";
import { ListItemButton, ListItemIcon,ListItemText,MenuItem } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import useMediaQuery  from '@mui/material/useMediaQuery';

import { useAppDispatch, useAppSelector } from "hooks";
import { toggleCreateChannelModal } from "reducers/ChannelsListReducer";
import { setBrowseChannelsContent, setNavView, setBrowseChannelsView, setCurrentChannelViewDesktop, setBrowseChannelsViewDesktop, setDirectMessageViewDesktop, setUserSettingsViewDesktop  } from 'reducers/CurrentContentReducer';

import StyledMenu from "./style";

const AddChannel = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { allChannelsListData } = useAppSelector((state) => state.channelsList);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery('(max-width: 600px)');

  const handleOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleCreateChannel = (): void => {
    handleClose();
    dispatch(toggleCreateChannelModal(true));
  };

  const handleBrowseChannels = (): void => {
    dispatch( setBrowseChannelsContent(allChannelsListData) ) 
    handleClose();

    if(isMobile) {
      dispatch(setNavView(false))
      dispatch(setBrowseChannelsView(true))
    }

    if(!isMobile) {
      dispatch(setCurrentChannelViewDesktop(false))      
      dispatch(setBrowseChannelsViewDesktop(true))
      dispatch(setDirectMessageViewDesktop(false))      
      dispatch(setUserSettingsViewDesktop(false))
    }
  }

  return (
    <div>
      <ListItemButton onClick={handleOpen} sx={{ pl: 4 }}>
        <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          <AddIcon />
        </ListItemIcon>
        <ListItemText
          primary="Add channels"
          sx={{ marginLeft: "-15px", paddingRight: "15px" }}
        />
      </ListItemButton>

      <StyledMenu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <MenuItem onClick={handleCreateChannel} disableRipple>
          Create a new channel
        </MenuItem>
        <MenuItem onClick={handleBrowseChannels} disableRipple>
          Browse Channels
        </MenuItem>
      </StyledMenu>
    </div>
  );
};

export default AddChannel;
function ssetUserSettingsViewDesktop(arg0: boolean): any {
  throw new Error("Function not implemented.");
}

