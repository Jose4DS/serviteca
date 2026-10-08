import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import MahoganyButton from '../components/MahoganyButton';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import { getServiciosByPlaca, findCliente, findCarro } from '../services/storage';
import type { Servicio, Cliente, Carro, NavTarget, Idioma } from '../types';

interface Props {
  onNavigate: (target: NavTarget) => void;
}

// ── Colores por tipo de servicio ───────────────────────────────────────────
const TIPO_COLORS: Record<string, string> = {
  'Cambio de aceite': '#6B2A2A',
  'Sincronización':   '#3a6b47',
  'Alineación':       '#1a5276',
  'Lavado':           '#5b2c6f',
};

export default function ServiceQueryScreen({ onNavigate }: Props) {
  const { idioma, speak } = useAccessibility();
  const [placa, setPlaca]       = useState('');
  const [searched, setSearched] = useState(false);
  const [results, setResults]   = useState<Servicio[]>([]);
  const [carro, setCarro]       = useState<Carro | undefined>(undefined);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const p = placa.trim().toUpperCase();

    const carroEncontrado = findCarro(p);
    const serviciosEncontrados = getServiciosByPlaca(p);

    setCarro(carroEncontrado);
    setResults(serviciosEncontrados);
    setSearched(true);

    if (!carroEncontrado) {
      speak(t('query.notRegistered', idioma));
    } else if (serviciosEncontrados.length === 0) {
      speak(t('query.empty', idioma));
    } else {
      speak(
        `${serviciosEncontrados.length} ` +
        `servicio${serviciosEncontrados.length !== 1 ? 's' : ''} encontrado${serviciosEncontrados.length !== 1 ? 's' : ''}.`
      );
    }
  }

  // Clientes únicos de los servicios encontrados
  const clientesUnicos: Cliente[] = [];
  if (searched && results.length > 0) {
    const seen = new Set<string>();
    results.forEach(s => {
      if (!seen.has(s.idCliente)) {
        seen.add(s.idCliente);
        const cli = findCliente(s.idCliente);
        if (cli) clientesUnicos.push(cli);
      }
    });
  }

  return (
    <PageLayout title={t('query.title', idioma)}>
      {/* ── Buscador ──────────────────────────────────────────────── */}
      <div style={{
        background: 'white', border: '2px solid #4a7c59',
        borderRadius: 10, padding: '20px 24px',
        marginBottom: 18, maxWidth: 700,
      }}>
        <h2 style={{ color: '#3a6b47', fontSize: 19, marginBottom: 14, fontWeight: 'bold' }}>
          🔍 {t('query.title', idioma)}
        </h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="q-plate" style={{
              fontFamily: 'Times New Roman, serif', fontSize: 14,
              fontWeight: 'bold', color: '#3a2010', display: 'block', marginBottom: 4,
            }}>
              {t('service.plate', idioma)}
            </label>
            <input
              id="q-plate"
              type="text"
              value={placa}
              onChange={e => { setPlaca(e.target.value.toUpperCase()); setSearched(false); }}
              placeholder={t('query.plate', idioma)}
              maxLength={7}
              style={{
                width: '100%', border: '2px solid #4a7c59', borderRadius: 5,
                padding: '8px 12px', fontFamily: 'Times New Roman, serif',
                fontSize: 16, boxSizing: 'border-box', outline: 'none',
                letterSpacing: 2, textTransform: 'uppercase',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#6B2A2A'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#4a7c59'; }}
            />
          </div>
          <MahoganyButton type="submit" variant="secondary" style={{ height: 38 }}>
            🔍 {t('query.search', idioma)}
          </MahoganyButton>
          <MahoganyButton type="button" variant="primary"
            onClick={() => onNavigate('main')} style={{ height: 38 }}>
            ← {t('service.back', idioma)}
          </MahoganyButton>
        </form>
      </div>

      {/* ── Resultados ────────────────────────────────────────────── */}
      {searched && (
        <div style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Placa no registrada */}
          {!carro && (
            <div style={{
              background: 'white', border: '2px solid #4a7c59',
              borderRadius: 10, padding: '20px 24px',
              textAlign: 'center', color: '#6B2A2A',
              fontWeight: 'bold', fontSize: 15,
              fontFamily: 'Times New Roman, serif',
            }}>
              🚫 {t('query.notRegistered', idioma)}
            </div>
          )}

          {/* ── Ficha del carro (RF-10) ─────────────────────────── */}
          {carro && <FichaCarroCard carro={carro} idioma={idioma} />}

          {/* ── Ficha(s) del cliente (RF-10) ────────────────────── */}
          {carro && clientesUnicos.length > 0 && (
            <FichaClientesCard clientes={clientesUnicos} idioma={idioma} />
          )}

          {/* ── Tabla de servicios ───────────────────────────────── */}
          {carro && (
            <div style={{
              background: 'white', border: '2px solid #4a7c59',
              borderRadius: 10, padding: '18px 24px',
            }}>
              {results.length === 0 ? (
                <div role="status" style={{
                  textAlign: 'center', padding: '20px 0',
                  color: '#6B2A2A', fontWeight: 'bold', fontSize: 15,
                  fontFamily: 'Times New Roman, serif',
                }}>
                  🚫 {t('query.empty', idioma)}
                </div>
              ) : (
                <>
                  <p style={{
                    marginBottom: 12, color: '#3a6b47',
                    fontWeight: 'bold', fontSize: 14,
                    fontFamily: 'Times New Roman, serif',
                  }}>
                    {results.length} servicio{results.length !== 1 ? 's' : ''} registrado{results.length !== 1 ? 's' : ''}
                  </p>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{
                      width: '100%', borderCollapse: 'collapse',
                      fontFamily: 'Times New Roman, serif', fontSize: 14,
                    }} aria-label="Tabla de servicios">
                      <thead>
                        <tr style={{ background: '#4a7c59', color: 'white' }}>
                          <th style={thStyle}>#</th>
                          <th style={thStyle}>{t('query.colDate', idioma)}</th>
                          <th style={thStyle}>{t('query.colType', idioma)}</th>
                          <th style={thStyle}>{t('query.colClient', idioma)}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((s, i) => {
                          const cli = findCliente(s.idCliente);
                          const nombre = cli
                            ? `${cli.nombres} ${cli.apellidos}`
                            : s.idCliente;
                          return (
                            <tr key={s.id} style={{ background: i % 2 === 0 ? '#f8faf8' : 'white' }}>
                              <td style={tdStyle}>{i + 1}</td>
                              <td style={tdStyle}>{s.fecha}</td>
                              <td style={tdStyle}>
                                <span style={{
                                  background: TIPO_COLORS[s.tipo] ?? '#555',
                                  color: 'white', borderRadius: 4,
                                  padding: '2px 8px', fontSize: 12, fontWeight: 'bold',
                                }}>
                                  {s.tipo}
                                </span>
                              </td>
                              <td style={tdStyle}>{nombre}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Sub-componentes de ficha
// ══════════════════════════════════════════════════════════════════════════

function FichaCarroCard({ carro, idioma }: { carro: Carro; idioma: Idioma }) {
  return (
    <div style={{
      background: 'white', border: '2px solid #4a7c59',
      borderRadius: 10, padding: '16px 20px',
    }}>
      <p style={{
        color: '#3a6b47', fontWeight: 'bold', fontSize: 13,
        fontFamily: 'Times New Roman, serif',
        textTransform: 'uppercase', letterSpacing: 1,
        marginBottom: 12, borderBottom: '1px solid #d8e8d8', paddingBottom: 6,
      }}>
        🚗 {t('query.carCard', idioma)}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Foto del carro */}
        <div style={{
          width: 120, height: 80, flexShrink: 0,
          border: '2px solid #b0c8b0', borderRadius: 8, overflow: 'hidden',
          background: '#f0f7f0', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {carro.imagenUrl ? (
            <img src={carro.imagenUrl} alt={`Carro ${carro.placa}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 36 }}>🚗</span>
          )}
        </div>

        {/* Datos del carro */}
        <div style={{ fontFamily: 'Times New Roman, serif' }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <DataField label="Placa" value={
              <span style={{ letterSpacing: 3, fontWeight: 'bold', fontSize: 18, color: '#6B2A2A' }}>
                {carro.placa}
              </span>
            } />
            <DataField label="Marca" value={carro.marca} />
            <DataField label="Modelo" value={carro.modelo} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FichaClientesCard({ clientes, idioma }: { clientes: Cliente[]; idioma: Idioma }) {
  return (
    <div style={{
      background: 'white', border: '2px solid #4a7c59',
      borderRadius: 10, padding: '16px 20px',
    }}>
      <p style={{
        color: '#3a6b47', fontWeight: 'bold', fontSize: 13,
        fontFamily: 'Times New Roman, serif',
        textTransform: 'uppercase', letterSpacing: 1,
        marginBottom: 12, borderBottom: '1px solid #d8e8d8', paddingBottom: 6,
      }}>
        👤 {t('query.clientCard', idioma)}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {clientes.map(cli => (
          <div key={cli.identificacion} style={{
            display: 'flex', gap: 24, flexWrap: 'wrap',
            fontFamily: 'Times New Roman, serif',
            paddingBottom: 10,
            borderBottom: clientes.length > 1 ? '1px dashed #d8e8d8' : 'none',
          }}>
            <DataField label="Identificación" value={cli.identificacion} />
            <DataField label="Nombre" value={`${cli.nombres} ${cli.apellidos}`} />
            <DataField label="Correo" value={cli.correo} />
            <DataField label="Celular" value={cli.celular} />
          </div>
        ))}
      </div>
    </div>
  );
}

function DataField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase',
        letterSpacing: 0.5, marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 14, color: '#222', fontWeight: 'bold' }}>
        {value}
      </div>
    </div>
  );
}

// ── Estilos de tabla ───────────────────────────────────────────────────────
const thStyle: React.CSSProperties = {
  padding: '9px 14px', textAlign: 'left', fontWeight: 'bold',
  fontSize: 13, borderBottom: '2px solid #2e5c3a',
};
const tdStyle: React.CSSProperties = {
  padding: '8px 14px', borderBottom: '1px solid #d8e8d8', verticalAlign: 'middle',
};
