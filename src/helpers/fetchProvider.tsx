import { serverEndpoints } from "./configs";

const { mainPath } = serverEndpoints;

export const _fetch = <T,>(props: FetchProps): Promise<T> => {
    const { options, additionalPath } = props;
    const url = mainPath + additionalPath;

    return fetch(url, options)
        .then((resp) => {
            if (resp.ok) return resp.json();

            return Promise.reject(resp);
        })
        .catch((err) => console.log('error' , err) );
};

export const _fetchBlob = (props: FetchProps): Promise<void | Blob> => {
    const { options, additionalPath } = props;
    const url = mainPath + additionalPath;

    return fetch(url, options)
        .then((resp) => {
            if (resp.ok) return resp.blob();

            return Promise.reject(resp);
        })
        .catch((err) => console.log('error' , err) );
};
