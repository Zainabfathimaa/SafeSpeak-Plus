import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, label, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-text-primary mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    type={inputType}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
                        isPassword && "pr-10",
                        error && "border-red-500 focus:ring-red-500",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
export { Input };
