// ── Entidades del dominio ──────────────────────────────────────────────────

export interface Cliente {
  identificacion: string;
  nombres: string;
  apellidos: string;
  correo: string;
  celular: string;
}

export interface Carro {
  placa: string;       // clave primaria
  marca: string;
  modelo: string;
  imagenUrl?: string;  // base64 o URL de objeto
}

export type TipoServicio =
  | 'Cambio de aceite'
  | 'Sincronización'
  | 'Alineación'
  | 'Lavado';

export interface Servicio {
  id: string;          // uuid simple: Date.now + random
  placa: string;
  idCliente: string;
  fecha: string;       // YYYY-MM-DD
  tipo: TipoServicio;
}

// ── Navegación ─────────────────────────────────────────────────────────────

export type Screen =
  | 'login'
  | 'main'
  | 'client-add'
  | 'client-edit'    // NUEVO v2
  | 'client-list'
  | 'car-add'
  | 'car-edit'       // NUEVO v2
  | 'car-list'
  | 'service-add'
  | 'service-edit'   // NUEVO v2
  | 'service-query'
  | 'service-list'
  | 'help';

/**
 * Payload de navegación — permite pasar el ID del registro a editar.
 * Los componentes que solo navegan por nombre de pantalla siguen usando
 * onNavigate('main') sin cambios; App.tsx acepta ambas formas.
 */
export interface NavPayload {
  screen: Screen;
  editId?: string; // identificacion (cliente) | placa (carro) | id (servicio)
}

/** Union aceptada por todas las funciones onNavigate de guia4 */
export type NavTarget = Screen | NavPayload;

// ── Accesibilidad ──────────────────────────────────────────────────────────

export type Idioma = 'es' | 'en' | 'pt'; // NUEVO: Português

export interface AccessibilityState {
  idioma: Idioma;
  ttsActive: boolean;
  brailleActive: boolean;
}
