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

router.get('/login', ifLoggedIn, (req, res) => {
    res.render('login');
})

router.get('/home', isAuthenticated, (req, res) => {
    //console.log(req.session.user);
    const sql = "SELECT * FROM products";

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

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            const user = result[0];
            decodedData = Buffer.from(user.password, 'base64').toString('utf8');
            if (password === decodedData) {
                req.session.user = user;

                const sql = "SELECT * FROM products";
                
                db.query(sql, (err, results) => {
                    if (err) throw err;
                    
                    res.render('home', { 
                        title: 'Home',
                        products: results,
                        user : user
                    });
                })
            } else {
                return res.render('login',{ 
                    success: false,
                    error_msg: "Password ไม่ถูกต้อง!!" }); 
            }
        } else {
            return res.render('login',{ 
                success: false,
                error_msg: "Email ไม่ถูกต้องกรุณากรอก email ใหม่ !!!" });
        }
    })
});


module.exports =  router;