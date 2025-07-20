import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
                                         className = '',
                                         variant = 'default',
                                         children,
                                         ...props
                                     }) => {
    const variants = {
        default: 'bg-blue-600 text-white',
        secondary: 'bg-gray-100 text-gray-800',
        destructive: 'bg-red-600 text-white',
        outline: 'border border-gray-300 text-gray-700 bg-white',
    };

    return (
        <div
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export { Badge };