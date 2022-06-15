import axios from "axios";
import { API_URL } from "../config";

export const listActiveCommissions = async () => {
    try {
        const res = await axios.get(`${API_URL}/active/commissions`);
        return res.data;
    } catch (error) {
        console.error('listActiveCommissions', error);
    }
}