import { createSlice } from '@reduxjs/toolkit';

const initState: ChannelsListInitState = {
  channelsListDisplay: true,
  channelsListData: [],
  createChannelModal: false,
  addUsersModal: false,
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
  },
});

export const { setChannelsListDisplay, setChannelsListData, toggleCreateChannelModal, toggleAddUsersModal } = slice.actions;

export default slice.reducer;
