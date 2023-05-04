const restaurant = require("../../modules/Restaurant/restaurant.repo");
let fs = require("fs")


exports.createRstaurant = async (req, res) => {
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

exports.resetPassword = async (req, res) => {
  try {
    const result = await restaurant.resetPassword(req.body.email, req.body.newPassword);
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

exports.updateRestaurant = async (req, res) => {
  try {
    const result = await restaurant.update(req.query._id, req.body);
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

exports.removeRestaurant = async (req, res) => {
  try {
    const result = await restaurant.remove(req.query._id);
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
  } catch (err) {
    console.log(`err.message`, err.message);
    res.status(500).json({
      success: false,
      code: 500,
      error: "Unexpected Error!"
    });
  }
}