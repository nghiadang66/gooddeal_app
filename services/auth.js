import axios from "axios";
import { API_URL } from "../config";

export const signup = async (user) => {
    try {
        const res = await axios.post(`${API_URL}/signup`, user, {
            validateStatus: function (status) {
              return status < 500; // Resolve only if the status code is less than 500
            }
        });
        return res.data;
    } catch (error) {
        console.log('signup', error);
    }
}

export const signin = async (user) => {
    try {
        const res = await axios.post(`${API_URL}/signin`, user, {
            validateStatus: function (status) {
              return status < 500; // Resolve only if the status code is less than 500
            }
        });
        return res.data;
    } catch (error) {
        console.log('signin', error);
    }
}

export const signout = async (refreshToken) => {
    try {
        const res = await axios.post(`${API_URL}/signout`, { refreshToken });
        return res.data;
    } catch (error) {
        console.log('signout', error);
    }
}

export const refresh = async (refreshToken) => {
    try {
        const res = await axios.post(`${API_URL}/refresh/token`, { refreshToken});
        return res.data;
    } catch (error) {
        console.log('refresh', error);
    }
}