/**
 * Layout base de 1280×720 px.
 * Estructura: Header | (contenido + panel accesibilidad)
 */
import Header from './Header';
import AccessibilityPanel from './AccessibilityPanel';

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: Props) {
  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: '#e8ece8',   // gris claro con toque verde
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Times New Roman, serif',
        overflow: 'hidden',
        boxShadow: '0 4px 32px #0004',
        margin: '0 auto',
      }}
    >
      <Header title={title} />

      {/* Área principal + panel lateral */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Contenido de la pantalla */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 28px',
          }}
          role="main"
        >
          {children}
        </main>

        {/* Panel accesibilidad (lado derecho) */}
        <AccessibilityPanel />
      </div>
    </div>
  );
}
