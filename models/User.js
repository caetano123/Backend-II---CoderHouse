const mongoose = require('mongoose');

const { Schema, model, Types } = mongoose;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  age:        { type: Number, required: true },
  password:   { type: String, required: true }, // se espera hash
  cart:       { type: Types.ObjectId, ref: 'Cart', default: null },
  role:       { type: String, enum: ['user','admin'], default: 'user' }
}, { timestamps: true });

// Opcional: método para quitar password al transformar a JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = model('User', userSchema);
