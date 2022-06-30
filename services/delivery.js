import axios from "axios";
import { API_URL } from "../config";

export const listActiveDeliveries = () => {
    return fetch(`${API_URL}/active/deliveries`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .catch((error) => console.log(error));
};