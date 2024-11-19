import React, { createContext, useEffect, useState, useContext } from "react";
export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {

    const [showReport, setShowReport] = useState({
        show: false,
        month: null,
        year: null,
        isCheck: 0
      });
 

  return (
    <ReportContext.Provider value={{ setShowReport, showReport }}>
      {children}
    </ReportContext.Provider>
  );
};

export default ReportContext;