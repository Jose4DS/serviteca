import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import MahoganyButton from '../components/MahoganyButton';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import type { Screen } from '../types';

interface Props {
  onNavigate: (screen: Screen) => void;
}

type HelpTab = 'faq' | 'call' | 'report';

const FAQS = [
  {
    q: '¿Cómo registro un cliente nuevo?',
    a: 'Vaya al menú "Clientes" → "Agregar". Complete todos los campos (identificación, nombres, apellidos, correo y celular) y presione "Guardar".',
  },
  {
    q: '¿Puedo registrar un servicio sin que el carro esté en el sistema?',
    a: 'No. Primero debe registrar el carro en "Carros" → "Agregar". El sistema valida que tanto la placa como el cliente existan antes de guardar el servicio.',
  },
  {
    q: '¿Cómo consulto el historial de un carro?',
    a: 'Vaya a "Servicios" → "Consultar". Escriba la placa del carro y presione "Buscar". Verá una tabla con todos los servicios realizados.',
  },
  {
    q: '¿Qué tipos de servicio están disponibles?',
    a: 'El sistema maneja cuatro tipos: Cambio de aceite, Sincronización, Alineación y Lavado.',
  },
  {
    q: '¿Los datos se guardan si cierro el navegador?',
    a: 'Sí. Los datos se guardan en el almacenamiento local del navegador (localStorage). Sin embargo, si borra los datos del navegador, la información se perderá.',
  },
  {
    q: '¿Cómo uso el panel de accesibilidad?',
    a: 'El panel está a la derecha en todas las pantallas. Puede cambiar el idioma (Español/Inglés), activar la lectura en voz alta (TTS) o la vista en Braille.',
  },
];

export default function HelpModal({ onNavigate }: Props) {
  const { idioma, speak } = useAccessibility();
  const [tab, setTab] = useState<HelpTab>('faq');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [reportSent, setReportSent] = useState(false);
  const [reportText, setReportText] = useState('');

  function selectTab(t: HelpTab, label: string) {
    setTab(t);
    speak(label);
    setReportSent(false);
  }

  const tabs: { key: HelpTab; label: string; icon: string }[] = [
    { key: 'faq',    label: t('help.faq', idioma),    icon: '❓' },
    { key: 'call',   label: t('help.call', idioma),   icon: '📞' },
    { key: 'report', label: t('help.report', idioma), icon: '🐛' },
  ];

  return (
    <PageLayout title={t('help.title', idioma)}>
      <div style={{ maxWidth: 680 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 0, borderBottom: '2px solid #4a7c59' }}>
          {tabs.map(tb => (
            <button
              key={tb.key}
              onClick={() => selectTab(tb.key, tb.label)}
              aria-selected={tab === tb.key}
              role="tab"
              style={{
                padding: '10px 22px',
                background: tab === tb.key ? 'white' : '#d4e8d4',
                border: '2px solid #4a7c59',
                borderBottom: tab === tb.key ? '2px solid white' : '2px solid #4a7c59',
                borderRadius: '8px 8px 0 0',
                marginBottom: -2,
                cursor: 'pointer',
                fontFamily: 'Times New Roman, serif',
                fontWeight: tab === tb.key ? 'bold' : 'normal',
                fontSize: 14,
                color: tab === tb.key ? '#3a6b47' : '#555',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {tb.icon} {tb.label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div
          role="tabpanel"
          style={{
            background: 'white',
            border: '2px solid #4a7c59',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            padding: '24px 28px',
            minHeight: 320,
          }}
        >
          {/* FAQ */}
          {tab === 'faq' && (
            <div>
              <p style={{ color: '#555', fontSize: 14, marginBottom: 16, fontStyle: 'italic' }}>
                Haga clic en una pregunta para ver la respuesta.
              </p>
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    border: '1px solid #b0c8b0',
                    borderRadius: 6,
                    marginBottom: 8,
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => {
                      const next = openFaq === i ? null : i;
                      setOpenFaq(next);
                      if (next !== null) speak(faq.q);
                    }}
                    aria-expanded={openFaq === i}
                    style={{
                      width: '100%',
                      background: openFaq === i ? '#e8f5e9' : '#f8faf8',
                      border: 'none',
                      padding: '12px 16px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: 'Times New Roman, serif',
                      fontWeight: 'bold',
                      fontSize: 14,
                      color: '#3a2010',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {faq.q}
                    <span style={{ color: '#4a7c59', fontSize: 16 }}>
                      {openFaq === i ? '▲' : '▼'}
                    </span>
                  </button>
                  {openFaq === i && (
                    <div
                      style={{
                        padding: '12px 16px',
                        fontFamily: 'Times New Roman, serif',
                        fontSize: 14,
                        color: '#333',
                        background: '#f0f7f0',
                        borderTop: '1px solid #b0c8b0',
                        lineHeight: 1.6,
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Llamar técnico */}
          {tab === 'call' && (
            <div style={{ textAlign: 'center', paddingTop: 20 }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>📞</div>
              <h3 style={{ color: '#3a6b47', fontSize: 22, marginBottom: 12 }}>
                {t('help.call', idioma)}
              </h3>
              <p style={{ color: '#555', fontSize: 15, marginBottom: 24, lineHeight: 1.6 }}>
                ¿Necesita ayuda técnica con el sistema o un servicio urgente?
                <br />Comuníquese directamente con nuestro equipo:
              </p>
              <div
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  gap: 12,
                  background: '#e8f5e9',
                  border: '2px solid #4a7c59',
                  borderRadius: 10,
                  padding: '20px 40px',
                }}
              >
                {[
                  { icon: '📱', label: 'Celular', value: '310 000 0000' },
                  { icon: '📧', label: 'Correo', value: 'soporte@serviteca.co' },
                  { icon: '🕐', label: 'Horario', value: 'Lun–Sáb 7am–6pm' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{item.icon}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 12, color: '#666', fontWeight: 'bold' }}>{item.label}</div>
                      <div style={{ fontSize: 15, color: '#3a2010' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reportar problema */}
          {tab === 'report' && (
            <div>
              <h3 style={{ color: '#3a6b47', fontSize: 18, marginBottom: 12 }}>
                🐛 {t('help.report', idioma)}
              </h3>
              {reportSent ? (
                <div
                  style={{
                    background: '#d4edda',
                    border: '2px solid #28a745',
                    borderRadius: 8,
                    padding: '20px',
                    textAlign: 'center',
                    color: '#155724',
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}
                >
                  ✅ ¡Reporte enviado! Gracias por ayudarnos a mejorar el sistema.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label
                      htmlFor="report-text"
                      style={{ fontWeight: 'bold', color: '#3a2010', fontSize: 14, display: 'block', marginBottom: 6 }}
                    >
                      Describa el problema que encontró:
                    </label>
                    <textarea
                      id="report-text"
                      value={reportText}
                      onChange={e => setReportText(e.target.value)}
                      rows={5}
                      placeholder="Ej: Al guardar un cliente, el sistema no muestra el mensaje de confirmación..."
                      style={{
                        width: '100%',
                        border: '2px solid #4a7c59',
                        borderRadius: 5,
                        padding: '8px 12px',
                        fontFamily: 'Times New Roman, serif',
                        fontSize: 14,
                        resize: 'vertical',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#6B2A2A'; }}
                      onBlur={e => { e.currentTarget.style.borderColor = '#4a7c59'; }}
                    />
                  </div>
                  <MahoganyButton
                    variant="secondary"
                    disabled={reportText.trim().length < 10}
                    onClick={() => {
                      setReportSent(true);
                      setReportText('');
                      speak('Reporte enviado. Gracias.');
                    }}
                  >
                    📤 Enviar reporte
                  </MahoganyButton>
                  <p style={{ fontSize: 12, color: '#888', fontStyle: 'italic' }}>
                    * Esto es un prototipo. El reporte no se envía a ningún servidor real.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botón regresar */}
        <div style={{ marginTop: 16 }}>
          <MahoganyButton variant="primary" onClick={() => onNavigate('main')}>
            ← {t('client.back', idioma)}
          </MahoganyButton>
        </div>
      </div>
    </PageLayout>
  );
}
