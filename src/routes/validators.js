const { body, param, query } = require('express-validator');

const required = (field, label) => body(field).trim().notEmpty().withMessage(`${label} is required`);

exports.login = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.doctor = [
  required('name', 'Name'),
  required('specialization', 'Specialization'),
  required('hospital', 'Hospital'),
  required('phone', 'Phone'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
];

exports.patient = [
  required('name', 'Name'),
  body('age').isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150').toInt(),
  required('phone', 'Phone'),
  required('condition', 'Condition'),
];

exports.id = (...names) => names.map((n) => param(n).isMongoId().withMessage('Invalid id'));

exports.list = [
  query('from').optional({ values: 'falsy' }).isISO8601().withMessage('Invalid from date'),
  query('to').optional({ values: 'falsy' }).isISO8601().withMessage('Invalid to date'),
  query('page').optional().isInt({ min: 1 }).withMessage('Invalid page'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Invalid limit'),
];
