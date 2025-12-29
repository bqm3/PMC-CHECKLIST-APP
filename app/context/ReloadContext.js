import React, { createContext, useState } from 'react';

export const ReloadContext = createContext();

export function ReloadProvider({ children }) {
  const [reloadKey, setReloadKey] = useState(0);

  const reload = () => setReloadKey(k => k + 1);

  return (
    <ReloadContext.Provider value={{ reloadKey, reload }}>
      {children}
    </ReloadContext.Provider>
  );
}
