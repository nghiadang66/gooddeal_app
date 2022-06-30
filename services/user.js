import axios from "axios";
import { API_URL } from "../config";

export const getUserProfile = async (userId, token) => {
    try {
        const res = await axios.get(`${API_URL}/user/profile/${userId}`,
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('getUserProfile', error);
    }
}


export const getlistUsers = async (filter) => {
    const { search, sortBy, order, limit, page, role } = filter;
    try {
        const res = await axios.get(`${API_URL}/users?search=${search}&role=${role}&sortBy=${sortBy}&order=${order}&limit=${limit}&page=${page}`);
        return res.data;
    } catch (error) {
        console.log('getlistUsers', error);
    }
}

export const updateavatar = async (userId, token, photo) => {
   
    return await fetch(`${API_URL}/user/avatar/${userId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: photo,
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
   
    
}
export const updatecover = async (userId, token, photo) => {
    return await fetch(`${API_URL}/user/cover/${userId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: photo,
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
}
export const updatePassword = async (userId, token, user) => {
    return await fetch(`${API_URL}/user/password/${userId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
};
export const updateProfile = async (userId, token, user) => {
    return await fetch(`${API_URL}/user/profile/${userId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));

};
export const addaddress = (userId, token, address) => {
    return fetch(`${API_URL}/user/address/${userId}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
};
export const deleteaddresses = (userId, token, index) => {
    return fetch(`${API_URL}/user/address/${userId}?index=${index}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
};

export const updateaddress = (userId, token, index, address) => {
    return fetch(`${API_URL}/user/address/${userId}?index=${index}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(address),
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
};