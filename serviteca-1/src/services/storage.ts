import { Client, Car, ServiceRecord } from '../types';

const STORAGE_KEYS = {
  CLIENTS: 'serviteca_clients_v1',
  CARS: 'serviteca_cars_v1',
  SERVICES: 'serviteca_services_v1',
  CREDENTIALS: 'serviteca_credentials_v1',
  SESSION: 'serviteca_session_v1',
};

// Initial sample data from mockups (distinguished clearly with isSample: true)
const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-sample-1',
    identification: '10203040',
    firstName: 'Tobey',
    lastName: 'Marshall',
    email: 'tobey@ejemplo.com',
    phone: '3001234567',
    createdAt: '2026-09-01T10:00:00Z',
    isSample: true,
  },
  {
    id: 'cli-sample-2',
    identification: '70809010',
    firstName: 'Manuel',
    lastName: 'Enrique',
    email: 'manuel@ejemplo.com',
    phone: '3109876543',
    createdAt: '2026-09-05T11:30:00Z',
    isSample: true,
  },
];

const INITIAL_CARS: Car[] = [
  {
    id: 'car-sample-1',
    plate: 'NFSMW',
    brand: 'BMW',
    model: 'M3 GTR',
    imageUrl: '',
    createdAt: '2026-09-01T10:15:00Z',
    isSample: true,
  },
];

const INITIAL_SERVICES: ServiceRecord[] = [
  {
    id: 'srv-sample-1',
    plate: 'NFSMW',
    clientIdentification: '10203040',
    serviceDate: '2026-09-15',
    serviceType: 'Sincronización',
    createdAt: '2026-09-15T14:00:00Z',
    isSample: true,
  },
  {
    id: 'srv-sample-2',
    plate: 'NFSMW',
    clientIdentification: '10203040',
    serviceDate: '2026-09-28',
    serviceType: 'Cambio de aceite',
    createdAt: '2026-09-28T09:00:00Z',
    isSample: true,
  },
];

const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: '1234',
};

export const storageService = {
  // Clients
  getClients(): Client[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
        return INITIAL_CLIENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CLIENTS;
    }
  },

  addClient(clientData: Omit<Client, 'id' | 'createdAt'>): Client {
    const clients = this.getClients();
    const newClient: Client = {
      ...clientData,
      id: 'cli-' + Date.now(),
      createdAt: new Date().toISOString(),
      isSample: false,
    };
    const updated = [newClient, ...clients];
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updated));
    return newClient;
  },

  findClientById(identification: string): Client | undefined {
    const clients = this.getClients();
    return clients.find((c) => c.identification.trim().toLowerCase() === identification.trim().toLowerCase());
  },

  // Cars
  getCars(): Car[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CARS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(INITIAL_CARS));
        return INITIAL_CARS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CARS;
    }
  },

  addCar(carData: Omit<Car, 'id' | 'createdAt'>): Car {
    const cars = this.getCars();
    const newCar: Car = {
      ...carData,
      plate: carData.plate.trim().toUpperCase(),
      id: 'car-' + Date.now(),
      createdAt: new Date().toISOString(),
      isSample: false,
    };
    const updated = [newCar, ...cars];
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(updated));
    return newCar;
  },

  findCarByPlate(plate: string): Car | undefined {
    const cars = this.getCars();
    return cars.find((c) => c.plate.trim().toUpperCase() === plate.trim().toUpperCase());
  },

  // Services
  getServices(): ServiceRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
        return INITIAL_SERVICES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SERVICES;
    }
  },

  addService(serviceData: Omit<ServiceRecord, 'id' | 'createdAt'>): ServiceRecord {
    const services = this.getServices();
    const newService: ServiceRecord = {
      ...serviceData,
      plate: serviceData.plate.trim().toUpperCase(),
      clientIdentification: serviceData.clientIdentification.trim(),
      id: 'srv-' + Date.now(),
      createdAt: new Date().toISOString(),
      isSample: false,
    };
    const updated = [newService, ...services];
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
    return newService;
  },

  getServicesByPlate(plate: string): ServiceRecord[] {
    const services = this.getServices();
    const cleanPlate = plate.trim().toUpperCase();
    return services.filter((s) => s.plate.trim().toUpperCase() === cleanPlate);
  },

  // Relational Validation
  validateRelationship(plate: string, clientIdentification: string): { valid: boolean; errorKey?: string } {
    const car = this.findCarByPlate(plate);
    if (!car) {
      return { valid: false, errorKey: 'alert.plateNotFound' };
    }
    const client = this.findClientById(clientIdentification);
    if (!client) {
      return { valid: false, errorKey: 'alert.clientNotFound' };
    }
    return { valid: true };
  },

  // Authentication
  getCredentials(): { username: string; password: string } {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(DEFAULT_CREDENTIALS));
        return DEFAULT_CREDENTIALS;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_CREDENTIALS;
    }
  },

  setCredentials(credentials: { username: string; password: string }) {
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(credentials));
  },

  login(username: string, pass: string): boolean {
    const creds = this.getCredentials();
    if (username.trim() === creds.username && pass === creds.password) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ loggedIn: true, user: username }));
      return true;
    }
    return false;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  isAuthenticated(): boolean {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!session) return false;
      const parsed = JSON.parse(session);
      return Boolean(parsed.loggedIn);
    } catch {
      return false;
    }
  },

  // Reset to initial demo data
  resetAll() {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(INITIAL_CARS));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(DEFAULT_CREDENTIALS));
  },
};
