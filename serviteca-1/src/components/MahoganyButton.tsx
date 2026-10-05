import React from 'react';

interface MahoganyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

export const MahoganyButton: React.FC<MahoganyButtonProps> = ({
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={`
        bg-[#8B3A1E] text-white font-bold px-6 py-2 rounded-lg
        border border-[#6e2b14] shadow-sm
        hover:bg-[#9e4324] hover:shadow
        active:bg-[#783017] active:translate-y-px
        focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-[#2E7D32]
        transition-all duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
