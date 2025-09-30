const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
// const {isAuthenticated} = require('../middlewares/authCheck')
const {aboutUs,vision,mission,certificate,contact,partner,timeline,indexAdmin} = require('../controllers/pacEcatalog')

router.get('/aboutUs', aboutUs)
router.get('/vision', vision)
router.get('/mission', mission)
router.get('/certificate', certificate)
router.get('/contact', contact)
router.get('/partner', partner)
router.get('/timeline', timeline)
router.get('/indexAdmin', indexAdmin)

module.exports = router;