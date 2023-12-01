import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedAuth = true;
    return storedAuth === 'true';
  });

  const validateToken = (token) => {
    return true;
  };

  return (
    <StateContext.Provider value={{ isLoggedIn, setIsLoggedIn, validateToken }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
