import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import MahoganyInput from '../components/MahoganyInput';
import MahoganyButton from '../components/MahoganyButton';
import MessageBox from '../components/MessageBox';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import { saveCliente } from '../services/storage';
import type { Screen } from '../types';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const EMPTY = { identificacion: '', nombres: '', apellidos: '', correo: '', celular: '' };

export default function ClientAddScreen({ onNavigate }: Props) {
  const { idioma, speak } = useAccessibility();
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');

  function set(field: keyof typeof EMPTY, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    setStatus('idle');
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const allFilled = Object.values(form).every(v => v.trim() !== '');
    if (!allFilled) {
      setStatus('error');
      speak(t('client.error', idioma));
      return;
    }
    saveCliente(form);
    setStatus('saved');
    speak(t('client.saved', idioma));
    setForm(EMPTY);
  }

  return (
    <PageLayout title={t('client.title', idioma)}>
      {/* Panel del formulario */}
      <div
        style={{
          background: 'white',
          border: '2px solid #4a7c59',
          borderRadius: 10,
          padding: '28px 32px',
          maxWidth: 560,
        }}
      >
        <h2 style={{ color: '#3a6b47', fontSize: 20, marginBottom: 20, fontWeight: 'bold' }}>
          📋 {t('client.title', idioma)}
        </h2>

        {status === 'saved' && (
          <div style={{ marginBottom: 16 }}>
            <MessageBox type="success" message={t('client.saved', idioma)} />
          </div>
        )}
        {status === 'error' && (
          <div style={{ marginBottom: 16 }}>
            <MessageBox type="error" message={t('client.error', idioma)} />
          </div>
        )}

        <form onSubmit={handleSave} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <MahoganyInput
              id="cli-id"
              label={t('client.id', idioma)}
              value={form.identificacion}
              onChange={e => set('identificacion', e.target.value)}
              placeholder="Ej: 1001234567"
              type="text"
              inputMode="numeric"
            />
            <MahoganyInput
              id="cli-phone"
              label={t('client.phone', idioma)}
              value={form.celular}
              onChange={e => set('celular', e.target.value)}
              placeholder="Ej: 3001234567"
              type="tel"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <MahoganyInput
              id="cli-names"
              label={t('client.names', idioma)}
              value={form.nombres}
              onChange={e => set('nombres', e.target.value)}
              placeholder="Ej: Juan Carlos"
            />
            <MahoganyInput
              id="cli-surnames"
              label={t('client.surnames', idioma)}
              value={form.apellidos}
              onChange={e => set('apellidos', e.target.value)}
              placeholder="Ej: Gómez Pérez"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <MahoganyInput
              id="cli-email"
              label={t('client.email', idioma)}
              value={form.correo}
              onChange={e => set('correo', e.target.value)}
              placeholder="Ej: juan@correo.com"
              type="email"
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <MahoganyButton type="submit" variant="secondary">
              💾 {t('client.save', idioma)}
            </MahoganyButton>
            <MahoganyButton
              type="button"
              variant="primary"
              onClick={() => onNavigate('main')}
            >
              ← {t('client.back', idioma)}
            </MahoganyButton>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
