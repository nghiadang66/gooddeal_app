import axios from "axios";
import { API_URL } from "../config";

export const getCartCount = async (userId, token) => {
    try {
        const res = await axios.get(`${API_URL}/cart/count/${userId}`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('getCartCount', error);
    }
}

export const addToCart = async (userId, token, cartItem) => {
    try {
        const res = await axios.post(`${API_URL}/cart/add/${userId}`, cartItem,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            validateStatus: function (status) {
                return status < 500;
            }
        });
        return res.data;
    } catch (error) {
        console.log('addToCart', error);
    }
}