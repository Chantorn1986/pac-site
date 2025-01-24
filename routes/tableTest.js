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

router.get('/',(req, res) => {
    try {
        const sql = "SELECT * FROM workLevel ORDER BY no ASC";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('sbAdmin/tables', { 
                title: 'Work Level Management',
                workLevel: results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});

router.get('/Add', (req, res) => {
    res.render('sbAdmin/tablesAdd',{ 
        title: 'Work Level Create',
        user: req.session.user });
})

router.post('/Add',(req, res) => {
    const { workLevelNo,workLevelCode,workLevelNameTH,workLevelNameEN }= req.body;
    const uuid = uuidv4();
    const sql = "INSERT INTO workLevel ( id, no,code, nameTH, nameEN ) VALUES(?, ?, ?, ?, ?)";
    db.query(sql, [ uuid,workLevelNo,workLevelCode, workLevelNameTH,workLevelNameEN ], (err, result) => {
        if (err) throw err;
        const sql = "SELECT * FROM workLevel ORDER BY no ASC";

        db.query(sql, (err, results) => {
            if (err) throw err;
    
            res.render('sbAdmin/tables', { 
                title: 'Work Level Management',
                workLevel: results,
                user: req.session.user
            });
        })
    })
})

router.get('/Edit/:id', (req, res) => {
    const sql = "SELECT * FROM workLevel WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('sbAdmin/tablesEdit', { 
            title: 'Work Level Edit',
            workLevel: result[0] ,
            user: req.session.user 
        });
    });
})

router.post('/Edit/:id',(req, res) => {
    const { workLevelNoE,workLevelCodeE,workLevelNameTHE,workLevelNameENE } = req.body;
    
    const sql = "UPDATE workLevel SET no = ?, nameCode = ?, nameTH = ? , nameEN = ? WHERE id = ?";
    db.query(sql, [workLevelNoE,workLevelCodeE,workLevelNameTHE,workLevelNameENE , req.params.id], (err, result) => {
        if (err) throw err;
        const sql = "SELECT * FROM workLevel ORDER BY no ASC";

        db.query(sql, (err, results) => {
            if (err) throw err;
    
            res.render('sbAdmin/tables', { 
                title: 'Work Level Management',
                workLevel: results,
                user: req.session.user
            });
        })
    })
})

router.get('/Del/:id', (req, res) => {
    const sql = "DELETE FROM workLevel WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        const sql = "SELECT * FROM workLevel ORDER BY no ASC";

        db.query(sql, (err, results) => {
            if (err) throw err;
    
            res.render('sbAdmin/tables', { 
                title: 'Work Level Management',
                workLevel: results,
                user: req.session.user
            });
        })
    });
})

router.get('/View/:id', (req, res) => {
    const sql = "SELECT * FROM workLevel WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('sbAdmin/tablesView', {
            title: 'Work Level View', 
            workLevel: result[0] ,
            user: req.session.user 
        });
    });
})

module.exports =  router;