import React, { createContext, useState, useEffect } from "react";
import {  useSelector } from "react-redux";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { ent_hangmuc } = useSelector((state) => state.entReducer);

  const [dataChecklists, setDataChecklists] = useState([]);
  const [dataHangmuc, setDataHangmuc] = useState([]);
  const [khuVuc, setKhuvuc] = useState([]);
  const [hangMucFilter, setHangMucFilter] = useState(ent_hangmuc);
  const [HangMucDefault, setHangMucDefault] = useState();
  const [stepKhuvuc, setStepKhuvuc] = useState(0);

  useEffect(() => {
    if (ent_hangmuc) {
      setHangMucDefault(ent_hangmuc);
    }
  }, [ent_hangmuc]);

  return (
    <DataContext.Provider
      value={{
        setDataChecklists,
        dataChecklists,
        dataHangmuc,
        setDataHangmuc,
        setHangMucFilter,
        hangMucFilter,
        setStepKhuvuc,
        stepKhuvuc,
        khuVuc,
        setKhuvuc,
        HangMucDefault,
        setHangMucDefault,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
