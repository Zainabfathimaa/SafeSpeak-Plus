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
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      textColor: 'text-green-800'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: AlertCircle,
      iconColor: 'text-red-600',
      textColor: 'text-red-800'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-800'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: Info,
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800'
    }
  };

  const style = styles[type] || styles.info;
  const IconComponent = style.icon;

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-lg shadow-lg p-4 flex items-start gap-3 animate-slideIn`}
      role="alert"
    >
      <IconComponent className={`h-5 w-5 flex-shrink-0 mt-0.5 ${style.iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${style.textColor}`}>{message}</p>
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
        className={`${style.textColor} hover:opacity-75 flex-shrink-0`}
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 space-y-3 z-50 pointer-events-auto max-w-sm">
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
