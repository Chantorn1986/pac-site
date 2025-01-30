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
        const sql = "SELECT id,no,code,name,DATE_FORMAT(createdAt, '%d/%m/%Y %H:%i:%s') as createdAt,DATE_FORMAT(updatedAt, '%d/%m/%Y %H:%i:%s') as updatedAt FROM stockCardBrands ORDER BY no,code ASC";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('stockCard/stockCardBrands', { 
                title: 'Stock Card Brands Management',
                stockCardBrands: results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});


router.get('/Add', (req, res) => {
    res.render('stockCard/stockCardBrandsAdd',{ 
        title: 'Stock Card Brands Create',
        user: req.session.user });
})

router.post('/Add',(req, res) => {
    const { stockCardBrandsNo,stockCardBrandsCode,stockCardBrandsName }= req.body;
    const uuid = uuidv4();
    const sql = "INSERT INTO stockCardBrands ( id, no,code, name ) VALUES(?, ?, ?,?)";
    db.query(sql, [ uuid,stockCardBrandsNo,stockCardBrandsCode, stockCardBrandsName ], (err, result) => {
        if (err) throw err;
        const sql = "SELECT id,no,code,name,DATE_FORMAT(createdAt, '%d/%m/%Y %H:%i:%s') as createdAt,DATE_FORMAT(updatedAt, '%d/%m/%Y %H:%i:%s') as updatedAt FROM stockCardBrands ORDER BY no,code ASC";

        db.query(sql, (err, results) => {
            if (err) throw err;
    
            res.render('stockCard/stockCardBrands', { 
                title: 'Stock Card Brands Management',
                stockCardBrands : results,
                user: req.session.user
            });
        })
    })
})

router.get('/Edit/:id', (req, res) => {
    const sql = "SELECT * FROM stockCardBrands WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('stockCard/stockCardBrandsEdit', { 
            title: 'Stock Card Brands Edit',
            stockCardBrands : result[0] ,
            user: req.session.user 
        });
    });
})

router.post('/Edit/:id',(req, res) => {
    const { stockCardBrandsNoE,stockCardBrandsCodeE,stockCardBrandsNameE } = req.body;
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    const timestamp = dateTime;
    const sql = "UPDATE stockCardBrands SET no = ?, Code = ?, name = ?, updatedAt=?  WHERE id = ?";
    db.query(sql, [stockCardBrandsNoE,stockCardBrandsCodeE,stockCardBrandsNameE ,timestamp, req.params.id], (err, result) => {
        if (err) throw err;
        const sql = "SELECT id,no,code,name,DATE_FORMAT(createdAt, '%d/%m/%Y %H:%i:%s') as createdAt,DATE_FORMAT(updatedAt, '%d/%m/%Y %H:%i:%s') as updatedAt FROM stockCardBrands ORDER BY no,code ASC";

        db.query(sql, (err, results) => {
            if (err) throw err;
    
            res.render('stockCard/stockCardBrands', { 
                title: 'Stock Card Brands Management',
                stockCardBrands : results,
                user: req.session.user
            });
        })
    })
})

router.get('/Del/:id', (req, res) => {
    const sql = "DELETE FROM stockCardBrands WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        const sql = "SELECT id,no,code,name,DATE_FORMAT(createdAt, '%d/%m/%Y %H:%i:%s') as createdAt,DATE_FORMAT(updatedAt, '%d/%m/%Y %H:%i:%s') as updatedAt FROM stockCardBrands ORDER BY no ASC";

        db.query(sql, (err, results) => {
            if (err) throw err;
    
            res.render('stockCard/stockCardBrands', { 
                title: 'Stock Card Brands Management',
                stockCardBrands : results,
                user: req.session.user
            });
        })
    });
})

router.get('/View/:id', (req, res) => {
    const sql = "SELECT id,no,code,name,DATE_FORMAT(createdAt, '%d/%m/%Y %H:%i:%s') as createdAt,DATE_FORMAT(updatedAt, '%d/%m/%Y %H:%i:%s') as updatedAt FROM stockCardBrands WHERE id = ? ";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('stockCard/stockCardBrandsView', {
            title: 'Stock Card Brands View', 
            stockCardBrands : result[0] ,
            user: req.session.user 
        });
    });
})

module.exports =  router;