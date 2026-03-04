import { useState, useCallback, useEffect } from 'react';
import toastService from '../services/toastService';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastService.subscribe((toast, removeId) => {
      if (removeId !== undefined && removeId !== null) {
        // Remove toast
        setToasts(prev => prev.filter(t => t.id !== removeId));
      } else if (toast) {
        // Add toast
        setToasts(prev => [...prev, toast]);
      }
    });

    return unsubscribe;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, removeToast };
};

export default useToast;
