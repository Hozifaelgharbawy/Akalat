const mael = require("../../modules/Meal/mael.repo");


exports.listMaels = async (req, res) => {
  try {
    const filter = req.query
    const result = await mael.list(filter);
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

exports.getMael = async (req, res) => {
  try {
    let filter = req.query
    const result = await mael.get(filter);
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