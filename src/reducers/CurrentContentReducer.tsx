import { createSlice } from '@reduxjs/toolkit';

const initState: CurrentContentInitState = {
  currentContent: null,
  isRecording: false
};

const slice = createSlice({
  name: 'channelsList',
  initialState: initState,
  reducers: {
    setCurrentContent: (state, action) => {
      state.currentContent = action.payload;
    },
    clearCurrentContent: (state, action) => {
      state.currentContent = null
    },
    setIsRecording: (state, action) => {
      state.isRecording = action.payload
    }
  },
});

export const { setCurrentContent, clearCurrentContent, setIsRecording } = slice.actions;

export default slice.reducer;
