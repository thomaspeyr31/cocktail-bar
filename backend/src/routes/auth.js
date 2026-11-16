const express = require('express');
const { validateLoginBody } = require('../middleware/validate');
const { login } = require('../controllers/authController');

const router = express.Router();

router.post('/login', validateLoginBody, login);

module.exports = router;
