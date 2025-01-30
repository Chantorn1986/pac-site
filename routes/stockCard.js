const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const path = require('path');
const { v4: uuidv4 } = require("uuid");
router.use(express.urlencoded({ extended: true }));
const db = require("../models/db.js");
const moment = require('moment');

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

router.get('/',(req, res) => {
    try {
        const sql2t = "SELECT * FROM `view_stockCard_goodsBrandsStatus` ORDER BY cardDate DESC;";

        db.query(sql2t, (err, results) => {
            if (err) throw err;

            res.render('stockCard/stockCard', { 
                title: 'Stock Card Management',
                stockCard : results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' });
    } 
});

router.get('/Add', (req, res) => {
   const sql1 = "SELECT id,keyword FROM stockCardGoods ORDER BY keyword ASC";
   const sql2 = "SELECT id,nameEN FROM stockCardStatus ORDER BY no ASC";
   const now = new Date();
   const dateString = moment(now).format('YYYY-MM-DD');
   try {
        db.query(sql1, (err, results1) => {
            if (err) throw err;

            db.query(sql2, (err, results2) => {
                if (err) throw err;
    
                res.render('stockCard/stockCardAdd',{ 
                    title: 'Stock Card Create',
                    stockCardGoods : results1,
                    stockCardStatus : results2,
                    dateDefault:dateString,
                    user: req.session.user });
           })
       })    
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' }); stockCardStatus
    } 
})

router.post('/Add',(req, res) => {
    const { stockCardGoodsID,stockCardDate,stockCardDocument,stockCardStatusID,stockCardQty,stockCardNote }= req.body;
    const uuid = uuidv4();
    const sqlAdd = "INSERT INTO `stockCard`(`id`, `goodsID`, `date`, `document`, `statusID`,`qty`, `note`) VALUES (?,?,?,?,?,?,?)";
    try {
        db.query(sqlAdd, [ uuid,stockCardGoodsID,stockCardDate,stockCardDocument,stockCardStatusID,stockCardQty,stockCardNote], (err, result) => {
            if (err) throw err;
            const sql2t = "SELECT * FROM `view_stockCard_goodsBrandsStatus` ORDER BY cardDate DESC;";
            
            db.query(sql2t, (err, results) => {
                if (err) throw err;
        
                res.render('stockCard/stockCard', { 
                    title: 'Stock Card Management',
                    stockCard : results,
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
    const sql1 = "SELECT id,keyword FROM stockCardGoods ORDER BY keyword ASC";
    const sql2 = "SELECT id,nameEN FROM stockCardStatus ORDER BY no ASC";
    const sql2t = "SELECT * FROM `view_stockCard_goodsBrandsStatus` WHERE id = ? ;"
    try {
        db.query(sql1, (err, results1) => {
            if (err) throw err;

            db.query(sql2, (err, results2) => {
                if (err) throw err;

                db.query(sql2t, [req.params.id], (err, result) => {
                    if (err) throw err;
                        const dateString =  moment(result[0].dateOld).format('YYYY-MM-DD');
                        res.render('stockCard/stockCardEdit', {
                            title: 'Stock Card Edit', 
                            stockCard : result[0] ,
                            stockCardGoods : results1,
                            stockCardStatus : results2,
                            dateString:dateString,
                            
                            user: req.session.user 
                        });
                });
           })
       })  

    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' });
    }
})

router.post('/Edit/:id',(req, res) => {
    try {
        const { stockCardGoodsIDE,stockCardDateE,stockCardDocumentE,stockCardStatusIDE,stockCardQtyE,stockCardNoteE } = req.body;
        const sql = "UPDATE stockCard SET goodsID=?,date=?,document=?,statusID=?,qty=?,note=?,updatedAt=?  WHERE id = ?";
        const today = new Date();
        const timestamp= moment(today).format();

        db.query(sql, [ stockCardGoodsIDE,stockCardDateE,stockCardDocumentE,stockCardStatusIDE,stockCardQtyE,stockCardNoteE,timestamp, req.params.id], (err, result) => {
            if (err) throw err;
            const sql2t = "SELECT * FROM `view_stockCard_goodsBrandsStatus` ORDER BY cardDate DESC;";
            db.query(sql2t, (err, results) => {
                if (err) throw err;
        
                res.render('stockCard/stockCard', { 
                    title: 'Stock Card Management',
                    stockCard : results,
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
            const sql2t = "SELECT * FROM `view_stockCard_goodsBrandsStatus` ORDER BY cardDate DESC;";

            db.query(sql2t, (err, results) => {
                if (err) throw err;
        
                res.render('stockCard/stockCard', { 
                    title: 'Stock Card Management',
                    stockCard : results,
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
        const sql2t = "SELECT * FROM `view_stockCard_goodsBrandsStatus` WHERE id = ? ;"

        db.query(sql2t, [req.params.id], (err, result) => {
            if (err) throw err;

            res.render('stockCard/stockCardView', {
                title: 'Stock Card View', 
                stockCard : result[0] ,
                user: req.session.user 
            });
        });
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' });
    }
})

module.exports =  router;