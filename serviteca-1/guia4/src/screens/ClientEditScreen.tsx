import { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import MahoganyInput from '../components/MahoganyInput';
import MahoganyButton from '../components/MahoganyButton';
import MessageBox from '../components/MessageBox';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import { findCliente, updateCliente } from '../services/storage';
import { useToast } from '../hooks/useToast';
import type { NavTarget, Cliente } from '../types';

interface Props {
  editId: string;                      // identificacion del cliente
  onNavigate: (target: NavTarget) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{10}$/;
type FieldKey = keyof Omit<Cliente, 'identificacion'>;
type FieldErrors = Partial<Record<FieldKey, string>>;

export default function ClientEditScreen({ editId, onNavigate }: Props) {
  const { idioma, speak } = useAccessibility();
  const { toast, showToast } = useToast();

  const [original] = useState(() => findCliente(editId));
  const [form, setForm] = useState<Omit<Cliente, 'identificacion'>>({
    nombres:   original?.nombres   ?? '',
    apellidos: original?.apellidos ?? '',
    correo:    original?.correo    ?? '',
    celular:   original?.celular   ?? '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Si no encuentra el registro, muestra error
  if (!original) {
    return (
      <PageLayout title={t('client.edit', idioma)}>
        <MessageBox type="error" message="Cliente no encontrado." />
        <div style={{ marginTop: 16 }}>
          <MahoganyButton variant="primary" onClick={() => onNavigate('client-list')}>
            ← {t('client.back', idioma)}
          </MahoganyButton>
        </div>
      </PageLayout>
    );
  }

  function validateField(field: FieldKey, value: string): string | undefined {
    const v = value.trim();
    if (!v) return t('client.error', idioma);
    if (field === 'correo' && !EMAIL_RE.test(v)) return t('msg.errorEmail', idioma);
    if (field === 'celular' && !PHONE_RE.test(v.replace(/[\s-]/g, '')))
      return t('msg.errorPhone', idioma);
    return undefined;
  }

  function set(field: FieldKey, value: string) {
    const normalized = field === 'celular' ? value.replace(/[\s-]/g, '') : value;
    setForm(f => ({ ...f, [field]: normalized }));
    if (fieldErrors[field])
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function handleBlur(field: FieldKey) {
    setFieldErrors(prev => ({ ...prev, [field]: validateField(field, form[field]) }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const errors: FieldErrors = {};
    (Object.keys(form) as FieldKey[]).forEach(field => {
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

    updateCliente({ identificacion: editId, ...form });
    const msg = t('msg.updated', idioma);
    showToast(msg, 'success');
    speak(msg);

    // Volver al listado tras 1 segundo para que el usuario vea el toast
    setTimeout(() => onNavigate('client-list'), 1000);
  }

  return (
    <PageLayout title={t('client.edit', idioma)}>
      {toast && (
        <div style={{ marginBottom: 12, position: 'sticky', top: 0, zIndex: 10 }}>
          <MessageBox type={toast.type} message={toast.message} />
        </div>
      )}

      <div
        style={{
          background: 'white', border: '2px solid #4a7c59',
          borderRadius: 10, padding: '28px 32px', maxWidth: 560,
        }}
      >
        <h2 style={{ color: '#3a6b47', fontSize: 20, marginBottom: 20, fontWeight: 'bold' }}>
          ✏️ {t('client.edit', idioma)}
        </h2>

        {/* Identificación — solo lectura */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontFamily: 'Times New Roman, serif', fontSize: 14,
            fontWeight: 'bold', color: '#3a2010', marginBottom: 4 }}>
            {t('client.id', idioma)}
          </p>
          <div style={{
            background: '#e8ece8', border: '2px solid #b0c8b0', borderRadius: 5,
            padding: '7px 10px', fontFamily: 'Times New Roman, serif',
            fontSize: 15, color: '#555', letterSpacing: 1,
          }}>
            {editId}
          </div>
          <p style={{ fontSize: 11, color: '#888', fontFamily: 'Times New Roman, serif', marginTop: 3 }}>
            La identificación no se puede modificar.
          </p>
        </div>

        <form onSubmit={handleSave} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <FieldWrap error={fieldErrors.nombres}>
              <MahoganyInput id="edit-names" label={t('client.names', idioma)}
                value={form.nombres} onChange={e => set('nombres', e.target.value)}
                onBlur={() => handleBlur('nombres')} style={inputBorder(fieldErrors.nombres)} />
            </FieldWrap>
            <FieldWrap error={fieldErrors.apellidos}>
              <MahoganyInput id="edit-surnames" label={t('client.surnames', idioma)}
                value={form.apellidos} onChange={e => set('apellidos', e.target.value)}
                onBlur={() => handleBlur('apellidos')} style={inputBorder(fieldErrors.apellidos)} />
            </FieldWrap>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <FieldWrap error={fieldErrors.correo}>
              <MahoganyInput id="edit-email" label={t('client.email', idioma)}
                value={form.correo} onChange={e => set('correo', e.target.value)}
                onBlur={() => handleBlur('correo')} type="email"
                style={inputBorder(fieldErrors.correo)} />
            </FieldWrap>
            <FieldWrap error={fieldErrors.celular}>
              <MahoganyInput id="edit-phone" label={t('client.phone', idioma)}
                value={form.celular} onChange={e => set('celular', e.target.value)}
                onBlur={() => handleBlur('celular')} type="tel" maxLength={10}
                style={inputBorder(fieldErrors.celular)} />
            </FieldWrap>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <MahoganyButton type="submit" variant="secondary">
              💾 {t('client.save', idioma)}
            </MahoganyButton>
            <MahoganyButton type="button" variant="primary"
              onClick={() => onNavigate('client-list')}>
              ← {t('client.back', idioma)}
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
