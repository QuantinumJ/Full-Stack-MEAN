const multer = require('multer'); // Para trabajar con archivos
const moment = require('moment');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/') // Comprobamos que no hay error, creamos destino
    },
    filename(req, file, cb) {
        const date = moment().format('DDMMYYYY-HHmmss_SSS');
        cb(null, ` ${date}-${file.originalname}`);
    }
})
const fileFilter = (req, file, cb) => {
    // para comprobar si el archivo es una imagen 
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true) // No hay error y es imagen , le permitimos seguir su camino
    } else {
        cb(null, false)
    }
}
const limit = {
    fileSize: 1024 * 1024 * 5
}

module.exports = multer({ storage, fileFilter, limit });