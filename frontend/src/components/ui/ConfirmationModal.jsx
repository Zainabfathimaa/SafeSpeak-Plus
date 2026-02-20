import React from 'react';
import { Button } from './Button';
import { X, AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';

/**
 * ConfirmationModal Component
 * 
 * A reusable modal dialog for confirming actions.
 * 
 * Props:
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Function to call when closing/cancelling
 * @param {function} onConfirm - Function to call when confirming
 * @param {string} title - Modal title
 * @param {string} message - Modal message/description
 * @param {string} confirmText - Text for confirm button (default: "Confirm")
 * @param {string} cancelText - Text for cancel button (default: "Cancel")
 * @param {string} variant - 'danger' | 'warning' | 'info' (default: 'danger')
 */
export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}) {
    if (!isOpen) return null;

    // Prevent scrolling when modal is open
    React.useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const getIcon = () => {
        switch (variant) {
            case 'warning':
                return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
            case 'info':
                return <AlertTriangle className="h-6 w-6 text-blue-500" />; // Replace with Info icon if available
            case 'danger':
            default:
                return <AlertTriangle className="h-6 w-6 text-red-500" />;
        }
    };

    const getConfirmButtonVariant = () => {
        switch (variant) {
            case 'warning': return 'secondary'; // Or a custom warning variant
            case 'info': return 'primary';
            case 'danger': return 'destructive'; // Assuming Button supports this or similar
            default: return 'primary';
        }
    };

    // Use portal to render outside parent DOM hierarchy
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div
                className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-scale-in"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${variant === 'danger' ? 'bg-red-50' : 'bg-gray-50'}`}>
                            {getIcon()}
                        </div>
                        <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 border-t border-gray-100">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default ConfirmationModal;
