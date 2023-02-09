// ChannelItem

interface ChannelItemProps {
    name: string;
}

// ChannelsList

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