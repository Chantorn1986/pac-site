const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const {isAuthenticated} = require('../middlewares/authCheck')
const {list,getCreate,postCreate,getUpdate,putUpdate,getRemove,getView} = require('../controllers/position')

router.get('/', isAuthenticated,list)
router.get('/Add', isAuthenticated,getCreate)
router.post('/Add', isAuthenticated,postCreate)
router.get('/Edit/:id', isAuthenticated,getUpdate)
router.post('/Edit/:id', isAuthenticated,putUpdate)
router.get('/Del/:id', isAuthenticated,getRemove)
router.get('/View/:id', isAuthenticated,getView)

module.exports = router;

