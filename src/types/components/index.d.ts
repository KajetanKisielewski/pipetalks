// ChannelItem

interface ChannelItemProps {
    name: string;
    private?: boolean;
}

// ChannelsList

interface ChannelsListData {
    name: string;
    createdAt: string;
    private: boolean;
    users: {
      id: string;
      name: string;
      email: string;
    }[]
}


// DirectMessageItem

interface DirectMessageItemProps {
    name: string;
}

// DirectMessagesList

interface DirectMessageListData {
    id: string,
    name: string,
    email: string,
}