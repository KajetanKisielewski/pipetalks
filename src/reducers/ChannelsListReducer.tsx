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
      if (!state.channelsListData.some( (channel) => channel.name === action.payload.name))
      state.channelsListData.push(action.payload);
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
      if (!state.allChannelsListData.some( (channel) => channel.name === action.payload.name))
      state.allChannelsListData.push(action.payload);
    },
  },
});

export const { setChannelsListDisplay, setChannelsListData, toggleCreateChannelModal, toggleAddUsersModal, setCurrentlyCreatedChannel, setAllChannelsListData } = slice.actions;

export default slice.reducer;
