import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import MahoganyInput from '../components/MahoganyInput';
import MahoganyButton from '../components/MahoganyButton';
import MessageBox from '../components/MessageBox';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import { saveCliente } from '../services/storage';
import { useToast } from '../hooks/useToast';
import type { NavTarget, Cliente } from '../types';

interface Props {
  onNavigate: (target: NavTarget) => void;
}

// ── Validaciones (RNF-01, RNF-02) ─────────────────────────────────────────
const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE  = /^\d{10}$/;

type FieldKey = keyof Cliente;
type FieldErrors = Partial<Record<FieldKey, string>>;

const EMPTY: Cliente = {
  identificacion: '',
  nombres: '',
  apellidos: '',
  correo: '',
  celular: '',
};

export default function ClientAddScreen({ onNavigate }: Props) {
  const { idioma, speak } = useAccessibility();
  const { toast, showToast } = useToast();

  const [form, setForm] = useState<Cliente>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // ── Validación por campo ──────────────────────────────────────────────
  function validateField(field: FieldKey, value: string): string | undefined {
    const v = value.trim();
    if (!v) return t('client.error', idioma);
    if (field === 'correo' && !EMAIL_RE.test(v))
      return t('msg.errorEmail', idioma);
    if (field === 'celular' && !PHONE_RE.test(v.replace(/[\s-]/g, '')))
      return t('msg.errorPhone', idioma);
    return undefined;
  }

  function set(field: FieldKey, value: string) {
    const normalized = field === 'celular' ? value.replace(/[\s-]/g, '') : value;
    setForm(f => ({ ...f, [field]: normalized }));
    // Limpiar error al escribir
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  function handleBlur(field: FieldKey) {
    const err = validateField(field, form[field]);
    setFieldErrors(prev => ({ ...prev, [field]: err }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    // Validar todos los campos
    const errors: FieldErrors = {};
    (Object.keys(EMPTY) as FieldKey[]).forEach(field => {
      const err = validateField(field, form[field]);
      if (err) errors[field] = err;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const msg = t('client.error', idioma);
      showToast(msg, 'error');
      speak(msg);
      return;
    }

    saveCliente(form);
    const msg = t('client.saved', idioma);
    showToast(msg, 'success');
    speak(msg);
    setForm(EMPTY);
    setFieldErrors({});
  }

  return (
    <PageLayout title={t('client.title', idioma)}>
      {/* Toast auto-descartable */}
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
          📋 {t('client.title', idioma)}
        </h2>

        <form onSubmit={handleSave} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <FieldWrap error={fieldErrors.identificacion}>
              <MahoganyInput
                id="cli-id"
                label={t('client.id', idioma)}
                value={form.identificacion}
                onChange={e => set('identificacion', e.target.value)}
                onBlur={() => handleBlur('identificacion')}
                placeholder="Ej: 1001234567"
                inputMode="numeric"
                style={inputBorder(fieldErrors.identificacion)}
              />
            </FieldWrap>
            <FieldWrap error={fieldErrors.celular}>
              <MahoganyInput
                id="cli-phone"
                label={t('client.phone', idioma)}
                value={form.celular}
                onChange={e => set('celular', e.target.value)}
                onBlur={() => handleBlur('celular')}
                placeholder="Ej: 3001234567"
                type="tel"
                maxLength={10}
                style={inputBorder(fieldErrors.celular)}
              />
            </FieldWrap>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <FieldWrap error={fieldErrors.nombres}>
              <MahoganyInput
                id="cli-names"
                label={t('client.names', idioma)}
                value={form.nombres}
                onChange={e => set('nombres', e.target.value)}
                onBlur={() => handleBlur('nombres')}
                placeholder="Ej: Juan Carlos"
                style={inputBorder(fieldErrors.nombres)}
              />
            </FieldWrap>
            <FieldWrap error={fieldErrors.apellidos}>
              <MahoganyInput
                id="cli-surnames"
                label={t('client.surnames', idioma)}
                value={form.apellidos}
                onChange={e => set('apellidos', e.target.value)}
                onBlur={() => handleBlur('apellidos')}
                placeholder="Ej: Gómez Pérez"
                style={inputBorder(fieldErrors.apellidos)}
              />
            </FieldWrap>
          </div>

          <div style={{ marginBottom: 24 }}>
            <FieldWrap error={fieldErrors.correo}>
              <MahoganyInput
                id="cli-email"
                label={t('client.email', idioma)}
                value={form.correo}
                onChange={e => set('correo', e.target.value)}
                onBlur={() => handleBlur('correo')}
                placeholder="Ej: juan@correo.com"
                type="email"
                style={inputBorder(fieldErrors.correo)}
              />
            </FieldWrap>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <MahoganyButton type="submit" variant="secondary">
              💾 {t('client.save', idioma)}
            </MahoganyButton>
            <MahoganyButton type="button" variant="primary" onClick={() => onNavigate('main')}>
              ← {t('client.back', idioma)}
            </MahoganyButton>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}

// ── Helpers de UI ──────────────────────────────────────────────────────────

function FieldWrap({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <div>
      {children}
      {error && (
        <p role="alert" style={{
          color: '#c0392b',
          fontSize: 12,
          marginTop: 3,
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
