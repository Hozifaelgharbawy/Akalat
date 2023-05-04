const delivery = require("../../modules/Delivery/delivery.repo");


exports.listDelivery = async (req, res) => {
  try {
    const filter = req.query
    const result = await delivery.list(filter);
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

exports.getDelivery = async (req, res) => {
  try {
    let filter = req.query
    const result = await delivery.get(filter);
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