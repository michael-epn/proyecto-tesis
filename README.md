# Sistema Inteligente de Gestión de Tesis ESFOT

Aplicación full-stack para gestionar el proceso de propuestas de tesis, solicitudes de tutoría, seguimiento de trámites y comunicación entre estudiantes, docentes y comisión académica.

## 1. Descripción general

Este proyecto permite:

- Registrar y autenticar usuarios con roles diferenciados: estudiante, docente y comisión.
- Generar propuestas de tesis mediante integración con IA.
- Enviar solicitudes de tutoría desde estudiantes hacia docentes.
- Aceptar, rechazar, revisar y aprobar trámites de tesis.
- Consultar métricas y historial de trámites.
- Mantener comunicación en tiempo real mediante chat.
- Subir imágenes de perfil y portada usando Cloudinary.
- Enviar correos de confirmación, recuperación y notificaciones.

## 2. Arquitectura del sistema

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- Cloudinary para almacenamiento de imágenes
- Nodemailer / Resend para correos
- Hugging Face para generación de temas con IA
- Stream Chat para mensajería en tiempo real

### Frontend
- React + Vite
- React Router DOM
- Zustand para estado global
- React Hook Form para formularios
- Tailwind CSS para estilos
- Axios para consumo de APIs

## 3. Estructura del proyecto

```text
backend/
  src/
    config/
    controllers/
    helpers/
    middlewares/
    models/
    routers/
    database.js
    index.js
    server.js

frontend/
  src/
    App.jsx
    main.jsx
    charts/
    components/
    config/
    css/
    data/
    hooks/
    layouts/
    pages/
    partials/
    store/
    utils/
```

## 4. Funcionalidades principales

### Autenticación y roles
- Registro e inicio de sesión para estudiantes, docentes y comisión.
- Confirmación de correo electrónico.
- Recuperación de contraseña.
- Protección de rutas por rol.

### Gestión de tesis
- Generación de propuestas de tesis con IA.
- Creación de solicitudes de tutoría.
- Respuesta de docentes a solicitudes.
- Envío de trámites a comisión.
- Aprobación o rechazo final por parte de la comisión.
- Historial de trámites y feedback.

### Perfiles
- Visualización y modificación de perfil por usuario.
- Actualización de datos personales y fotos.
- Gestión de cupos por parte de docentes.

### Chat interno
- Mensajería en tiempo real entre usuarios.
- Búsqueda de contactos.
- Carga de conversaciones y estados de lectura.

## 5. Backend: archivos clave

### Punto de entrada
- `backend/src/index.js`: inicia la conexión a MongoDB y levanta el servidor.
- `backend/src/server.js`: configura Express, CORS, carga de archivos y rutas.

### Modelos
- `backend/src/models/Estudiante.js`: modelo de estudiante.
- `backend/src/models/Docente.js`: modelo de docente.
- `backend/src/models/Comision.js`: modelo de comisión.
- `backend/src/models/SolicitudTesis.js`: modelo de solicitudes de tesis.
- `backend/src/models/TemaGenerado.js`: modelo de temas generados.

### Controladores
- `backend/src/controllers/estudiante_controller.js`: registro, login, perfil y recuperación.
- `backend/src/controllers/docente_controller.js`: gestión de docentes y perfil.
- `backend/src/controllers/comision_controller.js`: revisión de trámites y métricas.
- `backend/src/controllers/solicitud_controller.js`: flujo principal de tesis y solicitudes.
- `backend/src/controllers/chat_controller.js`: autenticación y token para chat.

### Helpers y utilidades
- `backend/src/helpers/huggingFaceService.js`: integración con Hugging Face.
- `backend/src/helpers/sendMail.js`: envío de correos transaccionales.
- `backend/src/helpers/uploadCloudinary.js`: subida de imágenes.

## 6. Frontend: archivos clave

### Aplicación
- `frontend/src/App.jsx`: rutas públicas y privadas.
- `frontend/src/layouts/DashboardLayout.jsx`: layout del sistema autenticado.
- `frontend/src/store/authStore.js`: manejo de sesión y token.

### Páginas principales
- `frontend/src/pages/Landing.jsx`: página de bienvenida.
- `frontend/src/pages/auth/*`: login, registro, recuperación y confirmación.
- `frontend/src/pages/estudiante/*`: módulos para estudiantes.
- `frontend/src/pages/docente/*`: módulos para docentes.
- `frontend/src/pages/comision/*`: módulos para comisión.
- `frontend/src/pages/Chat.jsx`: vista de mensajes.

### Chat
- `frontend/src/hooks/useChat.js`: lógica del chat en tiempo real.
- `frontend/src/components/chat/*`: componentes del chat.

## 7. Variables de entorno

El proyecto requiere variables de entorno tanto en backend como frontend.

### Backend
```env
MONGODB_URI_PRODUCTION=mongodb://...
JWT_SECRET=tu_jwt_secret
PORT=3000
URL_FRONTEND=http://localhost:5173
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
HUGGINGFACE_API_KEY=...
STREAM_API_KEY=...
STREAM_API_SECRET=...
```

### Frontend
```env
VITE_BACKEND_URL=http://localhost:3000/api
VITE_STREAM_API_KEY=...
```

## 8. Instalación

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 9. Scripts disponibles

### Backend
- `npm run dev`: ejecuta el servidor en modo desarrollo.
- `npm run start`: ejecuta el servidor en producción.

### Frontend
- `npm run dev`: inicia el servidor de desarrollo de Vite.
- `npm run build`: compila la aplicación para producción.

## 10. Notas de desarrollo

- El sistema está pensado para trabajar con roles claramente separados.
- La lógica de negocio se concentra en los controladores del backend.
- El frontend está estructurado por módulos según el tipo de usuario.
- Se recomienda revisar primero los controladores de solicitudes y comisión para entender el flujo completo del negocio.

## 11. Estado del proyecto

El proyecto ya cuenta con:
- autenticación y roles
- flujo completo de tesis y tutorías
- IA para generar ideas de tesis
- chat en tiempo real
- notificaciones por correo
- paneles diferenciados por rol

## 12. Próximos pasos sugeridos

- Añadir pruebas automatizadas.
- Mejorar validaciones de negocio y manejo de errores.
- Implementar OAuth o autenticación social.
- Mejorar la administración de archivos y documentación técnica.
- Optimizar el rendimiento de consultas a MongoDB.
