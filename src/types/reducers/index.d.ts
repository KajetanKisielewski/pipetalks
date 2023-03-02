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
    currentlyCreatedChannel: string;
    allChannelsListData: ChannelsListData[];
}
  

// DirectMessagesListReducer

interface DirectMessageListData {
    name: string;
    createdAt: string;
    id: number;
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
    }[]
    users: {
        name:string;
        email: string;
        settings: {
            imageUrl: null 
        }
    }[]
}

interface DirectMessagesInitState {
    directMessagesListDisplay: boolean;
    createDirectMessageModal: boolean;
    directMessagesListData: DirectMessageListData[];
    allDirectChannelsListData: any[];
}


// CurrentChannelContentReducer

interface CurrentChannelContentData  {
    createdAt: string;
    name: string;
    isPublic: boolean;
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

interface CurrentChannelContentInitState {
    currentChannelContent: CurrentChannelContentData;
    isRecording: boolean;
    browseChannelsContent: ChannelsListData[];
    directMessageContent: DirectMessageListData;
    userSettingsContentDisplay: boolean;


    isNavView: boolean;
    isCurrentChannelView: boolean;
    isBrowseChannelsView: boolean;
    isDirectMessageView: boolean;
    isUserSettingsView: boolean;
}

// UserDataReducer

interface UsersData {
    id: string,
    name: string,
    email: string,
}

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
      },
      usersData: UsersData[]
}