import * as type from "../types";
const initialState = {
  authToken: null,
  user: null,
  error: false,
  isLoading: false,
  message: null,
  passwordCore: null
};

export const authReducer = (state = initialState, action) => {
  // console.log('action', action.)
  switch (action.type) {
    case type.SET_LOGIN_INIT:
      return {
        ...state,
        authToken: null,
        user: null,
        passwordCore: null,
        error: false,
        isLoading: action.payload.isLoading,
        message: action.payload.message,
      };
    case type.SET_LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        authToken: action.payload.authToken,
        passwordCore: action.payload.passwordCore,
        isLoading: action.payload.isLoading,
        error: false,
        message: null
      };
    case type.SET_LOGIN_FAIL:
      return {
        ...state,
        authToken: null,
        passwordCore: null,
        user: null,
        error: true,
        isLoading: action.payload.isLoading,
        message: action.payload.message,
      };
    case type.SET_LOGOUT:
      return {
        ...state,
        authToken: null,
        passwordCore: null,
        user: null,
        error: false,
        isLoading: false,
        message: null,
      };
    default:
      return state;
  }
};
