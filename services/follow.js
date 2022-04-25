import axios from "axios";
import { API_URL } from "../config";

//products
export const listFollowingProducts = async (userId, token, filter) => {
    try {
        const { search, sortBy, order, limit, page } = filter;
        const res = await axios.get(`${API_URL}/following/products/${userId}?&limit=${limit}&page=${page}`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('listFollowingProducts', error);
    }
}

export const getNumberOfFollowersForProduct = async (productId) => {
    try {
        const res = await axios.get(`${API_URL}/product/number/of/followers/${productId}`);
        return res.data
    } catch (error) {
        console.log('getNumberOfFollowersForProduct', error);
    }
};

//stores
export const listFollowingStores = async (userId, token, filter) => {
    try {
        const { search, sortBy, order, limit, page } = filter;
        const res = await axios.get(`${API_URL}/following/stores/${userId}?&limit=${limit}&page=${page}`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}