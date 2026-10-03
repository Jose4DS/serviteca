# SERVITECA – Administración de Vehículos

Aplicación web para la administración básica de una serviteca de vehículos. Está pensada para quienes administran una serviteca. Este repositorio incluye el código de la aplicación y la documentación del proyecto (requerimientos, planeación y presentación).

**Probar la app en línea:** https://servitecajosefocar.ai.studio


## Descargas

Cada enlace inicia la descarga directamente, sin necesidad de tener cuenta de GitHub.

| Recurso | Descarga |
| --- | --- |
| Aplicación (código fuente, .zip) | [serviteca.zip](https://github.com/Jose4DS/serviteca/raw/main/serviteca.zip) |
| Listado de requerimientos (Excel) | [Listado_de_requerimientos_Serviteca.xlsx](https://github.com/Jose4DS/serviteca/raw/main/Listado_de_requerimientos_Serviteca.xlsx) |
| Presentación (PowerPoint) | [Presentación1.pptx](https://github.com/Jose4DS/serviteca/raw/main/Presentaci%C3%B3n1.pptx) |
| Planeación del proyecto (Word) | [Planeacion_proyecto_Serviteca_ADSO.docx](https://github.com/Jose4DS/serviteca/raw/main/Planeacion_proyecto_Serviteca_ADSO.docx) |

También puedes descargar todo el repositorio con **Code → Download ZIP** en la parte superior de esta página.


## FAQ

#### ¿Cómo descargo la app, el Excel y el PowerPoint?

Usa los enlaces de la sección [Descargas](#descargas). No necesitas iniciar sesión.

#### ¿Puedo usar la app sin instalar nada?

Sí. Ábrela directamente en línea desde https://servitecajosefocar.ai.studio.

#### ¿Cómo la ejecuto en mi computador?

1. Instala [Node.js](https://nodejs.org).
2. Clona el repositorio y entra a la carpeta:
   ```bash
   git clone https://github.com/Jose4DS/serviteca.git
   cd serviteca
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Si la app lo requiere, crea un archivo `.env` en la raíz con tu clave de la API de Gemini:
   ```
   GEMINI_API_KEY=tu_clave
   ```
5. Inicia el servidor de desarrollo y abre http://localhost:3000:
   ```bash
   npm run dev
   ```

#### ¿Con qué tecnologías está construida?

React 19, TypeScript, Vite y Tailwind CSS. Usa el SDK de Gemini (`@google/genai`) y fue desarrollada con Google AI Studio.

#### ¿Puedo reutilizar el código o los documentos?

El proyecto tiene copyright de su autor (ver [Copyright y créditos](#copyright-y-créditos)). Si quieres reutilizarlo, abre un [issue](https://github.com/Jose4DS/serviteca/issues) en este repositorio para pedir permiso.


## Documentación

- [Listado de requerimientos (Excel)](https://github.com/Jose4DS/serviteca/raw/main/Listado_de_requerimientos_Serviteca.xlsx)
- [Presentación del proyecto (PowerPoint)](https://github.com/Jose4DS/serviteca/raw/main/Presentaci%C3%B3n1.pptx)
- [Planeación del proyecto (Word)](https://github.com/Jose4DS/serviteca/raw/main/Planeacion_proyecto_Serviteca_ADSO.docx) · [versión en Markdown](Planeacion_proyecto_Serviteca_ADSO.md)
- [Aplicación en línea](https://servitecajosefocar.ai.studio)


## Copyright y créditos

Copyright © 2026 [Jose4DS](https://github.com/Jose4DS).

Construido con [Google AI Studio](https://aistudio.google.com) y la API de Gemini. Google, Google AI Studio y Gemini son marcas de Google LLC. Cualquier aviso de licencia de Google que aparezca en los archivos de `src/` se conserva tal cual.
