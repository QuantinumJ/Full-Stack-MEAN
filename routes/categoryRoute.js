const express = require('express');
const passport = require('passport');
const router = express.Router(); // Creacion de Rutas 
const controllerCategory = require('../controllers/categoryController');

const upload = require('../middleware/upload')

// localhost:5000/api/auth/category
router.get('/', passport.authenticate('jwt', { session: false }), controllerCategory.getAllCategory);
router.get('/:id', passport.authenticate('jwt', { session: false }), controllerCategory.getByIdCategory);
router.patch('/:id', upload.single('image'), passport.authenticate('jwt', { session: false }), controllerCategory.updateCategory);
router.delete('/:id', passport.authenticate('jwt', { session: false }), controllerCategory.removeCategory);
router.post('/', upload.single('image'), passport.authenticate('jwt', { session: false }), controllerCategory.createCategory);

module.exports = router;