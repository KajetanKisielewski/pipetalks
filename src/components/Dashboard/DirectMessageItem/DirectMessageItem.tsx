import React from 'react'
import { ListItemButton, ListItemText, Avatar } from "@mui/material";
import useMediaQuery  from '@mui/material/useMediaQuery';

import { setBrowseChannelsView, setDirectmessageContent, setDirectMessageView, setNavView } from 'reducers/CurrentContentReducer';
import { useAppDispatch, useFetch } from 'hooks';

const DirectMessageItem = (props: DirectMessageItemProps): JSX.Element => {
    const { name, users } = props;
    const dispatch = useAppDispatch()
    const { getNewMessagesCount, getDirectChannelInfo  } = useFetch();
    const isMobile = useMediaQuery('(max-width: 600px)');

    const email = users[0]?.email

    React.useEffect(() => {
        isUnreadMessage()
    },[])

    const handleDirectMessageContentDisplay = (): void => {
        getDirectChannelInfo (email)
            .then( resp => {
                dispatch( dispatch(setDirectmessageContent(resp)) ) 
    });
    
        if(isMobile) {
            dispatch(setDirectMessageView(true));
            dispatch(setNavView(false));
            dispatch(setBrowseChannelsView(false))
        }
    }

    const isUnreadMessage = async () => {
        const abc = await getNewMessagesCount();
        console.log('abc' , abc)
    }

    return (
        <ListItemButton sx={{ pl: 4 }} onClick={handleDirectMessageContentDisplay} >
            <Avatar alt={name} sx={{ width: 36, height: 36, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}/>
            <ListItemText primary={name} sx={{ pl: 1.5 }} />
        </ListItemButton>
    )
}

export default DirectMessageItem;
