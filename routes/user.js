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


router.get('/', (req, res) => {
    const sql = "SELECT * FROM users ORDER BY name ASC";

    db.query(sql, (err, results) => {
        if (err) throw err;

        res.render('user', { 
            title: 'user',
            users: results
        });
    })
});

router.get('/Add', (req, res) => {
    res.render('userAdd');
})

router.post('/Add', (req, res) => {
    const { userName, userEmail,userPassword,userRole }= req.body;
    const uuid = uuidv4();
    const hashedPassword =bcrypt.hashSync(userPassword, 10);
    const sql = "INSERT INTO users (id,name, email,password,role ) VALUES(?, ?, ?, ?, ?)";
    db.query(sql, [uuid, userName, userEmail, hashedPassword, userRole ], (err, result) => {
        if (err) throw err;

        res.redirect('/user');
    })
})

router.get('/Edit/:id', (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('userEdit', { user: result[0] });
    });
})

router.post('/Edit/:id',(req, res) => {
    const { userNameE, userEmailE,userPasswordE,userRoleE } = req.body;
    
    const hashedPassword = bcrypt.hashSync(userPasswordE, 10);
    const sql = "UPDATE users SET name = ?, email = ?, password = ? , role = ? WHERE id = ?";
    db.query(sql, [userNameE, userEmailE, hashedPassword, userRoleE , req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/user');
    })
})

router.get('/Del/:id', (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/user');
    });
})

module.exports =  router;