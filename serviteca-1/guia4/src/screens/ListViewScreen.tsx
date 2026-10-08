import React, { useState, useCallback } from 'react';
import PageLayout from '../components/PageLayout';
import MahoganyButton from '../components/MahoganyButton';
import MessageBox from '../components/MessageBox';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import { useAccessibility } from '../context/AccessibilityContext';
import { t } from '../utils/i18n';
import { useToast } from '../hooks/useToast';
import { useListFilter } from '../hooks/useListFilter';
import {
  getClientes, deleteCliente, countServiciosByCliente,
  getCarros,   deleteCarro,   countServiciosByPlaca,
  getServicios, deleteServicio,
} from '../services/storage';
import type { Screen, NavTarget, Idioma, Cliente, Carro, Servicio, TipoServicio } from '../types';

// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
  mode: 'client-list' | 'car-list' | 'service-list';
  onNavigate: (target: NavTarget) => void;
}

// ── Tipos internos para el diálogo de confirmación ─────────────────────────
type ConfirmTarget =
  | { type: 'client';  id: string }
  | { type: 'car';     id: string }
  | { type: 'service'; id: string }
  | null;

// ── Colores por tipo de servicio ───────────────────────────────────────────
const TIPO_COLORS: Record<string, string> = {
  'Cambio de aceite': '#6B2A2A',
  'Sincronización':   '#3a6b47',
  'Alineación':       '#1a5276',
  'Lavado':           '#5b2c6f',
};

const TIPOS: TipoServicio[] = ['Cambio de aceite', 'Sincronización', 'Alineación', 'Lavado'];

// ══════════════════════════════════════════════════════════════════════════
export default function ListViewScreen({ mode, onNavigate }: Props) {
  const { idioma, speak } = useAccessibility();
  const { toast, showToast } = useToast();

  // Datos en memoria (se recargan solo tras una mutación)
  const [clientes, setClientes] = useState(() => getClientes());
  const [carros,   setCarros]   = useState(() => getCarros());
  const [servicios, setServicios] = useState(() => getServicios());

  // Filtros extra solo para servicios
  const [filterTipo, setFilterTipo] = useState<TipoServicio | ''>('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo,   setFilterTo]   = useState('');

  // Diálogo de confirmación
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget>(null);

  // ── Función de filtro por modo ───────────────────────────────────────
  const clienteFilterFn = useCallback(
    (c: Cliente, q: string) => {
      const lq = q.toLowerCase();
      return (
        c.identificacion.includes(q) ||
        c.nombres.toLowerCase().includes(lq) ||
        c.apellidos.toLowerCase().includes(lq)
      );
    },
    []
  );

  const carroFilterFn = useCallback(
    (c: Carro, q: string) => {
      const lq = q.toLowerCase();
      return (
        c.placa.toLowerCase().includes(lq) ||
        c.marca.toLowerCase().includes(lq) ||
        c.modelo.toLowerCase().includes(lq)
      );
    },
    []
  );

  const servicioFilterFn = useCallback(
    (s: Servicio, q: string) => {
      const lq = q.toLowerCase();
      const matchText = !q || s.placa.toLowerCase().includes(lq) || s.idCliente.includes(q);
      const matchTipo = !filterTipo || s.tipo === filterTipo;
      const matchFrom = !filterFrom || s.fecha >= filterFrom;
      const matchTo   = !filterTo   || s.fecha <= filterTo;
      return matchText && matchTipo && matchFrom && matchTo;
    },
    [filterTipo, filterFrom, filterTo]
  );

  // ── Hooks de filtro/paginación por modo ──────────────────────────────
  const clienteFilter  = useListFilter({ data: clientes,  filterFn: clienteFilterFn });
  const carroFilter    = useListFilter({ data: carros,    filterFn: carroFilterFn });
  const servicioFilter = useListFilter({ data: servicios, filterFn: servicioFilterFn });

  // ── Títulos ──────────────────────────────────────────────────────────
  const titles: Record<Props['mode'], string> = {
    'client-list':  t('client.list', idioma),
    'car-list':     t('car.list', idioma),
    'service-list': t('service.list', idioma),
  };

  // ── Helpers de eliminación ───────────────────────────────────────────
  function openConfirm(target: ConfirmTarget) {
    setConfirmTarget(target);
  }

  function handleConfirmDelete() {
    if (!confirmTarget) return;

    if (confirmTarget.type === 'client') {
      deleteCliente(confirmTarget.id);
      setClientes(getClientes());
      setServicios(getServicios());
      const msg = t('msg.deleted', idioma);
      showToast(msg, 'success');
      speak(msg);
    }
    if (confirmTarget.type === 'car') {
      deleteCarro(confirmTarget.id);
      setCarros(getCarros());
      setServicios(getServicios());
      const msg = t('msg.deleted', idioma);
      showToast(msg, 'success');
      speak(msg);
    }
    if (confirmTarget.type === 'service') {
      deleteServicio(confirmTarget.id);
      setServicios(getServicios());
      const msg = t('msg.deleted', idioma);
      showToast(msg, 'success');
      speak(msg);
    }
    setConfirmTarget(null);
  }

  // ── Texto del diálogo de confirmación ────────────────────────────────
  function confirmDescription(): string {
    if (!confirmTarget) return '';
    if (confirmTarget.type === 'client') {
      const c = clientes.find(x => x.identificacion === confirmTarget.id);
      return c ? `${c.nombres} ${c.apellidos} — ID: ${c.identificacion}` : confirmTarget.id;
    }
    if (confirmTarget.type === 'car') {
      const c = carros.find(x => x.placa === confirmTarget.id);
      return c ? `${c.placa} — ${c.marca} ${c.modelo}` : confirmTarget.id;
    }
    if (confirmTarget.type === 'service') {
      const s = servicios.find(x => x.id === confirmTarget.id);
      return s ? `Placa: ${s.placa} | ${s.fecha} | ${s.tipo}` : confirmTarget.id;
    }
    return '';
  }

  function confirmWarning(): string | undefined {
    if (!confirmTarget) return undefined;
    let count = 0;
    if (confirmTarget.type === 'client') count = countServiciosByCliente(confirmTarget.id);
    if (confirmTarget.type === 'car')    count = countServiciosByPlaca(confirmTarget.id);
    if (count === 0) return undefined;
    return t('confirm.cascade', idioma).replace('{n}', String(count));
  }

  // ── Limpiar filtros de servicios ─────────────────────────────────────
  function clearServiceFilters() {
    setFilterTipo('');
    setFilterFrom('');
    setFilterTo('');
    servicioFilter.reset();
  }

  return (
    <PageLayout title={titles[mode]}>
      {/* Toast */}
      {toast && (
        <div style={{ marginBottom: 10, position: 'sticky', top: 0, zIndex: 10 }}>
          <MessageBox type={toast.type} message={toast.message} />
        </div>
      )}

      <div
        style={{
          background: 'white',
          border: '2px solid #4a7c59',
          borderRadius: 10,
          padding: '20px 24px',
          maxWidth: 900,
        }}
      >
        {/* ── Barra de herramientas ─────────────────────────────────── */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h2 style={{ color: '#3a6b47', fontSize: 19, fontWeight: 'bold', margin: 0 }}>
              {titles[mode]}
            </h2>
            <MahoganyButton variant="primary" onClick={() => onNavigate('main')}>
              ← {t('client.back', idioma)}
            </MahoganyButton>
          </div>

          {/* Búsqueda de texto */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <input
                type="search"
                value={
                  mode === 'client-list'  ? clienteFilter.query :
                  mode === 'car-list'     ? carroFilter.query   :
                  servicioFilter.query
                }
                onChange={e => {
                  if (mode === 'client-list')  clienteFilter.setQuery(e.target.value);
                  else if (mode === 'car-list') carroFilter.setQuery(e.target.value);
                  else                          servicioFilter.setQuery(e.target.value);
                }}
                placeholder={t('list.search', idioma)}
                aria-label={t('list.search', idioma)}
                style={{
                  width: '100%', border: '2px solid #4a7c59', borderRadius: 5,
                  padding: '6px 32px 6px 10px',
                  fontFamily: 'Times New Roman, serif', fontSize: 14,
                  background: '#f8faf8', outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#6B2A2A'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#4a7c59'; }}
              />
              {/* Botón limpiar búsqueda */}
              {(mode === 'client-list' ? clienteFilter.query :
                mode === 'car-list' ? carroFilter.query : servicioFilter.query) && (
                <button
                  onClick={() => {
                    if (mode === 'client-list')  clienteFilter.reset();
                    else if (mode === 'car-list') carroFilter.reset();
                    else                          servicioFilter.reset();
                  }}
                  aria-label={t('list.clear', idioma)}
                  style={{
                    position: 'absolute', right: 6, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 16, color: '#888', lineHeight: 1,
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {/* Filtros extra solo para servicios */}
            {mode === 'service-list' && (
              <>
                <select
                  value={filterTipo}
                  onChange={e => { setFilterTipo(e.target.value as TipoServicio | ''); servicioFilter.reset(); }}
                  aria-label={t('list.filterType', idioma)}
                  style={filterSelectStyle}
                >
                  <option value="">— {t('list.filterType', idioma)} —</option>
                  {TIPOS.map(tp => (
                    <option key={tp} value={tp}>{tp}</option>
                  ))}
                </select>

                <input
                  type="date"
                  value={filterFrom}
                  onChange={e => { setFilterFrom(e.target.value); servicioFilter.reset(); }}
                  title={t('list.filterFrom', idioma)}
                  aria-label={t('list.filterFrom', idioma)}
                  style={filterSelectStyle}
                />
                <span style={{ fontSize: 12, color: '#666', fontFamily: 'Times New Roman, serif' }}>
                  →
                </span>
                <input
                  type="date"
                  value={filterTo}
                  onChange={e => { setFilterTo(e.target.value); servicioFilter.reset(); }}
                  title={t('list.filterTo', idioma)}
                  aria-label={t('list.filterTo', idioma)}
                  style={filterSelectStyle}
                />

                {(filterTipo || filterFrom || filterTo) && (
                  <button onClick={clearServiceFilters} style={clearBtnStyle}>
                    ✕ {t('list.clearFilters', idioma)}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Tablas ───────────────────────────────────────────────── */}
        {mode === 'client-list' && (
          <ClientTable
            items={clienteFilter.pageItems}
            total={clienteFilter.filteredCount}
            idioma={idioma}
            onEdit={id => onNavigate({ screen: 'client-edit', editId: id })}
            onDelete={id => openConfirm({ type: 'client', id })}
          />
        )}
        {mode === 'car-list' && (
          <CarTable
            items={carroFilter.pageItems}
            total={carroFilter.filteredCount}
            idioma={idioma}
            onEdit={id => onNavigate({ screen: 'car-edit', editId: id })}
            onDelete={id => openConfirm({ type: 'car', id })}
          />
        )}
        {mode === 'service-list' && (
          <ServiceTable
            items={servicioFilter.pageItems}
            total={servicioFilter.filteredCount}
            idioma={idioma}
            onEdit={id => onNavigate({ screen: 'service-edit', editId: id })}
            onDelete={id => openConfirm({ type: 'service', id })}
          />
        )}

        {/* ── Paginación ───────────────────────────────────────────── */}
        {mode === 'client-list' && (
          <Pagination
            page={clienteFilter.page} totalPages={clienteFilter.totalPages}
            onPrev={clienteFilter.goPrev} onNext={clienteFilter.goNext}
            idioma={idioma}
          />
        )}
        {mode === 'car-list' && (
          <Pagination
            page={carroFilter.page} totalPages={carroFilter.totalPages}
            onPrev={carroFilter.goPrev} onNext={carroFilter.goNext}
            idioma={idioma}
          />
        )}
        {mode === 'service-list' && (
          <Pagination
            page={servicioFilter.page} totalPages={servicioFilter.totalPages}
            onPrev={servicioFilter.goPrev} onNext={servicioFilter.goNext}
            idioma={idioma}
          />
        )}
      </div>

      {/* ── Modal de confirmación ─────────────────────────────────── */}
      <ConfirmDialog
        open={confirmTarget !== null}
        description={confirmDescription()}
        warning={confirmWarning()}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </PageLayout>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Sub-tablas
// ══════════════════════════════════════════════════════════════════════════

interface ClientTableProps {
  items: Cliente[];
  total: number;
  idioma: Idioma;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function ClientTable({ items, total, idioma, onEdit, onDelete }: ClientTableProps) {
  if (total === 0) return <Empty idioma={idioma} />;
  if (items.length === 0) return <NoResults idioma={idioma} />;
  return (
    <table style={tableStyle} aria-label={t('client.list', idioma)}>
      <thead>
        <tr style={{ background: '#4a7c59', color: 'white' }}>
          {[
            t('client.id', idioma),
            t('client.names', idioma),
            t('client.surnames', idioma),
            t('client.email', idioma),
            t('client.phone', idioma),
            t('list.actions', idioma),
          ].map(h => <th key={h} style={thStyle}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {items.map((c, i) => (
          <tr key={c.identificacion} style={{ background: i % 2 === 0 ? '#f8faf8' : 'white' }}>
            <td style={tdStyle}>{c.identificacion}</td>
            <td style={tdStyle}>{c.nombres}</td>
            <td style={tdStyle}>{c.apellidos}</td>
            <td style={tdStyle}>{c.correo}</td>
            <td style={tdStyle}>{c.celular}</td>
            <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
              <ActionButtons
                onEdit={() => onEdit(c.identificacion)}
                onDelete={() => onDelete(c.identificacion)}
                idioma={idioma}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface CarTableProps {
  items: Carro[];
  total: number;
  idioma: Idioma;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function CarTable({ items, total, idioma, onEdit, onDelete }: CarTableProps) {
  if (total === 0) return <Empty idioma={idioma} />;
  if (items.length === 0) return <NoResults idioma={idioma} />;
  return (
    <table style={tableStyle} aria-label={t('car.list', idioma)}>
      <thead>
        <tr style={{ background: '#4a7c59', color: 'white' }}>
          {[
            t('car.plate', idioma),
            t('car.brand', idioma),
            t('car.model', idioma),
            'Imagen',
            t('list.actions', idioma),
          ].map(h => <th key={h} style={thStyle}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {items.map((c, i) => (
          <tr key={c.placa} style={{ background: i % 2 === 0 ? '#f8faf8' : 'white' }}>
            <td style={tdStyle}><b style={{ letterSpacing: 2 }}>{c.placa}</b></td>
            <td style={tdStyle}>{c.marca}</td>
            <td style={tdStyle}>{c.modelo}</td>
            <td style={tdStyle}>
              {c.imagenUrl
                ? <img src={c.imagenUrl} alt={`Carro ${c.placa}`}
                    style={{ width: 56, height: 38, objectFit: 'cover', borderRadius: 4, border: '1px solid #ccc' }} />
                : <span style={{ color: '#aaa', fontSize: 12 }}>—</span>}
            </td>
            <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
              <ActionButtons
                onEdit={() => onEdit(c.placa)}
                onDelete={() => onDelete(c.placa)}
                idioma={idioma}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface ServiceTableProps {
  items: Servicio[];
  total: number;
  idioma: Idioma;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function ServiceTable({ items, total, idioma, onEdit, onDelete }: ServiceTableProps) {
  if (total === 0) return <Empty idioma={idioma} />;
  if (items.length === 0) return <NoResults idioma={idioma} />;
  return (
    <table style={tableStyle} aria-label={t('service.list', idioma)}>
      <thead>
        <tr style={{ background: '#4a7c59', color: 'white' }}>
          {[
            t('car.plate', idioma),
            t('service.clientId', idioma),
            t('query.colDate', idioma),
            t('query.colType', idioma),
            t('list.actions', idioma),
          ].map(h => <th key={h} style={thStyle}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {items.map((s, i) => (
          <tr key={s.id} style={{ background: i % 2 === 0 ? '#f8faf8' : 'white' }}>
            <td style={tdStyle}><b style={{ letterSpacing: 2 }}>{s.placa}</b></td>
            <td style={tdStyle}>{s.idCliente}</td>
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
            <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
              <ActionButtons
                onEdit={() => onEdit(s.id)}
                onDelete={() => onDelete(s.id)}
                idioma={idioma}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Botones de acción reutilizables ────────────────────────────────────────
function ActionButtons({
  onEdit, onDelete, idioma,
}: { onEdit: () => void; onDelete: () => void; idioma: Idioma }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <button
        onClick={onEdit}
        aria-label={t('list.edit', idioma)}
        title={t('list.edit', idioma)}
        style={actionBtn('#3a6b47')}
        onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
      >
        ✏️
      </button>
      <button
        onClick={onDelete}
        aria-label={t('list.delete', idioma)}
        title={t('list.delete', idioma)}
        style={actionBtn('#6B2A2A')}
        onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.filter = 'brightness(1)'; }}
      >
        🗑️
      </button>
    </div>
  );
}

// ── Mensajes vacíos ────────────────────────────────────────────────────────
function Empty({ idioma }: { idioma: Idioma }) {
  return (
    <div style={{ textAlign: 'center', padding: '28px 0', color: '#888',
      fontFamily: 'Times New Roman, serif', fontSize: 15 }}>
      📭 No hay registros aún.
    </div>
  );
}

function NoResults({ idioma }: { idioma: Idioma }) {
  return (
    <div style={{ textAlign: 'center', padding: '28px 0', color: '#6B2A2A',
      fontFamily: 'Times New Roman, serif', fontSize: 15, fontWeight: 'bold' }}>
      🔍 {t('list.noResults', idioma)}
    </div>
  );
}

// ── Estilos constantes ─────────────────────────────────────────────────────
const tableStyle: React.CSSProperties = {
  width: '100%', borderCollapse: 'collapse',
  fontFamily: 'Times New Roman, serif', fontSize: 14,
};
const thStyle: React.CSSProperties = {
  padding: '9px 12px', textAlign: 'left', fontWeight: 'bold',
  fontSize: 13, borderBottom: '2px solid #2e5c3a',
};
const tdStyle: React.CSSProperties = {
  padding: '8px 12px', borderBottom: '1px solid #d8e8d8', verticalAlign: 'middle',
};
const filterSelectStyle: React.CSSProperties = {
  border: '2px solid #4a7c59', borderRadius: 5,
  padding: '6px 8px', fontFamily: 'Times New Roman, serif',
  fontSize: 13, background: '#f8faf8', outline: 'none', cursor: 'pointer',
};
const clearBtnStyle: React.CSSProperties = {
  background: 'none', border: '2px solid #6B2A2A', borderRadius: 5,
  color: '#6B2A2A', padding: '4px 10px', cursor: 'pointer',
  fontFamily: 'Times New Roman, serif', fontSize: 13, fontWeight: 'bold',
};

function actionBtn(bg: string): React.CSSProperties {
  return {
    background: bg, border: 'none', borderRadius: 4,
    padding: '4px 8px', cursor: 'pointer', fontSize: 14, lineHeight: 1,
  };
}
