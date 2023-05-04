const user = require("../../modules/User/user.repo");
const jwt = require("../../helpers/jwt.helper")
const { isValidEmail, isValidUser } = require("../../helpers/user.helper")
let fs = require("fs")


exports.register = async (req, res) => {
  try {
    let form
    if (req.body.role != "user") {
      form = {
        role: "user",
        ...req.body
      }
    }
    form = req.body
    let result = await user.create(form)
    return res.status(result.code).json(result)
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
    const result = await user.comparePassword(email, password);
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

exports.getUser = async (req, res) => {
  try {
    const isValid = await isValidUser(req);
    if (isValid) {
      let filter
      if (Object.keys(req.query).length != 0) {
        filter = {
          role: "user",
          ...req.query
        };
      }
      const result = await user.get(filter);
      res.status(result.code).json(result);
    }
    else {
      res.status(409).json({
        success: false,
        error: "You can only control your account!",
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

exports.resetPassword = async (req, res) => {
  try {
    const isValid = await isValidEmail(req);
    if (isValid) {
      const result = await user.resetPassword(req.body.email, req.body.newPassword);
      res.status(result.code).json(result);
    }
    else {
      res.status(409).json({
        success: false,
        error: "You can only control your email!",
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

exports.updateUser = async (req, res) => {
  try {
    const isValid = await isValidUser(req);
    if (isValid) {
      const result = await user.update(req.query._id, req.body);
      res.status(result.code).json(result);
    }
    else {
      res.status(409).json({
        success: false,
        error: "You can only update your data!",
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

exports.removeUser = async (req, res) => {
  try {
    const isValid = await isValidUser(req);
    if (isValid) {
      const result = await user.remove(req.query._id, "user");
      res.status(result.code).json(result);
    }
    else {
      res.status(409).json({
        success: false,
        error: "You can only delete your account!",
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

exports.uploadImage = async (req, res) => {
  try {
    const isValid = await isValidUser(req);
    if (isValid) {
      let image = req.files;
      const result = await user.isExist({ _id: req.query._id, role: "user" })
      if (result.success) {
        let oldImage = (result.success && result.record.image) ? (result.record.image) : false
        if (oldImage) {
          try {
            await fs.unlinkSync(oldImage.path);
          }
          catch (err) {
            console.log(`err`, err.errno);
          }
        }
        const update = await user.update(req.query._id, { image: image[0] });
        if (update.success) {
          res.status(update.code).json({ success: update.success, record: update.record.image, code: update.code });
        }
        else {
          res.status(update.code).json({ success: update.success, error: update.error, code: update.code });
        }
      }
      else {
        res.status(result.code).json({ success: result.success, error: result.error, code: result.code });
      }
    }
    else {
      res.status(409).json({
        success: false,
        error: "You can only update your image!",
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

exports.deleteImage = async (req, res) => {
  try {
    const isValid = await isValidUser(req);
    if (isValid) {
      const result = await user.isExist({ _id: req.query._id, role: "user" })
      if (result.success) {
        let oldImage = (result.success && result.record.image) ? (result.record.image) : false
        if (oldImage) {
          try {
            await fs.unlinkSync(oldImage.path);
          }
          catch (err) {
            console.log(`err`, err.errno);
          }
        }
        const update = await user.update(req.query._id, { $unset: { image: 1 } });
        if (update.success) {
          res.status(update.code).json({ success: update.success, code: update.code });
        }
        else {
          res.status(update.code).json({ success: update.success, error: update.error, code: update.code });
        }
      }
      else {
        res.status(result.code).json({ success: result.success, error: result.error, code: result.code });
      }
    }
    else {
      res.status(409).json({
        success: false,
        error: "You can only update your image!",
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