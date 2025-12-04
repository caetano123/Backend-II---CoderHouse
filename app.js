require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('./config/passport'); 

// Rutas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// Middlewares
app.use(express.json());
app.use(passport.initialize());

// Conexión a Mongo
const connectMongo = require('./config/mongo'); 
connectMongo();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', require('./routes/products'));
app.use('/api/purchases', require('./routes/purchases'))
app.use('/api/cart', require('./routes/cart'));


// Servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
