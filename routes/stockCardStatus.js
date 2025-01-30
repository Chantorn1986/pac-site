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
        const sql2t = "SELECT * FROM stockCardStatus ORDER BY no ASC;";

        db.query(sql2t, (err, results) => {
            if (err) throw err;

            res.render('stockCard/stockCardStatus', { 
                title: 'Stock Card Status Management',
                stockCardStatus: results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' });
    } 
});


router.get('/Add', (req, res) => {
   /* try {
        const sql = "SELECT id,name FROM stockCardBrands ORDER BY name ASC";
        db.query(sql, (err, results) => {
            if (err) throw err;*/

            res.render('stockCard/stockCardStatusAdd',{ 
                title: 'Stock Card Status Create',
                user: req.session.user });
       /* })    stockCardBrands: results,
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' }); stockCardStatus
    } */

})

router.post('/Add',(req, res) => {
    try {
        const { stockCardStatusNo,stockCardStatusNameTH,stockCardStatusNameEN,stockCardStatusInOut }= req.body;
        const uuid = uuidv4();
        const sql = "INSERT INTO stockCardStatus ( id,no,nameTH,nameEN,ValueInOut) VALUES(?, ?, ?, ?, ?)";
        db.query(sql, [ uuid,stockCardStatusNo,stockCardStatusNameTH,stockCardStatusNameEN,stockCardStatusInOut], (err, result) => {
            if (err) throw err;
            const sql2t = "SELECT * FROM stockCardStatus ORDER BY no ASC;";

            db.query(sql2t, (err, results) => {
                if (err) throw err;
        
                res.render('stockCard/stockCardStatus', { 
                    title: 'Stock Card Goods Management',
                    stockCardStatus : results,
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
    try {
         const sql2t = "SELECT * FROM stockCardStatus WHERE id = ? ;"
        db.query(sql2t, [req.params.id], (err, result) => {
            if (err) throw err;

                res.render('stockCard/stockCardStatusEdit', {
                    title: 'Stock Card Status Edit', 
                    stockCardStatus : result[0] ,
                    user: req.session.user 
                });
        });
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' });
    }
})

router.post('/Edit/:id',(req, res) => {
    try {
        const { stockCardStatusNoE,stockCardStatusNameTHE,stockCardStatusNameENE,stockCardStatusInOutE } = req.body;
        const sql = "UPDATE stockCardStatus SET no = ?, nameTH = ?,nameEN = ?, ValueInOut = ?  WHERE id = ?";
        db.query(sql, [ stockCardStatusNoE,stockCardStatusNameTHE,stockCardStatusNameENE,stockCardStatusInOutE, req.params.id], (err, result) => {
            if (err) throw err;
            const sql2t = "SELECT * FROM stockCardStatus ORDER BY no ASC;";

            db.query(sql2t, (err, results) => {
                if (err) throw err;
        
                res.render('stockCard/stockCardStatus', { 
                    title: 'Stock Card Status Management',
                    stockCardStatus : results,
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
    try {
        const sql = "DELETE FROM stockCardStatus WHERE id = ?";
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            const sql2t = "SELECT * FROM stockCardStatus ORDER BY no ASC;";

            db.query(sql2t, (err, results) => {
                if (err) throw err;
        
                res.render('stockCard/stockCardStatus', { 
                    title: 'Stock Card Status Management',
                    stockCardStatus : results,
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
        const sql2t = "SELECT * FROM stockCardStatus WHERE id = ? ;"

        db.query(sql2t, [req.params.id], (err, result) => {
            if (err) throw err;

            res.render('stockCard/stockCardStatusView', {
                title: 'Stock Card Status View', 
                stockCardStatus : result[0] ,
                user: req.session.user 
            });
        });
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' });
    }
})

module.exports =  router;