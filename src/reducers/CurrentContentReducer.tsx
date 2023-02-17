import { createSlice } from '@reduxjs/toolkit';

const initState: CurrentChannelContentInitState = {
  currentChannelContent: null,
  isRecording: false,
  browseChannelsContent: null,
  directMessageContent: null,
};

const slice = createSlice({
  name: 'currentContent',
  initialState: initState,
  reducers: {
    setCurrentChannelContent: (state, action) => {
      state.browseChannelsContent = null;
      state.directMessageContent = null;
      state.currentChannelContent = action.payload;
    },
    setIsRecording: (state, action) => {
      state.isRecording = action.payload
    },
    setBrowseChannelsContent: (state, action) => {
      state.currentChannelContent = null;
      state.directMessageContent = null;
      state.browseChannelsContent = action.payload;
    },
    setDirectmessageContent: (state, action) => {
      state.currentChannelContent = null;
      state.browseChannelsContent = null;
      state.directMessageContent = action.payload;
    },
  },
});

export const { setCurrentChannelContent, setIsRecording, setBrowseChannelsContent, setDirectmessageContent } = slice.actions;

export default slice.reducer;
