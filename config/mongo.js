const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB conectado correctamente ✔️");
  } catch (error) {
    console.error("Error conectando a MongoDB ❌", error);
    process.exit(1); // corta el servidor
  }
};

module.exports = connectMongo;
