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
    recordings: any;
    users: any;
    createdAt: any;
}

// DashBoard

interface UsersListData {
    id: string,
    name: string,
    email: string,
}

// UserItem

interface UserItemProps {
    user: UsersData;
    isDM: boolean;
}