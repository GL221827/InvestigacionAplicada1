//este archivo sirve para asegurar las autenticaciones

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { usersDB } from './usuarios.js';  // aqui se accede a la base local userDB que esta en usuarios.js y es ficticia

// Función para registrar un nuevo usuario 
export const registerUser = (req, res) => {
  const { username, password } = req.body;

  // Verificar si el usuario ya existe
  const existingUser = usersDB.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Usuario ya existe' });
  }

  // hashear la contraseña
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Crear el nuevo usuario 
  const newUser = { username, password: hashedPassword };
  usersDB.push(newUser);

  res.status(201).json({ message: 'Usuario registrado' });
};

// Función para iniciar sesión (generar token JWT)
export const loginUser = (req, res) => {
  const { username, password } = req.body;

  // Verificar si el usuario existe
  const user = usersDB.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Usuario no encontrado' });
  }

  // Verificar si la contraseña es correcta
  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Contraseña incorrecta' });
  }

  // Generar un token JWT
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ message: 'Inicio de sesión exitoso', token });
};

// Middleware para verificar el token JWT en rutas protegidas
export const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ message: 'No se proporcionó token de autenticación' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Guardamos la información del usuario en la solicitud
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
