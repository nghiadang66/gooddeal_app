import axios from "axios";
import { API_URL } from "../config";

export const signup = async (user) => {
    try {
        const res = await axios.post(`${API_URL}/signup`, user);
        return res.data;
    } catch (error) {
        console.log(error);

        let _response = {};
        if (
            err.response &&
            err.response.request &&
            err.response.request._response
        )
            _response = JSON.parse(err.response.request._response);
        if (_response.error) 
            return {
                error: _response.error,
            };
    }
}

export const signin = async (user) => {
    try {
        const res = await axios.post(`${API_URL}/signin`, user);
        return res.data;
    } catch (error) {
        console.log(error);

        let _response = {};
        if (
            err.response &&
            err.response.request &&
            err.response.request._response
        )
            _response = JSON.parse(err.response.request._response);
        if (_response.error) 
            return {
                error: _response.error,
            };
    }
}

export const signout = async (refreshToken) => {
    try {
        const res = await axios.post(`${API_URL}/signout`, { refreshToken });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const refresh = async (refreshToken) => {
    try {
        const res = await axios.post(`${API_URL}/refresh/token`, { refreshToken});
        return res.data;
    } catch (error) {
        console.log(error);
    }
}