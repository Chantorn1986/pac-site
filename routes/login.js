const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
const {isAuthenticated,ifLoggedIn} = require('../middlewares/authCheck')
const {getHome,getLogout,postLogin} = require('../controllers/login.js')

router.get('/home', isAuthenticated,getHome)
router.get('/logout',getLogout)
router.post('/login',postLogin)

// GET Routes
router.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
})

router.get('/pac', (req, res) => {
  res.render('indexPAC', { user: req.session.user });
})

router.get('/utilities-animation', (req, res) => {
  res.render('sbAdmin/utilities-animation', { user: req.session.user });
})

router.get('/utilities-border', (req, res) => {
  res.render('sbAdmin/utilities-border', { user: req.session.user });
})

router.get('/utilities-color', (req, res) => {
  res.render('sbAdmin/utilities-color', { user: req.session.user });
})

router.get('/utilities-other', (req, res) => {
  res.render('sbAdmin/utilities-other', { user: req.session.user });
})

router.get('/buttons', (req, res) => {
  res.render('sbAdmin/buttons', { user: req.session.user });
})

router.get('/cards', (req, res) => {
  res.render('sbAdmin/cards', { user: req.session.user });
})

router.get('/charts', (req, res) => {
  res.render('sbAdmin/charts', { user: req.session.user });
})

router.get('/404', (req, res) => {
  res.render('sbAdmin/404', { user: req.session.user });
})


router.get('/login', ifLoggedIn, (req, res) => {
  res.render('login');
})

module.exports = router;