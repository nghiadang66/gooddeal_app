import axios from "axios";
import { API_URL } from "../config";

export const listOrdersByStore = async (userId, token, filter, storeId) => {
    try {
        const { search, sortBy, order, limit, page, status } = filter;
        const res = await axios.get(`${API_URL}/orders/by/store/${storeId}/${userId}?search=${search}&status=${status}&sortBy=${sortBy}&order=${order}&limit=${limit}&page=${page}`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('listOrdersByStore', error);
    }
}