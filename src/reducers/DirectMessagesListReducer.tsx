import { createSlice } from '@reduxjs/toolkit';

const initState: DirectMessagesInitState = {
  directMessagesListDisplay: true,
};

const slice = createSlice({
  name: 'directMessages',
  initialState: initState,
  reducers: {
    setDirectMessagesListDisplay: (state, action) => {
      state.directMessagesListDisplay = action.payload;
    }
  },
});

export const { setDirectMessagesListDisplay } = slice.actions;

export default slice.reducer;
