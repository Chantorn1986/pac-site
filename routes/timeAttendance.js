const express = require('express');
const router = express.Router();
//const mysql = require('mysql2');
const path = require('path');
const { v4: uuidv4 } = require("uuid");
router.use(express.urlencoded({ extended: true }));
const db = require("../db/db.js");
const moment = require('moment');
const {isAuthenticated} = require('../middlewares/authCheck')

router.get('/rptClockInOut', isAuthenticated, (req, res) => {
  try {
    const sql = "SELECT `id`, `acNo`, `code`, `name`, `date`, `dateF`, `dayTypeWork`, `onDuty`, `offDuty`, `clockIn`, `clockOut`, `remark`, `late`, `lateHour`, `lateMinute`, `statusScan`, IF(`lateHour`>0,IF(`lateMinute`>0,CONCAT(`lateHour`,' ชม. ',`lateMinute`,' นาที'),CONCAT(`lateHour`,' ชม.')) ,IF(`lateMinute`>0,CONCAT(`lateMinute`,' นาที'),'-')) AS `timeLate` FROM `view_statusClockInOut`";
    db.query(sql, (err, results) => {
      if (err) throw err;

      res.render('timeAtt/rptTimeAttClockInOut', {
        title: 'Clock In-Out Report',
        statusClockInOut: results,
        user: req.session.user
      });
    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
});


module.exports = router;