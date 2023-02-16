import React from "react";
import { ListItemButton, ListItemIcon,ListItemText,MenuItem } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "hooks";
import { toggleCreateChannelModal } from "reducers/ChannelsListReducer";
import { setBrowseChannelsContent } from 'reducers/CurrentContentReducer';

import StyledMenu from "./style";

const AddChannel = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { channelsListData } = useAppSelector((state) => state.channelsList);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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

  const handleBrowseChannels = () => dispatch( setBrowseChannelsContent(channelsListData) )

  return (
    <div>
      <ListItemButton onClick={handleOpen}>
        <ListItemIcon>
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
