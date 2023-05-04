const restaurant = require("../../modules/Restaurant/restaurant.repo");
const jwt = require("../../helpers/jwt.helper")
const { isValidRestaurant, isValidEmail } = require("../../helpers/restaurant.helper")
let fs = require("fs")


exports.register = async (req, res) => {
  try {
    let form = req.body
    let result = await restaurant.create(form)
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
    const result = await restaurant.comparePassword(email, password);
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

exports.resetPassword = async (req, res) => {
  try {
    const isValid = isValidEmail(req);
    if (isValid) {
      const result = await restaurant.resetPassword(req.body.email, req.body.newPassword);
      res.status(result.code).json(result);
    }
    else res.status(409).json({
      success: false,
      error: "You can only your account!",
      code: 409
    });
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
    let filter = (req.query._id) != undefined ? req.query : { _id: req.tokenData._id, ...req.query }
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

exports.updateRestaurant = async (req, res) => {
  try {
    const isValid = isValidRestaurant(req);
    if (isValid) {
      const result = await restaurant.update(req.query._id, req.body);
      res.status(result.code).json(result);
    }
    else res.status(409).json({
      success: false,
      error: "You can only your account!",
      code: 409
    });
  } catch (err) {
    console.log(`err.message`, err.message);
    res.status(500).json({
      success: false,
      code: 500,
      error: "Unexpected Error!"
    });
  }
}

exports.removeRestaurant = async (req, res) => {
  try {
    const isValid = isValidRestaurant(req);
    if (isValid) {
      const result = await restaurant.remove(req.query._id);
      res.status(result.code).json(result);
    }
    else res.status(409).json({
      success: false,
      error: "You can only your account!",
      code: 409
    });
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
    const isValid = isValidRestaurant(req);
    if (isValid) {
      let image = req.files;
      const result = await restaurant.isExist({ _id: req.query._id })
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
        const update = await restaurant.update(req.query._id, { image: image[0] });
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
    else res.status(409).json({
      success: false,
      error: "You can only your account!",
      code: 409
    });
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
    const isValid = isValidRestaurant(req);
    if (isValid) {
      const result = await restaurant.isExist({ _id: req.query._id })
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
        const update = await restaurant.update(req.query._id, { $unset: { image: 1 } });
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
    else res.status(409).json({
      success: false,
      error: "You can only your account!",
      code: 409
    });
  } catch (err) {
    console.log(`err.message`, err.message);
    res.status(500).json({
      success: false,
      code: 500,
      error: "Unexpected Error!"
    });
  }
}