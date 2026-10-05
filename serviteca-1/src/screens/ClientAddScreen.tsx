import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { storageService } from '../services/storage';
import { MahoganyInput } from '../components/MahoganyInput';
import { MahoganyButton } from '../components/MahoganyButton';
import { MessageBox } from '../components/MessageBox';
import { AlertState } from '../types';
import { Users } from 'lucide-react';

interface ClientAddScreenProps {
  onBack: () => void;
}

export const ClientAddScreen: React.FC<ClientAddScreenProps> = ({ onBack }) => {
  const { t, speak } = useAccessibility();

  const [identification, setIdentification] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [alert, setAlert] = useState<AlertState | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Check empty fields
    if (
      !identification.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      setAlert({
        type: 'error',
        title: t('alert.errorTitle', '¡Error!'),
        message: t('alert.emptyFields', 'Debe llenar todos los espacios en blanco'),
      });
      return;
    }

    // Save client
    storageService.addClient({
      identification: identification.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });

    setAlert({
      type: 'success',
      title: t('alert.successTitle', '¡Guardado!'),
      message: t('alert.savedSuccess', 'Se han guardado los datos con éxito'),
    });

    // Clear fields
    setIdentification('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      {/* Panel Dark Green ~1070 x 600 px */}
      <div 
        className="w-full max-w-[1070px] min-h-[580px] bg-[#2E7D32] rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-[#236327] flex flex-col justify-between"
        role="region"
        aria-labelledby="client-form-heading"
      >
        <div>
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/20 pb-4 mb-8">
            <div className="p-2 rounded-lg bg-black/25 text-white">
              <Users className="w-8 h-8" />
            </div>
            <h2 id="client-form-heading" className="text-3xl font-bold text-white tracking-wide">
              {t('client.addTitle', 'Registrar cliente')}
            </h2>
          </div>

          {/* Form */}
          <form id="client-form" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <MahoganyInput
              label={t('client.id', 'Identificación')}
              value={identification}
              onChange={(e) => setIdentification(e.target.value)}
              placeholder="Ej: 10203040"
              autoComplete="off"
            />

            <div className="hidden md:block"></div>

            <MahoganyInput
              label={t('client.firstName', 'Nombres')}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ej: Tobey"
              autoComplete="off"
            />

            <MahoganyInput
              label={t('client.lastName', 'Apellidos')}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ej: Marshall"
              autoComplete="off"
            />

            <MahoganyInput
              label={t('client.email', 'Correo electrónico')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej: tobey@ejemplo.com"
              autoComplete="off"
            />

            <MahoganyInput
              label={t('client.phone', 'Celular')}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej: 3001234567"
              autoComplete="off"
            />
          </form>
        </div>

        {/* Bottom Right: Regresar y Guardar */}
        <div className="flex justify-end items-center gap-5 pt-8 mt-6 border-t border-white/20">
          <MahoganyButton
            type="button"
            onClick={onBack}
            className="min-w-32 text-lg py-2.5"
          >
            {t('btn.back', 'Regresar')}
          </MahoganyButton>

          <MahoganyButton
            type="submit"
            form="client-form"
            className="min-w-32 text-lg py-2.5 shadow-md"
          >
            {t('btn.save', 'Guardar')}
          </MahoganyButton>
        </div>
      </div>

      {/* Alert Message Box in Light Green */}
      {alert && (
        <MessageBox
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};
