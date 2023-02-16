import React from "react";
import { ListItemButton, ListItemIcon, Avatar, ListItemText } from "@mui/material";

import { useFetch, useAppSelector } from "hooks";

const UserItem = ( { user }: UserItemProps ): JSX.Element => {
    const { name, email } = user;
    const { editRoomsUsers } = useFetch();
    const { currentlyCreatedChannel } = useAppSelector((state) => state.channelsList);

    const addUserToChannel = (userEmail: string): void => {
        const usersEmails = { userEmails: [userEmail] };
        editRoomsUsers(currentlyCreatedChannel, usersEmails);
    };

    return (
        <ListItemButton sx={{ mt: 1, width: "100%" }} onClick={() => addUserToChannel(email)} >
          <ListItemIcon>
            <Avatar />
          </ListItemIcon>
          <ListItemText primary={name} sx={{ marginLeft: "-5px" }} />
        </ListItemButton>
      );
}

export default UserItem;
