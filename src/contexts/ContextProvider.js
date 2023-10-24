import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
