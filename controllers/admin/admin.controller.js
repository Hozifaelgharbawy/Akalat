const admin = require("../../modules/User/user.repo");
const jwt = require("../../helpers/jwt.helper")



exports.register = async (req, res) => {
  try {
    let form
    if (req.body.role != "admin") {
      form = {
        role: "admin",
        ...req.body
      }
    }
    form = req.body
    let result = await admin.create(form)
    if (result.success) {
      return res.status(result.code).json({ success: result.success, code: result.code, record: result.record })
    }
    return res.status(result.code).json({ success: result.success, code: result.code, error: result.error })

  } catch (err) {
    console.log(`err.message`, err.message);
    res.status(500).json({
      success: false,
      code: 500,
      error: "Unexpected Error!"
    });
  }

}



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await admin.comparePassword(email, password);
    if (result.success) {
      payload = {
        _id: result.record._id, name: result.record.name, email: result.record.email,
        role: result.record.role
      }
      const token = jwt.generateToken(payload);
      res.status(result.code).json({ success: result.success, token, code: result.code, record: result.record })
    }
    else {
      res.status(result.code).json(result)
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