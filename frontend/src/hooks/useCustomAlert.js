import { useState, useCallback } from 'react';

export const useCustomAlert = () => {
  const [alert, setAlert] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
    showIcon: true,
    showConfirm: true
  });

  const showAlert = useCallback(({
    title = 'Alert',
    message = '',
    type = 'info',
    confirmText = 'OK',
    showIcon = true,
    showConfirm = true
  }) => {
    setAlert({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      showIcon,
      showConfirm
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  // Convenience methods for different alert types
  const showSuccess = useCallback((title, message, confirmText = 'Great!') => {
    showAlert({
      title,
      message,
      type: 'success',
      confirmText
    });
  }, [showAlert]);

  const showError = useCallback((title, message, confirmText = 'OK') => {
    showAlert({
      title,
      message,
      type: 'error',
      confirmText
    });
  }, [showAlert]);

  const showWarning = useCallback((title, message, confirmText = 'Understood') => {
    showAlert({
      title,
      message,
      type: 'warning',
      confirmText
    });
  }, [showAlert]);

  const showInfo = useCallback((title, message, confirmText = 'OK') => {
    showAlert({
      title,
      message,
      type: 'info',
      confirmText
    });
  }, [showAlert]);

  return {
    alert,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useCustomAlert;