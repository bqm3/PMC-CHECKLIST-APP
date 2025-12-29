import axios , { AxiosRequestConfig } from "axios";
import { BASE_URL } from "../../constants/config";

const authConfig = (accessToken) => {
  return {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  };
};

const authConfigFormData = (accessToken) => {
  return {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      "Content-Type": "multipart/form-data",
    },
  };
};

export const fetchProjects = async (accessToken) => {
  const response = await axios.get(`${BASE_URL}/ent_duan/thong-tin-du-an`, authConfig(accessToken));
  return response.data.data;
};

export const anDaoTaoAPI = {
  getAllDaoTaoGiaoCa: async (params, accessToken) => {
    const query = params ? `?${params.toString()}` : "";
    const response = await axios.get(`${BASE_URL}/an-ninh-dao-tao${query}`, authConfig(accessToken));
    return response.data;
  },
  getLoaiDaoTao: async (accessToken) => {
    const response = await axios.get(`${BASE_URL}/an-ninh-dao-tao/loai`, authConfig(accessToken));
    return response.data;
  },
  createBaoCao: async (formData, accessToken) => {
    const response = await axios.post(`${BASE_URL}/an-ninh-dao-tao/`, formData, authConfig(accessToken));
    return response.data;
  },

  updateBaoCao: async (id, formData, accessToken) => {
    const response = await axios.put(`${BASE_URL}/an-ninh-dao-tao//${id}`, formData, authConfig(accessToken));
    return response.data;
  },

  deleteBaoCao: async (id, accessToken) => {
    const response = await axios.delete(`${BASE_URL}/an-ninh-dao-tao/${id}`, authConfig(accessToken));
    return response.data;
  },

  getBaoCaoById: async (id, accessToken) => {
    const response = await axios.get(`${BASE_URL}/an-ninh-dao-tao/${id}`, authConfig(accessToken));
    return response.data;
  },
};

export const anCongCuAPI = {
  getAllCongCu: async (accessToken) => {
    const response = await axios.get(`${BASE_URL}/an-ninh-cong-cu`, authConfig(accessToken));
    return response.data;
  },

  getAllBC_CongCu: async (accessToken, params) => {
    const query = params ? `?${params.toString()}` : '';
    const response = await axios.get(`${BASE_URL}/an-ninh-cong-cu/bao-cao${query}`, authConfig(accessToken));
    return response.data;
  },

  getBaoCaoDetail: async (accessToken, id) => {
    const response = await axios.get(`${BASE_URL}/an-ninh-cong-cu/bao-cao/${id}`, authConfig(accessToken));
    return response.data;
  },

  getLastestdayBC_CongCu: async (accessToken) => {
    const response = await axios.get(`${BASE_URL}/an-ninh-cong-cu/lastestday`, authConfig(accessToken));
    return response.data;
  },

  createBaoCao: async (accessToken, formData) => {
    console.log(formData);
    const response = await axios.post(`${BASE_URL}/an-ninh-cong-cu/create`, formData, authConfigFormData(accessToken));
    return response.data;
  },

  updateBaoCao: async (accessToken, id, formData) => {
    const response = await axios.put(`${BASE_URL}/an-ninh-cong-cu/update/${id}`, formData, authConfigFormData(accessToken));
    return response.data;
  },
};

export const getUserNhaThau_AN_Duan = async (ma_du_an, accessToken) => {
  const response = await axios.get(`${BASE_URL}/an-bao-cao-loi/an-nt-user-duan-an?ma_du_an=${ma_du_an}`, authConfig(accessToken));
  return response.data;
};
