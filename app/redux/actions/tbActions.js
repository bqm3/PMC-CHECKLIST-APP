import * as type from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../constants/config';


export const tb_checklistc_get = (pag) => {
    return async (dispatch) => {
        try {
          const token = await AsyncStorage.getItem("tokenUser");
       if (token !== null) {
            const response = await axios.get(BASE_URL + `/tb_checklistc/?page=${pag.page}&limit=${pag.limit}`, {
              headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
              },
            });
            const data = response.data;
            dispatch({
              type: type.SET_TB_CHECKLISTC_SUCCESS,
              payload: {
                tb_checklistc: data,
              },
            });
          } else {
            console.error("initialized error");
          }
        } catch (error) {
          console.log("errd", error.response.data.message);
        }
      };
};

export const tb_checklist_get_lai = (id) => {
  return async (dispatch) => {
      try {
        const token = await AsyncStorage.getItem("tokenUser");
     if (token !== null) {
          const response = await axios.get(BASE_URL + `/tb_checklistc/ca/${id}`, {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + token,
            },
          });
          const data = response.data.data;
          const processedData = data?.map((item) => {
            return {
              ...item,
              Giatrinhan: item?.Giatrinhan?.split("/"),
              valueCheck: null,
              GhichuChitiet: "",
              ID_ChecklistC: ID_ChecklistC,
              Anh: null,
              gioht: moment().format("LTS"),
            };
          });
          dispatch({
            type: type.SET_ENT_CHECKLIST_DETAIL_SUCCESS,
            payload: {
              ent_checklist_detail: processedData,
              isLoading: false
            },
          });
        } else {
          console.error("initialized error");
        }
      } catch (error) {
        console.log("errd", error.response.data.message);
      }
    };
};

