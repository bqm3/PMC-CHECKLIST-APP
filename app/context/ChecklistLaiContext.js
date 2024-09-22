import React, { createContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ent_khuvuc_get, ent_hangmuc_get } from "../redux/actions/entActions";

const ChecklistLaiContext = createContext();

export const ChecklistLaiProvider = ({ children }) => {
  const [dataChecklist1, setDataChecklist1] = useState([]);
  const [dataChecklistFilterContext, setDataChecklistFilterContext] = useState(
    []
  );
  const [newActionDataChecklist1, setNewActionDataChecklist1] = useState([]);
  const [defaultActionDataChecklist1, setDataChecklistDefault1] =
    useState([]);
  const [dataChecklistFaild1, setDataChecklistFaild1] = useState([]);
  return (
    <ChecklistLaiContext.Provider
      value={{
        dataChecklist1,
        setDataChecklist1,
        dataChecklistFilterContext,
        setDataChecklistFilterContext,
        newActionDataChecklist1,
        setNewActionDataChecklist1,
        defaultActionDataChecklist1,
        setDataChecklistDefault1,
        dataChecklistFaild1,
        setDataChecklistFaild1,
      }}
    >
      {children}
    </ChecklistLaiContext.Provider>
  );
};

export default ChecklistLaiContext;
