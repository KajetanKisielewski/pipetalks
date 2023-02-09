import { createSlice } from '@reduxjs/toolkit';

const initState: DirectMessagesInitState = {
  directMessagesListDisplay: true,
  directMessagesListData: [],
};

const slice = createSlice({
  name: 'directMessages',
  initialState: initState,
  reducers: {
    setDirectMessagesListDisplay: (state, action) => {
      state.directMessagesListDisplay = action.payload;
    },
    setDirectMessagesListData: (state, action) => {
      if (!state.directMessagesListData.some( (directMessage) => directMessage.name === action.payload.name ))
      state.directMessagesListData.push(action.payload);
    }
  },
});

export const { setDirectMessagesListDisplay, setDirectMessagesListData } = slice.actions;

export default slice.reducer;
