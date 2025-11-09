require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('./config/passport'); // registra estrategias
const sessionsRouter = require('./routes/sessions');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Iniciamos passport (necesario si usar sesiones; igual para estrategias)
app.use(passport.initialize());

// Rutas
app.use('/api/sessions', sessionsRouter);

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB conectado'))
  .catch(err => console.error('Error Mongo:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Servidor en puerto ${PORT}`));
