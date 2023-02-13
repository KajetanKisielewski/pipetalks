import { createSlice } from '@reduxjs/toolkit';

const initState: UserDataInitState = {
  userData: null
};

const slice = createSlice({
  name: 'userData',
  initialState: initState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    }
  },
});

export const { setUserData } = slice.actions;

export default slice.reducer;
