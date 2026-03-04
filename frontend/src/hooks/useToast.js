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

  // helper that frontend components expect
  const addToast = useCallback((type, message, duration, action) => {
    // type should be one of 'success','error','warning','info','custom'
    if (typeof toastService[type] === 'function') {
      return toastService[type](message, duration, action);
    }
    console.warn(`toastService has no method for type '${type}', defaulting to info`);
    return toastService.info(message, duration, action);
  }, []);

  return { toasts, removeToast, addToast };
};

export default useToast;
