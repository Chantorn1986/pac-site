const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const path = require('path');
const { v4: uuidv4 } = require("uuid");
router.use(express.urlencoded({ extended: true }));
const bcrypt = require('bcryptjs');
const db  = require("../models/db.js");

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

function ifLoggedIn(req, res, next) {
    if (req.session.user) {
        return res.redirect('/home');
    }
    next();
}

// GET Routes
router.get('/', (req, res) => {
    res.render('index', { user: req.session.user });
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

router.get('/home', isAuthenticated, (req, res) => {
    //console.log(req.session.user);
    const sql = "SELECT * FROM products";
    const sqlAlert = "SELECT `itHelpdeskDoc`.`id`, `document`,DATE_FORMAT(`datetime`, '%d/%m/%Y %H:%i:%s') as `datetimeS` , `datetime`, `reporter`, `problem`, `location`, `status`,`InternalTelephone`,`image` FROM `itHelpdeskDoc` LEFT JOIN `employee` ON `employee`.`nameTH` = `itHelpdeskDoc`.`reporter` WHERE `itHelpdeskDoc`.`status` = 'รอ'";
    db.query(sql, (err, results) => {
        if (err) throw err;

        res.render('home', { 
            title: 'Home',
            products: results,
            user: req.session.user
        });
    })
    //res.render('home', { user: req.session.user });
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

router.post('/login',(req,res)=>{
    const { email, password } = req.body;
    const sqlAlert = "SELECT `itHelpdeskDoc`.`id`, `document`,DATE_FORMAT(`datetime`, '%d/%m/%Y %H:%i:%s') as `datetimeS` , `datetime`, `reporter`, `problem`, `location`, `status`,`InternalTelephone`,`image`,`employee`.`code` FROM `itHelpdeskDoc` LEFT JOIN `employee` ON `employee`.`nameTH` = `itHelpdeskDoc`.`reporter` WHERE `itHelpdeskDoc`.`status` = 'รอ'";
    const sql = 'SELECT * FROM `view_profileSession` WHERE email = ?';
    try {
    db.query(sql, [email], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            const user = result[0];
            bcrypt.compare(password, user.password, (err, data) => {
                //if error than throw error
                if (err) throw err
                //if both match than you can do anything
                if (data) {
                    req.session.user = user;
                    db.query(sqlAlert, (err, resultsAlert) => {
                        if (err) throw err;
                        //console.log(resultsAlert);
                        if(resultsAlert.length>0){
                            res.render('home', { 
                                title: 'Home',
                                user : user,
                                dataAlert: resultsAlert,
                                lengthAlert :result.length
                            });
                        }
                        else{
                            res.render('home', { 
                                title: 'Home',
                                user : user,
                                dataAlert:null,
                                lengthAlert :0
                            });
                        }

                    })
                } else {
                        res.render('login', { 
                            title: 'login',
                            error_msg: "Password ไม่ถูกต้อง!!" 
                        });          
                }
            })
        } else {
            return res.render('login',{ 
                success: false,
                title: 'login',
                error_msg: "Email ไม่ถูกต้องกรุณากรอก email ใหม่ !!!" });
        }
    })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
    });


module.exports =  router;