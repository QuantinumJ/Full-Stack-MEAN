const express = require('express');
const router = express.Router(); // Creacion de Rutas 
const passport = require('passport');
const controllerOrder = require('../controllers/orderContoller');


router.get('/', passport.authenticate('jwt', { session: false }), controllerOrder.getAllOrder);
router.post('/', passport.authenticate('jwt', { session: false }), controllerOrder.createOrder);


module.exports = router;