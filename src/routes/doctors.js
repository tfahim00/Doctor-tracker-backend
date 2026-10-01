const router = require('express').Router();
const ctrl = require('../controllers/doctorController');
const v = require('./validators');
const validate = require('../middleware/validate');

router.get('/', v.list, validate, ctrl.listDoctors);
router.post('/', v.doctor, validate, ctrl.createDoctor);
router.get('/:id', v.id('id'), validate, ctrl.getDoctor);
router.get('/:id/patients', v.id('id'), validate, ctrl.listDoctorPatients);
router.post('/:id/patients', v.id('id'), v.patient, validate, ctrl.addPatient);
router.delete('/:id/patients/:patientId', v.id('id', 'patientId'), validate, ctrl.deletePatient);

module.exports = router;
