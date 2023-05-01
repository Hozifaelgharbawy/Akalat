const order = require("../../modules/Order/order.repo");


exports.listOrders = async (req, res) => {
    try {
        const filter = { user: req.tokenData._id, ...req.query }
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
        let filter
        if (Object.keys(req.query).length != 0) filter = { restaurant: req.tokenData._id, ...req.query }
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
