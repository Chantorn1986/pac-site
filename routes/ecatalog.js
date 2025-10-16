const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
// const {isAuthenticated} = require('../middlewares/authCheck')
const {aboutUs,vision,mission,certificate,contact,partner,timeline,indexAdmin,
  getBrands , getAddBrands , postAddBrands , getEditBrands , postEditBrands , delBrands,
  getTypeProducts , getAddTypeProducts , postAddTypeProducts , getEditTypeProducts , postEditTypeProducts , delTypeProducts
} = require('../controllers/ecatalog')

const { uploadBrands ,uploadTypeProducts}= require('../middlewares/callFunction');

router.get('/aboutUs', aboutUs)
router.get('/vision', vision)
router.get('/mission', mission)
router.get('/certificate', certificate)
router.get('/contact', contact)
router.get('/partner', partner)
router.get('/timeline', timeline)
router.get('/indexAdmin', indexAdmin)

router.get('/brands', getBrands)
router.get('/brands/Add', getAddBrands)
router.post('/brands/Add',uploadBrands, postAddBrands)
router.get('/brands/Edit/:id', getEditBrands)
router.post('/brands/Edit/:id',uploadBrands, postEditBrands)
router.get('/brands/Del/:id', delBrands)

router.get('/typeProducts', getTypeProducts)
router.get('/typeProducts/Add', getAddTypeProducts)
router.post('/typeProducts/Add', uploadTypeProducts, postAddTypeProducts)
router.get('/typeProducts/Edit/:id', getEditTypeProducts)
router.post('/typeProducts/Edit/:id', uploadTypeProducts, postEditTypeProducts)
router.get('/typeProducts/Del/:id', delTypeProducts)

module.exports = router;