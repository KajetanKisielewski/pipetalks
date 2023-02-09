// useFetch

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

// useLocalStorage

interface SignInResponse {
    access_token: string;
}

interface UseLocalStorage {
    getLocalStorage: () => SignInResponse;
    setLocalStorage: (signInResponse: SignInResponse) => void;
}
  
