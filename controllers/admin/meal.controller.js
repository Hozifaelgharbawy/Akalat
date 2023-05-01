const mael = require("../../modules/Meal/mael.repo");
let fs = require("fs")


exports.createMael = async (req, res) => {
  try {
    let form = req.body
    let result = await mael.create(form)
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

exports.updateMael = async (req, res) => {
  try {
    const result = await mael.update(req.query._id, req.body);
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

exports.removeMael = async (req, res) => {
  try {
    const result = await mael.remove(req.query._id);
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
    const result = await mael.isExist({ _id: req.query._id })
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
      const update = await mael.update(req.query._id, { image: image });
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
    const result = await mael.isExist({ _id: req.query._id })
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
          error: "The number of mael images must be a maximum of 8 images"
        });
      }
      const update = await mael.update(req.query._id, { image: oldImage });
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
    const result = await mael.isExist({ _id: req.query._id })
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
      const update = await mael.update(req.query._id, { image: [] });
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
    const result = await mael.isExist({ _id: req.query._id });
    if (result.success) {
      await req.body.paths.map((path) => {
        mael.update(req.query._id, { $pull: { image: { path: path } } });
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