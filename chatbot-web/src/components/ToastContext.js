// ToastContext.js
import React, { createContext, useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toastMessage, setToastMessage] = useState(null);
  
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
  };

  // Effect to show toast message
  React.useEffect(() => {
    if (toastMessage) {
      toast[toastMessage.type](toastMessage.message);
      setToastMessage(null); // Clear message after showing
    }
  }, [toastMessage]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}
