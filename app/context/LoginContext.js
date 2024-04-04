import React, { createContext, useEffect, useState, useContext } from "react";
export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [step, setStep] = useState(1);

  const saveStep = (data) => {
    setStep(data);
  };

  return (
    <LoginContext.Provider value={{ step, saveStep }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;