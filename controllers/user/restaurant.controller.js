const restaurant = require("../../modules/Restaurant/restaurant.repo");

exports.listRstaurants = async (req, res) => {
  try {
    const filter = req.query
    const result = await restaurant.list(filter);
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

exports.getRestaurant = async (req, res) => {
  try {
    let filter = req.query
    const result = await restaurant.get(filter);
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