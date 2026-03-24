import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const Toast = ({ 
  id, 
  type = 'info', 
  message, 
  duration = 5000, 
  onClose,
  action 
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const styles = {
    success: {
      bg: 'bg-white/80 backdrop-blur-md',
      border: 'border-l-4 border-l-green-500 border-gray-100',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      textColor: 'text-gray-800'
    },
    error: {
      bg: 'bg-white/80 backdrop-blur-md',
      border: 'border-l-4 border-l-red-500 border-gray-100',
      icon: AlertCircle,
      iconColor: 'text-red-500',
      textColor: 'text-gray-800'
    },
    warning: {
      bg: 'bg-white/80 backdrop-blur-md',
      border: 'border-l-4 border-l-yellow-500 border-gray-100',
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      textColor: 'text-gray-800'
    },
    info: {
      bg: 'bg-white/80 backdrop-blur-md',
      border: 'border-l-4 border-l-blue-500 border-gray-100',
      icon: Info,
      iconColor: 'text-blue-500',
      textColor: 'text-gray-800'
    }
  };

  const style = styles[type] || styles.info;
  const IconComponent = style.icon;

  return (
    <div
      className={`${style.bg} ${style.border} rounded-xl shadow-xl p-4 flex items-center gap-4 animate-slideDown pointer-events-auto border border-gray-100/50`}
      role="alert"
    >
      <div className={`p-2 rounded-full ${style.bg.replace('bg-white/80', 'bg-white')} shadow-sm`}>
        <IconComponent className={`h-5 w-5 flex-shrink-0 ${style.iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold tracking-tight ${style.textColor}`}>{message}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className={`text-sm font-medium ${style.textColor} hover:opacity-75 underline flex-shrink-0`}
        >
          {action.label}
        </button>
      )}
      <button
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 p-1 rounded-full hover:bg-gray-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 space-y-3 z-[9999] pointer-events-none w-full max-w-md px-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          action={toast.action}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default Toast;
