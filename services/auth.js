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
export const authsocial =async (user) => {
    try {
        const res = await axios.post(`${API_URL}/auth/social`, user);
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
   
};
export const signout = async (refreshToken) => {
    try {
        const res = await axios.post(`${API_URL}/signout`, { refreshToken });
        return res.data;
    } catch (error) {
        console.log('signout', error);
    }
}
export const forgotpassword = async (username) => {
    
    return await fetch(`${API_URL}/forgot/password`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(username),
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
}

export const refresh = async (refreshToken) => {
    try {
        const res = await axios.post(`${API_URL}/refresh/token`, { refreshToken});
        return res.data;
    } catch (error) {
        console.log('refresh', error);
    }
}