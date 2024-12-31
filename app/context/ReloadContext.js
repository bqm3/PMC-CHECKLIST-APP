import React, { createContext, useState } from 'react';

export const ReloadContext = createContext();

export const ReloadProvider = ({ children }) => {
  const [isReload, setIsReload] = useState(false);

  return (
    <ReloadContext.Provider value={{ isReload, setIsReload }}>
      {children}
    </ReloadContext.Provider>
  );
};
