const order = require("../../modules/Order/order.repo");
const { isValid } = require("../../helpers/restaurant.helper")



exports.listOrders = async (req, res) => {
    try {
        const isValidRestaurant = await isValid(req);
        if (isValidRestaurant) {
            const filter = req.query;
            const records = await order.list(filter);
            res.status(records.code).json(records);
        }
        else {
            res.status(409).json({
                success: false,
                error: "You can only see your orders!",
                code: 409
            });
        }
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
        const isValidRestaurant = await isValid(req);
        if (isValidRestaurant) {
            const filter = req.query;
            const record = await order.get(filter);
            res.status(record.code).json(record);
        }
        else {
            res.status(409).json({
                success: false,
                error: "You can only see your orders!",
                code: 409
            });
        }
    } catch (err) {
        console.log(`err.message`, err.message);
        res.status(500).json({
            success: false,
            code: 500,
            error: "Unexpected Error!"
        });
    }
}