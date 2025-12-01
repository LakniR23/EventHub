import { useState, useCallback } from 'react';

export const useConfirmAlert = () => {
  const [confirm, setConfirm] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning',
    onConfirm: () => {}
  });

  const showConfirm = useCallback(({
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning',
    onConfirm = () => {}
  }) => {
    setConfirm({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm
    });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirm(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const confirmDelete = useCallback((itemName, onConfirm) => {
    showConfirm({
      title: 'Delete Item',
      message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm
    });
  }, [showConfirm]);

  return {
    confirm,
    showConfirm,
    hideConfirm,
    confirmDelete
  };
};

export default useConfirmAlert;