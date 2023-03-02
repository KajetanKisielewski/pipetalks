import { createSlice } from '@reduxjs/toolkit';

const initState: DirectMessagesInitState = {
  directMessagesListDisplay: true,
  createDirectMessageModal: false,
  directMessagesListData: [],
  allDirectChannelsListData: [],
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
    setAllDirectChannelsListData: (state, action) => {
      state.allDirectChannelsListData = action.payload;
    },
  },
});

export const { setDirectMessagesListDisplay, toggleCreateDirectMessageModal, setDirectMessagesListData, setAllDirectChannelsListData } = slice.actions;

export default slice.reducer;
