import axios from "axios";
import { API_URL } from "../config";

export const getUserProfile = async (userId, token) => {
    try {
        const res = await axios.get(`${API_URL}/user/profile/${userId}`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('getUserProfile', data);
    }
}