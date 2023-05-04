const admin = require("../../modules/User/user.repo");
const jwt = require("../../helpers/jwt.helper")
const { isValidEmail, isValidAdmin } = require("../../helpers/admin.helper")
let fs = require("fs")



exports.createAdmin = async (req, res) => {
  try {
    if (req.token.role != "superAdmin") return res.status(409).json({ success: false, error: "Only superAdmin can create an admins!", code: 409 });
    let form
    if (req.body.role != "admin" || req.body.role != "superAdmin") {
      form = {
        role: "admin",
        ...req.body
      }
    }
    form = req.body
    let result = await admin.create(form)
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


exports.resetPassword = async (req, res) => {
  try {
    const isValid = await isValidEmail(req);
    if (isValid) {
      const result = await admin.resetPassword(req.body.email, req.body.newPassword);
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


exports.listAdmins = async (req, res) => {
  try {
    const filter = {
      role: "admin",
      ...req.query
    };
    const result = await admin.list(filter);
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



exports.getAdmin = async (req, res) => {
  try {
    let filter
    if (Object.keys(req.query).length != 0) {
      filter = {
        role: "admin",
        ...req.query
      };
    }
    const result = await admin.get(filter);
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


exports.updateAdmin = async (req, res) => {
  try {
    const isValid = await isValidAdmin(req);
    if (isValid) {
      const result = await admin.update(req.query._id, req.body);
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


exports.removeAdmin = async (req, res) => {
  try {
    const isValid = await isValidAdmin(req);
    if (isValid) {
      const result = await admin.remove(req.query._id, "admin");
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
    const isValid = await isValidAdmin(req);
    if (isValid) {
      let image = req.files;
      const result = await admin.isExist({ _id: req.query._id, role: "admin" })
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
        const update = await admin.update(req.query._id, { image: image[0] });
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
    const isValid = await isValidAdmin(req);
    if (isValid) {
      const result = await admin.isExist({ _id: req.query._id, role: "admin" })
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
        const update = await admin.update(req.query._id, { $unset: { image: 1 } });
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