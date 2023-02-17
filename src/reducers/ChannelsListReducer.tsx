import { createSlice } from '@reduxjs/toolkit';

const initState: ChannelsListInitState = {
  channelsListDisplay: true,
  channelsListData: [],
  createChannelModal: false,
  addUsersModal: false,
  currentlyCreatedChannel: null,
  allChannelsListData: [],
};

const slice = createSlice({
  name: 'channelsList',
  initialState: initState,
  reducers: {
    setChannelsListDisplay: (state, action) => {
      state.channelsListDisplay = action.payload;
    },
    setChannelsListData: (state, action) => {
      state.channelsListData = action.payload
    },
    toggleCreateChannelModal: (state, action) => {
      state.createChannelModal = action.payload;
    },
    toggleAddUsersModal: (state, action) => {
      state.addUsersModal = action.payload;
    },
    setCurrentlyCreatedChannel: (state, action) => {
      state.currentlyCreatedChannel = action.payload
    },
    setAllChannelsListData: (state, action) => {
      state.allChannelsListData = action.payload;
    },
  },
});

export const { setChannelsListDisplay, setChannelsListData, toggleCreateChannelModal, toggleAddUsersModal, setCurrentlyCreatedChannel, setAllChannelsListData } = slice.actions;

export default slice.reducer;
