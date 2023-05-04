const meal = require("../../modules/Meal/meal.repo");
let fs = require("fs")


exports.createMeal = async (req, res) => {
  try {
    let form = req.body
    let result = await meal.create(form)
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

exports.updateMeal = async (req, res) => {
  try {
    const result = await meal.update(req.query._id, req.body);
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

exports.removeMeal = async (req, res) => {
  try {
    const result = await meal.remove(req.query._id);
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
    const result = await meal.isExist({ _id: req.query._id })
    if (result.success) {
      let oldImage = (result.success && result.record.image) ? (result.record.image) : false
      if (oldImage) {
        try {
          await oldImage.map((image) => {
            fs.unlinkSync(image.path);
          })
        }
        catch (err) {
          console.log(`err`, err.errno);
        }
      }
      const update = await meal.update(req.query._id, { image: image });
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

exports.addToImagesArray = async (req, res) => {
  try {
    const result = await meal.isExist({ _id: req.query._id })
    if (result.success) {
      let oldImage = (result.success && result.record.image) ? (result.record.image) : false
      let count = oldImage.length + req.files.length
      let image = req.files
      if (count <= 8) {
        await image.map((image) => {
          oldImage.push(image)
        });
      }
      else {
        res.status(400).json({
          success: false,
          code: 400,
          error: "The number of meal images must be a maximum of 8 images"
        });
      }
      const update = await meal.update(req.query._id, { image: oldImage });
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
    const result = await meal.isExist({ _id: req.query._id })
    if (result.success) {
      let oldImage = (result.success && result.record.image) ? (result.record.image) : false
      if (oldImage) {
        try {
          await oldImage.map((image) => {
            fs.unlinkSync(image.path);
          })
        }
        catch (err) {
          console.log(`err`, err.errno);
        }
      }
      const update = await meal.update(req.query._id, { image: [] });
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

exports.removeFromImagesArray = async (req, res) => {
  try {
    const result = await meal.isExist({ _id: req.query._id });
    if (result.success) {
      await req.body.paths.map((path) => {
        meal.update(req.query._id, { $pull: { image: { path: path } } });
        fs.unlinkSync(path);
      });
      res.status(200).json({ success: true, code: 200 });
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