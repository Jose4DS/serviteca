import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import MahoganyButton from '../components/MahoganyButton';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import { getServiciosByPlaca, findCliente } from '../services/storage';
import type { Screen, Servicio } from '../types';

interface Props {
  onNavigate: (screen: Screen) => void;
}

export default function ServiceQueryScreen({ onNavigate }: Props) {
  const { idioma, speak } = useAccessibility();
  const [placa, setPlaca] = useState('');
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<Servicio[]>([]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const found = getServiciosByPlaca(placa.trim());
    setResults(found);
    setSearched(true);
    if (found.length === 0) {
      speak(t('query.empty', idioma));
    } else {
      speak(`${found.length} servicio${found.length !== 1 ? 's' : ''} encontrado${found.length !== 1 ? 's' : ''}.`);
    }
  }

  return (
    <PageLayout title={t('query.title', idioma)}>
      {/* Buscador */}
      <div
        style={{
          background: 'white',
          border: '2px solid #4a7c59',
          borderRadius: 10,
          padding: '24px 28px',
          marginBottom: 20,
          maxWidth: 680,
        }}
      >
        <h2 style={{ color: '#3a6b47', fontSize: 20, marginBottom: 16, fontWeight: 'bold' }}>
          🔍 {t('query.title', idioma)}
        </h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label
              htmlFor="q-plate"
              style={{
                fontFamily: 'Times New Roman, serif',
                fontSize: 14,
                fontWeight: 'bold',
                color: '#3a2010',
                display: 'block',
                marginBottom: 4,
              }}
            >
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
                width: '100%',
                border: '2px solid #4a7c59',
                borderRadius: 5,
                padding: '8px 12px',
                fontFamily: 'Times New Roman, serif',
                fontSize: 16,
                boxSizing: 'border-box',
                outline: 'none',
                letterSpacing: 2,
                textTransform: 'uppercase',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#6B2A2A'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#4a7c59'; }}
            />
          </div>
          <MahoganyButton type="submit" variant="secondary" style={{ height: 38 }}>
            🔍 {t('query.search', idioma)}
          </MahoganyButton>
          <MahoganyButton
            type="button"
            variant="primary"
            onClick={() => onNavigate('main')}
            style={{ height: 38 }}
          >
            ← {t('service.back', idioma)}
          </MahoganyButton>
        </form>
      </div>

      {/* Resultados */}
      {searched && (
        <div
          style={{
            background: 'white',
            border: '2px solid #4a7c59',
            borderRadius: 10,
            padding: '20px 28px',
            maxWidth: 680,
          }}
        >
          {results.length === 0 ? (
            <div
              role="status"
              style={{
                textAlign: 'center',
                padding: '24px 0',
                color: '#6B2A2A',
                fontWeight: 'bold',
                fontSize: 16,
                fontFamily: 'Times New Roman, serif',
              }}
            >
              🚫 {t('query.empty', idioma)}
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 12, color: '#3a6b47', fontWeight: 'bold', fontSize: 15 }}>
                Placa: <span style={{ color: '#6B2A2A', letterSpacing: 2 }}>{placa}</span>
                {' — '}
                {results.length} servicio{results.length !== 1 ? 's' : ''} registrado{results.length !== 1 ? 's' : ''}
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontFamily: 'Times New Roman, serif',
                    fontSize: 14,
                  }}
                  aria-label="Tabla de servicios"
                >
                  <thead>
                    <tr style={{ background: '#4a7c59', color: 'white' }}>
                      <th style={th}>#</th>
                      <th style={th}>{t('query.colDate', idioma)}</th>
                      <th style={th}>{t('query.colType', idioma)}</th>
                      <th style={th}>{t('query.colClient', idioma)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((s, i) => {
                      const cli = findCliente(s.idCliente);
                      const nombre = cli
                        ? `${cli.nombres} ${cli.apellidos}`
                        : s.idCliente;
                      return (
                        <tr
                          key={s.id}
                          style={{ background: i % 2 === 0 ? '#f8faf8' : 'white' }}
                        >
                          <td style={td}>{i + 1}</td>
                          <td style={td}>{s.fecha}</td>
                          <td style={td}>
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
                          <td style={td}>{nombre}</td>
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
    </PageLayout>
  );
}

const th: React.CSSProperties = {
  padding: '10px 14px',
  textAlign: 'left',
  fontWeight: 'bold',
  fontSize: 13,
  borderBottom: '2px solid #2e5c3a',
};

const td: React.CSSProperties = {
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
