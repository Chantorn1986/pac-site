const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
// const {isAuthenticated} = require('../middlewares/authCheck')
const {aboutUs,vision,mission,certificate,contact,partner,timeline,indexAdmin,
  listBrands,getCreateBrands,postCreateBrands,getUpdateBrands,putUpdateBrands,getRemoveBrands,
  listTypeProducts,getCreateTypeProducts,postCreateTypeProducts,getUpdateTypeProducts,putUpdateTypeProducts,getRemoveTypeProducts
} = require('../controllers/pacEcatalog')

const { uploadBrands ,uploadTypeProducts}= require('../middlewares/callFunction');

router.get('/aboutUs', aboutUs)
router.get('/vision', vision)
router.get('/mission', mission)
router.get('/certificate', certificate)
router.get('/contact', contact)
router.get('/partner', partner)
router.get('/timeline', timeline)
router.get('/indexAdmin', indexAdmin)

router.get('/brands', listBrands)
router.get('/brands/Add', getCreateBrands)
router.post('/brands/Add',uploadBrands, postCreateBrands)
router.get('/brands/Edit/:id', getUpdateBrands)
router.post('/brands/Edit/:id',uploadBrands, putUpdateBrands)
router.get('/brands/Del/:id', getRemoveBrands)

router.get('/typeProducts', listTypeProducts)
router.get('/typeProducts/Add', getCreateTypeProducts)
router.post('/typeProducts/Add', uploadTypeProducts, postCreateTypeProducts)
router.get('/typeProducts/Edit/:id', getUpdateTypeProducts)
router.post('/typeProducts/Edit/:id', uploadTypeProducts, putUpdateTypeProducts)
router.get('/typeProducts/Del/:id', getRemoveTypeProducts)

module.exports = router;