import { createSlice } from '@reduxjs/toolkit';

const initState: DirectMessagesInitState = {
  directMessagesListDisplay: true,
  createDirectMessageModal: false,
  directMessagesListData: []
};

const slice = createSlice({
  name: 'directMessages',
  initialState: initState,
  reducers: {
    setDirectMessagesListDisplay: (state, action) => {
      state.directMessagesListDisplay = action.payload;
    },
    toggleCreateDirectMessageModal: (state, action) => {
      state.createDirectMessageModal = action.payload;
    },
    setDirectMessagesListData: (state, action) => {
      if (!state.directMessagesListData.some( (directMessage) => directMessage.id === action.payload.id))
      state.directMessagesListData.push(action.payload);
    },
  },
});

export const { setDirectMessagesListDisplay, toggleCreateDirectMessageModal, setDirectMessagesListData } = slice.actions;

export default slice.reducer;
