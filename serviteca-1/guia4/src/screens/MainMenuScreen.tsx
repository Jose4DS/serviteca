import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import type { Screen, NavTarget } from '../types';

interface Props {
  onNavigate: (target: NavTarget) => void;
  onLogout: () => void;
}

type MenuItem = {
  key: string;
  label: (lang: ReturnType<typeof useAccessibility>['idioma']) => string;
  icon: string;
  subs?: { label: string; screen: NavTarget }[];
};

export default function MainMenuScreen({ onNavigate, onLogout }: Props) {
  const { idioma, speak } = useAccessibility();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      key: 'clients',
      label: (l) => t('menu.clients', l),
      icon: '👤',
      subs: [
        { label: t('menu.add', idioma), screen: 'client-add' },
        { label: t('menu.list', idioma), screen: 'client-list' },
      ],
    },
    {
      key: 'cars',
      label: (l) => t('menu.cars', l),
      icon: '🚗',
      subs: [
        { label: t('menu.add', idioma), screen: 'car-add' },
        { label: t('menu.list', idioma), screen: 'car-list' },
      ],
    },
    {
      key: 'services',
      label: (l) => t('menu.services', l),
      icon: '🔧',
      subs: [
        { label: t('menu.add', idioma), screen: 'service-add' },
        { label: t('menu.query', idioma), screen: 'service-query' },
        { label: t('menu.list', idioma), screen: 'service-list' },
      ],
    },
    {
      key: 'help',
      label: (l) => t('menu.help', l),
      icon: '❓',
      subs: [
        { label: t('menu.help', idioma), screen: 'help' },
      ],
    },
  ];

  function handleMenuClick(key: string, label: string) {
    speak(label);
    setOpenMenu(prev => (prev === key ? null : key));
  }

  function handleSub(screen: NavTarget, label: string) {
    speak(label);
    onNavigate(screen);
  }

  return (
    <PageLayout title={t('menu.welcome', idioma)}>
      {/* Bienvenida */}
      <div
        style={{
          background: 'white',
          borderRadius: 10,
          border: '2px solid #4a7c59',
          padding: '18px 24px',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span style={{ fontSize: 32 }}>👋</span>
        <div>
          <p style={{ fontWeight: 'bold', fontSize: 18, color: '#3a6b47', margin: 0 }}>
            {t('menu.welcome', idioma)}
          </p>
          <p style={{ fontSize: 13, color: '#666', margin: '4px 0 0' }}>
            Seleccione una opción del menú para continuar.
          </p>
        </div>
      </div>

      {/* Grid de menú */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        {menuItems.map(item => (
          <div key={item.key} style={{ position: 'relative' }}>
            {/* Botón principal */}
            <button
              onClick={() => handleMenuClick(item.key, item.label(idioma))}
              aria-expanded={openMenu === item.key}
              aria-haspopup="menu"
              style={{
                width: '100%',
                background: openMenu === item.key ? '#3a6b47' : '#4a7c59',
                color: 'white',
                border: `2px solid ${openMenu === item.key ? '#2e5c3a' : '#3a6b47'}`,
                borderRadius: openMenu === item.key ? '8px 8px 0 0' : 8,
                padding: '18px 12px',
                cursor: 'pointer',
                fontFamily: 'Times New Roman, serif',
                fontWeight: 'bold',
                fontSize: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => {
                if (openMenu !== item.key)
                  (e.currentTarget as HTMLButtonElement).style.background = '#3a6b47';
              }}
              onMouseLeave={e => {
                if (openMenu !== item.key)
                  (e.currentTarget as HTMLButtonElement).style.background = '#4a7c59';
              }}
            >
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              {item.label(idioma)}
              <span style={{ fontSize: 11, opacity: 0.8 }}>
                {openMenu === item.key ? '▲' : '▼'}
              </span>
            </button>

            {/* Submenú desplegable */}
            {openMenu === item.key && item.subs && (
              <div
                role="menu"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '2px solid #3a6b47',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  zIndex: 100,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px #0002',
                }}
              >
                {item.subs.map(sub => (
                  <button
                    key={sub.screen}
                    role="menuitem"
                    onClick={() => handleSub(sub.screen, sub.label)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid #e0e8e0',
                      padding: '11px 16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: 'Times New Roman, serif',
                      fontSize: 15,
                      color: '#3a2010',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f0f7f0'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#6B2A2A',
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                    />
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Botón Salir */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button
          onClick={() => { speak(t('menu.exit', idioma)); onLogout(); }}
          style={{
            background: '#6B2A2A',
            color: 'white',
            border: '2px solid #4a1a1a',
            borderRadius: 6,
            padding: '10px 28px',
            fontFamily: 'Times New Roman, serif',
            fontWeight: 'bold',
            fontSize: 15,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
        >
          🚪 {t('menu.exit', idioma)}
        </button>
      </div>

      {/* Resumen de datos */}
      <DataSummary idioma={idioma} />
    </PageLayout>
  );
}

/* Resumen rápido de registros en localStorage */
import { getClientes, getCarros, getServicios } from '../services/storage';

function DataSummary({ idioma }: { idioma: ReturnType<typeof useAccessibility>['idioma'] }) {
  const clients = getClientes().length;
  const cars = getCarros().length;
  const services = getServicios().length;

  const items = [
    { icon: '👤', label: t('menu.clients', idioma), count: clients, color: '#4a7c59' },
    { icon: '🚗', label: t('menu.cars', idioma), count: cars, color: '#3a6b47' },
    { icon: '🔧', label: t('menu.services', idioma), count: services, color: '#6B2A2A' },
  ];

  return (
    <div style={{ display: 'flex', gap: 14, marginTop: 20 }}>
      {items.map(item => (
        <div
          key={item.label}
          style={{
            flex: 1,
            background: 'white',
            border: `2px solid ${item.color}`,
            borderRadius: 8,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ fontSize: 24 }}>{item.icon}</span>
          <div>
            <div style={{ fontSize: 22, fontWeight: 'bold', color: item.color }}>{item.count}</div>
            <div style={{ fontSize: 12, color: '#555' }}>{item.label} registrados</div>
          </div>
        </div>
      ))}
    </div>
  );
}
