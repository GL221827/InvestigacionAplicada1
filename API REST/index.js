// Importamos las dependencias necesarias
import express from 'express'; //el framework para manejar las rutas
import jwt from 'jsonwebtoken'; //para autenticación con JWT.
import bcrypt from 'bcryptjs'; //para encriptar contraseñas.
import dotenv from 'dotenv'; //para manejar variables de entorno.
import { registerUser, loginUser, authMiddleware } from './routes/auth.js';  // Funciones de autenticación
import { usersDB } from './routes/usuarios.js';  // Base de datos ficticia

// Configuramos las variables de entorno
dotenv.config();

// Creamos la aplicación Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware para analizar cuerpos JSON
app.use(express.json());

// Ruta de registro de usuario
app.post('/auth/register', (req, res) => {
  registerUser(req, res);
});

// Ruta de inicio de sesión
app.post('/auth/login', (req, res) => {
  loginUser(req, res);
});

// Ruta protegida (requiere autenticación)
app.get('/data/info', authMiddleware, (req, res) => {
  res.json({ message: 'Acceso autorizado', user: req.user });
});

// Ruta de prueba (sin autenticación)
app.get('/public', (req, res) => {
  res.json({ message: 'Ruta pública accesible sin autenticación' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal' });
});

// Arrancamos el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
