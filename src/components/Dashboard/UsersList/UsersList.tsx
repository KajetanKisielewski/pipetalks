import React from "react";
import { List, Box, Button, TextField } from "@mui/material";

import { useAppSelector, useAppDispatch } from "hooks";
import { toggleAddUsersModal } from 'reducers/ChannelsListReducer';

import UserItem from "components/Dashboard/UserItem/UserItem";

const UsersList = (): JSX.Element => {
  const [searchedQuery, setSearchedQuery] = React.useState("");
  const { userData, usersData } = useAppSelector((state) => state.userData);
  const dispatch = useAppDispatch();

  const { name: loggedUserName , email: loggedUserEmail } = userData;

  const handleClose = () => dispatch(toggleAddUsersModal(false))

  const searchededUsers = (searchQuery: string): UsersData[] => {
    const matchingUsers = [];

    for (let i = 0; i < usersData.length; i++) {
      const user = usersData[i];
      if (user.email.includes(searchQuery) || user.name.includes(searchQuery) && !( user.name === loggedUserName || user.email === loggedUserEmail )) {
        matchingUsers.push(user);
      }
    }
    return matchingUsers;
  };

  const renderSearchedUsers = (query: string) => {
    const users = searchededUsers(query);

    return (
      <List>
        {users.map((user) => {
            const { id, } = user
            return ( <UserItem key={id} user={user} /> )
        })}
      </List>
    );
  };

  const renderUsersList = (): JSX.Element => {
    if (!usersData) return;

    return (
      <List>
        {usersData.map((user) => {
            const { id, email, name } = user

            if(name === loggedUserName || email === loggedUserEmail) return;
            return (<UserItem key={id} user={user} /> );
        })}
      </List>
    );
  };

  return (
    <Box component="form" sx={{ mt: 5 }} noValidate autoComplete="off">
      <TextField
        required
        id="outlined-required"
        label="Enter a name or email"
        sx={{
          width: "100%",
        }}
        onChange={(e) => setSearchedQuery(e.target.value)}
      />
      { searchedQuery?.length ? renderSearchedUsers(searchedQuery) : renderUsersList() }
      <Box sx={{ mt: 2, textAlign: "right" }}>
        <Button variant="contained" onClick={handleClose}>
          Done
        </Button>
      </Box>
    </Box>
  );
};

export default UsersList;
