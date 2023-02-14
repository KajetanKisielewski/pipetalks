// ChannelItem

interface ChannelItemProps {
    name: string;
    isPublic: boolean;
}

// ChannelsList

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