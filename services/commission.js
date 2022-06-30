import axios from "axios";
import { API_URL } from "../config";

export const getCommissionByStore = (storeId) => {
    return fetch(`${API_URL}/store/commission/${storeId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
};