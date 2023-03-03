import { createSlice } from '@reduxjs/toolkit';

const initState: CurrentChannelContentInitState = {
  currentChannelContent: null,
  isRecording: false,
  browseChannelsContent: null,
  directMessageContent: null,
  userSettingsContentDisplay: false,

  isNavView: true,
  isCurrentChannelView: false,
  isBrowseChannelsView: false,
  isDirectMessageView: false,
  isUserSettingsView: false,

  isCurrentChannelViewDesktop: false,
  isBrowseChannelsViewDesktop: true,
  isDirectMessageViewDesktop: false,
  isUserSettingsViewDesktop: false,
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
    setBrowseChannelsView: (state, action) => {
      state.isBrowseChannelsView = action.payload
    },
    setDirectMessageView: (state, action) => {
      state.isDirectMessageView = action.payload
    },
    setUserSettingsView: (state, action) => {
      state.isUserSettingsView = action.payload
    },

    setCurrentChannelViewDesktop: (state, action) => {
      state.isCurrentChannelViewDesktop = action.payload;
    },
    setBrowseChannelsViewDesktop: (state, action) => {
      state.isBrowseChannelsViewDesktop = action.payload
    },
    setDirectMessageViewDesktop: (state, action) => {
      state.isDirectMessageViewDesktop = action.payload
    },
    setUserSettingsViewDesktop: (state, action) => {
      state.isUserSettingsViewDesktop = action.payload
    }
  },
});

export const { setCurrentChannelContent, setIsRecording, setBrowseChannelsContent, setDirectmessageContent, setUserSettingsCotent, setNavView, setCurrentChannelView, setBrowseChannelsView, setDirectMessageView, setUserSettingsView, setCurrentChannelViewDesktop, setBrowseChannelsViewDesktop, setDirectMessageViewDesktop, setUserSettingsViewDesktop } = slice.actions;

export default slice.reducer;
