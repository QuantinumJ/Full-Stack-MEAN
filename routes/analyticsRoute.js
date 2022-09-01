const express = require('express');
const passport = require('passport');
const router = express.Router(); // Creacion de Rutas 
const controllerAnalitcs = require('../controllers/analyticsController');


router.get('/overview', passport.authenticate('jwt', { session: false }), controllerAnalitcs.overview);

router.get('/analyticas', passport.authenticate('jwt', { session: false }), controllerAnalitcs.analytics)




module.exports = router;