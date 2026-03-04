// Toast Service - Centralized toast management
let toastListeners = [];
let toastId = 0;

export const toastService = {
  // Subscribe to toast updates
  subscribe: (listener) => {
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  },

  // Show success toast
  success: (message, duration = 5000) => {
    const id = ++toastId;
    toastListeners.forEach(listener => 
      listener({ id, type: 'success', message, duration })
    );
    return id;
  },

  // Show error toast
  error: (message, duration = 6000) => {
    const id = ++toastId;
    toastListeners.forEach(listener => 
      listener({ id, type: 'error', message, duration })
    );
    return id;
  },

  // Show warning toast
  warning: (message, duration = 5000) => {
    const id = ++toastId;
    toastListeners.forEach(listener => 
      listener({ id, type: 'warning', message, duration })
    );
    return id;
  },

  // Show info toast
  info: (message, duration = 5000) => {
    const id = ++toastId;
    toastListeners.forEach(listener => 
      listener({ id, type: 'info', message, duration })
    );
    return id;
  },

  // Show custom toast with action button
  custom: (message, type = 'info', duration = 5000, action = null) => {
    const id = ++toastId;
    toastListeners.forEach(listener => 
      listener({ id, type, message, duration, action })
    );
    return id;
  },

  // Remove specific toast
  remove: (id) => {
    toastListeners.forEach(listener => listener(null, id));
  }
};

export default toastService;
