import Logo from './Logo';
import { useAccessibility } from '../context/AccessibilityContext';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { idioma } = useAccessibility();

  return (
    <header
      className="flex items-center gap-4 px-6 py-3 shadow-md"
      style={{ background: '#3a6b47', minHeight: 72 }}
      role="banner"
    >
      <Logo size={52} />
      <div className="flex-1">
        <h1
          className="text-white text-2xl font-bold tracking-wide"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          {title}
        </h1>
        <p
          className="text-green-200 text-sm"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          Sistema de administración de clientes, carros y servicios
        </p>
      </div>
      {/* Espacio decorativo derecho */}
      <div className="text-green-300 text-xs text-right" style={{ fontFamily: 'Times New Roman, serif' }}>
        <div>Serviteca ADSO</div>
        <div>v1.0.0</div>
      </div>
    </header>
  );
}
