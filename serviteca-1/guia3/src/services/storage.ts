import type { Cliente, Carro, Servicio } from '../types';

// ── Claves de localStorage ─────────────────────────────────────────────────
const KEYS = {
  CLIENTES: 'srv_clientes',
  CARROS:   'srv_carros',
  SERVICIOS: 'srv_servicios',
} as const;

// ── Utilidades genéricas ───────────────────────────────────────────────────
function getAll<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function saveAll<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Clientes ───────────────────────────────────────────────────────────────
export function getClientes(): Cliente[] {
  return getAll<Cliente>(KEYS.CLIENTES);
}

export function saveCliente(c: Cliente): void {
  const list = getClientes().filter(x => x.identificacion !== c.identificacion);
  list.push(c);
  saveAll(KEYS.CLIENTES, list);
}

export function findCliente(id: string): Cliente | undefined {
  return getClientes().find(c => c.identificacion === id);
}

// ── Carros ─────────────────────────────────────────────────────────────────
export function getCarros(): Carro[] {
  return getAll<Carro>(KEYS.CARROS);
}

export function saveCarro(c: Carro): void {
  const list = getCarros().filter(x => x.placa !== c.placa);
  list.push(c);
  saveAll(KEYS.CARROS, list);
}

export function findCarro(placa: string): Carro | undefined {
  return getCarros().find(c => c.placa.toUpperCase() === placa.toUpperCase());
}

// ── Servicios ──────────────────────────────────────────────────────────────
export function getServicios(): Servicio[] {
  return getAll<Servicio>(KEYS.SERVICIOS);
}

export function saveServicio(s: Servicio): void {
  const list = getServicios();
  list.push(s);
  saveAll(KEYS.SERVICIOS, list);
}

export function getServiciosByPlaca(placa: string): Servicio[] {
  return getServicios().filter(
    s => s.placa.toUpperCase() === placa.toUpperCase()
  );
}

// ── ID único ───────────────────────────────────────────────────────────────
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
