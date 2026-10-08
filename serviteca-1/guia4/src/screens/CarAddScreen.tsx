import { useState, useRef } from 'react';
import PageLayout from '../components/PageLayout';
import MahoganyInput from '../components/MahoganyInput';
import MahoganyButton from '../components/MahoganyButton';
import MessageBox from '../components/MessageBox';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import { saveCarro } from '../services/storage';
import { useToast } from '../hooks/useToast';
import type { NavTarget, Carro } from '../types';

interface Props {
  onNavigate: (target: NavTarget) => void;
}

// ── Validación de placa colombiana (RNF-03) ────────────────────────────────
// Formato vigente: ABC123 | Formato antiguo: ABC12D
const PLACA_RE = /^[A-Z]{3}[0-9]{2,3}[A-Z]?$/;

type CarroFields = Omit<Carro, 'imagenUrl'>;
type FieldErrors = Partial<Record<keyof CarroFields, string>>;
const EMPTY: CarroFields = { placa: '', marca: '', modelo: '' };

export default function CarAddScreen({ onNavigate }: Props) {
  const { idioma, speak } = useAccessibility();
  const { toast, showToast } = useToast();

  const [form, setForm] = useState<CarroFields>(EMPTY);
  const [imagenUrl, setImagenUrl] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Validación ──────────────────────────────────────────────────────────
  function validateField(field: keyof CarroFields, value: string): string | undefined {
    const v = value.trim();
    if (!v) return t('car.error', idioma);
    if (field === 'placa' && !PLACA_RE.test(v))
      return t('msg.errorPlate', idioma);
    return undefined;
  }

  function set(field: keyof CarroFields, raw: string) {
    const value = field === 'placa' ? raw.toUpperCase() : raw;
    setForm(f => ({ ...f, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  function handleBlur(field: keyof CarroFields) {
    setFieldErrors(prev => ({ ...prev, [field]: validateField(field, form[field]) }));
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImagenUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    const errors: FieldErrors = {};
    (Object.keys(EMPTY) as (keyof CarroFields)[]).forEach(field => {
      const err = validateField(field, form[field]);
      if (err) errors[field] = err;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const msg = t('car.error', idioma);
      showToast(msg, 'error');
      speak(msg);
      return;
    }

    saveCarro({ ...form, imagenUrl: imagenUrl || undefined });
    const msg = t('car.saved', idioma);
    showToast(msg, 'success');
    speak(msg);
    setForm(EMPTY);
    setImagenUrl('');
    if (fileRef.current) fileRef.current.value = '';
    setFieldErrors({});
  }

  return (
    <PageLayout title={t('car.title', idioma)}>
      {toast && (
        <div style={{ marginBottom: 12, position: 'sticky', top: 0, zIndex: 10 }}>
          <MessageBox type={toast.type} message={toast.message} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 780 }}>
        {/* Formulario */}
        <div
          style={{
            background: 'white',
            border: '2px solid #4a7c59',
            borderRadius: 10,
            padding: '28px 28px',
          }}
        >
          <h2 style={{ color: '#3a6b47', fontSize: 20, marginBottom: 20, fontWeight: 'bold' }}>
            🚗 {t('car.title', idioma)}
          </h2>

          <form onSubmit={handleSave} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
              <FieldWrap error={fieldErrors.placa}>
                <MahoganyInput
                  id="car-plate"
                  label={t('car.plate', idioma)}
                  value={form.placa}
                  onChange={e => set('placa', e.target.value)}
                  onBlur={() => handleBlur('placa')}
                  placeholder="Ej: ABC123"
                  maxLength={7}
                  style={inputBorder(fieldErrors.placa)}
                />
              </FieldWrap>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
              <FieldWrap error={fieldErrors.marca}>
                <MahoganyInput
                  id="car-brand"
                  label={t('car.brand', idioma)}
                  value={form.marca}
                  onChange={e => set('marca', e.target.value)}
                  onBlur={() => handleBlur('marca')}
                  placeholder="Ej: Chevrolet"
                  style={inputBorder(fieldErrors.marca)}
                />
              </FieldWrap>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
              <FieldWrap error={fieldErrors.modelo}>
                <MahoganyInput
                  id="car-model"
                  label={t('car.model', idioma)}
                  value={form.modelo}
                  onChange={e => set('modelo', e.target.value)}
                  onBlur={() => handleBlur('modelo')}
                  placeholder="Ej: Spark 2022"
                  style={inputBorder(fieldErrors.modelo)}
                />
              </FieldWrap>
            </div>

            {/* Subir imagen */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontFamily: 'Times New Roman, serif',
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#3a2010',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                {t('car.photo', idioma)}
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImage}
                id="car-image"
                style={{ display: 'none' }}
              />
              <label
                htmlFor="car-image"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#4a7c59',
                  color: 'white',
                  border: '2px solid #2e5c3a',
                  borderRadius: 6,
                  padding: '8px 18px',
                  cursor: 'pointer',
                  fontFamily: 'Times New Roman, serif',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLLabelElement).style.filter = 'brightness(1.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLLabelElement).style.filter = 'brightness(1)'; }}
              >
                📷 {t('car.photo', idioma)}
              </label>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <MahoganyButton type="submit" variant="secondary">
                💾 {t('car.save', idioma)}
              </MahoganyButton>
              <MahoganyButton type="button" variant="primary" onClick={() => onNavigate('main')}>
                ← {t('car.back', idioma)}
              </MahoganyButton>
            </div>
          </form>
        </div>

        {/* Vista previa */}
        <div
          style={{
            background: 'white',
            border: '2px solid #4a7c59',
            borderRadius: 10,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 260,
          }}
        >
          <p style={{ color: '#3a6b47', fontWeight: 'bold', marginBottom: 12, fontSize: 14 }}>
            Vista previa
          </p>
          {imagenUrl ? (
            <img
              src={imagenUrl}
              alt="Vista previa del carro"
              style={{
                maxWidth: '100%',
                maxHeight: 240,
                borderRadius: 8,
                border: '2px solid #4a7c59',
                objectFit: 'contain',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: 200,
                border: '2px dashed #b0c8b0',
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
              }}
            >
              <span style={{ fontSize: 40 }}>🚗</span>
              <p style={{ marginTop: 10, fontFamily: 'Times New Roman, serif', fontSize: 14 }}>
                Sin imagen seleccionada
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
