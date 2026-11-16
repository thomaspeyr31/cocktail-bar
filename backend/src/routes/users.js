const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const { validateUserBody } = require('../middleware/validate');
const { listUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.use(authenticate, requireRole('admin'));

router.get('/', listUsers);
router.post('/', validateUserBody, createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
