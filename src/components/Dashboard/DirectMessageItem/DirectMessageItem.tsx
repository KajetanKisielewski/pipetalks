import React from 'react'
import { ListItemButton, ListItemText, Avatar } from "@mui/material";

import { setBrowseChannelsView, setDirectmessageContent, setDirectMessageView, setNavView } from 'reducers/CurrentContentReducer';
import { useAppDispatch, useFetch } from 'hooks';

const DirectMessageItem = (props: DirectMessageItemProps): JSX.Element => {
    const { name } = props;
    console.log('props' , props)
    const dispatch = useAppDispatch()
    const { getNewMessagesCount } = useFetch();

    React.useEffect(() => {
        isUnreadMessage()
    })

    const handleDirectMessageContentDisplay = (): void => {
        dispatch(setDirectmessageContent(props));
        dispatch(setDirectMessageView(true));
        dispatch(setNavView(false));
        dispatch(setBrowseChannelsView(false))
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
