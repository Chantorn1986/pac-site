const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const path = require('path');
const { v4: uuidv4 } = require("uuid");
router.use(express.urlencoded({ extended: true }));
const bcrypt = require('bcryptjs');

const condb = require("../db");
const db = mysql.createConnection({
    host: condb.host(),
    user: condb.user(),
    password: condb.password(),
    database: condb.database()
})

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

router.get('/',isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM users ORDER BY name ASC";

    db.query(sql, (err, results) => {
        if (err) throw err;

        res.render('user', { 
            title: 'user',
            users: results,
            user: req.session.user 
        });
    })
});

router.get('/Add',isAuthenticated, (req, res) => {
    res.render('userAdd',{ user: req.session.user });
})

router.post('/Add',isAuthenticated, (req, res) => {
    const { userName, userEmail,userPassword,userRole }= req.body;
    const uuid = uuidv4();
    const hashedPassword =bcrypt.hashSync(userPassword, 10);
    const sql = "INSERT INTO users (id,name, email,password,role ) VALUES(?, ?, ?, ?, ?)";
    db.query(sql, [uuid, userName, userEmail, hashedPassword, userRole ], (err, result) => {
        if (err) throw err;

        res.redirect('/user',{ user: req.session.user });
    })
})

router.get('/Edit/:id',isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('userEdit', { 
            user: result[0] ,
            user: req.session.user 
        });
    });
})

router.post('/Edit/:id',isAuthenticated,(req, res) => {
    const { userNameE, userEmailE,userPasswordE,userRoleE } = req.body;
    
    const hashedPassword = bcrypt.hashSync(userPasswordE, 10);
    const sql = "UPDATE users SET name = ?, email = ?, password = ? , role = ? WHERE id = ?";
    db.query(sql, [userNameE, userEmailE, hashedPassword, userRoleE , req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/user',{ user: req.session.user });
    })
})

router.get('/Del/:id',isAuthenticated, (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/user',{ user: req.session.user });
    });
})

module.exports =  router;