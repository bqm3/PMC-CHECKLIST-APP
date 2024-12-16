import React, { createContext, useEffect, useState, useContext } from "react";
export const ExpoTokenContext = createContext();

export const ExpoTokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);

 

  return (
    <ExpoTokenContext.Provider value={{ token, setToken }}>
      {children}
    </ExpoTokenContext.Provider>
  );
};

export default ExpoTokenContext;