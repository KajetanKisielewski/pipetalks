import React from "react";
import { List, Box, Button, TextField, styled } from "@mui/material";

import { useAppSelector, useAppDispatch } from "hooks";
import { toggleAddUsersModal } from 'reducers/ChannelsListReducer';
import { toggleCreateDirectMessageModal } from "reducers/DirectMessagesListReducer";

import UserItem from "components/Dashboard/UserItem/UserItem";

interface UserListProps {
  isDM: boolean;
}

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#ffffffb2',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#ffffffb2',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ffffffb2',
    },
    '&:hover fieldset': {
      borderColor: '#ffffffb2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ffffffb2',
    },
  },
});

const UsersList = (props: UserListProps): JSX.Element => {
  const [searchedQuery, setSearchedQuery] = React.useState("");
  const { userData, usersData } = useAppSelector((state) => state.userData);
  const dispatch = useAppDispatch();

  const { isDM } = props;
  const { name: loggedUserName , email: loggedUserEmail } = userData;

  const handleCloseAddUser = () => dispatch(toggleAddUsersModal(false))

  const handleCloseDirectMessage = () => dispatch(toggleCreateDirectMessageModal(false))

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
            return (<UserItem key={id} user={user} isDM={isDM}/> )
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
            return (<UserItem key={id} user={user} isDM={isDM}/> );
        })}
      </List>
    );
  };

  return (
    <Box component="form" sx={{ mt: 5 }} noValidate autoComplete="off">
      <StyledTextField
        required
        id="outlined-required"
        label="Enter a name or email"
        sx={{
          width: '100%',
          input: { color: '#ffffffb2' },
          label: { color: '#ffffffb2' },
        }}
        onChange={(e) => setSearchedQuery(e.target.value)}
      />
      { searchedQuery?.length ? renderSearchedUsers(searchedQuery) : renderUsersList() }
      <Box sx={{ mt: 2, textAlign: "right" }}>
        <Button variant="contained" color='success' onClick={isDM ? handleCloseDirectMessage : handleCloseAddUser }>
          Done
        </Button>
      </Box>
    </Box>
  );
};

export default UsersList;
