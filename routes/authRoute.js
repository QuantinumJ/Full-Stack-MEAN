const express = require('express');
const router = express.Router(); // Creacion de Rutas 
const controllerAuth = require('../controllers/authController');


// localhost:5000/api/auth/login
router.post('/login', controllerAuth.login);

// localhost:5000/api/auth/register
router.post('/register', controllerAuth.register);


module.exports = router;