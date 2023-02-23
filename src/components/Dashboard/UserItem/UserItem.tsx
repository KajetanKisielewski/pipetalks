import React from "react";
import { ListItemButton, ListItemIcon, Avatar, ListItemText } from "@mui/material";

import { useFetch, useAppSelector, useAppDispatch, useLocalStorage } from "hooks";
import { setDirectMessagesListData } from "reducers/DirectMessagesListReducer";


const UserItem = ( { user, isDM }: UserItemProps ): JSX.Element => {
    const { name, email } = user;
    const { editChannelUsers, getDirectChannelInfo } = useFetch();
    const dispatch = useAppDispatch()
    const { currentlyCreatedChannel } = useAppSelector((state) => state.channelsList);

    const addUserToChannel = (userEmail: string): void => {
        const usersEmails = { userEmails: [userEmail] };
        editChannelUsers(currentlyCreatedChannel, usersEmails);
    };

    const createDirestMessageInstance = (): void => {
      getDirectChannelInfo(email).then(
        resp => dispatch(setDirectMessagesListData(resp))
      )
    }

    return (
        <ListItemButton sx={{ mt: 1, width: "100%" }} onClick={() => {isDM? createDirestMessageInstance() : addUserToChannel(email)} } >
          <ListItemIcon>
            <Avatar />
          </ListItemIcon>
          <ListItemText primary={name} sx={{ marginLeft: "-5px" }} />
        </ListItemButton>
      );
}

export default UserItem;
