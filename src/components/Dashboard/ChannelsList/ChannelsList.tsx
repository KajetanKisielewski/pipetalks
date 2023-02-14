import React from "react";

import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

import { useAppDispatch, useAppSelector, useFetch } from "hooks";
import { setChannelsListDisplay, setChannelsListData } from 'reducers/ChannelsListReducer';

import ChannelItem from '../ChannelItem/ChannelItem';
import AddChannel from '../AddChannel/AddChannel';
import CreateChannelModal from "../Modals/CreateChannelModal/CreateChannelModal";

const ChannelsList = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const { getAllChannelsData } = useFetch();
    const { channelsListDisplay, channelsListData } = useAppSelector((state) => state.channelsList);

    React.useEffect(() => {
        getAllChannelsDataData()
    },[]);

    const getAllChannelsDataData = async (): Promise<void> => {
        const data = await getAllChannelsData()
        const channelsData = data.records;

        channelsData.forEach( (channel: ChannelsListData) =>  dispatch(setChannelsListData(channel)) )
    }

    const handleListCollapse = (): void => {
        dispatch(setChannelsListDisplay(!channelsListDisplay) )
    };

    const renderChannels = (): JSX.Element[] => {
        if(!channelsListData) return;

        return channelsListData.map( channel => {
            const { name, isPublic } = channel;
            return <ChannelItem key={name} name={name} isPublic={isPublic} />
        })
    }

  return (
    <List>

      <ListItemButton onClick={handleListCollapse}>
        <ListItemIcon>
            {channelsListDisplay ? <ExpandLess /> : <ExpandMore />}
        </ListItemIcon>
        <ListItemText primary="Channels List" sx={{ marginLeft: '-15px', paddingRight: '15px' }} />
      </ListItemButton>

      <Collapse in={channelsListDisplay} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
            {renderChannels()}
        </List>

        <AddChannel />
        <CreateChannelModal />
      </Collapse>

    </List>
  );
};

export default ChannelsList;
