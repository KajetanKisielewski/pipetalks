import React from "react";

import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

import { useAppDispatch, useAppSelector, useFetch } from "hooks";
import { setChannelsListDisplay, setChannelsListData } from 'reducers/ChannelsListReducer';

import ChannelItem from "../ChannelItem/ChannelItem";


const ChannelsList = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const { getAllChannels } = useFetch();
    const { channelsListDisplay, channelsListData } = useAppSelector((state) => state.channelsList);

    React.useEffect(() => {
        getAllChannelsData()
    },[]);

    const getAllChannelsData = async (): Promise<void> => {
        const data = await getAllChannels()
        const channelsData = data.records;
        
        channelsData.forEach( (channel: ChannelsListData) =>  dispatch(setChannelsListData(channel)) )
    }

    const handleListCollapse = (): void => {
        dispatch(setChannelsListDisplay(!channelsListDisplay) )
    };

    const renderChannels = (): JSX.Element[] => {
        if(!channelsListData) return;

        return channelsListData.map( channel => {
            const { name } = channel;
            return <ChannelItem key={name} name={name}/>
        })
    }

  return (
    <List>

      <ListItemButton onClick={handleListCollapse}>
        <ListItemIcon>
            {channelsListDisplay ? <ExpandLess /> : <ExpandMore />}
        </ListItemIcon>
        <ListItemText primary="Channels List" />
      </ListItemButton>

      <Collapse in={channelsListDisplay} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
            {renderChannels()}
        </List>
      </Collapse>
    </List>
  );
};

export default ChannelsList;
