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
    const sqlAdd = "INSERT INTO `leaveType` ( `id`, `no`, `nameTH`, `nameEN`, `quota` ) VALUES(?, ?, ?, ?, ?)";
    const sql = "SELECT * FROM `leaveType` ORDER BY `no` ASC";
    try {
        db.query(sqlAdd, [uuid, leaveTypeNo, leaveTypeNameTH, leaveTypeNameEN, leaveTypeQuota], (err, result) => {
            if (err) throw err;

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

router.get('/leaveType/Edit/:id', isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM `leaveType` WHERE `id` = ?";
    try {
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            res.render('leave/leaveTypeEdit', {
                title: 'Leave Type Edit',
                results: result[0],
                user: req.session.user
            });
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
})

router.post('/leaveType/Edit/:id', isAuthenticated, (req, res) => {
    const { leaveTypeNoE, leaveTypeNameTHE, leaveTypeNameENE, leaveTypeQuotaE } = req.body;

    const sql = "UPDATE `leaveType` SET no = ?,Code = ? , nameTH = ? , nameEN = ? WHERE id = ?";
    try {
        db.query(sql, [leaveTypeNoE, leaveTypeNameTHE, leaveTypeNameENE, leaveTypeQuotaE, req.params.id], (err, result) => {
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

router.get('/leaveType/Del/:id', isAuthenticated, (req, res) => {
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

router.get('/leaveType/View/:id', isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM `leaveType` WHERE id = ?";
    try {
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            res.render('leave/leaveTypeView', {
                title: 'Leave Type View',
                results: result[0],
                user: req.session.user
            });
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
})

router.get('/leaveApprove', isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM `view_leaveApprove` ORDER BY `nameTH` ASC";
    try {
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('leave/leaveApprove', {
                title: 'Leave Approve Management',
                results: results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
});

router.get('/leaveApprove/Add', isAuthenticated, (req, res) => {
    const sqlName = "SELECT `id`,`nameTH` FROM `employee` ORDER BY `nameTH` ASC";
    try {
        db.query(sqlName, (err, resultsName) => {
            if (err) throw err;
            res.render('leave/leaveApproveAdd', {
                title: 'leave Approve Create',
                resultsName: resultsName,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }

})

router.post('/leaveApprove/Add', isAuthenticated, (req, res) => {
    const { leaveApproveEmployee, leaveApproveHead, leaveApproveHR, leaveApproveMD } = req.body;
    const uuid = uuidv4();
    const sqlAdd = "INSERT INTO `leaveApprove` (`id`, `emID`, `approveHead`, `approveHR`, `approveMD`) VALUES(?, ?, ?, ?, ?)";
    const sql = "SELECT * FROM `view_leaveApprove` ORDER BY `nameTH` ASC";
    try {
        db.query(sqlAdd, [uuid, leaveApproveEmployee, leaveApproveHead, leaveApproveHR, leaveApproveMD], (err, resultAdd) => {
            if (err) throw err;

            db.query(sql, (err, results) => {
                if (err) throw err;

                res.render('leave/leaveApprove', {
                    title: 'leave Approve Management',
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

router.get('/leaveApprove/Edit/:id', isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM FROM `view_leaveApprove` WHERE `leaveAppID` = ?";
    const sqlName = "SELECT `id`,`nameTH` FROM `employee` ORDER BY `nameTH` ASC";
    try {
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            db.query(sqlName, (err, resultName) => {
                if (err) throw err;
                res.render('leave/leaveApproveEdit', {
                    title: 'leave Approve Edit',
                    results: result[0],
                    resultName: resultName,
                    user: req.session.user
                });
            })
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
})

router.post('/leaveApprove/Edit/:id', isAuthenticated, (req, res) => {
    const { leaveApproveEmployeeE, leaveApproveHeadE, leaveApproveHRE, leaveApproveMDE } = req.body;
    const now = new Date();
    const timestamp = moment(now).format();
    const sql = "SELECT * FROM `view_leaveApprove` ORDER BY `nameTH` ASC";
    const sqlEdit = "UPDATE `leaveApprove` SET `emID`=?, `approveHead`=?, `approveHR`=?, `approveMD`=?,`updatedAt`=?  WHERE id = ?";
    try {
        db.query(sqlEdit, [leaveApproveEmployeeE, leaveApproveHeadE, leaveApproveHRE, leaveApproveMDE, timestamp, req.params.id], (err, result) => {
            if (err) throw err;


            db.query(sql, (err, results) => {
                if (err) throw err;

                res.render('leave/leaveApprove', {
                    title: 'leave Approve Management',
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

router.get('/leaveApprove/Del/:id', isAuthenticated, (req, res) => {
    const sqlDel = "DELETE FROM `leaveApprove` WHERE id = ?";
    const sql = "SELECT * FROM `view_leaveApprove` ORDER BY `nameTH` ASC";
    try {
        db.query(sqlDel, [req.params.id], (err, result) => {
            if (err) throw err;
            db.query(sql, (err, results) => {
                if (err) throw err;
                res.render('leave/leaveApprove', {
                    title: 'leave Approve Management',
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

router.get('/leaveApprove/View/:id', isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM `view_leaveApprove` WHERE `leaveAppID` = ?";
    try {
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            const coverDate = {
                createdAt: null,
                updatedAt: null
            }
            if (result[0]['createdAt']) {
                if (result[0]['createdAt'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
                    coverDate.createdAt = moment(result[0]['createdAt']).format('DD/MM/YYYY HH:mm:ss');
                }
            }
            if (result[0]['updatedAt']) {
                if (result[0]['datetiupdatedAtmeSolve'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
                    coverDate.updatedAt = moment(result[0]['updatedAt']).format('DD/MM/YYYY HH:mm:ss');
                }
            }
            res.render('leave/leaveApproveView', {
                title: 'Leave Approve View',
                results: result[0],
                user: req.session.user,
                coverDate: coverDate
            });
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
})

module.exports = router;