import { createSlice } from '@reduxjs/toolkit';

const initState: CurrentChannelContentInitState = {
  currentChannelContent: null,
  isRecording: false,
  browseChannelsContent: null
};

const slice = createSlice({
  name: 'currentContent',
  initialState: initState,
  reducers: {
    setCurrentChannelContent: (state, action) => {
      state.browseChannelsContent = null;
      state.currentChannelContent = action.payload;
    },
    setIsRecording: (state, action) => {
      state.isRecording = action.payload
    },
    setBrowseChannelsContent: (state, action) => {
      state.currentChannelContent = null;
      state.browseChannelsContent = action.payload;
    },
  },
});

export const { setCurrentChannelContent, setIsRecording, setBrowseChannelsContent } = slice.actions;

export default slice.reducer;
