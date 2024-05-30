import React, { createContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ent_khuvuc_get, ent_hangmuc_get } from "../redux/actions/entActions";

const DataContext = createContext();

export const DataProvider = ({ children }) => {

  const { ent_hangmuc } = useSelector((state) => state.entReducer);
  
  const [dataChecklists, setDataChecklists] = useState([]);
  const [dataHangmuc, setDataHangmuc] = useState([]);
  const [hangMuc, setHangMuc] = useState(ent_hangmuc);
  const [stepKhuvuc, setStepKhuvuc] = useState(0);

  return (
    <DataContext.Provider
      value={{ setDataChecklists, dataChecklists, dataHangmuc, setDataHangmuc,setHangMuc, hangMuc, setStepKhuvuc, stepKhuvuc }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
