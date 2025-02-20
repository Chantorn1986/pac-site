const express = require('express');
const router = express.Router();
//const mysql = require('mysql2');
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

router.get('/rptClockInOut',isAuthenticated,(req, res) => {
    try {
        const sql = "SELECT * FROM `view_statusClockInOut`";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('timeAtt/rptTimeAttClockInOut', { 
                title: 'Clock In-Out Report',
                statusClockInOut : results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});



module.exports =  router;