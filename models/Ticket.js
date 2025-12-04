const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ticketSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  purchaser: {
    type: String,
    required: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }]
}, {
  timestamps: true
});

// Versión CORREGIDA del pre-save hook
ticketSchema.pre('validate', function(next) {
  if (!this.code) {
    // Generar código único
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.code = `TICKET-${timestamp}-${random}`;
  }
  next();
});

ticketSchema.pre('save', function(next) {
  if (!this.code) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.code = `TICKET-${timestamp}-${random}`;
  }
  next();
});

module.exports = model('Ticket', ticketSchema);