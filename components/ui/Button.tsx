'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-primary text-white hover:opacity-90',
      secondary: 'bg-surface-container-high text-on-surface hover:bg-surface-variant',
      tertiary: 'bg-transparent text-primary',
      outline: 'border border-outline text-on-surface hover:bg-surface-container-low',
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={baseClasses + ' ' + variantClasses[variant] + ' ' + sizeClasses[size] + ' ' + className}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
