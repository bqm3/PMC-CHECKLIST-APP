import * as type from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../constants/config';

export const ent_khoicv_get = () => {
  return async (dispatch) => {
    try{
      await AsyncStorage.setItem('tokenUser',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7IklEX1VzZXIiOjMsIlVzZXJOYW1lIjoiQWRtaW4iLCJQZXJtaXNzaW9uIjoxLCJJRF9EdWFuIjoxLCJQYXNzd29yZCI6IiQyYiQxMCRXbEZYdjgyd1hsTzZyaHNmS245dk1lNkgvdUU0ZXA0R3FiWGhsTjhCeXliVjlRSDY5QTNJNiIsIklEX0tob2lDViI6MSwiRW1haWxzIjoicGhvbmdzb2hvYUBwbWN3ZWIudm4iLCJpc0RlbGV0ZSI6MCwiZW50X2R1YW4iOnsiRHVhbiI6IkThu7Egw6FuIFZOUFQifSwiZW50X2NodWN2dSI6eyJDaHVjdnUiOiJHacOhbSDEkeG7kWMgZOG7sSDDoW4ifX0sImlhdCI6MTcxMDkwMDUwMiwiZXhwIjoxNzExNTA1MzAyfQ.3E9JQc3tYtieUw93-1Nx5qzkgiQFa4PBXZYfQ0PFOss")
      let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7IklEX1VzZXIiOjMsIlVzZXJOYW1lIjoiQWRtaW4iLCJQZXJtaXNzaW9uIjoxLCJJRF9EdWFuIjoxLCJQYXNzd29yZCI6IiQyYiQxMCRXbEZYdjgyd1hsTzZyaHNmS245dk1lNkgvdUU0ZXA0R3FiWGhsTjhCeXliVjlRSDY5QTNJNiIsIklEX0tob2lDViI6MSwiRW1haWxzIjoicGhvbmdzb2hvYUBwbWN3ZWIudm4iLCJpc0RlbGV0ZSI6MCwiZW50X2R1YW4iOnsiRHVhbiI6IkThu7Egw6FuIFZOUFQifSwiZW50X2NodWN2dSI6eyJDaHVjdnUiOiJHacOhbSDEkeG7kWMgZOG7sSDDoW4ifX0sImlhdCI6MTcxMDkwMDUwMiwiZXhwIjoxNzExNTA1MzAyfQ.3E9JQc3tYtieUw93-1Nx5qzkgiQFa4PBXZYfQ0PFOss";
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
    
    }catch(err){
      console.log('err', err)
    }
  }
};


export const ent_calv_get = () => {
  return async (dispatch) => {
    try{
      await AsyncStorage.setItem('tokenUser',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7IklEX1VzZXIiOjMsIlVzZXJOYW1lIjoiQWRtaW4iLCJQZXJtaXNzaW9uIjoxLCJJRF9EdWFuIjoxLCJQYXNzd29yZCI6IiQyYiQxMCRXbEZYdjgyd1hsTzZyaHNmS245dk1lNkgvdUU0ZXA0R3FiWGhsTjhCeXliVjlRSDY5QTNJNiIsIklEX0tob2lDViI6MSwiRW1haWxzIjoicGhvbmdzb2hvYUBwbWN3ZWIudm4iLCJpc0RlbGV0ZSI6MCwiZW50X2R1YW4iOnsiRHVhbiI6IkThu7Egw6FuIFZOUFQifSwiZW50X2NodWN2dSI6eyJDaHVjdnUiOiJHacOhbSDEkeG7kWMgZOG7sSDDoW4ifX0sImlhdCI6MTcxMDkwMDUwMiwiZXhwIjoxNzExNTA1MzAyfQ.3E9JQc3tYtieUw93-1Nx5qzkgiQFa4PBXZYfQ0PFOss")
      let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7IklEX1VzZXIiOjMsIlVzZXJOYW1lIjoiQWRtaW4iLCJQZXJtaXNzaW9uIjoxLCJJRF9EdWFuIjoxLCJQYXNzd29yZCI6IiQyYiQxMCRXbEZYdjgyd1hsTzZyaHNmS245dk1lNkgvdUU0ZXA0R3FiWGhsTjhCeXliVjlRSDY5QTNJNiIsIklEX0tob2lDViI6MSwiRW1haWxzIjoicGhvbmdzb2hvYUBwbWN3ZWIudm4iLCJpc0RlbGV0ZSI6MCwiZW50X2R1YW4iOnsiRHVhbiI6IkThu7Egw6FuIFZOUFQifSwiZW50X2NodWN2dSI6eyJDaHVjdnUiOiJHacOhbSDEkeG7kWMgZOG7sSDDoW4ifX0sImlhdCI6MTcxMDkwMDUwMiwiZXhwIjoxNzExNTA1MzAyfQ.3E9JQc3tYtieUw93-1Nx5qzkgiQFa4PBXZYfQ0PFOss";
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
    
    }catch(err){
      console.log('err', err)
    }
  }
};