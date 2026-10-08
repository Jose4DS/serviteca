import { useState, useRef } from 'react';
import PageLayout from '../components/PageLayout';
import MahoganyInput from '../components/MahoganyInput';
import MahoganyButton from '../components/MahoganyButton';
import MessageBox from '../components/MessageBox';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import { findCarro, updateCarro } from '../services/storage';
import { useToast } from '../hooks/useToast';
import type { NavTarget, Carro } from '../types';

interface Props {
  editId: string;                   // placa del carro
  onNavigate: (target: NavTarget) => void;
}

type EditFields = Omit<Carro, 'placa'>;
type FieldErrors = Partial<Record<keyof EditFields, string>>;

export default function CarEditScreen({ editId, onNavigate }: Props) {
  const { idioma, speak } = useAccessibility();
  const { toast, showToast } = useToast();

  const [original] = useState(() => findCarro(editId));
  const [form, setForm] = useState<EditFields>({
    marca:     original?.marca     ?? '',
    modelo:    original?.modelo    ?? '',
    imagenUrl: original?.imagenUrl ?? '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const fileRef = useRef<HTMLInputElement>(null);

  if (!original) {
    return (
      <PageLayout title={t('car.edit', idioma)}>
        <MessageBox type="error" message="Carro no encontrado." />
        <div style={{ marginTop: 16 }}>
          <MahoganyButton variant="primary" onClick={() => onNavigate('car-list')}>
            ← {t('car.back', idioma)}
          </MahoganyButton>
        </div>
      </PageLayout>
    );
  }

  function validateField(field: keyof EditFields, value: string): string | undefined {
    if (field === 'imagenUrl') return undefined;  // opcional
    return value.trim() ? undefined : t('car.error', idioma);
  }

  function set(field: keyof EditFields, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (fieldErrors[field as keyof FieldErrors])
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function handleBlur(field: keyof EditFields) {
    setFieldErrors(prev => ({ ...prev, [field]: validateField(field, form[field] ?? '') }));
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set('imagenUrl', ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const errors: FieldErrors = {};
    (['marca', 'modelo'] as (keyof EditFields)[]).forEach(field => {
      const err = validateField(field, form[field] ?? '');
      if (err) errors[field] = err;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const msg = t('car.error', idioma);
      showToast(msg, 'error');
      speak(msg);
      return;
    }

    updateCarro({ placa: editId, ...form });
    const msg = t('msg.updated', idioma);
    showToast(msg, 'success');
    speak(msg);
    setTimeout(() => onNavigate('car-list'), 1000);
  }

  return (
    <PageLayout title={t('car.edit', idioma)}>
      {toast && (
        <div style={{ marginBottom: 12, position: 'sticky', top: 0, zIndex: 10 }}>
          <MessageBox type={toast.type} message={toast.message} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 780 }}>
        {/* Formulario */}
        <div style={{
          background: 'white', border: '2px solid #4a7c59',
          borderRadius: 10, padding: '28px 28px',
        }}>
          <h2 style={{ color: '#3a6b47', fontSize: 20, marginBottom: 20, fontWeight: 'bold' }}>
            ✏️ {t('car.edit', idioma)}
          </h2>

          {/* Placa — solo lectura */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: 'Times New Roman, serif', fontSize: 14,
              fontWeight: 'bold', color: '#3a2010', marginBottom: 4 }}>
              {t('car.plate', idioma)}
            </p>
            <div style={{
              background: '#e8ece8', border: '2px solid #b0c8b0', borderRadius: 5,
              padding: '7px 10px', fontFamily: 'Times New Roman, serif',
              fontSize: 16, color: '#555', letterSpacing: 3, fontWeight: 'bold',
            }}>
              {editId}
            </div>
            <p style={{ fontSize: 11, color: '#888', fontFamily: 'Times New Roman, serif', marginTop: 3 }}>
              La placa no se puede modificar.
            </p>
          </div>

          <form onSubmit={handleSave} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
              <FieldWrap error={fieldErrors.marca}>
                <MahoganyInput id="edit-brand" label={t('car.brand', idioma)}
                  value={form.marca} onChange={e => set('marca', e.target.value)}
                  onBlur={() => handleBlur('marca')} style={inputBorder(fieldErrors.marca)} />
              </FieldWrap>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
              <FieldWrap error={fieldErrors.modelo}>
                <MahoganyInput id="edit-model" label={t('car.model', idioma)}
                  value={form.modelo} onChange={e => set('modelo', e.target.value)}
                  onBlur={() => handleBlur('modelo')} style={inputBorder(fieldErrors.modelo)} />
              </FieldWrap>
            </div>

            {/* Cambiar imagen */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontFamily: 'Times New Roman, serif', fontSize: 14,
                fontWeight: 'bold', color: '#3a2010', marginBottom: 6 }}>
                {t('car.photo', idioma)}
              </p>
              <input ref={fileRef} type="file" accept="image/*"
                onChange={handleImage} id="edit-image" style={{ display: 'none' }} />
              <label htmlFor="edit-image" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: '#4a7c59', color: 'white', border: '2px solid #2e5c3a',
                borderRadius: 6, padding: '8px 18px', cursor: 'pointer',
                fontFamily: 'Times New Roman, serif', fontSize: 14, fontWeight: 'bold',
              }}>
                📷 {t('car.photo', idioma)}
              </label>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <MahoganyButton type="submit" variant="secondary">
                💾 {t('client.save', idioma)}
              </MahoganyButton>
              <MahoganyButton type="button" variant="primary"
                onClick={() => onNavigate('car-list')}>
                ← {t('car.back', idioma)}
              </MahoganyButton>
            </div>
          </form>
        </div>

        {/* Vista previa de imagen */}
        <div style={{
          background: 'white', border: '2px solid #4a7c59',
          borderRadius: 10, padding: '20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: 260,
        }}>
          <p style={{ color: '#3a6b47', fontWeight: 'bold', marginBottom: 12, fontSize: 14 }}>
            Vista previa
          </p>
          {form.imagenUrl ? (
            <img src={form.imagenUrl} alt={`Carro ${editId}`}
              style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 8,
                border: '2px solid #4a7c59', objectFit: 'contain' }} />
          ) : (
            <div style={{
              width: '100%', height: 200, border: '2px dashed #b0c8b0',
              borderRadius: 8, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', color: '#888',
            }}>
              <span style={{ fontSize: 40 }}>🚗</span>
              <p style={{ marginTop: 10, fontFamily: 'Times New Roman, serif', fontSize: 14 }}>
                Sin imagen
              </p>
            </div>
          )}
        </div>
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
