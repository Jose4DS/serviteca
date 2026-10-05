import React from 'react';
import PageLayout from '../components/PageLayout';
import MahoganyButton from '../components/MahoganyButton';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import { getClientes, getCarros, getServicios } from '../services/storage';
import type { Screen, Idioma } from '../types';

interface Props {
  mode: 'client-list' | 'car-list' | 'service-list';
  onNavigate: (screen: Screen) => void;
}

export default function ListViewScreen({ mode, onNavigate }: Props) {
  const { idioma } = useAccessibility();

  const titles: Record<Props['mode'], string> = {
    'client-list':  t('client.list', idioma),
    'car-list':     t('car.list', idioma),
    'service-list': t('service.list', idioma),
  };

  return (
    <PageLayout title={titles[mode]}>
      <div
        style={{
          background: 'white',
          border: '2px solid #4a7c59',
          borderRadius: 10,
          padding: '24px 28px',
          maxWidth: 860,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ color: '#3a6b47', fontSize: 20, fontWeight: 'bold', margin: 0 }}>
            {titles[mode]}
          </h2>
          <MahoganyButton variant="primary" onClick={() => onNavigate('main')}>
            ← {t('client.back', idioma)}
          </MahoganyButton>
        </div>

        {mode === 'client-list'  && <ClientTable  idioma={idioma} />}
        {mode === 'car-list'     && <CarTable     idioma={idioma} />}
        {mode === 'service-list' && <ServiceTable idioma={idioma} />}
      </div>
    </PageLayout>
  );
}

/* ── Tabla Clientes ──────────────────────────────────────────────────────── */
function ClientTable({ idioma }: { idioma: Idioma }) {
  const data = getClientes();
  if (data.length === 0) return <Empty />;
  const headers = [
    t('client.id', idioma),
    t('client.names', idioma),
    t('client.surnames', idioma),
    t('client.email', idioma),
    t('client.phone', idioma),
  ];
  return (
    <table style={tableStyle} aria-label="Lista de clientes">
      <thead>
        <tr style={{ background: '#4a7c59', color: 'white' }}>
          {headers.map(h => <th key={h} style={thStyle}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((c, i) => (
          <tr key={c.identificacion} style={{ background: i % 2 === 0 ? '#f8faf8' : 'white' }}>
            <td style={tdStyle}>{c.identificacion}</td>
            <td style={tdStyle}>{c.nombres}</td>
            <td style={tdStyle}>{c.apellidos}</td>
            <td style={tdStyle}>{c.correo}</td>
            <td style={tdStyle}>{c.celular}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── Tabla Carros ────────────────────────────────────────────────────────── */
function CarTable({ idioma }: { idioma: Idioma }) {
  const data = getCarros();
  if (data.length === 0) return <Empty />;
  const headers = [
    t('car.plate', idioma),
    t('car.brand', idioma),
    t('car.model', idioma),
    'Imagen',
  ];
  return (
    <table style={tableStyle} aria-label="Lista de carros">
      <thead>
        <tr style={{ background: '#4a7c59', color: 'white' }}>
          {headers.map(h => <th key={h} style={thStyle}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((c, i) => (
          <tr key={c.placa} style={{ background: i % 2 === 0 ? '#f8faf8' : 'white' }}>
            <td style={tdStyle}><b style={{ letterSpacing: 2 }}>{c.placa}</b></td>
            <td style={tdStyle}>{c.marca}</td>
            <td style={tdStyle}>{c.modelo}</td>
            <td style={tdStyle}>
              {c.imagenUrl ? (
                <img
                  src={c.imagenUrl}
                  alt={`Carro ${c.placa}`}
                  style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc' }}
                />
              ) : (
                <span style={{ color: '#aaa', fontSize: 12 }}>Sin imagen</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── Tabla Servicios ─────────────────────────────────────────────────────── */
function ServiceTable({ idioma }: { idioma: Idioma }) {
  const data = getServicios();
  if (data.length === 0) return <Empty />;
  const headers = [
    t('car.plate', idioma),
    t('service.clientId', idioma),
    t('query.colDate', idioma),
    t('query.colType', idioma),
  ];
  return (
    <table style={tableStyle} aria-label="Lista de servicios">
      <thead>
        <tr style={{ background: '#4a7c59', color: 'white' }}>
          {headers.map(h => <th key={h} style={thStyle}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((s, i) => (
          <tr key={s.id} style={{ background: i % 2 === 0 ? '#f8faf8' : 'white' }}>
            <td style={tdStyle}><b style={{ letterSpacing: 2 }}>{s.placa}</b></td>
            <td style={tdStyle}>{s.idCliente}</td>
            <td style={tdStyle}>{s.fecha}</td>
            <td style={tdStyle}>
              <span
                style={{
                  background: tipoColor(s.tipo),
                  color: 'white',
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              >
                {s.tipo}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Empty() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '32px 0',
        color: '#888',
        fontFamily: 'Times New Roman, serif',
        fontSize: 15,
      }}
    >
      📭 No hay registros aún.
    </div>
  );
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'Times New Roman, serif',
  fontSize: 14,
};
const thStyle: React.CSSProperties = {
  padding: '10px 14px',
  textAlign: 'left',
  fontWeight: 'bold',
  fontSize: 13,
  borderBottom: '2px solid #2e5c3a',
};
const tdStyle: React.CSSProperties = {
  padding: '9px 14px',
  borderBottom: '1px solid #d8e8d8',
  verticalAlign: 'middle',
};

function tipoColor(tipo: string): string {
  const map: Record<string, string> = {
    'Cambio de aceite': '#6B2A2A',
    'Sincronización':   '#3a6b47',
    'Alineación':       '#1a5276',
    'Lavado':           '#5b2c6f',
  };
  return map[tipo] ?? '#555';
}
