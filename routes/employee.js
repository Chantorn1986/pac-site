
const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const {isAuthenticated} = require('../middlewares/authCheck')
const {list,getCreate,postCreate,getUpdate,putUpdate,getRemove,getView,getSub,getSubCreate,postSubCreate,getSubUpdate,putSubUpdate,getSubRemove,getSubView,
getSubZCreate,postSubZCreate,getSubZUpdate,putSubZUpdate,getSubZRemove,getSubZView,getSubZzCreate,postSubZzCreate,getSubZzUpdate,putSubZzUpdate,getSubZzRemove,getSubZzView,
getRptContact,getRptInformation,geRptEducation,getRptWorkPeriod,getRptCard,getRptVehicle,getRptProfile} = require('../controllers/employee')

const { uploadEmployee ,uploadEmployeeCard}= require('../middlewares/callFunction');

// const path = require('path');
// const multer = require('multer');
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// })
// const upload = multer({ storage });

router.get('/', isAuthenticated,list)
router.get('/Sub/:id', isAuthenticated,getSub)
// router.get('/Add/:id', isAuthenticated,getSub)
router.get('/Add', isAuthenticated,getCreate)
router.post('/Add',isAuthenticated,uploadEmployee,postCreate)
router.get('/Edit/:id', isAuthenticated,getUpdate)
router.post('/Edit/:id', isAuthenticated,uploadEmployee,putUpdate)
router.get('/Del/:id', isAuthenticated,getRemove)
router.get('/View/:id', isAuthenticated,getView)
// Education
router.get('/SubAdd/:id', isAuthenticated,getSubCreate)
router.post('/SubAdd/:id', isAuthenticated,postSubCreate)
router.get('/SubEdit/:id', isAuthenticated,getSubUpdate)
router.post('/SubEdit/:id', isAuthenticated,putSubUpdate)
router.get('/SubDel/:id', isAuthenticated,getSubRemove)
router.get('/SubView/:id', isAuthenticated,getSubView)
// Card
router.get('/SubZAdd/:id', isAuthenticated,getSubZCreate)
router.post('/SubZAdd/:id', isAuthenticated,uploadEmployeeCard,postSubZCreate)
router.get('/SubZEdit/:id', isAuthenticated,getSubZUpdate)
router.post('/SubZEdit/:id', isAuthenticated,uploadEmployeeCard,putSubZUpdate)
router.get('/SubZDel/:id', isAuthenticated,getSubZRemove)
router.get('/SubZView/:id', isAuthenticated,getSubZView)
// Conveyance
router.get('/SubZzAdd/:id', isAuthenticated,getSubZzCreate)
router.post('/SubZzAdd/:id', isAuthenticated,postSubZzCreate)
router.get('/SubZzEdit/:id', isAuthenticated,getSubZzUpdate)
router.post('/SubZzEdit/:id', isAuthenticated,putSubZzUpdate)
router.get('/SubZzDel/:id', isAuthenticated,getSubZzRemove)
router.get('/SubZzView/:id', isAuthenticated,getSubZzView)
// Report
router.get('/rptContact', isAuthenticated,getRptContact)
router.get('/rptInformation', isAuthenticated,getRptInformation)
router.get('/rptEducation', isAuthenticated,geRptEducation)
router.get('/rptWorkPeriod', isAuthenticated,getRptWorkPeriod)
router.get('/rptCards', isAuthenticated,getRptCard)
router.get('/rptVehicle', isAuthenticated,getRptVehicle)
router.get('/profile', isAuthenticated,getRptProfile)

module.exports = router;