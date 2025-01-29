const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const path = require('path');
const { v4: uuidv4 } = require("uuid");
router.use(express.urlencoded({ extended: true }));
const bcrypt = require('bcryptjs');
const { Buffer } = require('buffer');
const db = require("../models/db.js");

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}


router.get('/',isAuthenticated,(req, res) => {
    try {
        const sql = "SELECT * FROM users ORDER BY name ASC";

        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('userLogin/user', { 
                title: 'Users Management',
                users : results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' });
    } 
});

router.get('/Add',isAuthenticated, (req, res) => {
    res.render('userLogin/userAdd',{ 
        title: 'Users Create',
        user: req.session.user });
})

router.post('/Add',isAuthenticated, (req, res) => {
    const { name, email,password,role }= req.body;
    const uuid = uuidv4();
    const hashedPassword =bcrypt.hashSync(password, 10);
    //const encodedData = Buffer.from(userPassword).toString('base64');
    const sql = "INSERT INTO users (id,name, email,password,role ) VALUES(?, ?, ?, ?, ?)";
    const sql2 = "SELECT * FROM users ORDER BY name ASC";
    try {
        db.query(sql, [uuid, name, email, hashedPassword, role ], (err, result) => {
            if (err) throw err;
            db.query(sql2, (err, results) => {
                if (err) throw err;
                res.render('userLogin/user', { 
                    title: 'Users Management',
                    users: results,
                    user: req.session.user 
                });
            })
        }) 
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }             
})

router.get('/Edit/:id',isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    try {
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            res.render('userLogin/userEdit', { 
                title: 'Users Edit',
                users: result[0] ,
                user: req.session.user 
            });
        });
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' });
    }
})

router.post('/Edit/:id',isAuthenticated,(req, res) => {
    const { nameE, emailE,passwordE,roleE } = req.body;
    const hashedPassword =bcrypt.hashSync(passwordE, 10);
    const encodedData = Buffer.from(passwordE).toString('base64');
    const sql = "UPDATE users SET name = ?, email = ?, password = ? , role = ? WHERE id = ?";
    try {
        db.query(sql, [nameE, emailE, hashedPassword, roleE , req.params.id], (err, result) => {
            if (err) throw err;
            const sql = "SELECT * FROM users ORDER BY name ASC";
            db.query(sql, (err, results) => {
                if (err) throw err;
                res.render('userLogin/user', { 
                    title: 'Users Management',
                    users: results,
                    user: req.session.user 
                });
            })
        })
    } catch (err) {
        console.error('Error editing data:', err);
        res.status(500).json({ error: 'Error editing data into the database.' });
    } 
})

router.get('/Del/:id',isAuthenticated, (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?";
    try {
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            const sql = "SELECT * FROM users ORDER BY name ASC";
            db.query(sql, (err, results) => {
                if (err) throw err;
                res.render('userLogin/user', { 
                    title: 'Users Management',
                    users: results,
                    user: req.session.user 
                });
            })
        });
    } catch (err) {
        console.error('Error deleting data:', err);
        res.status(500).json({ error: 'Error deleting data into the database.' });
    } 
})

router.get('/View/:id',isAuthenticated, (req, res) => {
    try {
        const sql2t = "SELECT * FROM users WHERE id = ?";
        db.query(sql2t, [req.params.id], (err, result) => {
            if (err) throw err;

            res.render('userLogin/userView', {
                title: 'Users View', 
                users : result[0] ,
                user: req.session.user 
            });
        });
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' });
    }
})

module.exports =  router;