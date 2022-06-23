import axios from "axios";
import { API_URL } from "../config";

export const listReviews = async (filter) => {
    try {
        const { productId, storeId, userId, rating, sortBy, order, limit, page } = filter;
        const res = await axios.get(`${API_URL}/reviews?productId=${productId}&storeId=${storeId}&userId=${userId}&rating=${rating}&sortBy=${sortBy}&order=${order}&limit=${limit}&page=${page}`);
        return res.data;
    } catch (error) {
        console.log('listReviews', error);
    }
}

export const checkReview = async (userId, token, data) => {
    try {
        const res = await axios({
            method: 'post',
            url: `${API_URL}/review/check/${userId}`,
            data: data,
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
        console.log('checkReview', error);
    }
}

export const reviewProduct = async (userId, token, review) => {
    try {
        const res = await axios({
            method: 'post',
            url: `${API_URL}/review/create/${userId}`,
            data: review,
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
        console.log('reviewProduct', error);
    }
}

export const editReview = async (userId, token, review, reviewId) => {
    try {
        const res = await axios({
            method: 'put',
            url: `${API_URL}/review/${reviewId}/${userId}`,
            data: review,
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
        console.log('editReview', error);
    }
}