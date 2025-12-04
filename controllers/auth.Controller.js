const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userRepository = require('../repositories/userRepository'); 
const UserDTO = require('../dtos/userDto');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// -------------------------------------------------
// REGISTER
// -------------------------------------------------
exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const existingUser = await userRepository.getByEmail(email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ message: "Email ya registrado" });
    }

    const saltRounds = 10;
    const passwordHash = bcrypt.hashSync(password, saltRounds);

    const newUser = {
      first_name,
      last_name,
      email: email.toLowerCase(),
      age,
      password: passwordHash,
      role: role || "user",
      cart: null
    };

    const createdUser = await userRepository.create(newUser);

    // Devolver DTO sin datos sensibles
    const dto = new UserDTO(createdUser);

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: dto
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Error del servidor",
      error: error.message
    });
  }
};

// -------------------------------------------------
// LOGIN
// -------------------------------------------------
exports.login = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const user = req.user;

  const payload = {
    sub: user._id.toString(),
    role: user.role,
    email: user.email
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  res.json({
    message: "Login correcto",
    token
  });
};

// -------------------------------------------------
// CURRENT (con DTO sin información sensible)
// -------------------------------------------------
exports.current = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "No autenticado" });

  const dto = new UserDTO(req.user);

  return res.json({ user: dto });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await userRepository.getByEmail(email);
  if(!user) return res.status(404).json({ message: 'Usuario no encontrado' });
  
  const token = generateToken(20); // utils/generateToken.js
  await PasswordResetToken.create({ userId: user._id, token, expires: Date.now() + 3600000 }); // 1h

  await mailService.sendPasswordReset(user.email, token);

  res.json({ message: 'Email enviado para recuperación' });
};

// POST /reset-password/:token
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const record = await PasswordResetToken.findOne({ token });
  if(!record || record.expires < Date.now()) return res.status(400).json({ message: 'Token inválido o expirado' });

  const user = await userRepository.getById(record.userId);
  const isSame = await bcrypt.compare(newPassword, user.password);
  if(isSame) return res.status(400).json({ message: 'No puedes usar la misma contraseña' });

  const hash = bcrypt.hashSync(newPassword, 10);
  await userRepository.updatePassword(user._id, hash);
  await record.delete();

  res.json({ message: 'Contraseña actualizada correctamente' });
};