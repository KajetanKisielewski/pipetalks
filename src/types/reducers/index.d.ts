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


// CurrentContentReducer

interface CurrentContentData  {
    createdAt: string;
    name: string;
    private: boolean;
    recordings: {
        createdAt: string;
        duration: number;
        filename: string;
        id: number;
        roomName: string;
        transcription: {
            createdAt: string;
            filename: string;
            id: number;
            language: string;
            url: string;
        }
        url: string;
        user: {
            email: string;
            name: string;
            settings: {
                imageUrl: null;
            }
        }
    }[]
    users: {
        id: string;
        name: string;
        email: string;
    }[]
}

interface CurrentContentInitState {
    currentContent: CurrentContentData;
    isRecording: boolean;
}