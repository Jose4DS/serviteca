# Planeación del proyecto Serviteca ADSO: Sistema de administración de clientes, carros y servicios

**[Nombres de los integrantes del equipo]**

**[Nombre de la institución]**

**[Nombre del curso]**

**[Nombre del docente]**

2 de octubre de 2026

---

## Contenido

1. [Introducción](#introducción)
2. [Descripción del proyecto](#descripción-del-proyecto)
3. [Requerimientos del sistema](#requerimientos-del-sistema)
4. [Metodología de trabajo](#metodología-de-trabajo)
5. [Equipo y organización](#equipo-y-organización)
6. [Plan de trabajo y cronograma](#plan-de-trabajo-y-cronograma)
7. [Gestión del proyecto](#gestión-del-proyecto)
8. [Entregables y criterios de aceptación](#entregables-y-criterios-de-aceptación)
9. [Supuestos y puntos por confirmar](#supuestos-y-puntos-por-confirmar)
10. [Conclusiones](#conclusiones)
11. [Referencias](#referencias)

---

## Introducción

Una serviteca es un negocio donde se atienden los carros para servicios como el cambio de aceite, la alineación, la sincronización o el lavado. Cuando el registro de los clientes y de los servicios no está ordenado, es fácil que la información se pierda o que resulte difícil saber qué se le hizo a un carro y en qué fecha. Por eso, el proyecto Serviteca ADSO propone un sistema de administración donde el personal pueda registrar clientes, carros y servicios, y consultar el historial de un carro a partir de su placa.

Este documento presenta la planeación de ese proyecto. Se elaboró a partir de cuatro fuentes: el documento de especificación de interfaces (*Documento de especificación de interfaces de usuario*, s. f.), el listado de requerimientos versión 2 (*Listado de requerimientos*, s. f.), el boceto de la interfaz hecho en PowerPoint (*Boceto de la interfaz*, s. f.) y la planeación beta del proyecto (*Planeación del proyecto Serviteca*, 2026). Aquí explicamos qué vamos a construir, cómo vamos a trabajar, qué metodología usaremos, cómo gestionaremos el tiempo y los riesgos y cuándo daremos el proyecto por terminado. Escribimos el plan con palabras sencillas y con metas realistas para un equipo de estudiantes de segundo semestre, y seguimos las normas APA en su séptima edición (American Psychological Association [APA], 2020).

## Descripción del proyecto

### Qué vamos a construir

Vamos a construir una aplicación web para computador con la que el personal de la serviteca pueda iniciar sesión, registrar clientes, registrar carros, registrar los servicios que se les hacen y consultar los servicios de un carro escribiendo su placa. Cada pantalla tendrá, al lado derecho, un panel de accesibilidad con tres herramientas: un traductor, una función que lee los textos en voz alta y otra que los muestra en braille (*Listado de requerimientos*, s. f.). En lo visual usaremos fondo gris claro, paneles verdes, detalles en color caoba, letra Times New Roman y un tamaño de pantalla de 1280 × 720 píxeles.

Esta primera versión es un prototipo. Igual que en el documento de especificación, nos concentramos en la interfaz y en la forma de navegar entre pantallas, sin conectar el sistema a una base de datos real (*Documento de especificación*, s. f.). Los datos se guardarán en el mismo computador donde se use el programa.

### Objetivos

El objetivo general es planear y construir, en ocho semanas, un prototipo funcional del sistema de administración de la Serviteca que cumpla los 72 requerimientos del listado versión 2. Para lograrlo nos proponemos los siguientes objetivos específicos:

- Entender y organizar los requerimientos para convertirlos en tareas.
- Revisar y completar el boceto de las pantallas con el docente antes de programar.
- Construir las pantallas de inicio de sesión, menú, clientes, carros, servicios y consulta.
- Agregar el panel de accesibilidad con traductor, lectura en voz alta y braille.
- Probar el sistema con la lista de chequeo y con personas ajenas al equipo.
- Documentar el proyecto y presentarlo con una demostración en vivo.

### Alcance

Para no prometer más de lo que podemos hacer, definimos qué entra y qué no en esta versión. Entran el inicio de sesión, el menú principal con sus submenús, los formularios de cliente, carro y servicio, la consulta de servicios por placa, el panel de accesibilidad en todas las pantallas y las reglas de diseño (colores, letra y medidas). No entran el servidor ni la base de datos real, los roles de usuario ni la recuperación real de la contraseña, la facturación, el inventario, los pagos ni la versión para celular.

## Requerimientos del sistema

El listado de requerimientos versión 2 es el documento que nos dice qué debe hacer el sistema. Tiene 72 requisitos repartidos en ocho hojas de Excel: siete módulos funcionales y una hoja de requisitos generales de diseño. Cada requisito ocupa una fila y, cuando probamos el sistema, se marca con una X en una de tres columnas: SI (cumple), NO (no cumple) o ADI (falta una función que se debe adicionar). La Tabla 1 resume cuántos requisitos tiene cada módulo y qué se espera de él.

**Tabla 1**

*Requerimientos por módulo*

| Módulo (hoja del Excel) | Req. | Qué debe poder hacer el sistema |
|:---|:---:|:---|
| Inicio de sesión | 9 | Mostrar el recuadro de ingreso, ocultar la contraseña y avisar en amarillo cuando los datos son incorrectos. |
| Pantalla principal | 10 | Mostrar el menú (Clientes, Carros, Servicios, Ayuda y Salir) y desplegar los submenús Agregar, Consultar y Listar. |
| Registrar cliente | 9 | Pedir identificación, nombres, apellidos, correo y celular, y avisar si faltan datos (¡Error!) o si todo se guardó (¡Guardado!). |
| Registrar carro | 11 | Pedir placa, marca y modelo, y permitir subir una foto del carro y verla en pantalla. |
| Registrar servicio | 11 | Pedir placa, identificación del cliente, fecha (con calendario) y tipo de servicio: cambio de aceite, sincronización, alineación o lavado. |
| Consultar servicios | 8 | Buscar por placa y mostrar una tabla con los servicios; si no hay, mostrar “Este carro no tiene servicios registrados”. |
| Accesibilidad | 7 | Mostrar un panel con traductor, lectura en voz alta y braille. |
| Generales de diseño | 7 | Cumplir en todas las pantallas el fondo gris, el logo, los colores verde y caoba, la letra Times New Roman y las medidas en píxeles. |
| **Total** | **72** | |

*Nota.* Elaboración propia a partir del listado de requerimientos versión 2 (*Listado de requerimientos*, s. f.).

Como el Excel funciona como lista de chequeo, nos sirve para saber en qué punto del proyecto estamos: cada vez que terminamos un módulo revisamos su hoja y marcamos lo que ya cumple. Los requisitos de accesibilidad y los generales son los más exigentes, porque deben cumplirse en todas las pantallas a la vez. Para el panel de accesibilidad tomaremos además como lectura de apoyo las pautas WCAG (World Wide Web Consortium [W3C], 2018), una referencia internacional sobre cómo hacer los sitios web más accesibles.

El boceto de la interfaz, hecho en PowerPoint, tiene 27 diapositivas. En ellas se ven el inicio de sesión (con y sin mensaje de error), el menú principal con sus submenús, los formularios de cliente, carro y servicio, los mensajes de error y de guardado, la consulta de servicios por placa con un ejemplo de resultado y el submenú de Ayuda (*Boceto de la interfaz*, s. f.). Ese boceto es nuestro modelo visual: antes de dar por terminada una pantalla, la comparamos con su diapositiva.

## Metodología de trabajo

Para trabajar adoptamos la misma idea del documento de especificación: una metodología ágil inspirada en Scrum, con ciclos cortos de una semana, combinada con prácticas de Design Thinking (*Documento de especificación*, s. f.). Elegimos esta forma de trabajo porque nos permite avanzar por partes, mostrar resultados con frecuencia y corregir los errores a tiempo, en lugar de descubrirlos al final.

### Scrum adaptado a nuestro equipo

Scrum es una forma de organizar el trabajo en la que el proyecto se divide en ciclos cortos llamados *sprints*, y al terminar cada uno se muestra un avance terminado (Schwaber y Sutherland, 2020). Nosotros usaremos ocho sprints de una semana, uno por cada semana del plan. Como además cursamos otras materias, adaptamos Scrum de esta manera:

- **Planeación (lunes, 30 minutos):** elegimos las tareas de la semana a partir de los requisitos del Excel.
- **Seguimiento corto (miércoles, 15 minutos):** en lugar de la reunión diaria, cada uno cuenta qué hizo, qué hará y qué lo está bloqueando.
- **Revisión y cierre (viernes, 45 minutos):** mostramos lo hecho al docente o a un compañero, marcamos en el Excel los requisitos que ya cumplen y hablamos de qué salió bien y qué podemos mejorar.
- **Tablero de tareas:** un cuadro con las columnas Por hacer, En proceso, En revisión y Hecho, donde todos ven en qué va cada tarea.

Las reuniones suman cerca de una hora y media por persona cada semana y ya están incluidas en las horas del plan. En Scrum hay un dueño del producto, un facilitador y un equipo de desarrollo. En nuestro caso, el docente hace de dueño del producto, porque decide si lo entregado sirve; la persona de coordinación hace de facilitador, y las tres personas hacemos el trabajo.

### Design Thinking

Design Thinking es una forma de crear soluciones que empieza por entender a las personas que las van a usar (Brown, 2008). Lo aplicamos en cinco pasos: empatizar (entender cómo trabaja el personal de una serviteca y qué necesita), definir (convertir esas necesidades en los 72 requisitos), idear (dibujar las pantallas), prototipar (construirlas) y probar (revisarlas con la lista de chequeo y con personas que no son del equipo).

### Trabajo por entregas

También trabajaremos de forma iterativa e incremental, como se plantea en el documento de especificación (*Documento de especificación*, s. f.). Esto quiere decir que construimos el sistema por piezas: primero el inicio de sesión y el menú, luego los formularios, después la consulta y al final la accesibilidad. Cada pieza se prueba antes de pasar a la siguiente, y lo que aprendemos se corrige en el ciclo siguiente.

## Equipo y organización

Somos un equipo de tres personas. Para que todos aprendamos de todas las partes del proyecto, dividimos el trabajo en tres roles y los rotamos cada dos semanas, de modo que todos programen y todos prueben (*Planeación del proyecto Serviteca*, 2026). La Tabla 2 muestra qué hace cada rol y quién lo ocupa en cada periodo.

**Tabla 2**

*Roles del equipo y rotación cada dos semanas*

| Rol | Qué hace | S1–S2 | S3–S4 | S5–S6 | S7–S8 |
|:---|:---|:---:|:---:|:---:|:---:|
| Coordinación y pruebas | Organiza las reuniones, lleva el tablero de tareas, marca el Excel de cumplimiento y escribe la documentación. | A | C | B | A |
| Pantallas | Construye los componentes visuales y los formularios: inicio de sesión, menú, cliente, carro, servicio y consulta. | B | A | C | B |
| Datos y accesibilidad | Se encarga del guardado de la información, las validaciones, el traductor, la voz y el braille. | C | B | A | C |

*Nota.* A, B y C son los tres integrantes del equipo. Elaboración propia a partir de la planeación beta (*Planeación del proyecto Serviteca*, 2026).

Además de los roles, acordamos algunas reglas para trabajar bien en grupo: cada tarea tiene un responsable; nadie aprueba su propio trabajo, sino que lo revisa otro compañero; si alguien no puede cumplir una tarea, avisa antes de la reunión del miércoles para repartirla; y las dudas importantes se llevan al docente lo antes posible.

## Plan de trabajo y cronograma

El proyecto dura ocho semanas. Partimos de tres supuestos: el equipo tiene tres integrantes, cada uno dedica en promedio seis horas por semana y la entrega es al final de la semana ocho. Con ello el equipo dispone de 144 horas en total, es decir, 48 horas por persona. El documento de especificación organiza la primera fase del proyecto, la maquetación, en cinco días de trabajo: análisis de requerimientos, mapa de navegación, guía de estilo, prototipos y documentación (*Documento de especificación*, s. f.). Esa fase corresponde a nuestras semanas uno y dos; desde la semana tres pasamos a construir las pantallas. La Tabla 3 detalla la meta, las actividades y las horas de cada semana.

**Tabla 3**

*Plan de trabajo semana por semana*

| Sem. | Meta de la semana | Actividades principales | Horas equipo | Horas por persona |
|:---:|:---|:---|:---:|:---:|
| 1 | Todos entendemos el problema y podemos abrir el proyecto en nuestros computadores. | Leer el listado de requerimientos y anotar dudas; instalar los programas; crear el repositorio y el tablero de tareas; probar el prototipo de ejemplo; repasar lo básico de programación web. | 14 | 4,7 |
| 2 | Boceto aprobado y piezas visuales listas para reutilizar. | Revisar con el docente el boceto de las seis pantallas; acordar la lista de idiomas del traductor; definir fondo, colores y letra; construir encabezado, botones, campos y recuadros de mensaje. | 18 | 6 |
| 3 | Entrar al sistema y navegar por el menú (19 requisitos). | Pantalla de inicio de sesión con mensaje de datos incorrectos; menú con Clientes, Carros, Servicios, Ayuda y Salir; submenús; primera ronda de chequeo con las hojas 1 y 2 del Excel. | 20 | 6,7 |
| 4 | Guardar clientes y carros (20 requisitos). | Guardado de datos; formulario de cliente con los mensajes ¡Error! y ¡Guardado!; formulario de carro con el botón “Subir imagen” y vista previa; botones Guardar y Regresar. | 20 | 6,7 |
| 5 | Registrar y consultar servicios (19 requisitos). | Formulario de servicio con calendario y lista de los cuatro tipos; comprobar que la placa y el cliente existan; consulta por placa con tabla y mensaje cuando no hay servicios; pantallas de listado. | 20 | 6,7 |
| 6 | Panel de accesibilidad completo en todas las pantallas (7 requisitos). | Panel verde con Traductor, TTS y Braile; traducción con dos idiomas al inicio; lectura en voz alta; conversión a braille; verificar el panel en las seis pantallas. | 22 | 7,3 |
| 7 | Excel completo marcado con SI, NO o ADI. | Recorrer las 72 filas y anotar observaciones; corregir cada NO y registrar los ADI como mejoras; prueba con dos personas ajenas al equipo; probar en Chrome y Edge. | 18 | 6 |
| 8 | Entrega lista y ensayada. | Manual de usuario corto con capturas; README con las instrucciones para abrir el proyecto; presentación de 10 minutos con demostración en vivo; ensayo general y copia de respaldo. | 12 | 4 |
| | **Total** | | **144** | **48** |

*Nota.* Elaboración propia a partir de la planeación beta (*Planeación del proyecto Serviteca*, 2026). Las horas incluyen reuniones, trabajo en las pantallas, pruebas y documentación. Los requisitos por semana suman 65 más los 7 generales de diseño, que se cumplen en todas las pantallas.

La Figura 1 muestra el mismo plan de forma visual. Las pruebas no esperan hasta la semana siete: al terminar cada módulo revisamos su hoja del Excel, y la documentación se va escribiendo a lo largo del proyecto.

**Figura 1**

*Cronograma del proyecto por semanas*

| Actividad | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Preparación y estudio | ■ | | | | | | | |
| Bocetos y piezas visuales | | ■ | | | | | | |
| Inicio de sesión y menú | | | ■ | | | | | |
| Clientes y carros | | | | ■ | | | | |
| Servicios y consulta | | | | | ■ | | | |
| Accesibilidad | | | | | | ■ | | |
| Pruebas y ajustes | | | □ | □ | □ | □ | ■ | |
| Documentos y entrega | □ | □ | □ | □ | □ | □ | □ | ■ |

*Nota.* Elaboración propia. ■ = trabajo principal; □ = trabajo de apoyo, que se hace en partes pequeñas durante varias semanas, como revisar cada módulo con el Excel o ir escribiendo la documentación.

Para seguir el avance definimos seis hitos: boceto aprobado (fin de la semana 2), ingreso y navegación funcionando (semana 3), registro de clientes, carros y servicios terminado (semana 5), accesibilidad completa (semana 6), Excel completo marcado (semana 7) y entrega con presentación (semana 8).

## Gestión del proyecto

Para gestionar el proyecto tomamos como guía algunas áreas de la gestión de proyectos (Project Management Institute [PMI], 2017): alcance, tiempo, calidad, riesgos, recursos y comunicación. Las usamos de una forma sencilla, acorde con el tamaño de nuestro equipo.

### Gestión del alcance

El alcance es lo que prometemos entregar. Está definido por los 72 requisitos del Excel y por la lista de lo que no incluye esta versión. Si a alguien se le ocurre una función nueva, la anotamos en la columna ADI y la hablamos en la reunión del lunes. Solo entra al proyecto si cabe en las horas de la semana y el docente está de acuerdo; si no, queda como mejora para una versión futura. Así evitamos que el trabajo crezca sin control.

### Gestión del tiempo

Controlamos el tiempo con tres herramientas: el cronograma (Figura 1), las horas por semana (Tabla 3) y el tablero de tareas. Cada viernes comparamos las horas que planeamos con las que realmente usamos. Si nos atrasamos, primero usamos las tres horas de margen que dejamos en la semana siete. Si no alcanzan, damos prioridad a lo esencial (inicio de sesión, menú, formularios y consulta) y reducimos lo que menos afecta el funcionamiento, por ejemplo el número de idiomas del traductor.

### Gestión de la calidad

La calidad se mide con el Excel: un requisito está bien cuando se marca SI. Además, cada pantalla la revisa otro integrante antes de darla por terminada. En la semana siete haremos una prueba con dos personas ajenas al equipo, a quienes no les explicaremos nada, para ver si el sistema se entiende por sí solo. También lo probaremos en dos navegadores, Chrome y Edge.

### Gestión de los riesgos

Un riesgo es algo que podría salir mal y retrasar el proyecto. Identificamos los más probables desde el inicio y decidimos qué hacer en cada caso (Tabla 4).

**Tabla 4**

*Riesgos del proyecto y medidas previstas*

| Riesgo | Probabilidad | Qué haremos |
|:---|:---:|:---|
| Nadie del equipo domina bien la programación web al empezar | Alta | Dedicar la semana 1 a práctica guiada y programar en parejas las dos primeras pantallas. |
| El traductor y el braille toman más tiempo del previsto | Alta | Empezar con dos idiomas y ampliar si sobra tiempo; en braille, solo letras, números y signos básicos. |
| Las semanas de parciales reducen el tiempo disponible | Alta | Dejar la semana 7 con tres horas de margen y adelantar tareas antes de los exámenes. |
| Conflictos al unir el trabajo de los tres | Media | Una copia del proyecto por persona, cambios pequeños y revisión antes de unir. |
| Cambian los requerimientos (hay idiomas por definir) | Media | Anotar cada cambio en la columna ADI y acordar la lista de idiomas en la semana 2. |
| Se pierden los datos al borrar el navegador | Media | Aclarar en la presentación que es un prototipo y preparar datos de ejemplo para la demostración. |
| Un integrante no puede trabajar durante una semana | Media | Rotar los roles, dejar el trabajo anotado en el tablero y repartir sus tareas entre los otros dos. |

*Nota.* Elaboración propia a partir de la planeación beta (*Planeación del proyecto Serviteca*, 2026). El último riesgo fue agregado por el equipo.

### Gestión de los recursos y la comunicación

Los recursos del proyecto son tres personas, 144 horas de trabajo y herramientas gratuitas: Visual Studio Code, que es el editor donde se escribe el programa; Node.js, que permite ejecutar el proyecto en el computador; Git y GitHub, para guardar el código y sus versiones; PowerPoint o Figma, para los bocetos; Excel, para la lista de chequeo; y los navegadores Chrome y Edge, para las pruebas. Por eso no prevemos gastos de dinero.

Para no pisarnos el trabajo, cada integrante trabajará en su propia copia del proyecto en GitHub y los cambios se unirán en pasos pequeños, después de que otro compañero los revise. Para comunicarnos usaremos un grupo de mensajería para los avisos rápidos, las tres reuniones de la semana y el tablero de tareas, donde queda a la vista quién hace qué.

## Entregables y criterios de aceptación

Al final del proyecto entregaremos cinco cosas:

- El código del proyecto en GitHub, con un README que explique cómo abrirlo.
- El Excel de requerimientos con el nivel de cumplimiento de cada fila.
- Los bocetos de las pantallas.
- Un manual de usuario corto, con capturas.
- Una presentación de 10 minutos con demostración en vivo.

Daremos el proyecto por terminado cuando se cumplan cuatro condiciones:

- Las 72 filas del Excel están marcadas y ningún NO queda sin explicación.
- Los colores usados coinciden con la paleta del listado de requerimientos.
- El recorrido completo (inicio de sesión, cliente, carro, servicio y consulta) funciona sin errores.
- Una persona nueva usa el sistema sin ayuda.

## Supuestos y puntos por confirmar

Esta planeación parte de los tres supuestos ya mencionados (tres integrantes, seis horas semanales por persona y ocho semanas), que podemos ajustar: si cambian, se modifican las horas de la Tabla 3 y no la estructura del plan. Las fechas exactas de cada semana se definirán según el calendario académico. Al comparar los documentos nos quedaron varias dudas que queremos resolver con el docente durante la semana uno:

- Los documentos no coinciden en algunos puntos de diseño. El documento de especificación habla de una aplicación móvil en modo oscuro (negro, azul grafito, amarillo y verde) con una vista para el cliente, mientras que el listado versión 2 y el boceto muestran una aplicación de computador de 1280 × 720 píxeles con fondo gris, paneles verdes y detalles caoba. En este plan seguimos el listado y el boceto, por ser los más detallados, y dejamos la vista del cliente y la versión móvil como posibles mejoras.
- El menú ofrece Consultar y Listar en Clientes y Carros, y Listar en Servicios, pero el listado solo describe la consulta de servicios por placa. Hay que preguntar si esas pantallas entran en el alcance.
- El enlace “¿Olvidaste tu contraseña?” no tiene un requisito que explique qué ocurre al pulsarlo.
- Los idiomas del traductor aparecen como “por definir”. Proponemos empezar con dos y ampliar si hay tiempo.
- Las opciones del menú Ayuda (preguntas frecuentes, llamar a un técnico y reportar un problema) no tienen contenido definido.
- El usuario administrador con clave sencilla que trae el prototipo de ejemplo sirve para una demostración, pero no sería seguro en un sistema real.

## Conclusiones

La planeación nos permite ver el proyecto completo antes de empezar: qué hay que construir (72 requisitos), quién lo hace, en qué orden y en cuánto tiempo (ocho semanas y 144 horas). Combinar Scrum, con ciclos de una semana, y Design Thinking nos da una forma sencilla de avanzar por partes, mostrar resultados cada viernes y corregir a tiempo.

También identificamos los puntos más difíciles, que son la accesibilidad y la poca experiencia del equipo con la programación web, y preparamos medidas para cada uno. Lo más importante será mantener el orden: trabajar en ciclos cortos, revisar lo hecho con el Excel y hablar pronto con el docente cuando surjan dudas. Con esto esperamos entregar un prototipo que cumpla lo pedido y que una persona nueva pueda usar sin ayuda.

## Referencias

American Psychological Association. (2020). *Publication manual of the American Psychological Association* (7th ed.). https://doi.org/10.1037/0000165-000

*Boceto de la interfaz de la Serviteca (Presentación1.pptx)* [Presentación de PowerPoint no publicada]. (s. f.).

Brown, T. (2008). Design thinking. *Harvard Business Review, 86*(6), 84–92.

*Documento de especificación de interfaces de usuario (UI/UX): Proyecto aplicación móvil Serviteca ADSO* [Documento de Word no publicado]. (s. f.).

*Listado de requerimientos del sistema de administración de la Serviteca* (Versión 2) [Hoja de cálculo de Excel no publicada]. (s. f.).

*Planeación del proyecto Serviteca* [Documento PDF no publicado]. (2026, 2 de octubre).

Project Management Institute. (2017). *A guide to the project management body of knowledge (PMBOK guide)* (6.ª ed.). Project Management Institute.

Schwaber, K. y Sutherland, J. (2020). *The Scrum guide: The definitive guide to Scrum: The rules of the game*. https://scrumguides.org/scrum-guide.html

World Wide Web Consortium. (2018). *Web content accessibility guidelines (WCAG) 2.1*. https://www.w3.org/TR/WCAG21/
