// useFetch

interface UseFetch {
    signIn: (userData: URLSearchParams) => Promise<SignInAndUpResponse>;
    signUp: (userData: any) => Promise<SignInAndUpResponse>;
    getAllChannels: () => Promise<AllChannelsResponse>;
    getAllUsers: () => Promise<AllUsersResponse>;
    getChannelData: (channelName: string) => Promise<ChannelResponse>;
    getTranscribe: (filename: string) => Promise<TranscribeReponse>;
    getRecording: (filename: string) => Promise<Blob | void>;
    sendRecord: (recordData: FormData) => Promise<RecordDataResponse>;
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
        recordings: [],
        transcriptions: [],
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
        userEmail: string;
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
}


// UseMediaRecorder

interface MediaRecorderData {
    startRecordingAudio: () => void;
    stopRecordingAudio: () => void;
    playRecord: () => void;
    prepereRecord: () => Blob;
    clearMediaRecorderState: () => void;
}
