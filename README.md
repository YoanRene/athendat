# Athendat - API de Gestión de Usuarios

Athendat es una API RESTful desarrollada con NestJS para la gestión de usuarios con autenticación JWT y comunicación en tiempo real mediante WebSockets.

## Características

- Registro y autenticación de usuarios
- Gestión completa de usuarios (CRUD)
- Autenticación mediante JWT (JSON Web Tokens)
- Comunicación en tiempo real con WebSockets
- Documentación de API con Swagger
- Registro de logs con Winston

## Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (local o remoto)
- npm o yarn

## Instalación

1. Clonar el repositorio o descargar el código fuente

2. Instalar las dependencias:

```bash
npm install
```

## Configuración

1. Crear un archivo `.env` en la raíz del proyecto con la siguiente configuración (o modificar el existente):

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/athendat
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=3600
LOG_LEVEL=info
LOG_FILE_PATH=logs/app.log
```

Asegúrate de cambiar `your_jwt_secret_key` por una clave secreta segura.

## Ejecución de la Aplicación

### Modo Desarrollo

```bash
npm run start:dev
```

Este comando inicia la aplicación en modo de desarrollo con recarga automática cuando se detectan cambios en el código.

### Modo Producción

```bash
npm run build
npm run start:prod
```

## Documentación de la API

La documentación de la API está disponible a través de Swagger UI. Una vez que la aplicación esté en ejecución, puedes acceder a la documentación en:

```
http://localhost:3000/api
```

## Endpoints Principales

### Autenticación

- **POST /auth/login** - Iniciar sesión con nombre de usuario y contraseña
- **POST /auth/logout** - Cerrar sesión (elimina la cookie JWT)

### Usuarios

- **POST /users** - Crear un nuevo usuario
- **GET /users** - Obtener todos los usuarios (requiere autenticación)
- **GET /users/:id** - Obtener un usuario por ID (requiere autenticación)
- **PATCH /users/:id** - Actualizar un usuario (requiere autenticación)
- **DELETE /users/:id** - Eliminar un usuario (requiere autenticación)

## WebSockets

La aplicación utiliza Socket.IO para la comunicación en tiempo real. Los clientes pueden conectarse al servidor WebSocket y recibir notificaciones cuando se realizan operaciones sobre los usuarios.

### Eventos disponibles

- **userOperation** - Se emite cuando se crea, actualiza o elimina un usuario

## Prueba de WebSockets

Para verificar el funcionamiento de la comunicación en tiempo real mediante Socket.IO, puedes utilizar el archivo `socket-test.html` incluido en el proyecto. Este archivo proporciona una interfaz visual que permite:

- Monitorear el estado de conexión con el servidor WebSocket
- Visualizar los eventos de operaciones de usuarios en tiempo real
- Ver el historial de mensajes y eventos con marcas de tiempo

Para usar el archivo de prueba:

1. Asegúrate de que el servidor esté en ejecución
2. Abre el archivo `socket-test.html` en tu navegador
3. Observa cómo se actualiza automáticamente la interfaz cuando se realizan operaciones CRUD en la API

Ejemplo de conexión desde el cliente:

```javascript
// Cliente JavaScript
const socket = io('http://localhost:3000');

socket.on('userOperation', (data) => {
  console.log(data.message); // Ej: "El usuario john realizó la operación creación"
  console.log(data.timestamp); // Timestamp de la operación
});
```

## Estructura del Proyecto

- **src/auth/** - Módulo de autenticación
- **src/users/** - Módulo de gestión de usuarios
- **src/websockets/** - Módulo de WebSockets
- **src/config/** - Configuración de la aplicación
- **src/database/** - Configuración de la base de datos
- **src/logging/** - Configuración de logs

## Logs

Los logs de la aplicación se guardan en el directorio especificado en la variable de entorno `LOG_FILE_PATH`. Por defecto, se guardan en `logs/app.log`.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.
