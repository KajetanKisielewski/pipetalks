// ChannelsListReducer

interface ChannelsListData {
    name: string;
    createdAt: string;
    recordings: [];
    transcriptions: [];
    users: {
      id: string;
      name: string;
      email: string;
    }[]
}
  
interface ChannelsListInitState {
    channelsListDisplay: boolean;
    channelsListData: ChannelsListData[]
}
  

// DirectMessagesListReducer

interface DirectMessageListData {
    id: string,
    name: string,
    email: string,
}
    
 interface DirectMessagesInitState {
    directMessagesListDisplay: boolean;
    directMessagesListData: DirectMessageListData[]
}
