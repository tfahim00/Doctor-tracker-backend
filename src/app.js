const express = require('express');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', auth, require('./routes/doctors'));
app.use('/api/patients', auth, require('./routes/patients'));
app.use('/api/dashboard', auth, require('./routes/dashboard'));

app.use('/api', (req, res) => res.status(404).json({ message: 'Not found' }));
app.use(errorHandler);

module.exports = app;
