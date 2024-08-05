import React, { createContext, useEffect, useState, useContext } from "react";
export const ConnectContext = createContext();

export const ConnectProvider = ({ children }) => {
  const [isConnect, setConnect] = useState(false);

  const saveConnect = (data) => {
    setConnect(data);
  };

  return (
    <ConnectContext.Provider value={{ isConnect, saveConnect }}>
      {children}
    </ConnectContext.Provider>
  );
};

export default ConnectContext;