import { createSlice } from '@reduxjs/toolkit';

const initState: CurrentChannelContentInitState = {
  currentChannelContent: null,
  isRecording: false,
  browseChannelsContent: null,
  directMessageContent: null,
  userSettingsContentDisplay: false,

  isNavView: true,
  isCurrentChannelView: false,

};

const slice = createSlice({
  name: 'currentContent',
  initialState: initState,
  reducers: {
    setCurrentChannelContent: (state, action) => {
      state.browseChannelsContent = null;
      state.directMessageContent = null;
      state.currentChannelContent = action.payload;
      state.userSettingsContentDisplay = false;
    },
    setIsRecording: (state, action) => {
      state.isRecording = action.payload
    },
    setBrowseChannelsContent: (state, action) => {
      state.currentChannelContent = null;
      state.directMessageContent = null;
      state.browseChannelsContent = action.payload;
      state.userSettingsContentDisplay = false;
    },
    setDirectmessageContent: (state, action) => {
      state.currentChannelContent = null;
      state.browseChannelsContent = null;
      state.directMessageContent = action.payload;
      state.userSettingsContentDisplay = false;
    },
    setUserSettingsCotent: (state, action) => {
      state.currentChannelContent = null;
      state.browseChannelsContent = null;
      state.directMessageContent = null;
      state.userSettingsContentDisplay = action.payload;
    },


    setNavView: (state, action) => {
      state.isNavView = action.payload;
    },
    setCurrentChannelView: (state, action) => {
      state.isCurrentChannelView = action.payload;
    },
    // setBrowseChannelsView: (state, action) => {
    //   state.isNavView = !state.isMobileView
    // },
    // setDirectMessageView: (state, action) => {
    //   state.isNavView = !state.isMobileView
    // },
    // setUserSettingsView: (state, action) => {
    //   state.isNavView = !state.isMobileView
    // }
  },
});

export const { setCurrentChannelContent, setIsRecording, setBrowseChannelsContent, setDirectmessageContent, setUserSettingsCotent, setNavView, setCurrentChannelView } = slice.actions;

export default slice.reducer;
