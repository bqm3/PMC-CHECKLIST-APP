import * as type from '../types';
const initialState = {
  authToken: null,
  user: {
    ID_User: 3,
    UserName: 'Admin',
    Permission: 1,
    ID_Duan: 1,
    Password: '$2b$10$WlFXv82wXlO6rhsfKn9vMe6H/uE4ep4GqbXhlN8ByybV9QH69A3I6',
    ID_KhoiCV: 1,
    Emails: 'phongsohoa@pmcweb.vn',
    isDelete: 0,
    ent_duan: {
      Duan: 'Dự án VNPT',
    },
    ent_chucvu: {
      Chucvu: 'Giám đốc dự án',
    },
  },
  error: false,
  isLoading: false,
  message: null,
};

export const authReducer = (state = initialState, action) => {
  // console.log('action', action.)
  switch (action.type) {
    case type.SET_LOGIN_INIT:
      return {
        ...state,
        authToken: null,
        user: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        authToken: action.payload.authToken,
        isLoading: false,
        error: false,
      };
    case type.SET_LOGIN_FAIL:
      return {
        ...state,
        authToken: null,
        user: null,
        error: true,
        isLoading: false,
        message: null,
      };
    case type.SET_LOGOUT:
      return {
        ...state,
        authToken: null,
        user: null,
        error: false,
        isLoading: true,
        message: null,
      };
    default:
      return state;
  }
};
