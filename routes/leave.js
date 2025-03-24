const express = require('express');
const router = express.Router();
//const mysql = require('mysql2');
const path = require('path');
const { v4: uuidv4 } = require("uuid");
router.use(express.urlencoded({ extended: true }));
const db = require("../models/db.js");
const moment = require('moment');
const multer = require('multer');

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

router.get('/leaveType', isAuthenticated, (req, res) => {
    try {
        const sql = "SELECT `id`, `no`, `nameTH`, `nameEN`, `quota` FROM `leaveType` ORDER BY `no` ASC";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('leave/leaveType', {
                title: 'Leave Type Management',
                results: results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
});

router.get('/leaveType/Add', isAuthenticated, (req, res) => {
    res.render('leave/leaveTypeAdd', {
        title: 'Leave Type Create',
        user: req.session.user
    });
})

router.post('/leaveType/Add', isAuthenticated, (req, res) => {
    const { leaveTypeNo, leaveTypeQuota, leaveTypeNameTH, leaveTypeNameEN } = req.body;
    const uuid = uuidv4();
    const sql = "INSERT INTO `leaveType` ( `id`, `no`, `nameTH`, `nameEN`, `quota` ) VALUES(?, ?, ?, ?, ?)";
    try {
        db.query(sql, [uuid, leaveTypeNo, leaveTypeNameTH, leaveTypeNameEN, leaveTypeQuota], (err, result) => {
            if (err) throw err;
            const sql = "SELECT * FROM `leaveType` ORDER BY `no` ASC";

            db.query(sql, (err, results) => {
                if (err) throw err;

                res.render('leave/leaveType', {
                    title: 'Leave Type Management',
                    results: results,
                    user: req.session.user
                });
            })
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});

router.get('/leaveType/Edit/:id',isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM `leaveType` WHERE `id` = ?";
    try {
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            res.render('leave/leaveTypeEdit', { 
                title: 'Leave Type Edit',
                results: result[0] ,
                user: req.session.user 
            });
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.post('/leaveType/Edit/:id',isAuthenticated,(req, res) => {
    const { leaveTypeNoE, leaveTypeNameTHE, leaveTypeNameENE, leaveTypeQuotaE } = req.body;
    
    const sql = "UPDATE `leaveType` SET no = ?,Code = ? , nameTH = ? , nameEN = ? WHERE id = ?";
    try {
        db.query(sql, [leaveTypeNoE, leaveTypeNameTHE, leaveTypeNameENE, leaveTypeQuotaE , req.params.id], (err, result) => {
            if (err) throw err;
            const sql = "SELECT * FROM `leaveType` ORDER BY no ASC";

            db.query(sql, (err, results) => {
                if (err) throw err;
        
                res.render('leave/leaveType', {
                    title: 'Leave Type Management',
                    results: results,
                    user: req.session.user
                });
            })
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/leaveType/Del/:id',isAuthenticated, (req, res) => {
    const sql = "DELETE FROM `leaveType` WHERE id = ?";
    try {
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            const sql = "SELECT * FROM `leaveType` ORDER BY no ASC";

            db.query(sql, (err, results) => {
                if (err) throw err;
        
                res.render('leave/leaveType', {
                    title: 'Leave Type Management',
                    results: results,
                    user: req.session.user
                });
            })
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/leaveType/View/:id',isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM `leaveType` WHERE id = ?";
    try {
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            res.render('leave/leaveTypeView', { 
                title: 'Leave Type View',
                results: result[0] ,
                user: req.session.user 
            });
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

module.exports = router;