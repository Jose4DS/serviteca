import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { storageService } from '../services/storage';
import { MahoganyInput } from '../components/MahoganyInput';
import { MahoganyButton } from '../components/MahoganyButton';
import { KeyRound, ShieldAlert, Check } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { t, speak } = useAccessibility();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const currentCreds = storageService.getCredentials();

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setHasError(false);

    const success = storageService.login(username, password);
    if (success) {
      speak('Inicio de sesión exitoso');
      onLoginSuccess();
    } else {
      setHasError(true);
      speak(t('login.error', 'Datos incorrectos, intente nuevamente'));
    }
  };

  const handleLoadDemo = () => {
    setUsername(currentCreds.username);
    setPassword(currentCreds.password);
    setHasError(false);
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    storageService.setCredentials({
      username: currentCreds.username,
      password: newPassword.trim(),
    });
    setResetSuccessMessage('Contraseña actualizada con éxito');
    setPassword(newPassword.trim());
    setTimeout(() => {
      setResetSuccessMessage('');
      setShowForgotModal(false);
      setNewPassword('');
    }, 1500);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      {/* Centered Login Box: ~640 x 540 px */}
      <div 
        className="w-full max-w-[640px] min-h-[500px] bg-[#2E7D32] rounded-3xl p-8 sm:p-10 shadow-2xl border-2 border-[#236327] flex flex-col justify-between"
        role="region"
        aria-labelledby="login-heading"
      >
        <div>
          {/* Title */}
          <h2 
            id="login-heading" 
            className="text-3xl sm:text-4xl font-bold text-white text-center tracking-wide"
          >
            {t('login.title', 'Inicio de sesión')}
          </h2>

          {/* Error Message in Yellow under title */}
          {hasError && (
            <div 
              className="mt-4 p-2 text-center text-[#FFFF00] font-bold text-lg bg-black/20 rounded-lg border border-yellow-400/40 animate-in fade-in"
              role="alert"
            >
              ⚠️ {t('login.error', 'Datos incorrectos, intente nuevamente')}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-6">
            <MahoganyInput
              label={t('login.username', 'Usuario')}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (hasError) setHasError(false);
              }}
              placeholder="admin"
              autoComplete="username"
              hasError={hasError}
              required
            />

            <MahoganyInput
              label={t('login.password', 'Contraseña')}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (hasError) setHasError(false);
              }}
              placeholder="••••"
              autoComplete="current-password"
              hasError={hasError}
              required
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-white hover:text-stone-200 underline text-sm sm:text-base font-medium cursor-pointer transition-colors text-left"
              >
                {t('login.forgot', '¿Olvidaste tu contraseña?')}
              </button>

              <button
                type="button"
                onClick={handleLoadDemo}
                className="text-xs text-stone-200 hover:text-white bg-black/20 hover:bg-black/30 px-2.5 py-1 rounded border border-white/20 transition-colors cursor-pointer"
                title="Cargar credenciales predeterminadas"
              >
                {t('login.useDemo', 'Cargar demo')}
              </button>
            </div>

            {/* Bottom Right Ingresar Button */}
            <div className="flex justify-end pt-6">
              <MahoganyButton
                type="submit"
                className="min-w-36 text-lg py-2.5 shadow-md"
              >
                {t('login.submit', 'Ingresar')}
              </MahoganyButton>
            </div>
          </form>
        </div>

        {/* Demo info note at the bottom */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-stone-200">
          <span>{t('login.demoNotice', 'Credenciales de demostración: admin / 1234')}</span>
        </div>
      </div>

      {/* Password Recovery Modal */}
      {showForgotModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#2E7D32] text-white w-full max-w-md rounded-2xl p-6 shadow-2xl border-2 border-white/40">
            <div className="flex items-center gap-3 border-b border-white/20 pb-3 mb-4">
              <KeyRound className="w-6 h-6 text-yellow-300" />
              <h3 className="text-2xl font-bold text-white">
                {t('login.recoveryTitle', 'Recuperar contraseña')}
              </h3>
            </div>

            <p className="text-sm text-stone-200 mb-3">
              {t('login.recoveryDesc', 'Para la cuenta de demostración o administrador configurado:')}
            </p>

            <div className="bg-black/30 p-3 rounded-lg mb-4 text-sm font-mono space-y-1 border border-white/10">
              <p>👤 {t('login.recoveryUser', 'Usuario registrado: admin')}</p>
              <p>🔑 {t('login.recoveryPass', `Contraseña actual: ${currentCreds.password}`)}</p>
            </div>

            <form onSubmit={handleSaveNewPassword} className="space-y-4">
              <MahoganyInput
                label="Nueva contraseña (opcional para cambiar)"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva clave"
              />

              {resetSuccessMessage && (
                <p className="text-sm text-yellow-300 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" /> {resetSuccessMessage}
                </p>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setUsername(currentCreds.username);
                    setPassword(currentCreds.password);
                    setShowForgotModal(false);
                  }}
                  className="bg-[#5AC135] text-black font-bold px-3 py-1.5 rounded-lg text-sm hover:bg-[#6edc46] cursor-pointer"
                >
                  Usar credencial actual
                </button>

                <div className="flex gap-2">
                  {newPassword && (
                    <MahoganyButton type="submit" className="text-sm py-1.5 px-3">
                      Guardar
                    </MahoganyButton>
                  )}
                  <MahoganyButton
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="text-sm py-1.5 px-3"
                  >
                    {t('login.recoveryClose', 'Cerrar')}
                  </MahoganyButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
