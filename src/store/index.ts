import { combineReducers, configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import ChannelsListReducer from 'reducers/ChannelsListReducer';
import DirectMessagesListReducer from 'reducers/DirectMessagesListReducer';

const reducer = combineReducers({
  channelsList: ChannelsListReducer,
  directMessagesList: DirectMessagesListReducer,
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
