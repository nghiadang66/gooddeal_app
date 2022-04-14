import axios from "axios";
import { API_URL } from "../config";

export const listReviews = async (filter) => {
    const { productId, storeId, userId, rating, sortBy, order, limit, page } = filter;
    try {
        const res = await axios.get(`${API_URL}/reviews?productId=${productId}&storeId=${storeId}&userId=${userId}&rating=${rating}&sortBy=${sortBy}&order=${order}&limit=${limit}&page=${page}`);
        return res.data;
    } catch (error) {
        console.log('listReviews', error);
    }
}