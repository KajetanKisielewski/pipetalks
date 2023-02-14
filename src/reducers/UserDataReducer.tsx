import { createSlice } from '@reduxjs/toolkit';

const initState: UserDataInitState = {
  userData: null,
  usersData: [],
};

const slice = createSlice({
  name: 'userData',
  initialState: initState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUsersData: (state, action) => {
      if (!state.usersData.some( (userData) => userData.name === action.payload.name ))
      state.usersData.push(action.payload);
    }
  },
});

export const { setUserData, setUsersData } = slice.actions;

export default slice.reducer;
