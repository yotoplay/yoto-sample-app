import axios from 'axios';
import { getAccessToken } from './yotoAuthService';
const BASE_URL = 'https://api.yotoplay.com';

export const getDevicesView = async () => {
    const url = `${BASE_URL}/device-v2/devices/mine`;
    return axios
        .get(url, { headers: { Authorization: `Bearer ${getAccessToken()}` } })
        .then(response => response.data);
};