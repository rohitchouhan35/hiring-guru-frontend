import React, { createContext, useContext, useEffect, useState } from 'react';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedAuth = localStorage.getItem('isLoggedIn');
    return storedAuth === 'true';
  });

  const validateToken = (token) => {
    try {
      const decoded = token;
      // Check if the token is expired
      if (decoded == "valido") {
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  };

  useEffect(() => {
    // Validate the token on initial load
    const token = localStorage.getItem('token');
    if (validateToken(token)) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      localStorage.removeItem('token');
    }
  }, []);

  return (
    <StateContext.Provider value={{ isLoggedIn, setIsLoggedIn, validateToken }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
