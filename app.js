// Instalamos express y lo requirimos
const express = require('express');
const bodyParser = require('body-parser'); // biblioteca que nos permite parsear los datos que nos vienen por body
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path')


const authRouters = require('./routes/authRoute'); // Importamos el router
const categoryRouters = require('./routes/categoryRoute'); // Importamos el router
const analyticsRouters = require('./routes/analyticsRoute'); // Importamos el router
const orderRouters = require('./routes/orderRoute'); // Importamos el router
const positionRouters = require('./routes/positionRoute'); // Importamos el router

const keys = require('./config/keys');
const app = express(); // Lo inicializamos

mongoose.connect(keys.mongoURI)
    .then(() => console.log('Mongo se ha conectado'))
    .catch(error => console.log(error));
app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(require('morgan')('dev')); // Permite ver de como trabaja el servidor de forma mas detallada
app.use('/uploads', express.static('uploads'));
app.use(require('cors')('dev')); // Esta biblioteca nos permite enviar,recibir y recorer cors peticiones

app.use(bodyParser.urlencoded({ extended: true })); // Parsea 
app.use(bodyParser.json());


app.use('/api/auth', authRouters); // concadenamos ( raiz(puerto) + /api/auth + router ('/login'))

app.use('/api/category', categoryRouters); // concadenamos ( raiz(puerto) + /api/auth + router)

app.use('/api/analyticas', analyticsRouters);

app.use('/api/order', orderRouters);

app.use('/api/position', positionRouters);


// Configuracion producccion

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/dist/client'))

    app.get('*', (req, res)=>{
        res.sendFile(
            path.resolve(
                __dirname, 'client', 'dist', 'client', 'index.html'
            )
        )
    })
}


module.exports = app; // Con el  constuctor exportamos la variable