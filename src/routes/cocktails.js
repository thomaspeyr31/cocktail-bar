const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/cocktailController');

const router = express.Router();

router.get('/', ctrl.listCocktails);
router.get('/:id', ctrl.getCocktail);
router.post('/', authenticate, requireRole('admin'), ctrl.createCocktail);
router.put('/:id', authenticate, requireRole('admin'), ctrl.updateCocktail);
router.patch('/:id', authenticate, requireRole('admin'), ctrl.patchCocktail);
router.delete('/:id', authenticate, requireRole('admin'), ctrl.deleteCocktail);

module.exports = router;
