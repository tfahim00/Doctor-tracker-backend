const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

exports.getDashboard = async (req, res) => {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - 29);

  const [totalDoctors, totalPatients, patientsPerDoctor, patientsByDate] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
    // Top 10 doctors by patient count.
    Patient.aggregate([
      { $group: { _id: '$doctor', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'doctors', localField: '_id', foreignField: '_id', as: 'doctor' } },
      { $unwind: '$doctor' },
      { $project: { _id: 0, doctorId: '$_id', name: '$doctor.name', count: 1 } },
    ]),
    // New patients per day over the last 30 days.
    Patient.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', count: 1 } },
    ]),
  ]);

  // Fill days with no new patients so the chart shows them as 0 instead of skipping them.
  const counts = Object.fromEntries(patientsByDate.map((d) => [d.date, d.count]));
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(since.getTime() + i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    return { date, count: counts[date] || 0 };
  });

  res.json({ totalDoctors, totalPatients, patientsPerDoctor, patientsByDate: days });
};
