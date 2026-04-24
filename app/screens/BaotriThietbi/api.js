import axios from "axios";
import { BASE_URL } from "../../constants/config";

const authConfig = (accessToken) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
});

export const tansuatAPI = {
  getList: async (authToken, params = {}) => {
    return axios.get(`${BASE_URL}/bt_dmtansuat`, { 
      ...authConfig(authToken), 
      params 
    });
  },
};

export const hanhdongAPI = {
  getList: async (authToken, params = {}) => {
    return axios.get(`${BASE_URL}/bt_dmhanhdong`, { 
      ...authConfig(authToken), 
      params 
    });
  },
};

export const bt_thongtinchung_API = {
  getAll: async (authToken) => {
    return axios.get(`${BASE_URL}/bt_thongtinchung`, authConfig(authToken));
  },

  getById: async (authToken, id) => {
    return axios.get(`${BASE_URL}/bt_thongtinchung/${id}`, authConfig(authToken));
  },

  exportPDF: async (authToken, id) => {
    return axios.get(`${BASE_URL}/bt_thongtinchung/export-pdf/${id}`, {
      headers: {
        'Accept': 'application/pdf',
        Authorization: `Bearer ${authToken}`,
      },
      responseType: "blob",
    });
  },

  create: async (authToken, data) => {
    return axios.post(`${BASE_URL}/bt_thongtinchung/create`, data, authConfig(authToken));
  },


};

export const bt_chitiettb_API = {
   updateTask: async (authToken, formData) => {
    return axios.put(`${BASE_URL}/bt_chitiettb/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${authToken}`,
      },
    });
  },
}
    

export const bt_thietbi_da_API = {
  getAll: async (authToken, search = "", id_nhomtb = null, id_dmthietbi = null) => {
    let query = `?search=${search}`;
    if (id_nhomtb) query += `&id_nhomtb=${id_nhomtb}`;
    if (id_dmthietbi) query += `&id_dmthietbi=${id_dmthietbi}`;
    
    return axios.get(`${BASE_URL}/bt_thietbida${query}`, authConfig(authToken));
  },
};

export const nhomtbAPI = {
  getList: async (authToken, params = {}) => {
    return axios.get(`${BASE_URL}/bt_dmnhomtb`, { 
      ...authConfig(authToken), 
      params 
    });
  },
};

export const thietbiAPI = {
  getList: async (authToken, params = {}) => {
    return axios.get(`${BASE_URL}/bt_dmthietbi`, { 
      ...authConfig(authToken), 
      params 
    });
  },
};