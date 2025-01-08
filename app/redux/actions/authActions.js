import * as type from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../constants/config';
import axiosClient from '../../api/axiosClient';
// export const initialize = () => {
//   return async (dispatch) => {
//     let token = await AsyncStorage.getItem("tokenUser");
//     if (token !== null) {
//       const response = await axios.get(BASE_URL + "validate-token", {
//         headers: {
//           Accept: "application/json",
//           Authorization: "Bearer " + token,
//         },
//       });
//       const user = response.data;
//       dispatch({
//         type: type.SET_INITIAL_STATE,
//         payload: {
//           user: user,
//           classes: user.classes,
//           authToken: token,
//           isLoggedIn: true,
//           error: false,
//           isLoading: false,
//         },
//       });
//     } else {
//       console.error("initialized error");
//     }
//   };
// };

export const login = (UserName, Password, deviceInfo, infoIP) => {
  return async dispatch => {
    dispatch({
      type: type.SET_LOGIN_INIT,
      payload: {
        user: null,
        authToken: null,
        message: null,
        isLoading: true
      },
    });
    // console.log('rin',UserName, Password)
    try {
      const response = await axios.post(
        BASE_URL + '/ent_user/login',
        {
          UserName,
          Password,
          deviceInfo,
          infoIP
        },
      );
      if (response.status == 200) {
        const {token, user, passwordCore} = response.data;
        await AsyncStorage.setItem('tokenUser', token);
        dispatch({
          type: type.SET_LOGIN_SUCCESS,
          payload: {
            user: user,
            authToken: token,
            message: null,
            isLoading: false,
            passwordCore: passwordCore
          },
        });
      }
    } catch (e) {
      dispatch({
        type: type.SET_LOGIN_FAIL,
        payload: {
          user: null,
          authToken: null,
          message: "Thông tin đăng nhập sai. Vui lòng thử lại!!!",
          isLoading: false ,
          passwordCore: null
        },
      });
    }
  };
};

export const logoutAction = () => {
  return async (dispatch) => {
    dispatch({
      type: type.SET_LOGOUT,
      payload: {
        user: null,
        tokenUser: null,
        isLoading: false,
      },
    });
  };
};