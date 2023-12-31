import { get } from '../utils/api';
const endpoint = import.meta.env.VITE_API_ENDPOINT;

export const getSeries = async id => {
    const url = endpoint + '/cric/v1/series/' + id;
    return get(url);
}
