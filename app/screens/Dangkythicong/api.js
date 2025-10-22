import axios from "axios";
import { BASE_URL } from "../../constants/config";


export const getDangKyThiCong = async (filters, authToken) => {
  return axios.get(`${BASE_URL}/nt_dangky_tc?fromDate=${filters?.fromDate}&toDate=${filters?.toDate}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
};


export const getDangKyThiCongDetail = async (id_dang_ky, accessToken) => {
  return axios.get(`${BASE_URL}/nt_dangky_tc/${id_dang_ky}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updateDangKyThiCongStatus = async (id_dang_ky, data, accessToken) => {
  return axios.put(`${BASE_URL}/nt_dangky_tc/update/${id_dang_ky}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};


export const getUser = async (accessToken) => {
  return axios.get(`${BASE_URL}/nt_dangky_tc/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updatePhanQuyen = async (data, accessToken) => {
  return axios.post(`${BASE_URL}/nt_dangky_tc/user`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};

export const addNewCCDC = async (data, accessToken) => {
  return axios.post(`${BASE_URL}/nt_dangky_tc/cong-cu-create`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};

export const updateInfoCCDC = async (congCuId, data, accessToken) => {
  return axios.put(`${BASE_URL}/nt_dangky_tc/cong-cu-update/${congCuId}`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};

export const uploadImage = async (congCuId, imageUri, type, accessToken) => {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: "image.jpg",
  });
  return axios.post(`${BASE_URL}/nt_dangky_tc/cong-cu-image/${congCuId}/${type}`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
