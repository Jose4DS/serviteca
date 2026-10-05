# Serviteca ADSO

Sistema de administración de clientes, carros y servicios para una serviteca (cambio de aceite, alineación, sincronización y lavado).

Proyecto desarrollado como prototipo funcional de escritorio (1280 × 720 px) para el programa ADSO del SENA.

**Integrante:** Jose David Gomez Saavedra

---

## Tecnologías

| Herramienta | Versión | Uso |
|---|---|---|
| React | 19 | UI y gestión de estado |
| TypeScript | 5.x | Tipado estático |
| Vite | 6.x | Bundler y servidor de desarrollo |
| Tailwind CSS | 4.x | Utilidades de estilo |
| localStorage | API nativa | Persistencia de datos en el navegador |
| Web Speech API | API nativa | Lectura en voz alta (TTS) |

Sin servidor ni base de datos real. Todos los datos se guardan en el `localStorage` del navegador.

---

## Instalación y ejecución

### Requisitos

- Node.js ≥ 18
- npm ≥ 9

### Pasos

```bash
# 1. Entrar a la carpeta del proyecto
cd guia3

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

El servidor queda disponible en `http://localhost:3001`.

> **Credenciales de demostración:** usuario `admin`, contraseña `1234`

---

## Estructura del proyecto

```
guia3/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx                   # Enrutador principal
    ├── main.tsx                  # Punto de entrada
    ├── index.css                 # Estilos globales
    ├── types/
    │   └── index.ts              # Tipos: Cliente, Carro, Servicio, Screen
    ├── context/
    │   └── AccessibilityContext.tsx   # Idioma, TTS, Braille
    ├── services/
    │   └── storage.ts            # CRUD sobre localStorage
    ├── utils/
    │   ├── i18n.ts               # Traducciones ES / EN
    │   └── braille.ts            # Conversión texto → Braille Unicode
    ├── components/
    │   ├── Logo.tsx              # Logo SVG (caoba + verde)
    │   ├── Header.tsx            # Encabezado con logo y título
    │   ├── PageLayout.tsx        # Marco 1280×720: Header + contenido + panel
    │   ├── AccessibilityPanel.tsx # Panel lateral: Traductor, TTS, Braille
    │   ├── MahoganyButton.tsx    # Botón reutilizable (caoba / verde)
    │   ├── MahoganyInput.tsx     # Campo de texto reutilizable
    │   └── MessageBox.tsx        # Mensajes de éxito / error / aviso
    └── screens/
        ├── LoginScreen.tsx       # Inicio de sesión
        ├── MainMenuScreen.tsx    # Menú principal con submenús
        ├── ClientAddScreen.tsx   # Registrar cliente
        ├── CarAddScreen.tsx      # Registrar carro + vista previa imagen
        ├── ServiceAddScreen.tsx  # Registrar servicio (con validación)
        ├── ServiceQueryScreen.tsx # Consultar servicios por placa
        ├── ListViewScreen.tsx    # Listar clientes / carros / servicios
        └── HelpModal.tsx         # Ayuda: FAQ, llamar técnico, reportar
```

---

## Funcionalidades

### Pantallas

| Pantalla | Descripción |
|---|---|
| **Inicio de sesión** | Recuadro de ingreso, contraseña oculta/visible, mensaje de error en amarillo |
| **Menú principal** | Menú con Clientes, Carros, Servicios, Ayuda y Salir; submenús Agregar, Consultar y Listar |
| **Registrar cliente** | Formulario con ID, nombres, apellidos, correo y celular. Mensajes `¡Error!` y `¡Guardado!` |
| **Registrar carro** | Placa, marca y modelo. Botón "Subir imagen" con vista previa |
| **Registrar servicio** | Placa, ID cliente, fecha (calendario), tipo (4 opciones). Valida que placa y cliente existan |
| **Consultar servicios** | Búsqueda por placa, tabla de resultados, mensaje cuando no hay servicios |
| **Listar registros** | Tablas completas de clientes, carros y servicios |
| **Ayuda** | FAQ acordeón, contacto de técnico, formulario para reportar problema |

### Panel de accesibilidad (todas las pantallas)

| Herramienta | Función |
|---|---|
| **Traductor** | Cambia el idioma de la interfaz: Español / English |
| **Lectura en voz alta (TTS)** | Lee textos con la Web Speech API del navegador |
| **Braille** | Convierte texto a caracteres Braille Unicode (letras, números, signos básicos) |

### Diseño

- Tamaño fijo: **1280 × 720 px**
- Fondo gris claro (`#e8ece8`), paneles verdes (`#4a7c59` / `#3a6b47`), detalles caoba (`#6B2A2A`)
- Tipografía: **Times New Roman**
- Logo SVG propio (llave inglesa + gota de aceite)

---

## Fuera del alcance (v1)

- Servidor o base de datos real
- Roles de usuario o recuperación de contraseña
- Facturación, inventario o pagos
- Versión para dispositivos móviles

---

## Notas sobre los datos

Los datos se guardan en `localStorage` bajo las claves `srv_clientes`, `srv_carros` y `srv_servicios`. Si el usuario borra los datos del navegador, la información se pierde. Para la demostración se recomienda registrar primero un cliente y un carro antes de intentar registrar un servicio.

---

## Cumplimiento de requisitos

Ver tabla completa al final de este archivo.

| Módulo | Total | SI | NO | ADI |
|---|:---:|:---:|:---:|:---:|
| Inicio de sesión | 9 | 9 | 0 | 0 |
| Pantalla principal | 10 | 10 | 0 | 0 |
| Registrar cliente | 9 | 9 | 0 | 0 |
| Registrar carro | 11 | 11 | 0 | 0 |
| Registrar servicio | 11 | 11 | 0 | 0 |
| Consultar servicios | 8 | 8 | 0 | 0 |
| Accesibilidad | 7 | 7 | 0 | 0 |
| Generales de diseño | 7 | 7 | 0 | 0 |
| **Total** | **72** | **72** | **0** | **0** |

Detalle completo en la sección [Matriz de requisitos](#matriz-de-requisitos) más abajo.

---

## Matriz de requisitos

### Módulo 1 — Inicio de sesión (9 req.)

| # | Requisito | Estado |
|---|---|:---:|
| 1.1 | Mostrar recuadro de ingreso de usuario y contraseña | SI |
| 1.2 | Ocultar la contraseña por defecto | SI |
| 1.3 | Botón para mostrar / ocultar contraseña | SI |
| 1.4 | Mostrar mensaje de error cuando los datos son incorrectos | SI |
| 1.5 | El mensaje de error se muestra en color amarillo | SI |
| 1.6 | Limpiar el campo de error al empezar a escribir de nuevo | SI |
| 1.7 | Incluir usuario de demostración (admin / 1234) | SI |
| 1.8 | Mostrar pista de las credenciales de demo en pantalla | SI |
| 1.9 | Panel de accesibilidad visible en la pantalla de login | SI |

### Módulo 2 — Pantalla principal (10 req.)

| # | Requisito | Estado |
|---|---|:---:|
| 2.1 | Mostrar menú con opción Clientes | SI |
| 2.2 | Mostrar menú con opción Carros | SI |
| 2.3 | Mostrar menú con opción Servicios | SI |
| 2.4 | Mostrar menú con opción Ayuda | SI |
| 2.5 | Mostrar menú con opción Salir | SI |
| 2.6 | Submenú Agregar disponible en Clientes, Carros y Servicios | SI |
| 2.7 | Submenú Consultar disponible en Servicios | SI |
| 2.8 | Submenú Listar disponible en Clientes, Carros y Servicios | SI |
| 2.9 | Submenús se despliegan al hacer clic en el ítem del menú | SI |
| 2.10 | Panel de accesibilidad visible en el menú principal | SI |

### Módulo 3 — Registrar cliente (9 req.)

| # | Requisito | Estado |
|---|---|:---:|
| 3.1 | Campo de identificación | SI |
| 3.2 | Campo de nombres | SI |
| 3.3 | Campo de apellidos | SI |
| 3.4 | Campo de correo electrónico | SI |
| 3.5 | Campo de celular | SI |
| 3.6 | Mostrar `¡Error!` si algún campo está vacío al guardar | SI |
| 3.7 | Mostrar `¡Guardado!` cuando el registro se guarda con éxito | SI |
| 3.8 | Botón Guardar funcional | SI |
| 3.9 | Botón Regresar vuelve al menú principal | SI |

### Módulo 4 — Registrar carro (11 req.)

| # | Requisito | Estado |
|---|---|:---:|
| 4.1 | Campo de placa | SI |
| 4.2 | Campo de marca | SI |
| 4.3 | Campo de modelo | SI |
| 4.4 | Placa se convierte automáticamente a mayúsculas | SI |
| 4.5 | Botón "Subir imagen" para adjuntar foto del carro | SI |
| 4.6 | Vista previa de la imagen seleccionada | SI |
| 4.7 | La imagen se guarda asociada al carro (base64) | SI |
| 4.8 | Mostrar `¡Error!` si faltan campos obligatorios | SI |
| 4.9 | Mostrar `¡Guardado!` al guardar correctamente | SI |
| 4.10 | Botón Guardar funcional | SI |
| 4.11 | Botón Regresar vuelve al menú principal | SI |

### Módulo 5 — Registrar servicio (11 req.)

| # | Requisito | Estado |
|---|---|:---:|
| 5.1 | Campo de placa del carro | SI |
| 5.2 | Campo de identificación del cliente | SI |
| 5.3 | Campo de fecha con selector de calendario nativo | SI |
| 5.4 | Selector de tipo de servicio: Cambio de aceite | SI |
| 5.5 | Selector de tipo de servicio: Sincronización | SI |
| 5.6 | Selector de tipo de servicio: Alineación | SI |
| 5.7 | Selector de tipo de servicio: Lavado | SI |
| 5.8 | Validar que la placa exista antes de guardar | SI |
| 5.9 | Validar que el cliente exista antes de guardar | SI |
| 5.10 | Mostrar `¡Guardado!` al registrar correctamente | SI |
| 5.11 | Botón Regresar vuelve al menú principal | SI |

### Módulo 6 — Consultar servicios (8 req.)

| # | Requisito | Estado |
|---|---|:---:|
| 6.1 | Campo de búsqueda por placa | SI |
| 6.2 | Botón Buscar | SI |
| 6.3 | Mostrar tabla con los servicios encontrados | SI |
| 6.4 | Columna Fecha en la tabla | SI |
| 6.5 | Columna Tipo de servicio en la tabla | SI |
| 6.6 | Columna Cliente en la tabla | SI |
| 6.7 | Mostrar `Este carro no tiene servicios registrados` cuando no hay resultados | SI |
| 6.8 | Botón Regresar vuelve al menú principal | SI |

### Módulo 7 — Accesibilidad (7 req.)

| # | Requisito | Estado |
|---|---|:---:|
| 7.1 | Panel de accesibilidad visible en todas las pantallas | SI |
| 7.2 | Herramienta Traductor con mínimo 2 idiomas | SI |
| 7.3 | El idioma cambia toda la interfaz en tiempo real | SI |
| 7.4 | Herramienta de Lectura en voz alta (TTS) | SI |
| 7.5 | TTS lee el texto que el usuario escriba o el sistema anuncie | SI |
| 7.6 | Herramienta de Braille disponible | SI |
| 7.7 | Braille convierte letras, números y signos básicos | SI |

### Módulo 8 — Requisitos generales de diseño (7 req.)

| # | Requisito | Estado |
|---|---|:---:|
| 8.1 | Tamaño de pantalla 1280 × 720 px | SI |
| 8.2 | Fondo gris claro en todas las pantallas | SI |
| 8.3 | Paneles en color verde en todas las pantallas | SI |
| 8.4 | Detalles en color caoba en todas las pantallas | SI |
| 8.5 | Tipografía Times New Roman en toda la interfaz | SI |
| 8.6 | Logo de la serviteca visible en todas las pantallas | SI |
| 8.7 | Panel de accesibilidad ubicado al lado derecho | SI |
