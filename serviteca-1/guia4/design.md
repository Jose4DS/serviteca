# Diseño técnico — Serviteca ADSO v2 (guia4)

**Versión:** 2.0  
**Autor:** Jose David Gomez Saavedra  
**Fecha:** Octubre 2026  
**Estado:** Aprobado para implementación

---

## 0. Principio general

`guia4` parte de una **copia exacta de `guia3`**. La primera tarea de
implementación es ese copiado; luego cada tarea posterior modifica solo
los archivos que le corresponden. `guia3` nunca se toca.

Las tres claves de `localStorage` (`srv_clientes`, `srv_carros`,
`srv_servicios`) no cambian de nombre ni de forma. Todo lo que ya guardó
guia3 se leerá sin migración desde guia4.

---

## 1. Cambios en `src/types/index.ts`

### 1.1 `Idioma` — agregar Português

```ts
// ANTES (guia3)
export type Idioma = 'es' | 'en';

// DESPUÉS (guia4)
export type Idioma = 'es' | 'en' | 'pt';
```

### 1.2 `Screen` — agregar rutas nuevas

```ts
// ANTES (guia3)
export type Screen =
  | 'login' | 'main'
  | 'client-add' | 'client-list'
  | 'car-add'    | 'car-list'
  | 'service-add'| 'service-query' | 'service-list'
  | 'help';

// DESPUÉS (guia4) — se agregan las tres rutas de edición
export type Screen =
  | 'login' | 'main'
  | 'client-add'  | 'client-edit'  | 'client-list'
  | 'car-add'     | 'car-edit'     | 'car-list'
  | 'service-add' | 'service-edit' | 'service-query' | 'service-list'
  | 'help';
```

### 1.3 Tipo de parámetro de navegación con payload

`App.tsx` en guia3 pasa solo `Screen`. En guia4 necesitamos pasar también
el ID del registro a editar. Se añade un tipo helper sin romper los sitios
que solo pasan el nombre de la pantalla:

```ts
// Nuevo en guia4 — src/types/index.ts
export interface NavPayload {
  screen: Screen;
  editId?: string;   // identificacion (cliente) | placa (carro) | id (servicio)
}
```

`App.tsx` cambiará su función `navigate` para aceptar `Screen | NavPayload`.
Todos los componentes que hoy llaman `onNavigate('main')` seguirán funcionando
sin cambios porque el parámetro sigue siendo compatible.

---

## 2. Cambios en `src/services/storage.ts`

Se añaden las funciones que hoy faltan. Las existentes **no se modifican**.

```ts
// ── Nuevas funciones ───────────────────────────────────────────────────────

// Clientes
export function updateCliente(c: Cliente): void {
  // Sustituye el registro con la misma identificacion; falla silencioso si no existe
  const list = getClientes().map(x => x.identificacion === c.identificacion ? c : x);
  saveAll(KEYS.CLIENTES, list);
}

export function deleteCliente(id: string): void {
  saveAll(KEYS.CLIENTES, getClientes().filter(x => x.identificacion !== id));
  // Cascada: eliminar servicios del cliente
  saveAll(KEYS.SERVICIOS, getServicios().filter(s => s.idCliente !== id));
}

export function countServiciosByCliente(id: string): number {
  return getServicios().filter(s => s.idCliente === id).length;
}

// Carros
export function updateCarro(c: Carro): void {
  const list = getCarros().map(x => x.placa === c.placa ? c : x);
  saveAll(KEYS.CARROS, list);
}

export function deleteCarro(placa: string): void {
  saveAll(KEYS.CARROS, getCarros().filter(x => x.placa !== placa));
  // Cascada: eliminar servicios del carro
  saveAll(KEYS.SERVICIOS, getServicios().filter(s => s.placa !== placa));
}

export function countServiciosByPlaca(placa: string): number {
  return getServicios().filter(
    s => s.placa.toUpperCase() === placa.toUpperCase()
  ).length;
}

// Servicios
export function updateServicio(s: Servicio): void {
  const list = getServicios().map(x => x.id === s.id ? s : x);
  saveAll(KEYS.SERVICIOS, list);
}

export function deleteServicio(id: string): void {
  saveAll(KEYS.SERVICIOS, getServicios().filter(s => s.id !== id));
}

export function findServicio(id: string): Servicio | undefined {
  return getServicios().find(s => s.id === id);
}
```

**Invariante de cascada:** `deleteCliente` y `deleteCarro` eliminan en una
sola llamada a `saveAll` por entidad, evitando inconsistencias si hay un
error entre dos escrituras.

---

## 3. Cambios en `src/utils/i18n.ts`

### 3.1 Ampliar el tipo `Idioma`

El catálogo pasa de `Record<Idioma, Translations>` con dos entradas a tres.

### 3.2 Claves nuevas (iguales en los tres idiomas)

```
// Acciones de tabla
'list.edit'            Editar / Edit / Editar
'list.delete'          Eliminar / Delete / Excluir
'list.actions'         Acciones / Actions / Ações

// Mensajes de retroalimentación
'msg.updated'          ¡Actualizado! / Updated! / Atualizado!
'msg.deleted'          ¡Eliminado! / Deleted! / Excluído!
'msg.errorEmail'       ¡Error! Correo electrónico inválido. / ... / ...
'msg.errorPhone'       ¡Error! El celular debe tener 10 dígitos. / ... / ...
'msg.errorPlate'       ¡Error! Formato de placa inválido (ej: ABC123). / ... / ...
'msg.errorDateFuture'  ¡Error! La fecha no puede ser futura. / ... / ...

// Filtros de listado
'list.search'          Buscar... / Search... / Pesquisar...
'list.clear'           Limpiar / Clear / Limpar
'list.noResults'       No se encontraron registros con ese criterio. / ... / ...
'list.filterType'      Tipo / Type / Tipo
'list.filterFrom'      Desde / From / De
'list.filterTo'        Hasta / To / Até
'list.clearFilters'    Limpiar filtros / Clear filters / Limpar filtros
'list.page'            Página / Page / Página
'list.of'              de / of / de
'list.prev'            Anterior / Previous / Anterior
'list.next'            Siguiente / Next / Próximo

// Confirmación de eliminación
'confirm.title'        ¿Confirmar eliminación? / Confirm deletion? / Confirmar exclusão?
'confirm.yes'          Sí, eliminar / Yes, delete / Sim, excluir
'confirm.cancel'       Cancelar / Cancel / Cancelar
'confirm.cascade'      Este registro tiene {n} servicio(s) asociado(s)... / ...

// Historial (consulta)
'query.notRegistered'  Esta placa no está registrada en el sistema. / ... / ...
'query.carCard'        Ficha del carro / Car details / Ficha do veículo
'query.clientCard'     Cliente(s) asociado(s) / Associated client(s) / Cliente(s) associado(s)

// Editar
'client.edit'          Editar cliente / Edit client / Editar cliente
'car.edit'             Editar carro / Edit car / Editar veículo
'service.edit'         Editar servicio / Edit service / Editar serviço
```

### 3.3 Catálogo Português (pt)

Todas las 60+ claves existentes de ES se traducen a PT-BR. La función `t()`
no cambia su firma; solo se agrega `pt` al mapa `catalogs`.

### 3.4 TTS locale por idioma

En `AccessibilityContext.tsx`, la lógica de idioma en `speak()` pasa de
condición binaria a lookup:

```ts
// ANTES
utt.lang = idioma === 'es' ? 'es-CO' : 'en-US';

// DESPUÉS
const LANG_MAP: Record<Idioma, string> = {
  es: 'es-CO',
  en: 'en-US',
  pt: 'pt-BR',
};
utt.lang = LANG_MAP[idioma];
```

---

## 4. Nuevos componentes

### 4.1 `ConfirmDialog` — `src/components/ConfirmDialog.tsx`

Modal reutilizable para confirmar eliminaciones.

**Props:**
```ts
interface ConfirmDialogProps {
  open: boolean;
  title: string;              // "¿Confirmar eliminación?"
  description: string;        // Resumen del registro (placa, nombre, etc.)
  warning?: string;           // Texto de advertencia de cascada (opcional)
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;      // Default: t('confirm.yes', idioma)
  cancelLabel?: string;       // Default: t('confirm.cancel', idioma)
}
```

**Comportamiento:**
- Cuando `open` es `false`, no renderiza nada (`return null`).
- Cuando `open` es `true`, renderiza un overlay `position: fixed, inset: 0`
  con fondo semitransparente (`rgba(0,0,0,0.45)`) y el panel del modal centrado.
- El panel tiene `role="dialog"`, `aria-modal="true"`, `aria-labelledby` apuntando
  al `<h2>` del título.
- Al montar con `open = true`, el foco se mueve al botón **Cancelar** (el más
  seguro). `Tab` y `Shift+Tab` ciclan solo entre los dos botones (foco trampa).
- `Escape` llama a `onCancel`.
- El botón **Sí, eliminar** es caoba (`#6B2A2A`); **Cancelar** es verde (`#4a7c59`).
- El `warning` se muestra en un recuadro amarillo si está presente.

**Dimensiones:** panel de 400 × auto px, centrado en el frame de 1280×720.

### 4.2 `useToast` — `src/hooks/useToast.ts`

Hook liviano para los mensajes auto-descartables (RF-13).

```ts
interface Toast {
  message: string;
  type: 'success' | 'error' | 'warning';
}

// Retorna: { toast, showToast }
// showToast('¡Actualizado!', 'success') → muestra por 3 s y limpia solo
function useToast(): { toast: Toast | null; showToast: (msg: string, type: Toast['type']) => void }
```

Internamente usa `useState` + `useEffect` con `setTimeout(3000)`.
El timer se limpia si el componente se desmonta o si llega un nuevo toast
antes de que expire el anterior.

Los componentes que hoy usan `status` local (`'idle' | 'saved' | 'error'`)
migrarán a `useToast`. El toast se renderiza con el `MessageBox` existente,
flotando en la parte superior del panel de formulario (`position: sticky, top: 0`).

### 4.3 `useListFilter` — `src/hooks/useListFilter.ts`

Hook genérico que centraliza la lógica de búsqueda + paginación de los
tres listados (RF-03, RF-06, RF-09, RF-14).

```ts
interface ListFilterOptions<T> {
  data: T[];
  pageSize?: number;            // default 10
  filterFn: (item: T, query: string) => boolean;
}

interface ListFilterResult<T> {
  query: string;
  setQuery: (q: string) => void;
  page: number;
  totalPages: number;
  pageItems: T[];               // solo los ítems de la página actual
  goNext: () => void;
  goPrev: () => void;
  reset: () => void;            // limpia query y vuelve a página 1
}
```

El filtrado ocurre sobre `data` ya en memoria; `pageItems` se deriva
sin releer `localStorage`.

### 4.4 `Pagination` — `src/components/Pagination.tsx`

Componente de UI para los controles de paginación.

```ts
interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  idioma: Idioma;
}
```

Muestra: `[← Anterior]  Página 2 de 5  [Siguiente →]`.
Botones deshabilitados en los extremos.

---

## 5. Cambios en pantallas existentes

### 5.1 `ListViewScreen.tsx` → **reescritura** `src/screens/ListViewScreen.tsx`

Este archivo en guia3 exporta un único componente con `mode` como prop.
En guia4 se mantiene el mismo contrato de props pero el interior se rehace
completamente para incorporar búsqueda, paginación y acciones por fila.

**Nuevo contrato de props:**
```ts
interface Props {
  mode: 'client-list' | 'car-list' | 'service-list';
  onNavigate: (target: Screen | NavPayload) => void;
}
```

**Estructura interna para cada modo:**

```
ListViewScreen
├── Barra de herramientas
│   ├── Título
│   ├── Campo de búsqueda (texto libre)        ← RF-03, RF-06
│   ├── [solo service-list] Selector Tipo      ← RF-09
│   ├── [solo service-list] Desde / Hasta      ← RF-09
│   ├── Botón Limpiar (o Limpiar filtros)
│   └── Botón Regresar
├── Tabla con filas
│   └── Cada fila: datos + botón Editar + botón Eliminar
├── Mensaje vacío ("No hay registros" / "No coincide el criterio")
├── Paginación (Pagination component)
└── ConfirmDialog (portal dentro del mismo componente)
```

**Estado local del componente:**
```ts
const [confirmTarget, setConfirmTarget] = useState<
  { type: 'client'; id: string } |
  { type: 'car'; id: string } |
  { type: 'service'; id: string } |
  null
>(null);

const [data, setData] = useState(() => loadByMode(mode)); // carga inicial
const { toast, showToast } = useToast();
const { query, setQuery, pageItems, page, totalPages,
        goNext, goPrev, reset, /* filtros extra */ } = useListFilter({ data, filterFn });
```

**Flujo de eliminación:**
1. Usuario pulsa 🗑️ en una fila → `setConfirmTarget({ type, id })`.
2. `ConfirmDialog` se abre con `open={confirmTarget !== null}`.
3. Usuario confirma → se llama la función de delete correspondiente →
   `setData` se actualiza → `showToast('¡Eliminado!', 'success')` →
   `setConfirmTarget(null)`.
4. Usuario cancela → `setConfirmTarget(null)`.

**Flujo de edición:**
- Usuario pulsa ✏️ → `onNavigate({ screen: 'client-edit', editId: c.identificacion })`.

### 5.2 `ServiceQueryScreen.tsx` → **ampliar** `src/screens/ServiceQueryScreen.tsx`

Se añade, entre el buscador y la tabla de servicios, una sección condicional
que aparece solo si la búsqueda devuelve resultados o la placa existe:

```
ServiceQueryScreen (después de buscar)
├── Buscador (sin cambios)
└── [si searched]
    ├── [si carro existe] FichaCarroCard
    │   ├── Imagen (o ícono 🚗 si no hay)
    │   ├── Placa, marca, modelo
    └── [si carro no existe] mensaje "Esta placa no está registrada"
    ├── [si carro existe y tiene servicios]
    │   ├── FichaClientesCard (clientes únicos de los servicios)
    │   │   └── Por cada cliente: nombres, apellidos, correo, celular
    │   └── Tabla de servicios (sin cambios)
    └── [si carro existe pero sin servicios]
        └── "Este carro no tiene servicios registrados."
```

**Componentes internos nuevos** (dentro del mismo archivo):
- `FichaCarroCard` — panel verde con foto, placa, marca, modelo.
- `FichaClientesCard` — lista de clientes únicos extraídos de los servicios.

### 5.3 `ClientAddScreen.tsx` — **validaciones adicionales** (RNF-01, RNF-02)

Se agrega estado de error por campo (`fieldErrors`) y validación `onBlur`:

```ts
const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Cliente, string>>>({});

function validateField(field: keyof Cliente, value: string): string | null {
  if (field === 'correo') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : t('msg.errorEmail', idioma);
  }
  if (field === 'celular') {
    return /^\d{10}$/.test(value.replace(/[\s-]/g, '')) ? null : t('msg.errorPhone', idioma);
  }
  return value.trim() === '' ? t('client.error', idioma) : null;
}
```

El borde del input cambia a rojo si `fieldErrors[field]` es no nulo.
`useToast` reemplaza el estado `'saved' | 'error'`.

### 5.4 `CarAddScreen.tsx` — **validación de placa** (RNF-03)

Igual que 5.3 pero solo para el campo placa:

```ts
const PLACA_RE = /^[A-Z]{3}[0-9]{2,3}[A-Z]?$/;
```

### 5.5 `ServiceAddScreen.tsx` — **validación de fecha futura** (RNF-04)

```ts
function validateFecha(value: string): string | null {
  if (!value) return t('service.error', idioma);
  return value > new Date().toISOString().slice(0, 10)
    ? t('msg.errorDateFuture', idioma)
    : null;
}
```

---

## 6. Nuevas pantallas de edición

Las tres pantallas de edición son variantes de los formularios de registro.
Comparten estructura pero reciben el registro a editar como prop.

### 6.1 `ClientEditScreen.tsx`

```ts
interface Props {
  editId: string;                        // identificacion del cliente
  onNavigate: (s: Screen | NavPayload) => void;
}
```

- Carga el cliente con `findCliente(editId)` al montar.
- Si no lo encuentra, muestra un error y un botón para volver.
- El campo `identificacion` se muestra en un `<div>` de solo lectura (no `<input>`).
- Los demás campos son editables con las mismas validaciones de ClientAddScreen.
- Al guardar llama `updateCliente(form)` → `showToast('¡Actualizado!', 'success')` →
  `onNavigate('client-list')` tras 1 segundo.

### 6.2 `CarEditScreen.tsx`

```ts
interface Props {
  editId: string;   // placa del carro
  onNavigate: (s: Screen | NavPayload) => void;
}
```

- Igual que ClientEditScreen pero para `Carro`.
- El campo `placa` es de solo lectura.
- Soporta reemplazar la imagen: al subir una nueva, el `imagenUrl` se actualiza en memoria; el anterior se descarta.

### 6.3 `ServiceEditScreen.tsx`

```ts
interface Props {
  editId: string;   // id del servicio
  onNavigate: (s: Screen | NavPayload) => void;
}
```

- Carga con `findServicio(editId)`.
- Todos los campos son editables (placa, idCliente, fecha, tipo).
- Aplica las mismas validaciones que `ServiceAddScreen` (placa existe, cliente existe, fecha no futura).
- Al guardar llama `updateServicio(form)` → toast → vuelve a `'service-list'`.

---

## 7. Cambios en `App.tsx`

### 7.1 Tipo de navegación

```ts
// Nueva firma que acepta ambas formas
type NavTarget = Screen | NavPayload;

const [screen, setScreen]   = useState<Screen>('login');
const [editId, setEditId]   = useState<string | undefined>(undefined);

function navigate(target: NavTarget) {
  const s = typeof target === 'string' ? target : target.screen;
  const id = typeof target === 'string' ? undefined : target.editId;
  if (s !== 'login' && !loggedIn) { setScreen('login'); return; }
  setScreen(s);
  setEditId(id);
}
```

### 7.2 Nuevas rutas en el árbol JSX

```tsx
{loggedIn && screen === 'client-edit' && editId && (
  <ClientEditScreen editId={editId} onNavigate={navigate} />
)}
{loggedIn && screen === 'car-edit' && editId && (
  <CarEditScreen editId={editId} onNavigate={navigate} />
)}
{loggedIn && screen === 'service-edit' && editId && (
  <ServiceEditScreen editId={editId} onNavigate={navigate} />
)}
```

Las rutas existentes (`client-list`, `car-list`, `service-list`) actualizan
su prop a `onNavigate={navigate}` para soportar el nuevo tipo.

---

## 8. Estructura de archivos final de guia4

```
guia4/
├── requirements.md           ← ya existe
├── design.md                 ← este documento
├── index.html                ← copiado de guia3, sin cambios
├── package.json              ← copiado de guia3, sin cambios
├── tsconfig.json             ← copiado de guia3, sin cambios
├── vite.config.ts            ← copiado de guia3, sin cambios
└── src/
    ├── App.tsx               ← MODIFICADO (navegación, rutas nuevas)
    ├── main.tsx              ← copiado, sin cambios
    ├── index.css             ← copiado, sin cambios
    │
    ├── types/
    │   └── index.ts          ← MODIFICADO (Idioma + pt, Screen + edits, NavPayload)
    │
    ├── context/
    │   └── AccessibilityContext.tsx   ← MODIFICADO (LANG_MAP con pt-BR)
    │
    ├── services/
    │   └── storage.ts        ← MODIFICADO (update*, delete*, count*)
    │
    ├── utils/
    │   ├── i18n.ts           ← MODIFICADO (claves nuevas + catálogo pt)
    │   └── braille.ts        ← copiado, sin cambios
    │
    ├── hooks/                ← NUEVA carpeta
    │   ├── useToast.ts       ← NUEVO
    │   └── useListFilter.ts  ← NUEVO
    │
    ├── components/
    │   ├── Logo.tsx          ← copiado, sin cambios
    │   ├── Header.tsx        ← copiado, sin cambios
    │   ├── PageLayout.tsx    ← copiado, sin cambios
    │   ├── AccessibilityPanel.tsx  ← copiado, sin cambios
    │   ├── MahoganyButton.tsx      ← copiado, sin cambios
    │   ├── MahoganyInput.tsx       ← copiado, sin cambios
    │   ├── MessageBox.tsx          ← copiado, sin cambios
    │   ├── ConfirmDialog.tsx ← NUEVO
    │   └── Pagination.tsx    ← NUEVO
    │
    └── screens/
        ├── LoginScreen.tsx         ← copiado, sin cambios
        ├── MainMenuScreen.tsx      ← copiado, sin cambios
        ├── HelpModal.tsx           ← copiado, sin cambios
        ├── ClientAddScreen.tsx     ← MODIFICADO (fieldErrors, useToast, validaciones)
        ├── ClientEditScreen.tsx    ← NUEVO
        ├── CarAddScreen.tsx        ← MODIFICADO (validación placa, useToast)
        ├── CarEditScreen.tsx       ← NUEVO
        ├── ServiceAddScreen.tsx    ← MODIFICADO (validación fecha, useToast)
        ├── ServiceEditScreen.tsx   ← NUEVO
        ├── ListViewScreen.tsx      ← REESCRITO (búsqueda, filtros, paginación, CRUD)
        └── ServiceQueryScreen.tsx  ← MODIFICADO (fichas carro y cliente)
```

**Leyenda:**
- `copiado, sin cambios` → copia literal de guia3 en la tarea 1; no vuelve a tocarse.
- `MODIFICADO` → copia de guia3 + cambios descritos en este documento.
- `NUEVO` → archivo que no existe en guia3.
- `REESCRITO` → mismo nombre y contrato de props, pero el interior cambia sustancialmente.

---

## 9. Plan de tareas de implementación

El código se construye en **5 tareas secuenciales**. Cada tarea es autónoma
y verificable antes de pasar a la siguiente.

| Tarea | Archivos que toca | Requisitos cubiertos |
|:---:|---|---|
| **T-1** | Copiar guia3 → guia4; `types/index.ts`; `services/storage.ts`; `utils/i18n.ts`; `context/AccessibilityContext.tsx` | RNF-05, RNF-09, RF-12 (idioma base) |
| **T-2** | `hooks/useToast.ts`; `hooks/useListFilter.ts`; `components/ConfirmDialog.tsx`; `components/Pagination.tsx` | RF-11, RF-13, RF-14 (infraestructura) |
| **T-3** | `screens/ClientAddScreen.tsx`; `screens/CarAddScreen.tsx`; `screens/ServiceAddScreen.tsx` | RNF-01, RNF-02, RNF-03, RNF-04 |
| **T-4** | `screens/ListViewScreen.tsx`; `screens/ClientEditScreen.tsx`; `screens/CarEditScreen.tsx`; `screens/ServiceEditScreen.tsx` | RF-01–RF-09, RF-11, RF-13, RF-14 |
| **T-5** | `screens/ServiceQueryScreen.tsx`; `App.tsx` | RF-10, RNF-06, RNF-07 |

---

## 10. Criterios de "tarea terminada"

Una tarea se considera completa cuando:

1. El proyecto compila sin errores TypeScript (`tsc --noEmit` sin salida).
2. El navegador carga sin errores en la consola.
3. Los datos pre-existentes de guia3 (si los hay) siguen siendo legibles.
4. Los criterios de aceptación de los requisitos cubiertos por esa tarea
   se pueden verificar manualmente en el navegador.
5. El panel de accesibilidad es visible y funcional en todas las pantallas
   afectadas por la tarea.
