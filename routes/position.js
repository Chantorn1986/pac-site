const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const path = require('path');
const { v4: uuidv4 } = require("uuid");
router.use(express.urlencoded({ extended: true }));
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
        const sql = "SELECT * FROM positions ORDER BY no ASC";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('dataDDL/position', { 
                title: 'Position Management',
                positions: results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});

router.get('/Add',isAuthenticated, (req, res) => {
    res.render('dataDDL/positionAdd',{ 
        title: 'Position Create',
        user: req.session.user });
})

router.post('/Add',isAuthenticated, (req, res) => {
    const { positionNo,positionNameTH,positionNameEN }= req.body;
    const uuid = uuidv4();
    const sql = "INSERT INTO positions ( id, no, nameTH, nameEN ) VALUES(?, ?, ?, ?)";
    db.query(sql, [ uuid,positionNo, positionNameTH,positionNameEN ], (err, result) => {
        if (err) throw err;
        const sql = "SELECT * FROM positions ORDER BY no ASC";

        db.query(sql, (err, results) => {
            if (err) throw err;
    
            res.render('dataDDL/position', { 
                title: 'Position Management',
                positions: results,
                user: req.session.user
            });
        })
    })
})

router.get('/Edit/:id',isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM positions WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('dataDDL/positionEdit', { 
            title: 'Position Edit',
            position: result[0] ,
            user: req.session.user 
        });
    });
})

router.post('/Edit/:id',isAuthenticated,(req, res) => {
    const { positionNoE,positionNameTHE,positionNameENE } = req.body;
    
    const sql = "UPDATE positions SET no = ?, nameTH = ? , nameEN = ? WHERE id = ?";
    db.query(sql, [positionNoE,positionNameTHE,positionNameENE , req.params.id], (err, result) => {
        if (err) throw err;
        const sql = "SELECT * FROM positions ORDER BY no ASC";

        db.query(sql, (err, results) => {
            if (err) throw err;
    
            res.render('dataDDL/position', { 
                title: 'Position Management',
                positions: results,
                user: req.session.user
            });
        })
    })
})

router.get('/Del/:id',isAuthenticated, (req, res) => {
    const sql = "DELETE FROM positions WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        const sql = "SELECT * FROM positions ORDER BY no ASC";

        db.query(sql, (err, results) => {
            if (err) throw err;
    
            res.render('dataDDL/position', { 
                title: 'Position Management',
                positions: results,
                user: req.session.user
            });
        })
    });
})

router.get('/View/:id',isAuthenticated,  (req, res) => {
    const sql = "SELECT * FROM positions WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('dataDDL/positionView', {
            title: 'Position View', 
            position: result[0] ,
            user: req.session.user 
        });
    });
})

module.exports =  router;