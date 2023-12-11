import { get } from '../utils/api';
const endpoint = import.meta.env.VITE_API_ENDPOINT;

export const getMatch = async id => {
    const url = endpoint + '/cric/v1/matches/' + id;
    return get(url);
}