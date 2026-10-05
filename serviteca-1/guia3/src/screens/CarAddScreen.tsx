import { useState, useRef } from 'react';
import PageLayout from '../components/PageLayout';
import MahoganyInput from '../components/MahoganyInput';
import MahoganyButton from '../components/MahoganyButton';
import MessageBox from '../components/MessageBox';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import { saveCarro } from '../services/storage';
import type { Screen } from '../types';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const EMPTY = { placa: '', marca: '', modelo: '' };

export default function CarAddScreen({ onNavigate }: Props) {
  const { idioma, speak } = useAccessibility();
  const [form, setForm] = useState(EMPTY);
  const [imagenUrl, setImagenUrl] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const fileRef = useRef<HTMLInputElement>(null);

  function set(field: keyof typeof EMPTY, value: string) {
    setForm(f => ({ ...f, [field]: value.toUpperCase() }));
    setStatus('idle');
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
    const allFilled = Object.values(form).every(v => v.trim() !== '');
    if (!allFilled) {
      setStatus('error');
      speak(t('car.error', idioma));
      return;
    }
    saveCarro({ ...form, imagenUrl: imagenUrl || undefined });
    setStatus('saved');
    speak(t('car.saved', idioma));
    setForm(EMPTY);
    setImagenUrl('');
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <PageLayout title={t('car.title', idioma)}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          maxWidth: 780,
        }}
      >
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

          {status === 'saved' && (
            <div style={{ marginBottom: 16 }}>
              <MessageBox type="success" message={t('car.saved', idioma)} />
            </div>
          )}
          {status === 'error' && (
            <div style={{ marginBottom: 16 }}>
              <MessageBox type="error" message={t('car.error', idioma)} />
            </div>
          )}

          <form onSubmit={handleSave} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
              <MahoganyInput
                id="car-plate"
                label={t('car.plate', idioma)}
                value={form.placa}
                onChange={e => set('placa', e.target.value)}
                placeholder="Ej: ABC123"
                maxLength={7}
              />
              <MahoganyInput
                id="car-brand"
                label={t('car.brand', idioma)}
                value={form.marca}
                onChange={e => set('marca', e.target.value)}
                placeholder="Ej: Chevrolet"
              />
              <MahoganyInput
                id="car-model"
                label={t('car.model', idioma)}
                value={form.modelo}
                onChange={e => set('modelo', e.target.value)}
                placeholder="Ej: Spark 2022"
              />
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
                  transition: 'filter 0.15s',
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

        {/* Vista previa de imagen */}
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
                fontSize: 14,
              }}
            >
              <span style={{ fontSize: 40 }}>🚗</span>
              <p style={{ marginTop: 10, fontFamily: 'Times New Roman, serif' }}>
                Sin imagen seleccionada
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
