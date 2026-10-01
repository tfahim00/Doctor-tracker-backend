const router = require('express').Router();
const ctrl = require('../controllers/patientController');
const v = require('./validators');
const validate = require('../middleware/validate');

router.get('/', v.list, validate, ctrl.listPatients);
router.put('/:id', v.id('id'), v.patient, validate, ctrl.updatePatient);
router.delete('/:id', v.id('id'), validate, ctrl.deletePatient);

module.exports = router;
