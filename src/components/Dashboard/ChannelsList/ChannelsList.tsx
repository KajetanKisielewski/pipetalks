import React from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import useMediaQuery  from '@mui/material/useMediaQuery';

import { useAppDispatch, useAppSelector, useFetch } from 'hooks';
import { setChannelsListDisplay, setChannelsListData } from 'reducers/ChannelsListReducer';
import ChannelItem from '../ChannelItem/ChannelItem';
import AddChannel from '../AddChannel/AddChannel';
import CreateChannelModal from '../Modals/CreateChannelModal/CreateChannelModal';
import AddUsersToChannelModal from '../Modals/AddUsersToChannelModal/AddUsersToChannelModal'

const ChannelsList = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const { getDataOfAllUserChannels } = useFetch();
    const { channelsListDisplay, channelsListData, currentlyCreatedChannel, allChannelsListData } = useAppSelector((state) => state.channelsList);
    const isMobile = useMediaQuery('(max-width: 600px)');

    React.useEffect(() => {
        getDataOfAllUserChannelsData()
    },[currentlyCreatedChannel, allChannelsListData]);

    const getDataOfAllUserChannelsData = async (): Promise<void> => {
        const data = await getDataOfAllUserChannels()
        const channelsData = data?.records;
        dispatch(setChannelsListData(channelsData))
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
    <List >

      { isMobile ?
        <ListItemButton onClick={handleListCollapse} >
          <ListItemText primary="Channels" />
          <ListItemIcon sx={{ pl: 2.5 }}>
            {channelsListDisplay ? <ExpandLess sx={{color: 'rgba(255, 255, 255, 0.7)'}} /> : <ExpandMore sx={{color: 'rgba(255, 255, 255, 0.7)'}} />}
          </ListItemIcon>
        </ListItemButton>
      :
        <ListItemButton onClick={handleListCollapse}>
          <ListItemIcon>
            {channelsListDisplay ? <ExpandLess sx={{color: 'rgba(255, 255, 255, 0.7)'}} /> : <ExpandMore sx={{color: 'rgba(255, 255, 255, 0.7)'}} />}
          </ListItemIcon>
          <ListItemText primary="Channels" sx={{ marginLeft: '-15px', paddingRight: '15px' }} />
        </ListItemButton>
      }

      <Collapse in={channelsListDisplay} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
            {renderChannels()}
        </List>

        <AddChannel />
        <CreateChannelModal />
        <AddUsersToChannelModal />
      </Collapse>

    </List>
  );
};

export default ChannelsList;
