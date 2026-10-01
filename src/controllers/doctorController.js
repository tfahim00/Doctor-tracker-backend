const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { buildListQuery } = require('./listQuery');

exports.listDoctors = async (req, res) => {
  const { filter, page, limit, skip } = buildListQuery(req.query);
  if (req.query.specialization) filter.specialization = req.query.specialization;

  const [data, total, specializations] = await Promise.all([
    Doctor.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Doctor.countDocuments(filter),
    Doctor.distinct('specialization'),
  ]);
  res.json({ data, total, page, pages: Math.ceil(total / limit) || 1, specializations: specializations.sort() });
};

exports.createDoctor = async (req, res) => {
  const { name, specialization, hospital, phone, email } = req.body;
  const doctor = await Doctor.create({ name, specialization, hospital, phone, email });
  res.status(201).json(doctor);
};

exports.getDoctor = async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).lean();
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json(doctor);
};

exports.listDoctorPatients = async (req, res) => {
  const patients = await Patient.find({ doctor: req.params.id }).sort({ createdAt: -1 }).lean();
  res.json(patients);
};

exports.addPatient = async (req, res) => {
  const exists = await Doctor.exists({ _id: req.params.id });
  if (!exists) return res.status(404).json({ message: 'Doctor not found' });
  const { name, age, phone, condition } = req.body;
  const patient = await Patient.create({ name, age, phone, condition, doctor: req.params.id });
  res.status(201).json(patient);
};

exports.deletePatient = async (req, res) => {
  const patient = await Patient.findOneAndDelete({ _id: req.params.patientId, doctor: req.params.id });
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json({ message: 'Patient deleted' });
};
