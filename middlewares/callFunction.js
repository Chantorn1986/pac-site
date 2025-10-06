const multer  = require('multer')

const storageBrands = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/brands')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
  }
})

const storageTypeProducts = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/typeProducts')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
  }
})

exports.uploadBrands = multer({ storage: storageBrands }).single('file')
exports.uploadTypeProducts = multer({ storage: storageTypeProducts }).single('file')
