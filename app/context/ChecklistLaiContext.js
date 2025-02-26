import React, { createContext, useState, useEffect } from "react";
const ChecklistLaiContext = createContext();

export const ChecklistLaiProvider = ({ children }) => {
  const [dataChecklist1, setDataChecklist1] = useState([]);
  const [dataChecklistFilterContext, setDataChecklistFilterContext] = useState([]);
  const [newActionDataChecklist1, setNewActionDataChecklist1] = useState([]);
  const [defaultActionDataChecklist1, setDataChecklistDefault1] = useState([]);
  const [dataChecklistFaild1, setDataChecklistFaild1] = useState([]);
  const [localtionContext, setLocationContext] = useState([]);
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
        localtionContext,
        setLocationContext,
      }}
    >
      {children}
    </ChecklistLaiContext.Provider>
  );
};

export default ChecklistLaiContext;
