import { _fetch, _fetchBlob } from "helpers/fetchProvider";
import { serverEndpoints } from "helpers/configs";
import useLocalStorage from "./useLocalStorage";


const useFetch = (): UseFetch => {
    const { login, register, channels, usersData, recording, userData, directMessages } = serverEndpoints;
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

    // DM's


    const getDirectChannelInfo = (userEmail: string) => {
        const additionalPath = `${directMessages}/${userEmail}`;
        const options = { 
            method: 'GET',
            headers: { Authorization: `Bearer ${access_token}` } 
        };
        return _fetch({additionalPath, options});
    } 


    // Rooms

    const getDataOfAllUserChannels = (): Promise<AllChannelsResponse> => {
        const additionalPath = `${channels}`;
        const options = { 
            method: 'GET', 
            headers: { Authorization: `Bearer ${access_token}` } 
        }
        return _fetch({ additionalPath, options })
    }

    const getAllChannelsData = (): Promise<AllChannelsResponse> => {
        const additionalPath = `${channels}?all_rooms=true`;
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

    const createChannel = (channelData: { name: string, isPublic: boolean }) => {
        const additionalPath = channels;
        const options = { 
            method: 'POST',
            body: JSON.stringify(channelData),
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}` 
            } 
        }
        return _fetch({ additionalPath, options })
    }

    const editChannelUsers = (channelName: string, usersEmails: any ) => {
        const additionalPath = `${channels}/${channelName}`;
        const options = { 
            method: 'PUT',
            body: JSON.stringify(usersEmails),
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}` 
            } 
        }
        return _fetch({ additionalPath, options })
    }

    const leaveChannel = (channelName: string) => {
        const additionalPath = `${channels}/${channelName}/leave`;
        const options = { 
            method: 'PUT',
            body: JSON.stringify(channelName),
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}` 
            } 
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


    return { signIn, signUp, getDataOfAllUserChannels, getAllUsersData, getChannelData, getTranscriptionFile, getRecording, sendRecord, getUserAvatar, getUserData, createChannel, editChannelUsers, leaveChannel, getAllChannelsData, getDirectChannelInfo };
}

export default useFetch;