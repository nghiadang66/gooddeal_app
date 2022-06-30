import axios from 'axios';
import { API_URL } from '../config';

export const listStyleByCategory = async (categoryId) => {
    try {
        const res = await axios.get(`${API_URL}/active/styles?categoryId=${categoryId}&limit=100`);
        return res.data;
    } catch (error) {
        console.error('listStyleByCategory', error);
    }
}

export const listActiveStyleValues = async (styleId) => {
    try {
        const res = await axios.get(`${API_URL}/active/style/values/by/style/${styleId}`);
        return res.data;
    } catch (error) {
        console.error('listActiveStyleValues', error);
    }
}

export const createStyleValue = async (userId, token, styleValue) => {
    try {
        const res = await axios({
            method: 'post',
            url: `${API_URL}/style/value/create/${userId}`,
            data: styleValue,
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
        console.log('createStyleValue', error);
    }
}