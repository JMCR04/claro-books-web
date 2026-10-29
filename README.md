# Biblioteca — Frontend

Aplicación de la prueba técnica Full Stack para Claro Dominicana. Permite consultar, crear, editar y eliminar libros y autores mediante una API propia en ASP.NET Core.

## Requisitos

- Node.js 22.18 o superior compatible con Vite.
- npm.
- Backend `claro-books-api` ejecutándose en `https://localhost:7275` y certificado de desarrollo HTTPS confiable.

## Instalación y ejecución

Clona este repositorio y abre una terminal en su carpeta raíz.

```powershell
npm install
Copy-Item .env.example .env
npm run dev -- --port 5173 --strictPort
```

Abre `http://localhost:5173`. En macOS/Linux, utiliza `cp .env.example .env` para copiar el archivo de configuración.

El archivo `.env` contiene la URL pública del backend de desarrollo:

```dotenv
VITE_API_BASE_URL=https://localhost:7275/api
```

Si cambias esta variable, reinicia Vite. El backend permite el origen `http://localhost:5173` mediante CORS.

## Compilación

```powershell
npm run build
```

El resultado se genera en `dist`. Para revisarlo localmente:

```powershell
npm run preview -- --port 5173 --strictPort
```

La ejecución del frontend requiere también el backend. Para alojar la aplicación como SPA, el servidor debe devolver `index.html` para las rutas de React Router.

## Organización

- `src/books`: modelos, servicio, formulario y páginas de libros.
- `src/authors`: modelos, servicio, formulario y páginas de autores.
- `src/shared`: cliente HTTP, manejo de carga/errores y hook de consultas.
- `src/App.tsx`: navegación y rutas con carga diferida mediante `lazy` y `Suspense`.

React y TypeScript se usan para la interfaz; Bootstrap y Bootstrap Icons para el diseño. Los servicios consumen exclusivamente el backend propio mediante `fetch`.

## Funcionalidades

- Listados con búsqueda y paginación.
- Detalle de libro con descripción, extracto, fecha, páginas y autores relacionados.
- Formularios reutilizables para crear y editar libros y autores.
- Confirmación de eliminación y mensajes de resultado.
- Estados de carga, errores y reintentos.
- Validación de campos obligatorios, longitudes e identificadores.

## Datos de prueba y limitaciones

FakeRESTApi simula las escrituras sin conservarlas. El backend combina las lecturas externas con cambios temporales en memoria, registrados únicamente después de una escritura exitosa. Los cambios permanecen al recargar el navegador, pero desaparecen al reiniciar el backend. No se usa base de datos ni almacenamiento del navegador para simular persistencia.

La API externa proporciona un único `idBook` por registro de autor. La columna **Libros publicados** cuenta los libros relacionados disponibles en este catálogo: con ese contrato, cada registro puede mostrar 0 o 1. No representa una bibliografía externa completa ni agrupa personas por coincidencias de nombres.

## Comprobación funcional

1. Iniciar el backend y el frontend.
2. Buscar un libro, cambiar de página y abrir su detalle.
3. Crear un libro, editarlo, recargar y comprobar sus datos.
4. Crear un autor asociado al libro y verificarlo en el detalle del libro.
5. Editar y eliminar el autor; comprobar la actualización del listado.
6. Eliminar el libro y cancelar otra eliminación para comprobar la confirmación.
7. Intentar guardar campos vacíos y revisar los errores.
8. Detener el backend y comprobar el mensaje de conexión y el reintento.

Las pruebas unitarias son opcionales en el enunciado y no se incluyen. La compilación se verifica con `npm run build`; las comprobaciones anteriores permiten validar la integración real.
