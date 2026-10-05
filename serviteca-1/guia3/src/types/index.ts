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
  | 'client-list'
  | 'car-add'
  | 'car-list'
  | 'service-add'
  | 'service-query'
  | 'service-list'
  | 'help';

// ── Accesibilidad ──────────────────────────────────────────────────────────

export type Idioma = 'es' | 'en';

export interface AccessibilityState {
  idioma: Idioma;
  ttsActive: boolean;
  brailleActive: boolean;
}
