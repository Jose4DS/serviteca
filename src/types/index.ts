export type Language = 'es' | 'en' | 'fr' | 'pt' | 'de' | 'it';

export type ScreenType =
  | 'login'
  | 'menu'
  | 'client_add'
  | 'client_list'
  | 'car_add'
  | 'car_list'
  | 'service_add'
  | 'service_query'
  | 'service_list';

export type ServiceType =
  | 'Cambio de aceite'
  | 'Sincronización'
  | 'Alineación'
  | 'Lavado';

export interface Client {
  id: string;
  identification: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  isSample?: boolean;
}

export interface Car {
  id: string;
  plate: string;
  brand: string;
  model: string;
  imageUrl?: string;
  createdAt: string;
  isSample?: boolean;
}

export interface ServiceRecord {
  id: string;
  plate: string;
  clientIdentification: string;
  serviceDate: string;
  serviceType: ServiceType;
  imageUrl?: string;
  createdAt: string;
  isSample?: boolean;
}

export interface AlertState {
  type: 'error' | 'success';
  title: string;
  message: string;
}
