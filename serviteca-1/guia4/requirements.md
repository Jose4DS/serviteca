# Requisitos — Serviteca ADSO v2 (guia4)

**Proyecto:** Sistema de administración de clientes, carros y servicios  
**Versión:** 2.0  
**Autor:** Jose David Gomez Saavedra  
**Fecha:** Octubre 2026  
**Estado:** Borrador — pendiente de aprobación

---

## 1. Contexto y punto de partida

`guia4` es la versión 2 del sistema. El código de `guia3` se copiará íntegro
como punto de partida en la primera tarea de implementación (no antes).
**No se modifica ni se borra nada de `guia3`.**

### Lo que ya existe en guia3 (los 72 requisitos siguen vigentes)

| Área | Estado en guia3 |
|---|---|
| Inicio de sesión con mensaje de error en amarillo | ✓ completo |
| Menú principal con submenús Agregar / Consultar / Listar | ✓ completo |
| Registrar cliente (ID, nombres, apellidos, correo, celular) | ✓ completo |
| Registrar carro (placa, marca, modelo, imagen) | ✓ completo |
| Registrar servicio (placa, cliente, fecha, tipo) con validación | ✓ completo |
| Consultar servicios por placa — tabla de resultados | ✓ completo |
| Listados de clientes, carros y servicios (solo lectura) | ✓ completo |
| Ayuda (FAQ, llamar técnico, reportar problema) | ✓ completo |
| Panel de accesibilidad: Traductor ES/EN, TTS, Braille | ✓ completo |
| Diseño: 1280×720 px, gris claro, verde, caoba, Times New Roman | ✓ completo |
| Persistencia en `localStorage` (`srv_clientes`, `srv_carros`, `srv_servicios`) | ✓ completo |

Los listados actuales muestran datos pero **no permiten editar ni eliminar**.
La consulta por placa muestra servicios pero **no muestra datos del carro ni del cliente**.
El traductor soporta **solo ES y EN**.

---

## 2. Pantallas y módulos de guia4

guia4 conserva las 10 pantallas de guia3 y agrega o amplía las siguientes:

| ID | Pantalla / Módulo | Nueva o ampliada |
|---|---|---|
| P-01 | Inicio de sesión | Sin cambios |
| P-02 | Menú principal | Sin cambios |
| P-03 | Registrar cliente | Sin cambios funcionales; agrega validación de formato |
| P-04 | **Editar cliente** | Nueva (se accede desde el listado) |
| P-05 | Registrar carro | Sin cambios funcionales; agrega validación de placa |
| P-06 | **Editar carro** | Nueva (se accede desde el listado) |
| P-07 | Registrar servicio | Sin cambios funcionales; agrega validación de fecha |
| P-08 | **Editar servicio** | Nueva (se accede desde el listado) |
| P-09 | **Listado de clientes** (ampliado) | Agrega búsqueda, filtro, Editar y Eliminar por fila |
| P-10 | **Listado de carros** (ampliado) | Agrega búsqueda, filtro, Editar y Eliminar por fila |
| P-11 | **Listado de servicios** (ampliado) | Agrega búsqueda, filtro, Editar y Eliminar por fila |
| P-12 | **Historial del carro** (ampliado) | Agrega ficha del carro y del cliente propietario |
| P-13 | **Diálogo de confirmación de eliminación** | Nuevo (modal reutilizable) |
| P-14 | Ayuda | Sin cambios |
| P-15 | Panel de accesibilidad | Agrega tercer idioma (Português) |

---

## 3. Requisitos funcionales

### RF-01 — Editar cliente desde el listado
**Descripción:** El usuario puede modificar los datos de un cliente ya registrado.  
**Criterio de aceptación:**
- En la tabla de clientes, cada fila tiene un botón **Editar** (ícono de lápiz).
- Al pulsarlo, se abre el formulario de cliente con los campos pre-rellenos con los datos actuales.
- El campo Identificación **no es editable** (es la clave primaria).
- Al guardar, el registro se actualiza en `localStorage` y se muestra `¡Actualizado!`.
- Si se deja algún campo vacío o con formato incorrecto, se muestra `¡Error!` y no se guarda.
- El botón Regresar vuelve al listado sin guardar cambios.

### RF-02 — Eliminar cliente desde el listado
**Descripción:** El usuario puede eliminar un cliente de la base de datos.  
**Criterio de aceptación:**
- En la tabla de clientes, cada fila tiene un botón **Eliminar** (ícono de papelera).
- Al pulsarlo, aparece el diálogo de confirmación (P-13) con el nombre y la identificación del cliente.
- Si el cliente tiene servicios asociados, el diálogo muestra una advertencia: *"Este cliente tiene N servicio(s) registrado(s). Eliminar el cliente también eliminará esos servicios."*
- Al confirmar, el cliente y sus servicios asociados se eliminan de `localStorage`.
- Al cancelar, no se realiza ningún cambio.
- Tras eliminar, se muestra un mensaje verde `¡Cliente eliminado!` en el listado durante 3 segundos.

### RF-03 — Buscar y filtrar en el listado de clientes
**Descripción:** El usuario puede encontrar rápidamente un cliente.  
**Criterio de aceptación:**
- Sobre la tabla aparece un campo de búsqueda de texto libre que filtra en tiempo real por identificación, nombres o apellidos (sin distinguir mayúsculas).
- El filtro se aplica mientras el usuario escribe; no requiere pulsar Buscar.
- Si no hay coincidencias, la tabla muestra *"No se encontraron clientes con ese criterio."*
- Un botón **Limpiar** (**×**) borra el filtro y restaura la lista completa.

### RF-04 — Editar carro desde el listado
**Descripción:** El usuario puede modificar los datos de un carro ya registrado.  
**Criterio de aceptación:**
- En la tabla de carros, cada fila tiene un botón **Editar**.
- Al pulsarlo, se abre el formulario de carro con los campos pre-rellenos.
- El campo Placa **no es editable**.
- Se puede reemplazar la imagen: al subir una nueva, la vista previa se actualiza y el base64 se sobreescribe.
- Al guardar, el registro se actualiza en `localStorage` y se muestra `¡Actualizado!`.
- El botón Regresar vuelve al listado sin guardar cambios.

### RF-05 — Eliminar carro desde el listado
**Descripción:** El usuario puede eliminar un carro.  
**Criterio de aceptación:**
- Cada fila tiene un botón **Eliminar**.
- El diálogo (P-13) muestra placa, marca y modelo del carro.
- Si el carro tiene servicios, el diálogo advierte: *"Este carro tiene N servicio(s) registrado(s). Eliminar el carro también eliminará esos servicios."*
- Al confirmar, el carro y sus servicios se eliminan de `localStorage`.
- Tras eliminar, se muestra `¡Carro eliminado!` durante 3 segundos.

### RF-06 — Buscar y filtrar en el listado de carros
**Descripción:** El usuario puede encontrar rápidamente un carro.  
**Criterio de aceptación:**
- Campo de búsqueda de texto libre que filtra en tiempo real por placa, marca o modelo.
- Si no hay coincidencias, la tabla muestra *"No se encontraron carros con ese criterio."*
- Botón **×** para limpiar el filtro.

### RF-07 — Editar servicio desde el listado
**Descripción:** El usuario puede corregir un servicio mal registrado.  
**Criterio de aceptación:**
- En la tabla de servicios, cada fila tiene un botón **Editar**.
- Al pulsarlo, se abre el formulario de servicio con los campos pre-rellenos.
- El campo ID del servicio no se muestra al usuario; se conserva internamente.
- Se pueden cambiar la placa, el cliente, la fecha y el tipo de servicio.
- La validación de placa y cliente existentes se aplica igual que en el registro.
- Al guardar, el registro se actualiza en `localStorage` y se muestra `¡Actualizado!`.

### RF-08 — Eliminar servicio desde el listado
**Descripción:** El usuario puede eliminar un servicio.  
**Criterio de aceptación:**
- Cada fila tiene un botón **Eliminar**.
- El diálogo (P-13) muestra placa, fecha y tipo del servicio.
- Al confirmar, el servicio se elimina de `localStorage`.
- Tras eliminar, se muestra `¡Servicio eliminado!` durante 3 segundos.

### RF-09 — Buscar y filtrar en el listado de servicios
**Descripción:** El usuario puede encontrar servicios rápidamente.  
**Criterio de aceptación:**
- Campo de búsqueda de texto libre que filtra en tiempo real por placa o identificación de cliente.
- Selector desplegable **Tipo** que filtra por tipo de servicio (Todos / Cambio de aceite / Sincronización / Alineación / Lavado).
- Selector **Desde** y **Hasta** (tipo `date`) que filtran por rango de fechas.
- Los tres filtros se pueden combinar simultáneamente.
- Botón **Limpiar filtros** que restablece todos los controles a su estado inicial.
- Si no hay resultados, se muestra *"No se encontraron servicios con ese criterio."*

### RF-10 — Historial completo del carro
**Descripción:** Al consultar por placa, el usuario ve la ficha completa del carro y del cliente.  
**Criterio de aceptación:**
- La pantalla de consulta muestra, antes de la tabla de servicios, una **ficha del carro** con: foto (o ícono si no hay), placa, marca y modelo.
- Debajo de la ficha del carro aparece la **ficha del cliente** asociado al primer servicio encontrado (nombres, apellidos, correo y celular). Si hay servicios de varios clientes, se muestran todos los clientes únicos.
- Si la placa no existe en `srv_carros`, se muestra: *"Esta placa no está registrada en el sistema."*
- Si la placa existe pero no tiene servicios, se mantiene el mensaje actual: *"Este carro no tiene servicios registrados."*
- La tabla de servicios ya existente permanece igual debajo de las fichas.

### RF-11 — Diálogo de confirmación de eliminación (modal reutilizable)
**Descripción:** Antes de eliminar cualquier registro, el sistema pide confirmación explícita.  
**Criterio de aceptación:**
- El diálogo es un componente modal centrado sobre el fondo, que bloquea la interacción con el resto de la pantalla.
- Muestra: título *"¿Confirmar eliminación?"*, resumen del registro a eliminar, advertencia de efecto en cascada si aplica, botón **Sí, eliminar** (caoba) y botón **Cancelar** (verde).
- Pulsar **Cancelar** o la tecla `Escape` cierra el modal sin cambios.
- El modal es accesible: tiene `role="dialog"`, `aria-modal="true"` y el foco se mantiene dentro mientras está abierto.

### RF-12 — Tercer idioma: Português (pt)
**Descripción:** El panel de accesibilidad ofrece tres idiomas: Español, English y Português.  
**Criterio de aceptación:**
- El selector de idioma muestra tres opciones: Español, English, Português.
- Al seleccionar Português, **toda la interfaz** (etiquetas, mensajes, botones, encabezados) cambia al portugués.
- La lectura en voz alta (TTS) usa la voz `pt-BR` cuando el idioma activo es Português.
- Las traducciones cubren todas las claves existentes en `i18n.ts` más las nuevas de guia4.

### RF-13 — Mensajes de retroalimentación en todas las acciones nuevas
**Descripción:** El usuario recibe confirmación visual en cada acción de escritura.  
**Criterio de aceptación:**
- Las acciones guardar, actualizar y eliminar muestran un mensaje de retroalimentación usando el componente `MessageBox` existente.
- Los mensajes de éxito son verdes (`¡Guardado!`, `¡Actualizado!`, `¡Eliminado!`).
- Los mensajes de error son rojos (`¡Error! …`).
- Cada mensaje desaparece automáticamente después de **3 segundos** o al iniciar una nueva acción.
- El TTS anuncia el mensaje si está activo.

### RF-14 — Paginación de listados
**Descripción:** Los listados muestran como máximo 10 filas por página para evitar desbordamiento.  
**Criterio de aceptación:**
- Cada listado muestra controles de paginación: *Anterior*, número de página actual y total, *Siguiente*.
- Los controles están deshabilitados cuando no hay más páginas en esa dirección.
- Al filtrar, la paginación se reinicia a la página 1.
- El tamaño de página es fijo en 10.

---

## 4. Requisitos no funcionales

### RNF-01 — Validación de formato: correo electrónico
**Criterio de aceptación:**
- El campo correo del cliente acepta únicamente valores que coincidan con el patrón `usuario@dominio.ext` (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
- Si el formato es incorrecto, se muestra *"¡Error! Correo electrónico inválido."* y el campo recibe borde rojo.
- La validación se dispara al perder el foco del campo (`onBlur`) y al intentar guardar.

### RNF-02 — Validación de formato: celular
**Criterio de aceptación:**
- El campo celular acepta únicamente 10 dígitos numéricos (regex: `/^\d{10}$/`).
- Se permite escribir espacios o guiones al tipear, pero se normalizan (se eliminan) antes de validar y guardar.
- Si el formato es incorrecto, se muestra *"¡Error! El celular debe tener 10 dígitos."*.

### RNF-03 — Validación de formato: placa
**Criterio de aceptación:**
- El campo placa acepta el formato colombiano vigente: 3 letras seguidas de 3 dígitos (`ABC123`) o el formato antiguo de 3 letras + 2 dígitos + 1 letra (`ABC12D`). Regex: `/^[A-Z]{3}[0-9]{2,3}[A-Z]?$/`.
- Las letras se convierten automáticamente a mayúsculas al tipear.
- Si el formato no coincide, se muestra *"¡Error! Formato de placa inválido (ej: ABC123)."*.

### RNF-04 — Validación de formato: fecha
**Criterio de aceptación:**
- El campo fecha del servicio no acepta fechas futuras (mayor que la fecha actual del sistema).
- Si se ingresa una fecha futura, se muestra *"¡Error! La fecha no puede ser futura."*.

### RNF-05 — Persistencia sin pérdida de datos
**Criterio de aceptación:**
- guia4 usa las mismas claves de `localStorage` que guia3 (`srv_clientes`, `srv_carros`, `srv_servicios`).
- Los datos registrados desde guia3 son legibles desde guia4 sin migración.
- Ninguna operación de guia4 puede corromper el formato JSON de los datos existentes.
- Antes de cada escritura masiva (`saveAll`), se valida que el array resultante sea serializable.

### RNF-06 — Accesibilidad del panel en pantallas nuevas
**Criterio de aceptación:**
- El `AccessibilityPanel` aparece en **todas** las pantallas nuevas o ampliadas de guia4 (P-04, P-06, P-08, P-09, P-10, P-11, P-12, P-13).
- El diálogo de confirmación (P-13) tiene foco trampa: `Tab` y `Shift+Tab` ciclan solo entre los botones del modal mientras está abierto.
- Todos los botones nuevos tienen `aria-label` descriptivo.
- Los mensajes de retroalimentación usan `role="alert"` para que los lectores de pantalla los anuncien automáticamente.

### RNF-07 — Diseño coherente con guia3
**Criterio de aceptación:**
- Todas las pantallas nuevas o ampliadas cumplen: tamaño 1280×720 px, fondo `#e8ece8`, paneles `#4a7c59` / `#3a6b47`, botones primarios `#6B2A2A` (caoba), tipografía Times New Roman.
- Los botones Editar y Eliminar en las tablas usan íconos consistentes con el sistema de diseño existente (pueden ser emoji o SVG de la misma paleta; **no** se añaden librerías de íconos nuevas).
- El modal de confirmación usa el mismo sistema de colores: fondo blanco, borde verde, botón Eliminar caoba, botón Cancelar verde.

### RNF-08 — Rendimiento con localStorage
**Criterio de aceptación:**
- Los filtros en tiempo real en los listados operan sobre datos ya cargados en memoria (sin releer `localStorage` en cada keystroke).
- El tiempo de respuesta visible al tipear en un filtro es menor a 100 ms para listas de hasta 200 registros.

### RNF-09 — Sin regresión de los 72 requisitos de guia3
**Criterio de aceptación:**
- Todas las funcionalidades de guia3 siguen operativas en guia4 sin cambios de comportamiento.
- Las 72 casillas de la lista de chequeo original se mantienen en estado SI.

---

## 5. Fuera del alcance (v2)

Los siguientes ítems **no forman parte de guia4** y quedan documentados como posibles mejoras futuras:

| Ítem | Razón de exclusión |
|---|---|
| Servidor o base de datos real | Prototipo local; requeriría backend y despliegue |
| Roles de usuario (admin vs. operador) | Añade complejidad de autenticación fuera del alcance |
| Recuperación real de contraseña | Requiere servidor de correo |
| Facturación y pagos | Módulo independiente no solicitado |
| Inventario de insumos | Módulo independiente no solicitado |
| Versión para dispositivos móviles | Diseño fijo 1280×720 px por especificación |
| Exportar a PDF o Excel | No solicitado en esta versión |
| Estadísticas o gráficas | No solicitado en esta versión |
| Cuarto idioma en el traductor | Se puede agregar en v3; v2 llega a tres (ES, EN, PT) |
| Sincronización entre navegadores | localStorage es por navegador y dispositivo |

---

## 6. Resumen de requisitos nuevos

| ID | Tipo | Título | Pantalla |
|---|---|---|---|
| RF-01 | Funcional | Editar cliente | P-04 |
| RF-02 | Funcional | Eliminar cliente con confirmación y cascada | P-09 + P-13 |
| RF-03 | Funcional | Buscar y filtrar en listado de clientes | P-09 |
| RF-04 | Funcional | Editar carro | P-06 |
| RF-05 | Funcional | Eliminar carro con confirmación y cascada | P-10 + P-13 |
| RF-06 | Funcional | Buscar y filtrar en listado de carros | P-10 |
| RF-07 | Funcional | Editar servicio | P-08 |
| RF-08 | Funcional | Eliminar servicio con confirmación | P-11 + P-13 |
| RF-09 | Funcional | Buscar y filtrar en listado de servicios (texto + tipo + rango de fecha) | P-11 |
| RF-10 | Funcional | Historial completo del carro (ficha de carro + cliente) | P-12 |
| RF-11 | Funcional | Diálogo de confirmación reutilizable | P-13 |
| RF-12 | Funcional | Tercer idioma: Português | P-15 |
| RF-13 | Funcional | Mensajes de retroalimentación auto-descartables (3 s) | Todas |
| RF-14 | Funcional | Paginación de 10 filas por página en todos los listados | P-09, P-10, P-11 |
| RNF-01 | No funcional | Validación formato correo | P-03, P-04 |
| RNF-02 | No funcional | Validación formato celular | P-03, P-04 |
| RNF-03 | No funcional | Validación formato placa | P-05, P-06, P-07, P-08 |
| RNF-04 | No funcional | Validación fecha no futura | P-07, P-08 |
| RNF-05 | No funcional | Persistencia sin pérdida de datos de guia3 | Storage |
| RNF-06 | No funcional | Accesibilidad en pantallas nuevas | Todas las nuevas |
| RNF-07 | No funcional | Diseño coherente con guia3 | Todas las nuevas |
| RNF-08 | No funcional | Rendimiento de filtros en memoria | P-09, P-10, P-11 |
| RNF-09 | No funcional | Sin regresión de los 72 requisitos de guia3 | Todo el sistema |

**Total nuevos:** 14 funcionales + 9 no funcionales = **23 requisitos adicionales**  
**Total guia4:** 72 (heredados) + 23 (nuevos) = **95 requisitos**

---

*Esperando aprobación antes de proceder al diseño técnico.*
