import * as type from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../constants/config';


export const tb_checklistc_get = () => {
    return async (dispatch) => {
        try {
          const token = await AsyncStorage.getItem("tokenUser");
       if (token !== null) {
            const response = await axios.get(BASE_URL + "/ent_checklistc", {
              headers: {
                Accept: "application/json",
                Authorization: "Bearer " + token,
              },
            });
            const data = response.data.data;
            dispatch({
              type: type.SET_TB_CHECKLISTC_SUCCESS,
              payload: {
                tb_checklistc: data,
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

