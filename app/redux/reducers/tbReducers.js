import * as type from "../types";
const initialState = {
  tb_checklistc: null,
  tb_checklistchitiet: null,
  tb_sucongoai: null,
  baocaochiso: null,
  error: false,
  isLoading: false,
  message: null,
  hsse: null,
};

export const tbReducer = (state = initialState, action) => {
  switch (action.type) {
    case type.SET_TB_CHECKLISTC_STATE:
      return {
        ...state,
        tb_checklistc: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_TB_CHECKLISTC_SUCCESS:
      return {
        ...state,
        tb_checklistc: action.payload.tb_checklistc,
        error: false,
        isLoading: false,
        message: null,
      };
    case type.SET_TB_CHECKLISTC_FAIL:
      return {
        ...state,
        tb_checklistc: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_TB_SUCONGOAI_STATE:
      return {
        ...state,
        tb_sucongoai: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_TB_SUCONGOAI_SUCCESS:
      return {
        ...state,
        tb_sucongoai: action.payload.tb_sucongoai,
        error: false,
        isLoading: false,
        message: null,
      };
    case type.SET_TB_SUCONGOAI_FAIL:
      return {
        ...state,
        tb_sucongoai: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_BAOCAOCHISO_STATE:
      return {
        ...state,
        baocaochiso: null,
        error: false,
        isLoading: true,
        message: null,
      };
    case type.SET_BAOCAOCHISO_SUCCESS:
      return {
        ...state,
        baocaochiso: action.payload.baocaochiso,
        error: false,
        isLoading: false,
        message: null,
      };
    case type.SET_BAOCAOCHISO_FAIL:
      return {
        ...state,
        baocaochiso: null,
        error: false,
        isLoading: true,
        message: null,
      };
      case type.SET_HSSE_SUCCESS:
        return {
          ...state,
          hsse: action.payload.hsse
        };
    default:
      return state;
  }
};
