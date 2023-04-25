const { log } = require("console");
const user = require("../../modules/User/user.repo");
let fs = require("fs")


exports.createUser = async (req, res) => {
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

exports.resetPassword = async (req, res) => {
  try {
    const result = await user.resetPassword(req.body.email, req.body.newPassword);
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

exports.updateUser = async (req, res) => {
  try {
    const result = await user.update(req.query._id, req.body);
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

exports.removeUser = async (req, res) => {
  try {
    const result = await user.remove(req.query._id, "user");
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

exports.uploadImage = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(`err.message`, err.message);
    res.status(500).json({
      success: false,
      code: 500,
      error: "Unexpected Error!"
    });
  }
}