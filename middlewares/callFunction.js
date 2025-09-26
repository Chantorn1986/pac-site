const multer = require('multer');
const path = require('path');

exports.uploadPic = async (req, res, next) => {
  try {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
      }
    })
    // next()
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Is Authenticated Invalid' })
  }
}

