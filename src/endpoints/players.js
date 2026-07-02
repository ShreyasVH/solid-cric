import { post, get } from '../utils/api';
const endpoint = import.meta.env.VITE_API_ENDPOINT;

export const getStats = async payload => {
    const url = endpoint + '/cric/v1/stats';
    return post(url, payload);
};

export const getDetails = async id => {
    const url = endpoint + `/cric/v1/players/${id}`;
    return get(url);
};