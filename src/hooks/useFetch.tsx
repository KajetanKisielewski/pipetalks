import { _fetch } from "helpers/fetchProvider";
import { serverEndpoints } from "helpers/configs";
import useLocalStorage from "./useLocalStorage";


const useFetch = () => {
    const { login, register, channels, users } = serverEndpoints;
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

    return { signIn, signUp, getAllChannels, getAllUsers };
}

export default useFetch;