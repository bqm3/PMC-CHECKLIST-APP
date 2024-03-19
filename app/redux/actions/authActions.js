import * as type from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../constants/config';

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

export const login = (UserName, Password) => {
  return async dispatch => {
    try {
        dispatch({
            type: type.SET_LOGIN_INIT,
            payload: {
              isLoading: true,
            },
          });
      const response = await axios.post(
        BASE_URL + '/ent_user/login',
        {
          UserName,
          Password,
        },
      );

      if (response.status == 200) {
        const {token, user} = response.data;
        await AsyncStorage.setItem('tokenUser', token);
        dispatch({
          type: type.SET_LOGIN_SUCCESS,
          payload: {
            user: user,
            authToken: token,
          },
        });
      }
    } catch (e) {
      dispatch({
        type: type.SET_LOGIN_FAIL,
        payload: {
          user: null,
          authToken: null,
        },
      });
    }
  };
};

// export const loginOtpAction = (phone, otp) => {
//   return async (dispatch) => {

//     try{
//      const response = await axios.post(
//        BASE_URL+ "user/verify-otp",
//        {
//          phone: phone,
//          otp: otp,
//        }
//      );
//      if (response.status == 200) {
//        const { access_token, user } = response.data;
//        await AsyncStorage.setItem("tokenUser", access_token);
//        dispatch({
//          type: type.SET_LOGIN_SUCCESS,
//          payload: {
//            user: user,
//            classes: user.classes,
//            authToken: access_token,
//            isLoggedIn: true,
//            error: false,
//            isLoading: false
//          }

//        });
//      }
//     }catch(e){
//      dispatch({
//        type: type.SET_LOGIN_FAIL_STATE,
//        payload: {
//          error: true,
//          isLoggedIn: false,
//          isLoading: false,
//                   user: null,
//                   authToken: null,
//                   classes: null
//        }

//      });
//     }
//   };
// };

// export const logoutAction = () => {
//   return async (dispatch) => {
//     await AsyncStorage.clear();
//     dispatch({
//       type: type.SET_LOGOUT_STATE,
//       payload: {
//         user: null,
//         classes: null,
//         authToken: null,
//         isLoggedIn: false,
//         isLoading: false,
//         error: false,
//       },
//     });
//   };
// };
