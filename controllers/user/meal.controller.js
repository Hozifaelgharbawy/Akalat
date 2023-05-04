const meal = require("../../modules/Meal/meal.repo");


exports.listMeals = async (req, res) => {
  try {
    const filter = req.query
    const result = await meal.list(filter);
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

exports.getMeal = async (req, res) => {
  try {
    let filter = req.query
    const result = await meal.get(filter);
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