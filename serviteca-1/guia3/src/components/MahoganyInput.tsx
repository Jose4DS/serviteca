import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export default function MahoganyInput({ label, id, ...rest }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        style={{
          fontFamily: 'Times New Roman, serif',
          fontSize: 14,
          fontWeight: 'bold',
          color: '#3a2010',
        }}
      >
        {label}
      </label>
      <input
        id={id}
        {...rest}
        style={{
          fontFamily: 'Times New Roman, serif',
          fontSize: 15,
          border: '2px solid #4a7c59',
          borderRadius: 5,
          padding: '6px 10px',
          background: '#f8faf8',
          color: '#1a1a1a',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          ...rest.style,
        }}
        onFocus={e => { e.currentTarget.style.borderColor = '#6B2A2A'; }}
        onBlur={e => { e.currentTarget.style.borderColor = '#4a7c59'; }}
      />
    </div>
  );
}
