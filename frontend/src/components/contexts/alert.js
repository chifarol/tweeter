import React, { createContext, useState, useEffect } from "react";

// initialize alert context for flash messages
export const AlertContext = createContext();

// the provider for alert context
export const AlertContextProvider = ({ children }) => {
  // initial state
  const initialState = {
    text: " ",
    active: false,
    type: "success",
  };
  // inintialize alert state
  const [alert, setAlert] = useState(initialState);

  // reset alert context after a new alert
  useEffect(() => {
    setTimeout(() => {
      setAlert({ ...alert, active: false });
    }, 5000);
  }, [alert]);

  const value = { alert, setAlert };
  return (
    <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
  );
};

export default AlertContext;
