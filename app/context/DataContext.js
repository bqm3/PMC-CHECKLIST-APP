import React, { createContext, useState, useEffect } from "react";
import {  useSelector } from "react-redux";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { ent_hangmuc, ent_khuvuc } = useSelector((state) => state.entReducer);

  const [dataChecklists, setDataChecklists] = useState([]); //Oke

  const [hangMucFilterByIDChecklistC, setHangMucFilterByIDChecklistC] = useState();
  const [khuVucFilterByIDChecklistC, setKhuVucFilterByIDChecklistC] = useState();
  
// Lọc chi tiết 1 khu vực lấy ra danh sách hạng mục
  const [hangMucByKhuVuc, setHangMucByKhuVuc] = useState()
  const [dataChecklistSize, setDataChecklistSize] = useState(0)

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
        dataChecklistSize
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
