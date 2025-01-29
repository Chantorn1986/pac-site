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


router.get('/',(req, res) => {
    try {
        const sql = "SELECT * FROM users ORDER BY name ASC";

        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('sbAdmin/tables', { 
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

router.get('/Add', (req, res) => {
    res.render('sbAdmin/tablesAdd',{ 
        title: 'Users Create',
        user: req.session.user });
})

router.post('/Add', (req, res) => {
    const { userName, userEmail,userPassword,userRole }= req.body;
    const uuid = uuidv4();
    //const hashedPassword =bcrypt.hashSync(userPassword, 10);
    const encodedData = Buffer.from(userPassword).toString('base64');
    const sql = "INSERT INTO users (id,name, email,password,role ) VALUES(?, ?, ?, ?, ?)";
    try {
        db.query(sql, [uuid, userName, userEmail, encodedData, userRole ], (err, result) => {
            if (err) throw err;
            const sql = "SELECT * FROM users ORDER BY name ASC";
            db.query(sql, (err, results) => {
                if (err) throw err;
                res.render('sbAdmin/tables', { 
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

router.get('/Edit/:id', (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    try {
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            res.render('sbAdmin/tablesEdit', { 
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

router.post('/Edit/:id',(req, res) => {
    const { userNameE, userEmailE,userPasswordE,userRoleE } = req.body;
    const data = userPasswordE;
    const encodedData = Buffer.from(userPasswordE).toString('base64');
    const sql = "UPDATE users SET name = ?, email = ?, password = ? , role = ? WHERE id = ?";
    try {
        db.query(sql, [userNameE, userEmailE, encodedData, userRoleE , req.params.id], (err, result) => {
            if (err) throw err;
            const sql = "SELECT * FROM users ORDER BY name ASC";
            db.query(sql, (err, results) => {
                if (err) throw err;
                res.render('sbAdmin/tables', { 
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

router.get('/Del/:id', (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?";
    try {
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            const sql = "SELECT * FROM users ORDER BY name ASC";
            db.query(sql, (err, results) => {
                if (err) throw err;
                res.render('sbAdmin/tables', { 
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

router.get('/View/:id', (req, res) => {
    try {
        const sql2t = "SELECT * FROM users WHERE id = ?";
        db.query(sql2t, [req.params.id], (err, result) => {
            if (err) throw err;

            res.render('sbAdmin/tablesView', {
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