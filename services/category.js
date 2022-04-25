import axios from 'axios';
import { API_URL } from '../config';

export const listActiveCategories = async (filter) => {
    const { search, sortBy, order, limit, page, categoryId } = filter;
    try {
        const res = await axios
            .get(`${API_URL}/active/categories?search=${search}&categoryId=${categoryId}&sortBy=${sortBy}&order=${order}&limit=${limit}&page=${page}`);
        return res.data;
    } catch (error) {
        console.error('listActiveCategories', error);
    }
}