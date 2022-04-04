import axios from "axios";
import { API_URL } from "../config";

export const getUserLevel = async (userId) => {
    try {
        const res = await axios.get(`${API_URL}/user/level/${userId}`);
        return res.data;
    } catch (error) {
        console.log('getUserLevel', error);
    }
}

export const getStoreLevel = async (storeId) => {
    try {
        const res = await axios.get(`${API_URL}/store/level/${storeId}`);
        return res.data;
    } catch (error) {
        console.log('getStoreLevel', error);
    }
}