const user = require("../../modules/User/user.repo");

exports.listUsers = async (req, res) => {
  try {
    const filter = {
      role: "user",
      ...req.query
    };
    const result = await user.list(filter);
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

exports.getUser = async (req, res) => {
  try {
    let filter
    if (Object.keys(req.query).length != 0) {
      filter = {
        role: "user",
        ...req.query
      };
    }
    const result = await user.get(filter);
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