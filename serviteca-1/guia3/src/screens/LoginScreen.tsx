import { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import type { Screen } from '../types';
import Logo from '../components/Logo';
import AccessibilityPanel from '../components/AccessibilityPanel';

// Credenciales de demostración
const DEMO_USER = 'admin';
const DEMO_PASS = '1234';

interface Props {
  onNavigate: (screen: Screen) => void;
}

export default function LoginScreen({ onNavigate }: Props) {
  const { idioma, speak } = useAccessibility();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (usuario === DEMO_USER && password === DEMO_PASS) {
      speak(t('menu.welcome', idioma));
      onNavigate('main');
    } else {
      setError(true);
      speak(t('login.error', idioma));
    }
  }

  return (
    <div
      style={{
        width: 1280,
        height: 720,
        background: '#e8ece8',
        display: 'flex',
        fontFamily: 'Times New Roman, serif',
        overflow: 'hidden',
        margin: '0 auto',
        boxShadow: '0 4px 32px #0004',
      }}
    >
      {/* Panel izquierdo decorativo */}
      <div
        style={{
          width: 420,
          background: 'linear-gradient(160deg, #3a6b47 60%, #4a7c59 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: 40,
        }}
      >
        <Logo size={90} />
        <div style={{ color: 'white', textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 'bold', margin: 0 }}>
            Sistema de Administración
          </p>
          <p style={{ fontSize: 14, color: '#c8e6c9', margin: '6px 0 0' }}>
            Clientes · Carros · Servicios
          </p>
        </div>
        {/* Decoración servicios */}
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
          {['🔧 Cambio de aceite', '⚙️ Sincronización', '🔄 Alineación', '🚿 Lavado'].map(s => (
            <div
              key={s}
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 8,
                padding: '8px 16px',
                color: 'white',
                fontSize: 14,
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Panel central: formulario */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: 12,
            padding: '40px 44px',
            width: 360,
            boxShadow: '0 2px 24px #0002',
            border: '2px solid #4a7c59',
          }}
        >
          <h2
            style={{
              color: '#3a6b47',
              fontSize: 26,
              fontWeight: 'bold',
              marginBottom: 6,
              textAlign: 'center',
            }}
          >
            {t('login.title', idioma)}
          </h2>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#888', marginBottom: 28 }}>
            Serviteca ADSO
          </p>

          {/* Mensaje de error en amarillo */}
          {error && (
            <div
              role="alert"
              style={{
                background: '#fff3cd',
                border: '2px solid #e0a800',
                color: '#856404',
                borderRadius: 6,
                padding: '10px 14px',
                marginBottom: 16,
                fontWeight: 'bold',
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              ⚠ {t('login.error', idioma)}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Usuario */}
            <div>
              <label
                htmlFor="login-user"
                style={{ fontWeight: 'bold', color: '#3a2010', fontSize: 14, display: 'block', marginBottom: 4 }}
              >
                {t('login.user', idioma)}
              </label>
              <input
                id="login-user"
                type="text"
                value={usuario}
                onChange={e => { setUsuario(e.target.value); setError(false); }}
                autoComplete="username"
                required
                placeholder="admin"
                style={{
                  width: '100%',
                  border: '2px solid #4a7c59',
                  borderRadius: 5,
                  padding: '8px 12px',
                  fontFamily: 'Times New Roman, serif',
                  fontSize: 15,
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#6B2A2A'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#4a7c59'; }}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="login-pass"
                style={{ fontWeight: 'bold', color: '#3a2010', fontSize: 14, display: 'block', marginBottom: 4 }}
              >
                {t('login.password', idioma)}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-pass"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(false); }}
                  autoComplete="current-password"
                  required
                  placeholder="••••"
                  style={{
                    width: '100%',
                    border: '2px solid #4a7c59',
                    borderRadius: 5,
                    padding: '8px 40px 8px 12px',
                    fontFamily: 'Times New Roman, serif',
                    fontSize: 15,
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#6B2A2A'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#4a7c59'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 18,
                    lineHeight: 1,
                    color: '#666',
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Botón entrar */}
            <button
              type="submit"
              style={{
                background: '#6B2A2A',
                color: 'white',
                border: '2px solid #4a1a1a',
                borderRadius: 6,
                padding: '10px',
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: 'Times New Roman, serif',
                cursor: 'pointer',
                marginTop: 4,
                transition: 'filter 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
            >
              {t('login.enter', idioma)}
            </button>
          </form>

          {/* Hint demo */}
          <div
            style={{
              marginTop: 20,
              background: '#e8f5e9',
              border: '1px dashed #4a7c59',
              borderRadius: 6,
              padding: '8px 12px',
              fontSize: 12,
              color: '#2e5c3a',
              textAlign: 'center',
            }}
          >
            💡 {t('login.hint', idioma)}
          </div>
        </div>
      </div>

      {/* Panel accesibilidad */}
      <AccessibilityPanel />
    </div>
  );
}
