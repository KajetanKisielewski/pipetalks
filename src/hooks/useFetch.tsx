import { _fetch } from "helpers/fetchProvider";
import { serverEndpoints } from "helpers/configs";
import useLocalStorage from "./useLocalStorage";


const useFetch = (): UseFetch => {
    const { login, register, channels, users, recording } = serverEndpoints;
    const { getLocalStorage } = useLocalStorage();
    const { access_token } = getLocalStorage() || {};

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

    const getAllChannels = (): Promise<AllChannelsResponse> => {
        const additionalPath = channels;
        const options = { 
            method: 'GET', 
            headers: { Authorization: `Bearer ${access_token}` } 
        }

        return _fetch({ additionalPath, options })
    }

    const getAllUsers = (): Promise<AllUsersResponse> => {
        const additionalPath = users;
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

    const sendRecord = (recordData: FormData): Promise<RecordDataResponse> => {
        const additionalPath = `recordings`;
        const options = { 
            method: 'POST', 
            body: recordData, 
            headers: { Authorization: `Bearer ${access_token}` } 
        };

        return _fetch({additionalPath, options});
    };

    const getTranscribe = (filename: string): Promise<TranscribeReponse> => {
        const additionalPath = `transcriptions/file/${filename}`;
        const options = { 
            method: 'GET', 
            headers: { Authorization: `Bearer ${access_token}` } 
        };

        return _fetch({additionalPath, options});
    }

    const getRecording = (filename: string): Promise<Blob | void> => {
        const { mainPath } = serverEndpoints;
        const additionalPath = `${recording}/file/${filename}`;
        const options = { 
            method: 'GET', 
            headers: { Authorization: `Bearer ${access_token}` } 
        };
        const url = mainPath + additionalPath;

        return fetch(url, options)
            .then((resp) => {
                if (resp.ok) return resp.blob();
            
                return Promise.reject(resp);
            })
            .catch((err) => console.log('error' , err) );
    }



    return { signIn, signUp, getAllChannels, getAllUsers, getChannelData, getTranscribe, getRecording, sendRecord };
}

export default useFetch;