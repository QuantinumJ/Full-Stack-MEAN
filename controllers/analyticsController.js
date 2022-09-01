const moment = require('moment')
const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');




module.exports.overview = async function(req, res) {
        try {
            // Buscamos todos los pedidos del usuario y los sortiamos de antigua a los nuevos
            const allOrders = await Order.find({ user: req.user.id }).sort({date: 1})
          

            const ordersMap = getOrdersMap(allOrders)
           
            const yesterdayOrders = ordersMap[moment().add(-1, 'd').format("DD.MM.YYYY")] || []
           
                // Cantidad de pedidos ayer
            const yesterdayOrdersNumber = yesterdayOrders.length

                //--Funcionalidades analiticas
                // Encontrar cantidad de pedidos
            const totalOrdersNumbres = allOrders.length

                // Cantidad de dias totales
            const daysNumber = Object.keys(ordersMap).length

                // cantidad de pedidos al dia
            const ordersPerDay = (totalOrdersNumbres / daysNumber).toFixed(0)

                // Porcentaje para la cantidad de pedidos
                // ((pedidos ayer)/ pedidos al dia) - 1 )*100

            const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2)

                // Ganancia total
            const totalGain = calculatePrice(allOrders)

                // ganacias al dia
            const gainPerDay = totalGain / daysNumber

                // ganacias de ayer
            const yesterdayGain = calculatePrice(yesterdayOrders)

                // porcenteja de ganacias
            const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2)

                // Diferencia entre cantidad de pedidos y ganacias por pedidos
            const compareGain = (yesterdayGain - gainPerDay).toFixed(2)
            const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2)

            res.status(200).json({
                gain: {
                    percent: Math.abs(+gainPercent),
                    compare: Math.abs(+compareGain),
                    yesterday: +yesterdayGain,
                    isHigher: +gainPercent > 0

                },
                orders: {
                    percent: Math.abs(+ordersPercent),
                    compare: Math.abs(+compareNumber),
                    yesterday: +yesterdayOrdersNumber,
                    isHigher: +ordersPercent > 0

                }
            })




        } catch (error) {
            errorHandler(res, error)
        }

    }

    // recorremos y lo mapeamos por fechas 
function getOrdersMap(orders = []) {
    const daysOrder = {}
    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY')

        if (date === moment().format('DD.MM.YYYY')) {
            return
        }
        if (!daysOrder[date]) {
            daysOrder[date] = []
        }
        daysOrder[date].push(order)

    })

    return daysOrder

}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const cost = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity
        }, 0)
        return total += cost
    }, 0)
}


module.exports.analytics = async function(req, res) {
try {
    const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
    const ordersMap = getOrdersMap(allOrders)

    const average = + (calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2)

    const chart = Object.keys(ordersMap).map(label =>{
        // label == 05.05.2022
        const gain = calculatePrice(ordersMap[label])
        const order = ordersMap[label].length
        
        return{
            label, gain, order
        }
    })

    res.status(200).json({
        average,
        chart
    })
    
} catch (error) {
    errorHandler(res,error)
}


}