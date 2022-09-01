const express = require('express');
const router = express.Router(); // Creacion de Rutas 
const controllerPosition = require('../controllers/positionController');
const passport = require('passport');

router.get('/:categoryId', passport.authenticate('jwt', { session: false }), controllerPosition.getPositionByCategoryId);

router.post('/', passport.authenticate('jwt', { session: false }), controllerPosition.createPosition);
router.patch('/:id', passport.authenticate('jwt', { session: false }), controllerPosition.updatePosition);
router.delete('/:id', passport.authenticate('jwt', { session: false }), controllerPosition.removePosition);




module.exports = router;