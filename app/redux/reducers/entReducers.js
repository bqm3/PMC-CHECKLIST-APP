import * as type from '../types';
const initialState = {
  ent_khoicv: null,
  ent_calv: null,
  error: false,
  isLoading: false,
  message: null,
};

export const entReducer = (state = initialState, action) => {
  switch (action.type) {
    case type.SET_ENT_KHOICV_STATE:
      return {
        ...state,
        ent_khoicv: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_ENT_KHOICV_SUCCESS:
      return {
        ...state,
        ent_khoicv: action.payload.ent_khoicv,
        error: false,
        isLoading: false,
        message: null,
      };
    case type.SET_ENT_KHOICV_FAIL:
      return {
        ...state,
        ent_khoicv: null,
        error: false,
        isLoading: true,
        message: null,
      };
      case type.SET_ENT_CALV_STATE:
        return {
          ...state,
          ent_calv: null,
          error: false,
          isLoading: true,
          message: null,
        };
      case type.SET_ENT_CALV_SUCCESS:
        return {
          ...state,
          ent_calv: action.payload.ent_calv,
          error: false,
          isLoading: false,
          message: null,
        };
      case type.SET_ENT_CALV_FAIL:
        return {
          ...state,
          ent_calv: null,
          error: false,
          isLoading: true,
          message: null,
        };
    case type.SET_LOGOUT:
      return {
        ...state,
        
      };
    default:
      return state;
  }
};
