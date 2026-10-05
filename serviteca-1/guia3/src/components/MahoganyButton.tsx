import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
}

const styles: Record<string, React.CSSProperties> = {
  primary: {
    background: '#6B2A2A',   // caoba
    color: '#fff',
    border: '2px solid #4a1a1a',
  },
  secondary: {
    background: '#4a7c59',   // verde
    color: '#fff',
    border: '2px solid #2e5c3a',
  },
  danger: {
    background: '#c0392b',
    color: '#fff',
    border: '2px solid #922b21',
  },
};

export default function MahoganyButton({
  variant = 'primary',
  children,
  style,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      style={{
        ...styles[variant],
        fontFamily: 'Times New Roman, serif',
        fontSize: 15,
        fontWeight: 'bold',
        borderRadius: 6,
        padding: '8px 22px',
        cursor: rest.disabled ? 'not-allowed' : 'pointer',
        opacity: rest.disabled ? 0.6 : 1,
        transition: 'filter 0.15s',
        ...style,
      }}
      onMouseEnter={e => {
        if (!rest.disabled) (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.15)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)';
      }}
    >
      {children}
    </button>
  );
}
