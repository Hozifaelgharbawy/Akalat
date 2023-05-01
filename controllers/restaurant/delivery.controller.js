const delivery = require("../../modules/Delivery/delivery.repo");
const { isValid } = require("../../helpers/restaurant.helper")
let fs = require("fs")


exports.createDelivery = async (req, res) => {
  try {
    const isValidRestaurant = await isValid(req);
    if (isValidRestaurant) {
      let form = (req.body.restaurant) != undefined && (req.body.restaurant) != "" ? req.body : { restaurant: req.tokenData._id, ...req.body }
      let result = await delivery.create(form)
      return res.status(result.code).json(result)
    }
    else {
      res.status(409).json({
        success: false,
        error: "You can only control your delivery!",
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
    const Delivery = await delivery.isExist({ email: req.body.email, restaurant: req.tokenData._id });
    if (Delivery.success) {
      const result = await delivery.resetPassword(req.body.email, req.body.newPassword);
      res.status(result.code).json(result);
    }
    else {
      res.status(409).json({
        success: false,
        error: "You can only control your delivery!",
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

exports.listDelivery = async (req, res) => {
  try {
    const filter = { restaurant: req.tokenData._id, ...req.query }
    const result = await delivery.list(filter);
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

exports.getDelivery = async (req, res) => {
  try {
    let filter
    if (Object.keys(req.query).length != 0) filter = { restaurant: req.tokenData._id, ...req.query }
    const result = await delivery.get(filter);
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

exports.updateDelivery = async (req, res) => {
  try {
    const Delivery = await delivery.isExist({ _id: req.query._id, restaurant: req.tokenData._id });
    if (Delivery.success) {
      const result = await delivery.update(req.query._id, req.body);
      res.status(result.code).json(result);
    }
    else {
      res.status(409).json({
        success: false,
        error: "You can only control your delivery!",
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

exports.removeDelivery = async (req, res) => {
  try {
    const Delivery = await delivery.isExist({ _id: req.query._id, restaurant: req.tokenData._id });
    if (Delivery.success) {
      const result = await delivery.remove(req.query._id);
      res.status(result.code).json(result);
    }
    else {
      res.status(409).json({
        success: false,
        error: "You can only control your delivery!",
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
    let image = req.files;
    const result = await delivery.isExist({ _id: req.query._id, restaurant: req.tokenData._id })
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
      const update = await delivery.update(req.query._id, { image: image[0] });
      if (update.success) {
        res.status(update.code).json({ success: update.success, record: update.record.image, code: update.code });
      }
      else {
        res.status(update.code).json({ success: update.success, error: update.error, code: update.code });
      }
    }
    else {
      res.status(409).json({
        success: false,
        error: "You can only control your delivery!",
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
    const result = await delivery.isExist({ _id: req.query._id, restaurant: req.tokenData._id })
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
      const update = await delivery.update(req.query._id, { $unset: { image: 1 } });
      if (update.success) {
        res.status(update.code).json({ success: update.success, code: update.code });
      }
      else {
        res.status(update.code).json({ success: update.success, error: update.error, code: update.code });
      }
    }
    else {
      res.status(409).json({
        success: false,
        error: "You can only control your delivery!",
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