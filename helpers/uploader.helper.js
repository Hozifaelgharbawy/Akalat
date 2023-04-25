let multer = require('multer');


exports.uploadImage = (folderName) => {
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `uploads/${folderName}`)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + Math.random() + '.jpg')
    }
  })
  return multer({storage: storage})
}