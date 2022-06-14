import axios from 'axios';
import { API_URL } from '../config';

export const listActiveProducts = async (filter) => {
    const {
        search,
        sortBy,
        order,
        limit,
        page,
        rating,
        minPrice,
        maxPrice,
        categoryId,
    } = filter;

    try { 
        const res = await axios.get(`${API_URL}/active/products?search=${search}&rating=${rating}&minPrice=${minPrice}&maxPrice=${maxPrice}&categoryId=${categoryId}&sortBy=${sortBy}&order=${order}&limit=${limit}&page=${page}`);
        return res.data;
    } catch (error) {
        console.log('listActiveProducts', error);
    }
}

export const listSellingProductsByStore = async (filter, storeId) => {
    const {
        search,
        sortBy,
        order,
        limit,
        page,
        rating,
        minPrice,
        maxPrice,
        categoryId,
    } = filter;

    try { 
        const res = await axios.get(`${API_URL}/selling/products/by/store/${storeId}?search=${search}&rating=${rating}&minPrice=${minPrice}&maxPrice=${maxPrice}&categoryId=${categoryId}&sortBy=${sortBy}&order=${order}&limit=${limit}&page=${page}`);
        return res.data;
    } catch (error) {
        console.log('listSellingProductsByStore', error);
    }
}

export const getProduct = async (productId) => {
    try { 
        const res = await axios.get(`${API_URL}/product/${productId}`);
        return res.data;
    } catch (error) {
        console.log('getProduct', error);
    }
}

export const getProductByIdForManager = async (userId, token, productId, storeId) => {
    try { 
        const res = await axios.get(`${API_URL}/product/for/manager/${productId}/${storeId}/${userId}`,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }, 
            });
        return res.data;
    } catch (error) {
        console.log('getProductByIdForManager', error);
    }
}

export const listProductsForManager = async (userId, token, filter, storeId) => {
    try {
        const { search, sortBy, order, limit, page, isSelling } = filter;
        const res = await axios.get(`${API_URL}/products/by/store/${storeId}/${userId}?search=${search}&isSelling=${isSelling}&sortBy=${sortBy}&order=${order}&limit=${limit}&page=${page}`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('listProductsForManager', error);
    }
}

export const sellOrStoreProduct = async (userId, token, value, storeId, productId) => {
    try {
        const res = await axios.put(`${API_URL}/product/selling/${productId}/${storeId}/${userId}`,
        value,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('sellOrStoreProduct', error);
    }
}

export const createProduct = async (userId, token, product, storeId) => {
    try {
        const res = await axios({
            method: 'post',
            url: `${API_URL}/product/create/${storeId}/${userId}`,
            data: product,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
            validateStatus: function (status) {
                return status < 500;
            },
            transformRequest: [function (data, headers) {
                return data;
            }],
        });
        return res.data;
    } catch (error) {
        console.log('createProduct', error);
    }
}

export const updateProduct = async (userId, token, product, productId, storeId) => {
    try {
        const res = await axios({
            method: 'put',
            url: `${API_URL}/product/update/${productId}/${storeId}/${userId}`,
            data: product,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
            validateStatus: function (status) {
                return status < 500;
            },
            transformRequest: [function (data, headers) {
                return data;
            }],
        });
        return res.data;
    } catch (error) {
        console.log('updateProduct', error);
    }
}

export const addListImages = async (userId, token, photo, productId, storeId) => {
    try {
        const res = await axios({
            method: 'post',
            url: `${API_URL}/product/images/${productId}/${storeId}/${userId}`,
            data: photo,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
            transformRequest: [function (data, headers) {
                return data;
            }],
        });
        return res.data;
    } catch (error) {
        console.log('addListImages', error);
    }
}

export const updateListImages = async (
    userId,
    token,
    photo,
    index,
    productId,
    storeId,
) => {
    try {
        const res = await axios({
            method: 'put',
            url: `${API_URL}/product/images/${productId}/${storeId}/${userId}?index=${index}`,
            data: photo,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
            },
            transformRequest: [function (data, headers) {
                return data;
            }],
        });
        return res.data;
    } catch (error) {
        console.log('updateListImages', error);
    }
}

export const removeListImages = async (userId, token, index, productId, storeId) => {
    try {
        const res = await axios.delete(`${API_URL}/product/images/${productId}/${storeId}/${userId}?index=${index}`,
        {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('removeListImages', error);
    }
}