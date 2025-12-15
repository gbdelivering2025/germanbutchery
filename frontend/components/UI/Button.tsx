import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'whatsapp' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#8B0000] text-white border-[#8B0000] hover:bg-[#6B0000]',
    secondary: 'bg-[#1a1a1a] text-white border-[#1a1a1a] hover:bg-black',
    whatsapp: 'bg-[#25D366] text-white border-[#25D366] hover:bg-[#20BA5A]',
    outline: 'bg-transparent text-[#8B0000] border-[#8B0000] hover:bg-[#8B0000] hover:text-white',
    ghost: 'bg-transparent text-[#1a1a1a] border-transparent hover:bg-gray-100',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block mr-2">⏳</span>
      ) : null}
      {children}
    </button>
  );
}
