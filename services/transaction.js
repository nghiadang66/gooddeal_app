import axios from "axios";
import { API_URL } from "../config";

export const listTransactionsByUser = async (userId, token, filter) => {
    const { sortBy, order, limit, page } = filter;
    try {
        const res = await axios.get(`${API_URL}/transactions/by/user/${userId}?sortBy=${sortBy}&order=${order}&limit=${limit}&page=${page}`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('listTransactionsByUser', error);
    }
}

export const createTransactionByUser = async (userId, token, transaction) => {
    try {
        const res = await axios({
            method: 'post',
            url: `${API_URL}/transaction/create/by/user/${userId}`,
            data: transaction,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            validateStatus: function (status) {
                return status < 500;
            },
        });
        return res.data;
    } catch (error) {
        console.log('createTransactionByUser', error);
    }
}

export const listTransactionsByStore = async (userId, token, filter, storeId) => {
    const { sortBy, order, limit, page } = filter;
    try {
        const res = await axios.get(`${API_URL}/transactions/by/store/${storeId}/${userId}?sortBy=${sortBy}&order=${order}&limit=${limit}&page=${page}`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('listTransactionsByStore', error);
    }
}

export const createTransactionByStore = async (userId, token, transaction, storeId) => {
    try {
        const res = await axios({
            method: 'post',
            url: `${API_URL}/transaction/create/by/store/${storeId}/${userId}`,
            data: transaction,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            validateStatus: function (status) {
                return status < 500;
            },
        });
        return res.data;
    } catch (error) {
        console.log('createTransactionByStore', error);
    }
}