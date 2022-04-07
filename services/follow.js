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

export const checkFollowingProduct = async (userId, token, productId) => {
    try {
        const res = await axios.get(`${API_URL}/check/following/products/${productId}/${userId}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('checkFollowingProduct', error);
    }
}

export const followProduct = async (userId, token, productId) => {
    try {
        const res = await axios.get(`${API_URL}/follow/product/${productId}/${userId}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('followProduct', error);
    }
}

export const unfollowProduct = async (userId, token, productId) => {
    try {
        const res = await axios.delete(`${API_URL}/unfollow/product/${productId}/${userId}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('unfollowProduct', error);
    }
}

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

export const getNumberOfFollowersForStore = async (storeId) => {
    try {
        const res = await axios.get(`${API_URL}/store/number/of/followers/${storeId}`);
        return res.data
    } catch (error) {
        console.log('getNumberOfFollowersForStore', error);
    }
};

export const checkFollowingStore = async (userId, token, storeId) => {
    try {
        const res = await axios.get(`${API_URL}/check/following/stores/${storeId}/${userId}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('checkFollowingStore', error);
    }
}

export const followStore = async (userId, token, storeId) => {
    try {
        const res = await axios.get(`${API_URL}/follow/store/${storeId}/${userId}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('followStore', error);
    }
}

export const unfollowStore = async (userId, token, storeId) => {
    try {
        const res = await axios.delete(`${API_URL}/unfollow/store/${storeId}/${userId}`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('unfollowStore', error);
    }
}