const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/orderController');

const router = express.Router();

router.get('/', ctrl.listOrders);
router.get('/:id', ctrl.getOrder);
router.post('/', ctrl.createOrder);
router.put('/:id', authenticate, requireRole('staff', 'admin'), ctrl.updateOrder);
router.delete('/:id', authenticate, requireRole('staff', 'admin'), ctrl.deleteOrder);

module.exports = router;
