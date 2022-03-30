import axios from "axios";
import { API_URL } from "../config";

export const listStoresByUser = async (userId, token, filter) => {
    try {
        const { search, sortBy, order, limit, page } = filter;
        const res = await axios.get(`${API_URL}/stores/by/user/${userId}?search=${search}&sortBy=${sortBy}&order=${order}&limit=${limit}&page=${page}`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('listStoresByUser', error);
    }
}

export const getlistStores = async (filter) => {
    try {
        const { search, sortBy, sortMoreBy, order, limit, page, isActive } = filter;
        const res = await axios.get(`${API_URL}/stores?search=${search}&isActive=${isActive}&sortBy=${sortBy}&sortMoreBy=${sortMoreBy}&order=${order}&limit=${limit}&page=${page}`);
        return res.data;
    } catch (error) {
        console.log('getlistStores', error);
    }
}