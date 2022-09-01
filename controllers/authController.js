const bcrypt = require('bcryptjs');
const { findOne } = require('../models/User');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function(req, res) {

    const candidate = await User.findOne({
        email: req.body.email
    })
    if (candidate) {
        // Comprobacion de pass, existencia de usuario
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            // Generacion del token, si los pass coinciden
            // Passamos al metodo de jwt 1 los datos que queremos que contenga el token, 
            // 2 parametro ( key )algoritmo a aplicar, 3 - parametro el tiempo de la vida del token
            const token = jwt.sign({
                    email: candidate.email,
                    userId: candidate._id
                }, keys.jwt, { expiresIn: 60 * 60 }) // 60sec => 60min

            res.status(200).json({
                token: `Bearer ${token}`
            })

        } else {
            res.status(401).json({ message: " el password no es correcto" })
        }
    } else {
        res.status(404).json({
            message: " Usuario con este email no encontrado"
        })
    }



}


module.exports.register = async function(req, res) {
    // email password 1- enviar 2 verificar la existencia // 3 generamos codificacion
    const candidate = await User.findOne({ email: req.body.email });
    if (candidate) {
        // si el usuario existe hay que lanzar error de existencia
        res.status(409).json({
            message: " Este email ya existe. Intenta con otro "
        })
    } else {
        // Generacion de hash
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
            // hay que generar usuario

        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
        try {
            await user.save();
            res.status(201).json(user);
        } catch (error) {
            errorHandler(res, error);
        }

    }
}