import React, { createContext, useEffect, useState, useContext } from "react";
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUser] = useState(null);

  const saveUser = (data) => {
    setUser(data);
  };

  // useEffect({
  //   setUser
  // },[userData])

  // useEffect({setUser(data)},[userData])


  return (
    <UserContext.Provider value={{ userData, saveUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;