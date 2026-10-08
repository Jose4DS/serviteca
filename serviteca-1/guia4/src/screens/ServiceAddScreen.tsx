import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import MahoganyInput from '../components/MahoganyInput';
import MahoganyButton from '../components/MahoganyButton';
import MessageBox from '../components/MessageBox';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import { saveServicio, findCarro, findCliente, generateId } from '../services/storage';
import { useToast } from '../hooks/useToast';
import type { NavTarget, TipoServicio } from '../types';

interface Props {
  onNavigate: (target: NavTarget) => void;
}

const TIPOS: TipoServicio[] = ['Cambio de aceite', 'Sincronización', 'Alineación', 'Lavado'];

// Fecha de hoy en formato YYYY-MM-DD (para validar RNF-04)
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

type FormState = { placa: string; idCliente: string; fecha: string; tipo: TipoServicio | '' };
type FieldKey = keyof FormState;
type FieldErrors = Partial<Record<FieldKey, string>>;

const EMPTY: FormState = { placa: '', idCliente: '', fecha: '', tipo: '' };

export default function ServiceAddScreen({ onNavigate }: Props) {
  const { idioma, speak } = useAccessibility();
  const { toast, showToast } = useToast();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // ── Validación por campo ──────────────────────────────────────────────
  function validateField(field: FieldKey, value: string): string | undefined {
    if (!value.trim()) return t('service.error', idioma);
    if (field === 'fecha' && value > today()) return t('msg.errorDateFuture', idioma);
    return undefined;
  }

  function set(field: FieldKey, value: string) {
    const normalized = field === 'placa' ? value.toUpperCase() : value;
    setForm(f => ({ ...f, [field]: normalized }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  function handleBlur(field: FieldKey) {
    setFieldErrors(prev => ({ ...prev, [field]: validateField(field, form[field]) }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    // Validar campos básicos
    const errors: FieldErrors = {};
    (Object.keys(EMPTY) as FieldKey[]).forEach(field => {
      const err = validateField(field, form[field]);
      if (err) errors[field] = err;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const msg = t('service.error', idioma);
      showToast(msg, 'error');
      speak(msg);
      return;
    }

    // Validar existencia de placa
    if (!findCarro(form.placa)) {
      const msg = t('service.errorPlate', idioma);
      setFieldErrors(prev => ({ ...prev, placa: msg }));
      showToast(msg, 'error');
      speak(msg);
      return;
    }

    // Validar existencia de cliente
    if (!findCliente(form.idCliente)) {
      const msg = t('service.errorClient', idioma);
      setFieldErrors(prev => ({ ...prev, idCliente: msg }));
      showToast(msg, 'error');
      speak(msg);
      return;
    }

    saveServicio({
      id: generateId(),
      placa: form.placa,
      idCliente: form.idCliente,
      fecha: form.fecha,
      tipo: form.tipo as TipoServicio,
    });

    const msg = t('service.saved', idioma);
    showToast(msg, 'success');
    speak(msg);
    setForm(EMPTY);
    setFieldErrors({});
  }

  return (
    <PageLayout title={t('service.title', idioma)}>
      {toast && (
        <div style={{ marginBottom: 12, position: 'sticky', top: 0, zIndex: 10 }}>
          <MessageBox type={toast.type} message={toast.message} />
        </div>
      )}

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

        <form onSubmit={handleSave} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <FieldWrap error={fieldErrors.placa}>
              <MahoganyInput
                id="svc-plate"
                label={t('service.plate', idioma)}
                value={form.placa}
                onChange={e => set('placa', e.target.value)}
                onBlur={() => handleBlur('placa')}
                placeholder="Ej: ABC123"
                maxLength={7}
                style={inputBorder(fieldErrors.placa)}
              />
            </FieldWrap>
            <FieldWrap error={fieldErrors.idCliente}>
              <MahoganyInput
                id="svc-client"
                label={t('service.clientId', idioma)}
                value={form.idCliente}
                onChange={e => set('idCliente', e.target.value)}
                onBlur={() => handleBlur('idCliente')}
                placeholder="Ej: 1001234567"
                inputMode="numeric"
                style={inputBorder(fieldErrors.idCliente)}
              />
            </FieldWrap>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {/* Fecha con calendario */}
            <FieldWrap error={fieldErrors.fecha}>
              <label
                htmlFor="svc-date"
                style={{
                  fontFamily: 'Times New Roman, serif', fontSize: 14,
                  fontWeight: 'bold', color: '#3a2010', display: 'block', marginBottom: 4,
                }}
              >
                {t('service.date', idioma)}
              </label>
              <input
                id="svc-date"
                type="date"
                value={form.fecha}
                max={today()}
                onChange={e => set('fecha', e.target.value)}
                onBlur={() => handleBlur('fecha')}
                style={{
                  width: '100%', border: `2px solid ${fieldErrors.fecha ? '#c0392b' : '#4a7c59'}`,
                  borderRadius: 5, padding: '6px 10px',
                  fontFamily: 'Times New Roman, serif', fontSize: 15,
                  background: '#f8faf8', color: '#1a1a1a', outline: 'none',
                  boxSizing: 'border-box', cursor: 'pointer',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#6B2A2A'; }}
                onBlurCapture={e => { e.currentTarget.style.borderColor = fieldErrors.fecha ? '#c0392b' : '#4a7c59'; }}
              />
            </FieldWrap>

            {/* Tipo de servicio */}
            <FieldWrap error={fieldErrors.tipo}>
              <label
                htmlFor="svc-type"
                style={{
                  fontFamily: 'Times New Roman, serif', fontSize: 14,
                  fontWeight: 'bold', color: '#3a2010', display: 'block', marginBottom: 4,
                }}
              >
                {t('service.type', idioma)}
              </label>
              <select
                id="svc-type"
                value={form.tipo}
                onChange={e => set('tipo', e.target.value)}
                onBlur={() => handleBlur('tipo')}
                style={{
                  width: '100%', border: `2px solid ${fieldErrors.tipo ? '#c0392b' : '#4a7c59'}`,
                  borderRadius: 5, padding: '6px 10px', height: 38,
                  fontFamily: 'Times New Roman, serif', fontSize: 15,
                  background: '#f8faf8', color: form.tipo ? '#1a1a1a' : '#888',
                  outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#6B2A2A'; }}
              >
                <option value="">— Seleccione —</option>
                {TIPOS.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </FieldWrap>
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

function FieldWrap({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <div>
      {children}
      {error && (
        <p role="alert" style={{
          color: '#c0392b', fontSize: 12, marginTop: 3,
          fontFamily: 'Times New Roman, serif',
        }}>
          {error}
        </p>
      )}
    </div>
  );
}

function inputBorder(error?: string): React.CSSProperties {
  return error ? { borderColor: '#c0392b' } : {};
}
