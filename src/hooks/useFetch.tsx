import { _fetch, _fetchBlob } from "helpers/fetchProvider";
import { serverEndpoints } from "helpers/configs";
import useLocalStorage from "./useLocalStorage";


const useFetch = (): UseFetch => {
    const { login, register, channels, usersData, recording, userData } = serverEndpoints;
    const { getLocalStorage } = useLocalStorage();
    const { access_token } = getLocalStorage() || {};

    // Transcription

    const getTranscriptionFile = (filename: string): Promise<TranscribeReponse> => {
        const additionalPath = `transcriptions/file/${filename}`;
        const options = { 
            method: 'GET', 
            headers: { Authorization: `Bearer ${access_token}` } 
        };
        return _fetch({additionalPath, options});
    }

    // Auth

    const signIn = (userData: URLSearchParams): Promise<SignInAndUpResponse> => {
        const additionalPath = login;
        const options = { 
            method: 'POST', 
            body: userData,
        }
        return _fetch({ additionalPath, options })
    };

    const signUp = (userData: any): Promise<SignInAndUpResponse> => {
        const additionalPath = register;
        const options = { 
            method: 'POST', 
            body: JSON.stringify(userData),
        }
        return _fetch({ additionalPath, options })
    };

    // Recordings

    const sendRecord = (recordData: FormData): Promise<RecordDataResponse> => {
        const additionalPath = `recordings`;
        const options = { 
            method: 'POST', 
            body: recordData, 
            headers: { Authorization: `Bearer ${access_token}` } 
        };

        return _fetch({additionalPath, options});
    };

    const getRecording = (filename: string): Promise<Blob | void> => {
        const additionalPath = `${recording}/file/${filename}`;
        const options = { 
            method: 'GET', 
            headers: { Authorization: `Bearer ${access_token}` } 
        };
       return _fetchBlob({additionalPath, options});
    }


    // Users

    const getAllUsersData = (): Promise<AllUsersResponse> => {
        const additionalPath = usersData;
        const options = { 
            method: 'GET', 
            headers: { Authorization: `Bearer ${access_token}` } 
        }
        return _fetch({ additionalPath, options })
    }

    const getUserData = () => {
        const additionalPath = userData;
        const options = { 
            method: 'GET', 
            headers: { Authorization: `Bearer ${access_token}` } 
        };
        return _fetch({additionalPath, options});
    }


    // Rooms

    const getAllChannelsData = (): Promise<AllChannelsResponse> => {
        const additionalPath = channels;
        const options = { 
            method: 'GET', 
            headers: { Authorization: `Bearer ${access_token}` } 
        }
        return _fetch({ additionalPath, options })
    }

    const getChannelData = (channelName: string): Promise<ChannelResponse> => {
        const additionalPath = `${channels}/${channelName}`;
        const options = { 
            method: 'GET', 
            headers: { Authorization: `Bearer ${access_token}` } 
        }
        return _fetch({ additionalPath, options })
    }


    // Images
    
    const getUserAvatar = (filename: string) => {
        const additionalPath = `profile-image/${filename}`;
        const options = { 
            method: 'GET', 
            headers: { Authorization: `Bearer ${access_token}` } 
        };
        return _fetchBlob({additionalPath, options});
    }


    return { signIn, signUp, getAllChannelsData, getAllUsersData, getChannelData, getTranscriptionFile, getRecording, sendRecord, getUserAvatar, getUserData };
}

export default useFetch;