// ChannelsListReducer

interface ChannelsListData {
    name: string;
    createdAt: string;
    isPublic: boolean;
    users: {
      id: string;
      name: string;
      email: string;
    }[]
}
  
interface ChannelsListInitState {
    channelsListDisplay: boolean;
    channelsListData: ChannelsListData[];
    createChannelModal: boolean;
    addUsersModal: boolean;
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

// UserDataReducer

interface UserDataInitState {
    userData: {
        id: string,
        name: string,
        email: string,
        isActive: boolean,
        isAdmin: boolean,
        updatedAt: null,
        createdAt: string,
        settings: {
          imageUrl: string;
          language: {
            code: string;
            value: string;
          },
          autoTranslate: boolean,
          translateLanguage: {
            code: string;
            value: string;
          }
        }
      }
}