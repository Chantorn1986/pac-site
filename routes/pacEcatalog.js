const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
// const {isAuthenticated} = require('../middlewares/authCheck')
const {aboutUs,vision,mission,certificate,contact,partner,timeline,indexAdmin,
  listBrands,getCreateBrands,postCreateBrands,getUpdateBrands,putUpdateBrands,getRemoveBrands,getViewBrands
} = require('../controllers/pacEcatalog')

const { upload }= require('../middlewares/callFunction');

// const path = require('path');
// const multer = require('multer');
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, '../public/uploads/brands');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// })
// const upload = multer({ storage });

router.get('/aboutUs', aboutUs)
router.get('/vision', vision)
router.get('/mission', mission)
router.get('/certificate', certificate)
router.get('/contact', contact)
router.get('/partner', partner)
router.get('/timeline', timeline)
router.get('/indexAdmin', indexAdmin)

router.get('/Brands', listBrands)
router.get('/Brands/Add', getCreateBrands)
router.post('/Brands/Add',upload, postCreateBrands)
router.get('/Brands/Edit/:id', getUpdateBrands)
router.post('/Brands/Edit/:id', putUpdateBrands)
router.get('/Brands/Del/:id', getRemoveBrands)
router.get('/Brands/View/:id', getViewBrands)

module.exports = router;