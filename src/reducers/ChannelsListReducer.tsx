import { createSlice } from '@reduxjs/toolkit';

const initState: ChannelsListInitState = {
  channelsListDisplay: true,
  channelsListData: [],
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
    }
  },
});

export const { setChannelsListDisplay, setChannelsListData } = slice.actions;

export default slice.reducer;
