interface Props {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

const bgMap: Record<Props['type'], string> = {
  success: '#d4edda',
  error:   '#f8d7da',
  warning: '#fff3cd',
  info:    '#d1ecf1',
};
const borderMap: Record<Props['type'], string> = {
  success: '#28a745',
  error:   '#dc3545',
  warning: '#e0a800',
  info:    '#17a2b8',
};
const colorMap: Record<Props['type'], string> = {
  success: '#155724',
  error:   '#721c24',
  warning: '#856404',
  info:    '#0c5460',
};

export default function MessageBox({ type, message }: Props) {
  return (
    <div
      role="alert"
      style={{
        background: bgMap[type],
        border: `2px solid ${borderMap[type]}`,
        color: colorMap[type],
        borderRadius: 6,
        padding: '10px 16px',
        fontFamily: 'Times New Roman, serif',
        fontSize: 15,
        fontWeight: 'bold',
      }}
    >
      {message}
    </div>
  );
}
