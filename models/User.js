const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  age:        { type: Number, required: true },
  password:   { type: String, required: true },
  
  // CAMBIA ESTO: de ObjectId a objeto embebido
  cart: {
    type: {
      items: [
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
          },
          quantity: {
            type: Number,
            default: 1,
            min: 1
          }
        }
      ]
    },
    default: { items: [] }  // Valor por defecto
  },
  
  role: { type: String, enum: ['user','admin'], default: 'user' }
}, { 
  timestamps: true 
});

// Método para quitar password al transformar a JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = model('User', userSchema);