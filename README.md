🛒 E-commerce Auth — Entrega N°1
📋 Descripción

Proyecto de autenticación y autorización de usuarios para un sistema de e-commerce.
Desarrollado con Node.js, Express, MongoDB, Mongoose, Passport, JWT y bcrypt.

Esta entrega implementa un CRUD de usuarios junto con un sistema de login basado en tokens JWT, cumpliendo los requisitos solicitados para la primera entrega del curso de Backend II (Coderhouse).

⚙️ Tecnologías Utilizadas

Node.js

Express

MongoDB / Mongoose

Passport (Local y JWT Strategies)

bcrypt (encriptación de contraseñas)

JSON Web Token (JWT)

dotenv (manejo de variables de entorno)

Nodemon (para desarrollo)

📁 Estructura del Proyecto
app.js
config/
  └── passport.js
models/
  └── User.js
routes/
  └── sessions.js
.env
.gitignore
package.json
README.md

🔐 Variables de Entorno (.env)

Ejemplo del archivo .env (no debe subirse al repositorio):

# === CONFIGURACIÓN GENERAL ===
PORT=3000

# === BASE DE DATOS ===
MONGO_URI=mongodb://localhost:27017/ecommerce

# === JWT (autenticación con token) ===
JWT_SECRET=clave_super_segura_para_jwt
JWT_EXPIRES_IN=1h

🚀 Instalación y Ejecución

Clonar el repositorio:

git clone https://github.com/<tu-usuario>/<tu-repo>.git


Instalar dependencias:

npm install


Crear el archivo .env con las variables de ejemplo.

Ejecutar el servidor:

npm run dev


o bien:

npm start


El servidor se iniciará en:
http://localhost:3000

🧠 Endpoints Principales
1️⃣ Registrar usuario

POST /api/sessions/register

Body (JSON):

{
  "first_name": "Caetano",
  "last_name": "Elizalde",
  "email": "caetano@example.com",
  "age": 17,
  "password": "123456"
}

2️⃣ Iniciar sesión

POST /api/sessions/login

Body (JSON):

{
  "email": "caetano@example.com",
  "password": "123456"
}


Respuesta:

{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}

3️⃣ Obtener usuario actual (requiere token)

GET /api/sessions/current

Header:

Authorization: Bearer <token>


Respuesta:

{
  "user": {
    "first_name": "Caetano",
    "last_name": "Elizalde",
    "email": "caetano@example.com",
    "role": "user"
  }
}

📦 Dependencias Principales
"bcrypt": "^6.0.0",
"body-parser": "^2.2.0",
"dotenv": "^17.2.3",
"express": "^5.1.0",
"jsonwebtoken": "^9.0.2",
"mongoose": "^8.19.3",
"passport": "^0.7.0",
"passport-jwt": "^4.0.1",
"passport-local": "^1.0.0"

👨‍💻 Autor

Caetano Elizalde
Proyecto académico — Backend II (Coderhouse)