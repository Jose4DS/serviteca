import React from 'react';

interface MahoganyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hasError?: boolean;
}

export const MahoganyInput: React.FC<MahoganyInputProps> = ({
  label,
  hasError = false,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={inputId} className="text-white text-base font-medium select-none">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          bg-[#8B3A1E] text-white px-3 py-2 rounded-lg text-base
          border ${hasError ? 'border-yellow-400 ring-1 ring-yellow-400' : 'border-[#6e2b14]'}
          focus:outline-none focus:ring-2 focus:ring-white focus:border-white
          placeholder:text-stone-300 placeholder:opacity-60
          transition-colors duration-150
          ${className}
        `}
        {...props}
      />
    </div>
  );
};
