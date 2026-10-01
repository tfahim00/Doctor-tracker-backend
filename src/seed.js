// Creates the login user from SEED_EMAIL / SEED_PASSWORD, and sample data if the DB has no doctors.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');

const doctors = [
  ['Dr. Ayesha Rahman', 'Cardiology', 'Square Hospital'],
  ['Dr. Karim Hossain', 'Neurology', 'United Hospital'],
  ['Dr. Nusrat Jahan', 'Pediatrics', 'Evercare Hospital'],
  ['Dr. Tanvir Ahmed', 'Orthopedics', 'Square Hospital'],
  ['Dr. Farhana Islam', 'Dermatology', 'Labaid Hospital'],
];
const conditions = ['Hypertension', 'Diabetes', 'Asthma', 'Migraine', 'Fracture', 'Eczema'];
const firstNames = ['Rahim', 'Sadia', 'Imran', 'Mitu', 'Arif', 'Lamia', 'Shakil', 'Tania', 'Joy', 'Rina'];

async function seed() {
  const { SEED_EMAIL, SEED_PASSWORD, MONGODB_URI } = process.env;
  if (!SEED_EMAIL || !SEED_PASSWORD) throw new Error('SEED_EMAIL and SEED_PASSWORD must be set');
  await mongoose.connect(MONGODB_URI);

  const password = await bcrypt.hash(SEED_PASSWORD, 10);
  await User.updateOne({ email: SEED_EMAIL.toLowerCase() }, { password }, { upsert: true });
  console.log(`User ready: ${SEED_EMAIL}`);

  if ((await Doctor.estimatedDocumentCount()) === 0) {
    const day = 24 * 60 * 60 * 1000;
    const created = await Doctor.insertMany(
      doctors.map(([name, specialization, hospital], i) => ({
        name,
        specialization,
        hospital,
        phone: `01700-00000${i}`,
        email: `${name.split(' ')[1].toLowerCase()}@example.com`,
        createdAt: new Date(Date.now() - (40 - i * 5) * day),
      }))
    );
    const patients = Array.from({ length: 40 }, (_, i) => ({
      name: `${firstNames[i % firstNames.length]} ${String.fromCharCode(65 + (i % 26))}.`,
      age: 5 + ((i * 7) % 70),
      phone: `01800-${String(100000 + i).slice(1)}`,
      condition: conditions[i % conditions.length],
      doctor: created[(i * 3) % created.length]._id,
      createdAt: new Date(Date.now() - (i % 28) * day),
    }));
    await Patient.insertMany(patients);
    console.log(`Inserted ${created.length} doctors and ${patients.length} patients`);
  }
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
