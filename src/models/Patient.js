const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    phone: { type: String, required: true, trim: true },
    condition: { type: String, required: true, trim: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

patientSchema.index({ name: 'text' });
patientSchema.index({ doctor: 1, createdAt: -1 });
patientSchema.index({ condition: 1 });

module.exports = mongoose.model('Patient', patientSchema);
