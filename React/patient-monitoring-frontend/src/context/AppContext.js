import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // { role: 'patient'|'doctor', id, name }
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser, notification, showNotification }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
