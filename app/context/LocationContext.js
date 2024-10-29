// LocationContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import * as Location from "expo-location";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
  };

  useEffect(() => {
    // const interval = setInterval(() => {
    //   getLocation();
    // }, 10000); // Lấy tọa độ mỗi 10 giây

    // return () => clearInterval(interval); // Dọn dẹp interval khi component bị hủy
  }, []);

  return (
    <LocationContext.Provider value={{ location, errorMsg }}>
      {children}
    </LocationContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng context
export const useLocation = () => {
  return useContext(LocationContext);
};
