import axios from "axios";
import { BASE_URL } from "../constants/config";

export const getURLMinio = async (path, accessToken) => {
    return axios.get(`${BASE_URL}/minio/url?fileName=${path}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};