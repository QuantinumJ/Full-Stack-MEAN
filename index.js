const app = require('./app'); // Aislamos la logica del app de puerto


const port = process.env.PORT || 5000;



app.listen(5000, () => console.log(`Server is already on ${port}`)); // Arimos el puerto