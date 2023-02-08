import { _fetch } from "helpers/fetchProvider";
import { serverEndpoints } from "helpers/configs";

interface SignInAndUpResponse {
    "access_token": string;
}

const useFetch = () => {
    const { login, register } = serverEndpoints;

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

    return { signIn, signUp };
}

export default useFetch;