// useFetch

interface FetchProps {
    options: {
        method: string;
        body?: URLSearchParams | string | FormData;
        headers?: {
            'Content-Type'?: string,
            Authorization?: string;
        }
    }
    additionalPath: string;
}

interface CreateChannelBody {
    channelName: string;
    isPublic: boolean;
}

interface UseFetch {
    signIn: (userData: URLSearchParams) => Promise<SignInAndUpResponse>;
    signUp: (userData: any) => Promise<SignInAndUpResponse>;
    getDataOfAllUserChannels: () => Promise<AllChannelsResponse>;
    getAllChannelsData: () => Promise<AllChannelsResponse>
    getAllUsersData: () => Promise<AllUsersResponse>;
    getChannelData: (channelName: string) => Promise<ChannelResponse>;
    getTranscriptionFile: (filename: string) => Promise<TranscribeReponse>;
    getRecording: (filename: string) => Promise<Blob | void>;
    sendRecord: (recordData: FormData) => Promise<RecordDataResponse>;
    getUserAvatar: (filename: string) => Promise<unknown>;
    getUserData: () => Promise<unknown>;
    createChannel: ( {name: string, isPublic: boolean} ) => Promise<unknown>;
    editChannelUsers: (channelName: string, usersEmails?: any) => Promise<unknown>;
    leaveChannel: (channelName: string) => Promise<unknow>;
    getDirectChannelInfo: (userEmail: string) => Promise<unknown>;
    editUserSettings: (userData: any) => Promise<unknown>
}

interface SignInAndUpResponse {
    "access_token": string;
}

interface AllChannelsResponse {
    pageNumber: number,
    pageSize: number,
    totalRecordCount: number,
    pagination: {
      next: string | null,
      previous: string | null
    },
    records: {
        name: string
        createdAt: string;
        isPublic: boolean;
        users: {
            id: string;
            name: string;
            email: string;
        }[]
    }[]
}

interface AllUsersResponse {
    pageNumber: number,
    pageSize: number,
    totalRecordCount: number,
    pagination: {
      next: string | null,
      previous: string | null
    },
    records: {
        id: string;
        name: string;
        email: string;
    }[]
}

interface ChannelResponse {
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


interface TranscribeReponse {
    text: string;
    roomName: string;
};

interface RecordDataResponse {
    "info": "string"
}
  

// useLocalStorage

interface SignInResponse {
    access_token: string;
}

interface UseLocalStorage {
    getLocalStorage: () => SignInResponse;
    setLocalStorage: (signInResponse: SignInResponse) => void;
    clearLocalStorage: () => void;
}


// UseMediaRecorder

interface MediaRecorderData {
    startRecordingAudio: () => void;
    stopRecordingAudio: () => void;
    playRecord: () => void;
    prepereRecord: () => Blob;
    clearMediaRecorderState: () => void;
}
