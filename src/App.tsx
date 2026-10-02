/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityContext';
import { storageService } from './services/storage';
import { ScreenType } from './types';
import { Header } from './components/Header';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { LoginScreen } from './screens/LoginScreen';
import { MainMenuScreen } from './screens/MainMenuScreen';
import { ClientAddScreen } from './screens/ClientAddScreen';
import { CarAddScreen } from './screens/CarAddScreen';
import { ServiceAddScreen } from './screens/ServiceAddScreen';
import { ServiceQueryScreen } from './screens/ServiceQueryScreen';
import { ListViewScreen } from './screens/ListViewScreen';
import { HelpModal } from './screens/HelpModal';

const AppContent: React.FC = () => {
  const { speak } = useAccessibility();

  // Authentication & Navigation
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return storageService.isAuthenticated();
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    return storageService.isAuthenticated() ? 'menu' : 'login';
  });

  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Sync authentication state
  useEffect(() => {
    const isAuth = storageService.isAuthenticated();
    setIsAuthenticated(isAuth);
    if (!isAuth) {
      setCurrentScreen('login');
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentScreen('menu');
  };

  const handleLogout = () => {
    storageService.logout();
    setIsAuthenticated(false);
    setCurrentScreen('login');
  };

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    speak(screen.replace('_', ' '));
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    speak('Menú principal');
  };

  return (
    <div className="min-h-screen w-full bg-[#F0F0F0] text-black flex flex-col justify-between select-none">
      {/* Target Canvas Wrapper: 1280 x 720 reference layout */}
      <div className="w-full max-w-[1280px] min-h-[720px] mx-auto flex flex-col p-3 sm:p-5 my-auto">
        {/* Top Header with SERVITECA brand & logo */}
        <Header 
          onLogoClick={isAuthenticated ? handleBackToMenu : undefined} 
        />

        {/* Center Main Stage + Right Accessibility Panel */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 sm:gap-6 items-stretch my-2">
          {/* Main Working Stage */}
          <main className="flex-1 flex flex-col justify-center min-w-0" role="main">
            {currentScreen === 'login' && (
              <LoginScreen onLoginSuccess={handleLoginSuccess} />
            )}

            {currentScreen === 'menu' && (
              <MainMenuScreen
                onNavigate={handleNavigate}
                onLogout={handleLogout}
                onOpenHelp={() => setShowHelpModal(true)}
              />
            )}

            {currentScreen === 'client_add' && (
              <ClientAddScreen onBack={handleBackToMenu} />
            )}

            {currentScreen === 'car_add' && (
              <CarAddScreen onBack={handleBackToMenu} />
            )}

            {currentScreen === 'service_add' && (
              <ServiceAddScreen onBack={handleBackToMenu} />
            )}

            {currentScreen === 'service_query' && (
              <ServiceQueryScreen onBack={handleBackToMenu} />
            )}

            {(currentScreen === 'client_list' ||
              currentScreen === 'car_list' ||
              currentScreen === 'service_list') && (
              <ListViewScreen
                type={currentScreen}
                onBack={handleBackToMenu}
                onNavigateToAdd={(targetAdd) => setCurrentScreen(targetAdd)}
              />
            )}
          </main>

          {/* Global Vertical Accessibility Panel on the right */}
          <div className="flex items-center justify-center shrink-0">
            <AccessibilityPanel />
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AccessibilityProvider>
      <AppContent />
    </AccessibilityProvider>
  );
}
