import axios from 'axios';
import { API_URL } from '../config';

export const listActiveCategories = async (filter) => {
    const { search, sortBy, order, limit, page, categoryId } = filter;
    try {
        const response = await axios
            .get(
                `${API_URL}/active/categories?search=${search}&categoryId=${categoryId}&sortBy=${sortBy}&order=${order}&limit=${limit}&page=${page}`,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                },
            );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}