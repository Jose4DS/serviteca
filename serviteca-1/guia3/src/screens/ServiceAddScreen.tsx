import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import MahoganyInput from '../components/MahoganyInput';
import MahoganyButton from '../components/MahoganyButton';
import MessageBox from '../components/MessageBox';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import { saveServicio, findCarro, findCliente, generateId } from '../services/storage';
import type { Screen, TipoServicio } from '../types';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const TIPOS: TipoServicio[] = ['Cambio de aceite', 'Sincronización', 'Alineación', 'Lavado'];
const EMPTY = { placa: '', idCliente: '', fecha: '', tipo: '' as TipoServicio | '' };

type StatusType = 'idle' | 'saved' | 'error' | 'errorPlate' | 'errorClient';

export default function ServiceAddScreen({ onNavigate }: Props) {
  const { idioma, speak } = useAccessibility();
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<StatusType>('idle');

  function set(field: keyof typeof EMPTY, value: string) {
    setForm(f => ({ ...f, [field]: field === 'placa' ? value.toUpperCase() : value }));
    setStatus('idle');
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    // Validar campos vacíos
    if (!form.placa || !form.idCliente || !form.fecha || !form.tipo) {
      setStatus('error');
      speak(t('service.error', idioma));
      return;
    }

    // Validar que la placa exista
    if (!findCarro(form.placa)) {
      setStatus('errorPlate');
      speak(t('service.errorPlate', idioma));
      return;
    }

    // Validar que el cliente exista
    if (!findCliente(form.idCliente)) {
      setStatus('errorClient');
      speak(t('service.errorClient', idioma));
      return;
    }

    saveServicio({
      id: generateId(),
      placa: form.placa,
      idCliente: form.idCliente,
      fecha: form.fecha,
      tipo: form.tipo as TipoServicio,
    });

    setStatus('saved');
    speak(t('service.saved', idioma));
    setForm(EMPTY);
  }

  const messageMap: Record<StatusType, { type: 'success' | 'error'; key: string } | null> = {
    idle:        null,
    saved:       { type: 'success', key: 'service.saved' },
    error:       { type: 'error',   key: 'service.error' },
    errorPlate:  { type: 'error',   key: 'service.errorPlate' },
    errorClient: { type: 'error',   key: 'service.errorClient' },
  };

  const msg = messageMap[status];

  return (
    <PageLayout title={t('service.title', idioma)}>
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
          🔧 {t('service.title', idioma)}
        </h2>

        {msg && (
          <div style={{ marginBottom: 16 }}>
            <MessageBox type={msg.type} message={t(msg.key, idioma)} />
          </div>
        )}

        <form onSubmit={handleSave} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <MahoganyInput
              id="svc-plate"
              label={t('service.plate', idioma)}
              value={form.placa}
              onChange={e => set('placa', e.target.value)}
              placeholder="Ej: ABC123"
              maxLength={7}
            />
            <MahoganyInput
              id="svc-client"
              label={t('service.clientId', idioma)}
              value={form.idCliente}
              onChange={e => set('idCliente', e.target.value)}
              placeholder="Ej: 1001234567"
              inputMode="numeric"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            {/* Fecha con calendario */}
            <div>
              <label
                htmlFor="svc-date"
                style={{
                  fontFamily: 'Times New Roman, serif',
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#3a2010',
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                {t('service.date', idioma)}
              </label>
              <input
                id="svc-date"
                type="date"
                value={form.fecha}
                onChange={e => set('fecha', e.target.value)}
                style={{
                  width: '100%',
                  border: '2px solid #4a7c59',
                  borderRadius: 5,
                  padding: '6px 10px',
                  fontFamily: 'Times New Roman, serif',
                  fontSize: 15,
                  background: '#f8faf8',
                  color: '#1a1a1a',
                  outline: 'none',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#6B2A2A'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#4a7c59'; }}
              />
            </div>

            {/* Tipo de servicio */}
            <div>
              <label
                htmlFor="svc-type"
                style={{
                  fontFamily: 'Times New Roman, serif',
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#3a2010',
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                {t('service.type', idioma)}
              </label>
              <select
                id="svc-type"
                value={form.tipo}
                onChange={e => set('tipo', e.target.value)}
                style={{
                  width: '100%',
                  border: '2px solid #4a7c59',
                  borderRadius: 5,
                  padding: '6px 10px',
                  fontFamily: 'Times New Roman, serif',
                  fontSize: 15,
                  background: '#f8faf8',
                  color: form.tipo ? '#1a1a1a' : '#888',
                  outline: 'none',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  height: 38,
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#6B2A2A'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#4a7c59'; }}
              >
                <option value="">— Seleccione —</option>
                {TIPOS.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <MahoganyButton type="submit" variant="secondary">
              💾 {t('service.save', idioma)}
            </MahoganyButton>
            <MahoganyButton type="button" variant="primary" onClick={() => onNavigate('main')}>
              ← {t('service.back', idioma)}
            </MahoganyButton>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
