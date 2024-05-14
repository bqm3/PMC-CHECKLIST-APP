import React, { createContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ent_khuvuc_get, ent_hangmuc_get } from "../redux/actions/entActions";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const dispath = useDispatch();
  const { user } = useSelector((state) => state.authReducer);
  const { ent_hangmuc, ent_khuvuc } = useSelector((state) => state.entReducer);
  const [dataChecklists, setDataChecklists] = useState([])

  const [dataHangmuc, setDataHangmuc] = useState([]);

  const int_khuvuc = async () => {
    await dispath(ent_khuvuc_get());
  };

  const int_hangmuc = async () => {
    await dispath(ent_hangmuc_get());
  };

  useEffect(() => {
    int_khuvuc();
  }, []);

  useEffect(() => {
    int_hangmuc();
  }, []);

  useEffect(() => {
    if (ent_hangmuc) {
      const hangmucIds = ent_hangmuc.map((item) => item.ID_Hangmuc);
      setDataHangmuc(hangmucIds);
    }
  }, [ent_hangmuc]);

  return <DataContext.Provider value={{setDataChecklists, dataChecklists, dataHangmuc}}>{children}</DataContext.Provider>;
};

export default DataContext;
