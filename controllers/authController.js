const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, cart, role } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    // Verificar email único
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email ya registrado' });

    // Encriptar contraseña con bcrypt.hashSync
    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(password, saltRounds);

    const user = new User({
      first_name,
      last_name,
      email: email.toLowerCase(),
      age,
      password: passwordHash,
      cart: cart || null,
      role: role || 'user'
    });

    await user.save();

    // No devolver el hash en la respuesta (user.toJSON ya borra password)
    res.status(201).json({ message: 'Usuario creado', user: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error del servidor', error: err.message });
  }
};

exports.login = (req, res, next) => {
  // Passport local strategy debe haber autenticado al usuario y pegado en req.user
  if (!req.user) {
    return res.status(401).json({ message: 'Autenticación fallida' });
  }

  const user = req.user;

  // Crear JWT (payload mínimo): sub = user._id, role, iat automaticamente, exp por opción
  const payload = {
    sub: user._id.toString(),
    role: user.role,
    email: user.email
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  res.json({ message: 'Login correcto', token });
};

exports.current = (req, res) => {
  // Esta ruta se protegerá con passport jwt y pondrá user en req.user
  if (!req.user) return res.status(401).json({ message: 'No autenticado' });

  // req.user es un documento mongoose; usamos toJSON para eliminar password
  res.json({ user: req.user });
};
