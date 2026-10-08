import { useState } from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import type { Screen, NavTarget } from './types';

// Pantallas heredadas de guia3 (sin cambios)
import LoginScreen       from './screens/LoginScreen';
import MainMenuScreen    from './screens/MainMenuScreen';
import HelpModal         from './screens/HelpModal';

// Formularios de registro (actualizados en T-3)
import ClientAddScreen   from './screens/ClientAddScreen';
import CarAddScreen      from './screens/CarAddScreen';
import ServiceAddScreen  from './screens/ServiceAddScreen';

// Pantallas de edición (nuevas en T-4)
import ClientEditScreen  from './screens/ClientEditScreen';
import CarEditScreen     from './screens/CarEditScreen';
import ServiceEditScreen from './screens/ServiceEditScreen';

// Listados (reescritos en T-4)
import ListViewScreen    from './screens/ListViewScreen';

// Historial completo (ampliado en T-5)
import ServiceQueryScreen from './screens/ServiceQueryScreen';

export default function App() {
  const [screen,  setScreen]  = useState<Screen>('login');
  const [editId,  setEditId]  = useState<string | undefined>(undefined);
  const [loggedIn, setLoggedIn] = useState(false);

  /**
   * Función de navegación unificada.
   * Acepta tanto un nombre de pantalla como un NavPayload con editId.
   * Todos los componentes que llaman onNavigate('main') siguen funcionando
   * sin cambios porque el tipo NavTarget = Screen | NavPayload.
   */
  function navigate(target: NavTarget) {
    const s   = typeof target === 'string' ? target : target.screen;
    const id  = typeof target === 'string' ? undefined : target.editId;

    if (s !== 'login' && !loggedIn) {
      setScreen('login');
      return;
    }
    setScreen(s);
    setEditId(id);
  }

  function handleLogin() {
    setLoggedIn(true);
    setScreen('main');
  }

  function handleLogout() {
    setLoggedIn(false);
    setScreen('login');
    setEditId(undefined);
  }

  return (
    <AccessibilityProvider>
      {/* Centrar el frame 1280×720 en la ventana */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#c8d8c8',
        padding: '16px',
        boxSizing: 'border-box',
      }}>

        {/* ── Login ────────────────────────────────────────────── */}
        {screen === 'login' && (
          <LoginScreen onNavigate={handleLogin as unknown as (s: Screen) => void} />
        )}

        {/* ── Menú principal ───────────────────────────────────── */}
        {loggedIn && screen === 'main' && (
          <MainMenuScreen onNavigate={navigate} onLogout={handleLogout} />
        )}

        {/* ── Clientes ─────────────────────────────────────────── */}
        {loggedIn && screen === 'client-add' && (
          <ClientAddScreen onNavigate={navigate} />
        )}
        {loggedIn && screen === 'client-edit' && editId && (
          <ClientEditScreen editId={editId} onNavigate={navigate} />
        )}
        {loggedIn && screen === 'client-list' && (
          <ListViewScreen mode="client-list" onNavigate={navigate} />
        )}

        {/* ── Carros ───────────────────────────────────────────── */}
        {loggedIn && screen === 'car-add' && (
          <CarAddScreen onNavigate={navigate} />
        )}
        {loggedIn && screen === 'car-edit' && editId && (
          <CarEditScreen editId={editId} onNavigate={navigate} />
        )}
        {loggedIn && screen === 'car-list' && (
          <ListViewScreen mode="car-list" onNavigate={navigate} />
        )}

        {/* ── Servicios ────────────────────────────────────────── */}
        {loggedIn && screen === 'service-add' && (
          <ServiceAddScreen onNavigate={navigate} />
        )}
        {loggedIn && screen === 'service-edit' && editId && (
          <ServiceEditScreen editId={editId} onNavigate={navigate} />
        )}
        {loggedIn && screen === 'service-query' && (
          <ServiceQueryScreen onNavigate={navigate} />
        )}
        {loggedIn && screen === 'service-list' && (
          <ListViewScreen mode="service-list" onNavigate={navigate} />
        )}

        {/* ── Ayuda ────────────────────────────────────────────── */}
        {loggedIn && screen === 'help' && (
          <HelpModal onNavigate={navigate} />
        )}
      </div>
    </AccessibilityProvider>
  );
}
