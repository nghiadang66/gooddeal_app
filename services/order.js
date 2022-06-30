import axios from 'axios';
import { API_URL } from '../config';

export const createOrder = (userId, token, cartId, order) => {
    return fetch(`${API_URL}/order/create/${cartId}/${userId}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
};
