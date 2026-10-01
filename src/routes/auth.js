const router = require('express').Router();
const ctrl = require('../controllers/authController');
const v = require('./validators');
const validate = require('../middleware/validate');

router.post('/login', v.login, validate, ctrl.login);
router.post('/logout', ctrl.logout);

module.exports = router;
