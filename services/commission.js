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
export const listActiveCommissions = async () => {
    try {
        const res = await axios.get(`${API_URL}/active/commissions`);
        return res.data;
    } catch (error) {
        console.error('listActiveCommissions', error);
    }
}
