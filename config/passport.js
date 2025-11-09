const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Local strategy: para login con email + password
passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return done(null, false, { message: 'Usuario no encontrado' });

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return done(null, false, { message: 'Contraseña incorrecta' });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// JWT strategy: extrae token del header Authorization Bearer <token>
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
};

passport.use('jwt', new JwtStrategy(opts, async (payload, done) => {
  try {
    // payload debe contener user id (ej: { sub: user._id } al crear token)
    const user = await User.findById(payload.sub);
    if (!user) return done(null, false, { message: 'Token inválido' });
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;
