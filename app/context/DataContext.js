import React, { createContext, useState, useEffect } from "react";
import {  useSelector } from "react-redux";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [dataChecklistByCa, setDataChecklistByCa] = useState([])
  const [dataChecklists, setDataChecklists] = useState([]); // Checklist còn lại trong ca 

  const [hangMucFilterByIDChecklistC, setHangMucFilterByIDChecklistC] = useState(); // Lọc hạng mục theo ca
  const [khuVucFilterByIDChecklistC, setKhuVucFilterByIDChecklistC] = useState(); // Lọc khu vực theo ca
  
// Lọc chi tiết 1 khu vực lấy ra danh sách hạng mục
  const [hangMucByKhuVuc, setHangMucByKhuVuc] = useState()
  const [dataChecklistSize, setDataChecklistSize] = useState(0)

  //notkhuvuc 
  const { ent_hangmuc, ent_khuvuc } = useSelector((state) => state.entReducer);
  const [hangMucFilter, setHangMucFilter] = useState(ent_hangmuc);
  const [HangMucDefault, setHangMucDefault] = useState();

  
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
        setHangMucFilterByIDChecklistC,
        hangMucFilterByIDChecklistC,
        khuVucFilterByIDChecklistC,
        setKhuVucFilterByIDChecklistC,
        setHangMucByKhuVuc,
        hangMucByKhuVuc,
        setDataChecklistSize,
        dataChecklistSize,
        dataChecklistByCa, 
        setDataChecklistByCa,
        setHangMucFilter,
        hangMucFilter,
        HangMucDefault,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
