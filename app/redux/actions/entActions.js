import * as type from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../../constants/config";
import moment from "moment";

export const ent_khoicv_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUser");
      if (token !== null) {
        const response = await axios.get(BASE_URL + "/ent_khoicv", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_KHOICV_SUCCESS,
          payload: {
            ent_khoicv: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_calv_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUser");

      if (token !== null) {
        const response = await axios.get(BASE_URL + "/ent_calv", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_CALV_SUCCESS,
          payload: {
            ent_calv: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_calv_filter = (id) => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUser");

      if (token !== null) {
        const response = await axios.post(BASE_URL + `/ent_calv`,{ID_KhoiCV: id}, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_CALV_SUCCESS,
          payload: {
            ent_calv: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_toanha_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUser");
      if (token !== null) {
        const response = await axios.get(BASE_URL + "/ent_toanha", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_TOANHA_SUCCESS,
          payload: {
            ent_toanha: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_khuvuc_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUser");
      if (token !== null) {
        const response = await axios.post(BASE_URL + "/ent_khuvuc/filter",{}, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_KHUVUC_SUCCESS,
          payload: {
            ent_khuvuc: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err ent_khuvuc_get", err.response.data.message);
    }
  };
};

export const ent_duan_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUser");
      if (token !== null) {
        const response = await axios.get(BASE_URL + "/ent_duan", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_DUAN_SUCCESS,
          payload: {
            ent_duan: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_chucvu_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUser");
      if (token !== null) {
        const response = await axios.get(BASE_URL + "/ent_chucvu", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_CHUCVU_SUCCESS,
          payload: {
            ent_chucvu: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_checklist_get = (pag) => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUser");
      if (token !== null) {
        const response = await axios.get(BASE_URL + `/ent_checklist/?page=${pag.page}&limit=${pag.limit}`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data;
        dispatch({
          type: type.SET_ENT_CHECKLIST_SUCCESS,
          payload: {
            ent_checklist: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
      dispatch({
        type: type.SET_ENT_CHECKLIST_FAIL,
        payload: {
          ent_checklist: [],
        },
      });
    }
  };
};

export const ent_tang_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUser");
      if (token !== null) {
        const response = await axios.get(BASE_URL + "/ent_tang", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_TANG_SUCCESS,
          payload: {
            ent_tang: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_hangmuc_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUser");
      if (token !== null) {
        const response = await axios.get(BASE_URL + "/ent_hangmuc", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_HANGMUC_SUCCESS,
          payload: {
            ent_hangmuc: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err HANGMUC", err);
    }
  };
};

export const ent_users_get = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUser");
      if (token !== null) {
        const response = await axios.get(BASE_URL + "/ent_user/get-online", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_ENT_USERS_SUCCESS,
          payload: {
            ent_users: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};

export const ent_checklist_mul_hm = (ID_Hangmucs, ID_Calv, ID_ChecklistC, ID_KhoiCV) => {
  return async (dispatch) => {
    dispatch({
      type: type.SET_ENT_CHECKLIST_STATE,
      payload: {
        ent_checklist_detail: [],
        isLoading: true
      },
    });
    try {
     
      const token = await AsyncStorage.getItem("tokenUser");

      if (token !== null) {
        const response = await axios.put(
          `${BASE_URL}/ent_checklist/filter-mul/${ID_ChecklistC}/${ID_Calv}`,
          { ID_KhoiCV: ID_KhoiCV, dataHangmuc: ID_Hangmucs },
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data.data;
        const processedData = data?.map((item) => {
          return {
            ...item,
            Giatrinhan: item?.Giatrinhan?.split("/").map((item) => 
              item
            .split(" ") // Chia chuỗi thành mảng từ
            .map(word => 
              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Viết hoa chữ cái đầu và viết thường các chữ còn lại
            )
            .join(" ") 
            .trim() 
            ),
            Giatriloi: item?.Giatriloi ? item?.Giatriloi.split(" ").map((item) => (item?.charAt(0).toUpperCase() + item.slice(1).toLowerCase())).join(" ").trim() : null,
            valueCheck: null,
            GhichuChitiet: "",
            ID_ChecklistC: ID_ChecklistC,
            Anh: null,
            isScan: null,
            Gioht: moment().format("LTS"),
          };
        });
        dispatch({
          type: type.SET_ENT_CHECKLIST_DETAIL_SUCCESS,
          payload: {
            ent_checklist_detail: processedData,
            isLoading: false
          },
        });
      } 
    } catch (err) {
      dispatch({
        type: type.SET_ENT_CHECKLIST_FAIL,
        payload: {
          ent_checklist_detail: [],
          isLoading: false
        },
      });
      console.log("ent_checklist_get_detail 2", err.response.data.message);
    }
  };
}

export const ent_checklist_mul_hm_return = (dataHangmuc, ID_Calv, ID_ChecklistC) => {
  
  return async (dispatch) => {
    dispatch({
      type: type.SET_ENT_CHECKLIST_STATE,
      payload: {
        ent_checklist_detail: [],
        isLoading: true
      },
    });
    try {
      const token = await AsyncStorage.getItem("tokenUser");
      if (token !== null) {
        const response = await axios.put(
          `${BASE_URL}/ent_checklist/filter-return/${ID_ChecklistC}/${ID_Calv}`,
          { ID_Hangmuc: dataHangmuc },
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = response.data.data;
        const processedData = data?.map((item) => {
          return {
            ...item,
            Giatrinhan: item?.Giatrinhan?.split("/").map((item) => item.trim()),
            valueCheck: null,
            GhichuChitiet: "",
            ID_ChecklistC: ID_ChecklistC,
            Anh: null,
            isScan: null,
            Gioht: moment().format("LTS"),
          };
        });
        dispatch({
          type: type.SET_ENT_CHECKLIST_DETAIL_SUCCESS,
          payload: {
            ent_checklist_detail: processedData,
            isLoading: false
          },
        });
      } 
    } catch (err) {
      dispatch({
        type: type.SET_ENT_CHECKLIST_FAIL,
        payload: {
          ent_checklist_detail: [],
          isLoading: false
        },
      });
      console.log("ent_checklist_get_detail 3", err.response);
    }
  };
}

export const check_hsse = () => {
  return async (dispatch) => {
    try {
      const token = await AsyncStorage.getItem("tokenUser");
      if (token !== null) {
        const response = await axios.post(BASE_URL + "/hsse/check",[], {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        });
        const data = response.data.data;
        dispatch({
          type: type.SET_CHECK_HSSE_SUCCESS,
          payload: {
            data_check_hsse: data,
          },
        });
      } else {
        console.error("initialized error");
      }
    } catch (err) {
      console.log("err", err);
    }
  };
};