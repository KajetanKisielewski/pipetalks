import { combineReducers, configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import ChannelsListReducer from 'reducers/ChannelsListReducer';
import DirectMessagesListReducer from 'reducers/DirectMessagesListReducer';
import CurrentContentReducer from 'reducers/CurrentContentReducer';
import UserDataReducer from 'reducers/UserDataReducer';

const reducer = combineReducers({
  channelsList: ChannelsListReducer,
  directMessagesList: DirectMessagesListReducer,
  currentContent: CurrentContentReducer,
  userData: UserDataReducer,
});

export const store = configureStore({ reducer });

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
