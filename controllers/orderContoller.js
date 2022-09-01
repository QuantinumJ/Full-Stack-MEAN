const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');


// (get) localhost:500/api/order?offset=2&limit=5 => limit(Maximo elementos a devolver) offset(cuantos posiciones hay que saltar)
module.exports.getAllOrder = async function(req, res) {
    const query = {
        user: req.user.id
    };
    // fecha de inicio
    if (req.query.start) {
        query.date = {
            // mas o igual a
            $gte: req.query.start
        }
    } else {
        console.log(query.date);
    }
    // fecha de fin
    if (req.query.end) {
        if (!query.date) {
            query.date = null
        } else {
            query.date['$lte'] = req.query.end
        }
    }
    if (req.query.order) {
        query.order = +req.query.order
    }

    try {
        const orders = await Order
            .find(query)
            .sort({ date: -1 })
            .skip(+req.query.offset) // Al poner un + antes de un string que contenga Number se parsea a number
            .limit(+req.query.limit)

        res.status(200).json(orders)
    } catch (error) {
        errorHandler(res, error)
    }


}

module.exports.createOrder = async function(req, res) {
    try {
        const lastOrder = await Order
            .findOne({
                user: req.user.id
            })
            .sort({ date: -1 })
        const maxOrder = lastOrder ? lastOrder.order : 0

        const order = await new Order({
            list: req.body.list,
            user: req.user.id,
            order: maxOrder + 1
        }).save();

        res.status(201).json(order);
    } catch (error) {

        res.errorHandler(error)
    }



}