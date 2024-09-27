import axios from "axios";
import { BASE_URL } from "../constants/config";


const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    console.log("Request:", JSON.stringify(config, null, 2));
    return config;
  },
  (error) => {
    console.error("Request Error:", JSON.stringify(error, null, 2));
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    console.log("Response:", JSON.stringify(response.data, null, 2));
    return response;
  },
  (error) => {
    console.error("Response Error:", JSON.stringify(error, null, 2));
    return Promise.reject(error);
  }
);

export default axiosClient;
