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
export const listCarts = (userId, token, filter) => {
    const { limit, page } = filter;
    return fetch(`${API_URL}/carts/${userId}?limit=${limit}&page=${page}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
};
export const listItemsByCart = (userId, token, cartId) => {
    return fetch(`${API_URL}/cart/items/${cartId}/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
};

export const deleteFromCart = (userId, token, cartItemId) => {
    return fetch(`${API_URL}/cart/remove/${cartItemId}/${userId}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
};

export const updateCartItem = (userId, token, count, cartItemId) => {
    return fetch(`${API_URL}/cart/update/${cartItemId}/${userId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(count),
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
};