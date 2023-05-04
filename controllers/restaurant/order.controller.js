const order = require("../../modules/Order/order.repo");
const deliveryRepo = require("../../modules/Delivery/delivery.repo");



exports.listOrders = async (req, res) => {
    try {
        const filter = { restaurant: req.tokenData._id, ...req.query }
        const records = await order.list(filter);
        res.status(records.code).json(records);
    } catch (err) {
        console.log(`err.message`, err.message);
        res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error!"
        });
    }
}

exports.getOrder = async (req, res) => {
    try {
        const filter = { restaurant: req.tokenData._id, ...req.query }
        const record = await order.get(filter);
        res.status(record.code).json(record);
    } catch (err) {
        console.log(`err.message`, err.message);
        res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error!"
        });
    }
}

exports.applyOrder = async (req, res) => {
    try {
        let orderId = req.body.order ? req.body.order : req.query.order
        let deliveryId = req.body.delivery ? req.body.delivery : req.query.delivery
        let record = await deliveryRepo.isExist({ _id: deliveryId, restaurant: req.tokenData._id })
        let result = await order.isExist({ _id: orderId, status: "pending" });
        if (record.success && (record.record.restaurant).toString() != (result.record.restaurant).toString()) return res.status(400).json({ success: false, code: 400, error: "This order is not for a restaurant" });
        if (!record.success) return res.status(400).json({ success: false, code: 400, error: "This delivery is not for a restaurant" });
        if (result.record.delivery) return res.status(400).json({ success: false, code: 400, error: "This order has delivery" });
        if (result.success) result = await order.update(result.record._id, { delivery: deliveryId });
        res.status(result.code).json(result);
    } catch (err) {
        console.log(`err.message`, err.message);
        res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error!"
        });
    }
}