import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import MahoganyInput from '../components/MahoganyInput';
import MahoganyButton from '../components/MahoganyButton';
import MessageBox from '../components/MessageBox';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import { findServicio, updateServicio, findCarro, findCliente } from '../services/storage';
import { useToast } from '../hooks/useToast';
import type { NavTarget, TipoServicio } from '../types';

interface Props {
  editId: string;                   // id del servicio
  onNavigate: (target: NavTarget) => void;
}

const TIPOS: TipoServicio[] = ['Cambio de aceite', 'Sincronización', 'Alineación', 'Lavado'];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

type FormState = { placa: string; idCliente: string; fecha: string; tipo: TipoServicio | '' };
type FieldKey  = keyof FormState;
type FieldErrors = Partial<Record<FieldKey, string>>;

export default function ServiceEditScreen({ editId, onNavigate }: Props) {
  const { idioma, speak } = useAccessibility();
  const { toast, showToast } = useToast();

  const [original] = useState(() => findServicio(editId));
  const [form, setForm] = useState<FormState>({
    placa:     original?.placa     ?? '',
    idCliente: original?.idCliente ?? '',
    fecha:     original?.fecha     ?? '',
    tipo:      original?.tipo      ?? '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  if (!original) {
    return (
      <PageLayout title={t('service.edit', idioma)}>
        <MessageBox type="error" message="Servicio no encontrado." />
        <div style={{ marginTop: 16 }}>
          <MahoganyButton variant="primary" onClick={() => onNavigate('service-list')}>
            ← {t('service.back', idioma)}
          </MahoganyButton>
        </div>
      </PageLayout>
    );
  }

  function validateField(field: FieldKey, value: string): string | undefined {
    if (!value.trim()) return t('service.error', idioma);
    if (field === 'fecha' && value > today()) return t('msg.errorDateFuture', idioma);
    return undefined;
  }

  function set(field: FieldKey, value: string) {
    const normalized = field === 'placa' ? value.toUpperCase() : value;
    setForm(f => ({ ...f, [field]: normalized }));
    if (fieldErrors[field])
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function handleBlur(field: FieldKey) {
    setFieldErrors(prev => ({ ...prev, [field]: validateField(field, form[field]) }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    // Validación de campos básicos
    const errors: FieldErrors = {};
    (Object.keys(form) as FieldKey[]).forEach(field => {
      const err = validateField(field, form[field]);
      if (err) errors[field] = err;
    });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const msg = t('service.error', idioma);
      showToast(msg, 'error'); speak(msg);
      return;
    }

    // Validar placa
    if (!findCarro(form.placa)) {
      const msg = t('service.errorPlate', idioma);
      setFieldErrors(prev => ({ ...prev, placa: msg }));
      showToast(msg, 'error'); speak(msg);
      return;
    }

    // Validar cliente
    if (!findCliente(form.idCliente)) {
      const msg = t('service.errorClient', idioma);
      setFieldErrors(prev => ({ ...prev, idCliente: msg }));
      showToast(msg, 'error'); speak(msg);
      return;
    }

    updateServicio({
      id: editId,
      placa: form.placa,
      idCliente: form.idCliente,
      fecha: form.fecha,
      tipo: form.tipo as TipoServicio,
    });

    const msg = t('msg.updated', idioma);
    showToast(msg, 'success');
    speak(msg);
    setTimeout(() => onNavigate('service-list'), 1000);
  }

  return (
    <PageLayout title={t('service.edit', idioma)}>
      {toast && (
        <div style={{ marginBottom: 12, position: 'sticky', top: 0, zIndex: 10 }}>
          <MessageBox type={toast.type} message={toast.message} />
        </div>
      )}

      <div style={{
        background: 'white', border: '2px solid #4a7c59',
        borderRadius: 10, padding: '28px 32px', maxWidth: 560,
      }}>
        <h2 style={{ color: '#3a6b47', fontSize: 20, marginBottom: 20, fontWeight: 'bold' }}>
          ✏️ {t('service.edit', idioma)}
        </h2>

        <form onSubmit={handleSave} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <FieldWrap error={fieldErrors.placa}>
              <MahoganyInput id="sedit-plate" label={t('service.plate', idioma)}
                value={form.placa} onChange={e => set('placa', e.target.value)}
                onBlur={() => handleBlur('placa')} placeholder="Ej: ABC123" maxLength={7}
                style={inputBorder(fieldErrors.placa)} />
            </FieldWrap>
            <FieldWrap error={fieldErrors.idCliente}>
              <MahoganyInput id="sedit-client" label={t('service.clientId', idioma)}
                value={form.idCliente} onChange={e => set('idCliente', e.target.value)}
                onBlur={() => handleBlur('idCliente')} inputMode="numeric"
                style={inputBorder(fieldErrors.idCliente)} />
            </FieldWrap>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {/* Fecha */}
            <FieldWrap error={fieldErrors.fecha}>
              <label htmlFor="sedit-date" style={labelStyle}>
                {t('service.date', idioma)}
              </label>
              <input
                id="sedit-date"
                type="date"
                value={form.fecha}
                max={today()}
                onChange={e => set('fecha', e.target.value)}
                onBlur={() => handleBlur('fecha')}
                style={{
                  width: '100%', border: `2px solid ${fieldErrors.fecha ? '#c0392b' : '#4a7c59'}`,
                  borderRadius: 5, padding: '6px 10px',
                  fontFamily: 'Times New Roman, serif', fontSize: 15,
                  background: '#f8faf8', outline: 'none',
                  boxSizing: 'border-box', cursor: 'pointer',
                }}
              />
            </FieldWrap>

            {/* Tipo */}
            <FieldWrap error={fieldErrors.tipo}>
              <label htmlFor="sedit-type" style={labelStyle}>
                {t('service.type', idioma)}
              </label>
              <select
                id="sedit-type"
                value={form.tipo}
                onChange={e => set('tipo', e.target.value)}
                onBlur={() => handleBlur('tipo')}
                style={{
                  width: '100%', border: `2px solid ${fieldErrors.tipo ? '#c0392b' : '#4a7c59'}`,
                  borderRadius: 5, padding: '6px 10px', height: 38,
                  fontFamily: 'Times New Roman, serif', fontSize: 15,
                  background: '#f8faf8', outline: 'none',
                  boxSizing: 'border-box', cursor: 'pointer',
                }}
              >
                <option value="">— Seleccione —</option>
                {TIPOS.map(tp => (
                  <option key={tp} value={tp}>{tp}</option>
                ))}
              </select>
            </FieldWrap>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <MahoganyButton type="submit" variant="secondary">
              💾 {t('service.save', idioma)}
            </MahoganyButton>
            <MahoganyButton type="button" variant="primary"
              onClick={() => onNavigate('service-list')}>
              ← {t('service.back', idioma)}
            </MahoganyButton>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'Times New Roman, serif', fontSize: 14,
  fontWeight: 'bold', color: '#3a2010', display: 'block', marginBottom: 4,
};

function FieldWrap({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <div>
      {children}
      {error && (
        <p role="alert" style={{ color: '#c0392b', fontSize: 12, marginTop: 3,
          fontFamily: 'Times New Roman, serif' }}>
          {error}
        </p>
      )}
    </div>
  );
}
function inputBorder(error?: string): React.CSSProperties {
  return error ? { borderColor: '#c0392b' } : {};
}
