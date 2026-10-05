import { useState } from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import type { Screen } from './types';

import LoginScreen      from './screens/LoginScreen';
import MainMenuScreen   from './screens/MainMenuScreen';
import ClientAddScreen  from './screens/ClientAddScreen';
import CarAddScreen     from './screens/CarAddScreen';
import ServiceAddScreen from './screens/ServiceAddScreen';
import ServiceQueryScreen from './screens/ServiceQueryScreen';
import ListViewScreen   from './screens/ListViewScreen';
import HelpModal        from './screens/HelpModal';

export default function App() {
  const [screen, setScreen] = useState<Screen>('login');
  const [loggedIn, setLoggedIn] = useState(false);

  function navigate(s: Screen) {
    // Proteger rutas: si no está logueado, volver al login
    if (s !== 'login' && !loggedIn) {
      setScreen('login');
      return;
    }
    setScreen(s);
  }

  function handleLogin() {
    setLoggedIn(true);
    setScreen('main');
  }

  function handleLogout() {
    setLoggedIn(false);
    setScreen('login');
  }

  return (
    <AccessibilityProvider>
      {/* Centrar el frame 1280×720 en la ventana */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#c8d8c8',
          padding: '16px',
          boxSizing: 'border-box',
        }}
      >
        {screen === 'login' && (
          <LoginScreen onNavigate={handleLogin as unknown as (s: Screen) => void} />
        )}

        {loggedIn && screen === 'main' && (
          <MainMenuScreen onNavigate={navigate} onLogout={handleLogout} />
        )}

        {loggedIn && screen === 'client-add' && (
          <ClientAddScreen onNavigate={navigate} />
        )}

        {loggedIn && screen === 'client-list' && (
          <ListViewScreen mode="client-list" onNavigate={navigate} />
        )}

        {loggedIn && screen === 'car-add' && (
          <CarAddScreen onNavigate={navigate} />
        )}

        {loggedIn && screen === 'car-list' && (
          <ListViewScreen mode="car-list" onNavigate={navigate} />
        )}

        {loggedIn && screen === 'service-add' && (
          <ServiceAddScreen onNavigate={navigate} />
        )}

        {loggedIn && screen === 'service-query' && (
          <ServiceQueryScreen onNavigate={navigate} />
        )}

        {loggedIn && screen === 'service-list' && (
          <ListViewScreen mode="service-list" onNavigate={navigate} />
        )}

        {loggedIn && screen === 'help' && (
          <HelpModal onNavigate={navigate} />
        )}
      </div>
    </AccessibilityProvider>
  );
}
