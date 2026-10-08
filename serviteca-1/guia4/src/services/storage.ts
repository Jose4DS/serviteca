import type { Cliente, Carro, Servicio } from '../types';

// ── Claves de localStorage ─────────────────────────────────────────────────
const KEYS = {
  CLIENTES:  'srv_clientes',
  CARROS:    'srv_carros',
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

// ══════════════════════════════════════════════════════════════════════════
// CLIENTES
// ══════════════════════════════════════════════════════════════════════════

export function getClientes(): Cliente[] {
  return getAll<Cliente>(KEYS.CLIENTES);
}

/** Guarda un cliente nuevo (upsert por identificacion) */
export function saveCliente(c: Cliente): void {
  const list = getClientes().filter(x => x.identificacion !== c.identificacion);
  list.push(c);
  saveAll(KEYS.CLIENTES, list);
}

/** Actualiza un cliente existente (la identificacion no cambia) */
export function updateCliente(c: Cliente): void {
  const list = getClientes().map(x =>
    x.identificacion === c.identificacion ? c : x
  );
  saveAll(KEYS.CLIENTES, list);
}

/**
 * Elimina un cliente y, en cascada, todos sus servicios.
 * Ambas escrituras ocurren en secuencia antes de retornar.
 */
export function deleteCliente(id: string): void {
  saveAll(KEYS.CLIENTES, getClientes().filter(x => x.identificacion !== id));
  saveAll(KEYS.SERVICIOS, getServicios().filter(s => s.idCliente !== id));
}

export function findCliente(id: string): Cliente | undefined {
  return getClientes().find(c => c.identificacion === id);
}

export function countServiciosByCliente(id: string): number {
  return getServicios().filter(s => s.idCliente === id).length;
}

// ══════════════════════════════════════════════════════════════════════════
// CARROS
// ══════════════════════════════════════════════════════════════════════════

export function getCarros(): Carro[] {
  return getAll<Carro>(KEYS.CARROS);
}

/** Guarda un carro nuevo (upsert por placa) */
export function saveCarro(c: Carro): void {
  const list = getCarros().filter(x => x.placa !== c.placa);
  list.push(c);
  saveAll(KEYS.CARROS, list);
}

/** Actualiza un carro existente (la placa no cambia) */
export function updateCarro(c: Carro): void {
  const list = getCarros().map(x => x.placa === c.placa ? c : x);
  saveAll(KEYS.CARROS, list);
}

/**
 * Elimina un carro y, en cascada, todos sus servicios.
 */
export function deleteCarro(placa: string): void {
  saveAll(KEYS.CARROS, getCarros().filter(x => x.placa !== placa));
  saveAll(KEYS.SERVICIOS, getServicios().filter(s =>
    s.placa.toUpperCase() !== placa.toUpperCase()
  ));
}

export function findCarro(placa: string): Carro | undefined {
  return getCarros().find(c => c.placa.toUpperCase() === placa.toUpperCase());
}

export function countServiciosByPlaca(placa: string): number {
  return getServicios().filter(
    s => s.placa.toUpperCase() === placa.toUpperCase()
  ).length;
}

// ══════════════════════════════════════════════════════════════════════════
// SERVICIOS
// ══════════════════════════════════════════════════════════════════════════

export function getServicios(): Servicio[] {
  return getAll<Servicio>(KEYS.SERVICIOS);
}

/** Agrega un servicio nuevo */
export function saveServicio(s: Servicio): void {
  const list = getServicios();
  list.push(s);
  saveAll(KEYS.SERVICIOS, list);
}

/** Actualiza un servicio existente (el id no cambia) */
export function updateServicio(s: Servicio): void {
  const list = getServicios().map(x => x.id === s.id ? s : x);
  saveAll(KEYS.SERVICIOS, list);
}

/** Elimina un servicio por su id */
export function deleteServicio(id: string): void {
  saveAll(KEYS.SERVICIOS, getServicios().filter(s => s.id !== id));
}

export function findServicio(id: string): Servicio | undefined {
  return getServicios().find(s => s.id === id);
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
