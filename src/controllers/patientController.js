const Patient = require('../models/Patient');
const { buildListQuery } = require('./listQuery');

exports.listPatients = async (req, res) => {
  const { filter, page, limit, skip } = buildListQuery(req.query);
  if (req.query.condition) filter.condition = req.query.condition;

  const [data, total, conditions] = await Promise.all([
    Patient.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('doctor', 'name').lean(),
    Patient.countDocuments(filter),
    Patient.distinct('condition'),
  ]);
  res.json({ data, total, page, pages: Math.ceil(total / limit) || 1, conditions: conditions.sort() });
};

exports.updatePatient = async (req, res) => {
  const { name, age, phone, condition } = req.body;
  const patient = await Patient.findByIdAndUpdate(
    req.params.id,
    { name, age, phone, condition },
    { new: true, runValidators: true }
  ).populate('doctor', 'name');
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json(patient);
};

exports.deletePatient = async (req, res) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json({ message: 'Patient deleted' });
};
