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
        const sql2t = "SELECT goods.id,goods.no,goods.brandID as brandID ,brands.name as brand,goods.code,goods.model,goods.keyword,DATE_FORMAT(goods.createdAt, '%d/%l/%Y %H:%i:%s') as createdAt,DATE_FORMAT(goods.updatedAt, '%d/%l/%Y %H:%i:%s') as updatedAt FROM stockCardGoods goods left join stockCardBrands brands on goods.brandID = brands.id ORDER BY goods.no,goods.code ASC;";

        db.query(sql2t, (err, results) => {
            if (err) throw err;

            res.render('stockCard/stockCardGoods', { 
                title: 'Stock Card Goods Management',
                stockCardGoods: results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' });
    } 
});


router.get('/Add', (req, res) => {
    try {
        const sql = "SELECT id,name FROM stockCardBrands ORDER BY name ASC";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('stockCard/stockCardGoodsAdd',{ 
                title: 'Stock Card Goods Create',
                stockCardBrands: results,
                user: req.session.user });
        })
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' });
    } 

})

router.post('/Add',(req, res) => {
    try {
        const { stockCardGoodsNo,stockCardGoodsBrand,stockCardGoodsCode,stockCardGoodsModel,stockCardGoodsKeyword }= req.body;
        const uuid = uuidv4();
        const sql = "INSERT INTO stockCardGoods ( id, no,brandID,code, model ,keyword) VALUES(?, ?, ?, ?, ?, ?)";
        db.query(sql, [ uuid,stockCardGoodsNo,stockCardGoodsBrand,stockCardGoodsCode, stockCardGoodsModel,stockCardGoodsKeyword ], (err, result) => {
            if (err) throw err;
             const sql2t = "SELECT goods.id,goods.no,goods.brandID as brandID ,brands.name as brand,goods.code,goods.model,goods.keyword,DATE_FORMAT(goods.createdAt, '%d/%l/%Y %H:%i:%s') as createdAt,DATE_FORMAT(goods.updatedAt, '%d/%l/%Y %H:%i:%s') as updatedAt FROM stockCardGoods goods left join stockCardBrands brands on goods.brandID = brands.id ORDER BY goods.no,goods.code ASC;";

            db.query(sql2t, (err, results) => {
                if (err) throw err;
        
                res.render('stockCard/stockCardGoods', { 
                    title: 'Stock Card Goods Management',
                    stockCardGoods : results,
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
         const sql2t = "SELECT goods.id,goods.no,goods.brandID as brandID ,brands.name as brand,goods.code,goods.model,goods.keyword,DATE_FORMAT(goods.createdAt, '%d/%l/%Y %H:%i:%s') as createdAt,DATE_FORMAT(goods.updatedAt, '%d/%l/%Y %H:%i:%s') as updatedAt FROM stockCardGoods goods left join stockCardBrands brands on goods.brandID = brands.id WHERE goods.id = ? ;"
        db.query(sql2t, [req.params.id], (err, result) => {
            if (err) throw err;
            
            const sql2 = "SELECT id,name FROM stockCardBrands ORDER BY name ASC";
            db.query(sql2, (err, stockCardBrands) => {
                if (err) throw err;
                res.render('stockCard/stockCardGoodsEdit', {
                    title: 'Stock Card Goods Edit', 
                    stockCardGoods : result[0] ,
                    stockCardBrands : stockCardBrands,
                    user: req.session.user 
                });
            });
        });
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' });
    }
})

router.post('/Edit/:id',(req, res) => {
    try {
        const { stockCardGoodsNoE,stockCardGoodsCodeE,stockCardGoodsBrandE,stockCardGoodsModelE } = req.body;
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date + ' ' + time;
        const timestamp = dateTime;
        const sql = "UPDATE stockCardGoods SET no = ?, Code = ?,brandID = ?, model = ?, updatedAt=?  WHERE id = ?";
        db.query(sql, [stockCardGoodsNoE,stockCardGoodsCodeE,stockCardGoodsBrandE,stockCardGoodsModelE ,timestamp, req.params.id], (err, result) => {
            if (err) throw err;
            const sql2t = "SELECT goods.id,goods.no,goods.brandID as brandID ,brands.name as brand,goods.code,goods.model,goods.keyword,DATE_FORMAT(goods.createdAt, '%d/%l/%Y %H:%i:%s') as createdAt,DATE_FORMAT(goods.updatedAt, '%d/%l/%Y %H:%i:%s') as updatedAt FROM stockCardGoods goods left join stockCardBrands brands on goods.brandID = brands.id ORDER BY goods.no,goods.code ASC;";

            db.query(sql2t, (err, results) => {
                if (err) throw err;
        
                res.render('stockCard/stockCardGoods', { 
                    title: 'Stock Card Goods Management',
                    stockCardGoods : results,
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
        const sql = "DELETE FROM stockCardGoods WHERE id = ?";
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            const sql2t = "SELECT goods.id,goods.no,goods.brandID as brandID ,brands.name as brand,goods.code,goods.model,goods.keyword,DATE_FORMAT(goods.createdAt, '%d/%l/%Y %H:%i:%s') as createdAt,DATE_FORMAT(goods.updatedAt, '%d/%l/%Y %H:%i:%s') as updatedAt FROM stockCardGoods goods left join stockCardBrands brands on goods.brandID = brands.id ORDER BY goods.no,goods.code ASC;";

            db.query(sql2t, (err, results) => {
                if (err) throw err;
        
                res.render('stockCard/stockCardGoods', { 
                    title: 'Stock Card Goods Management',
                    stockCardGoods : results,
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
        const sql2t = "SELECT goods.id,goods.no,goods.brandID as brandID ,brands.name as brand,goods.code,goods.model,goods.keyword,DATE_FORMAT(goods.createdAt, '%d/%l/%Y %H:%i:%s') as createdAt,DATE_FORMAT(goods.updatedAt, '%d/%l/%Y %H:%i:%s') as updatedAt FROM stockCardGoods goods left join stockCardBrands brands on goods.brandID = brands.id WHERE goods.id = ? ;"
        db.query(sql2t, [req.params.id], (err, result) => {
            if (err) throw err;

            res.render('stockCard/stockCardGoodsView', {
                title: 'Stock Card Goods View', 
                stockCardGoods : result[0] ,
                user: req.session.user 
            });
        });
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' });
    }
})

module.exports =  router;