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
        const sql = "SELECT * FROM departments ORDER BY no ASC";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('dataDDL/department', { 
                title: 'Department Management',
                departments: results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});

router.get('/Add',isAuthenticated, (req, res) => {
    res.render('dataDDL/departmentAdd',{ 
        title: 'Department Create',
        user: req.session.user });
})

router.post('/Add',isAuthenticated,(req, res) => {
    const { departmentNo,departmentCode,departmentNameTH,departmentNameEN }= req.body;
    const uuid = uuidv4();
    const sql = "INSERT INTO departments ( id, no,code, nameTH, nameEN ) VALUES(?, ?, ?, ?, ?)";
    db.query(sql, [ uuid,departmentNo,departmentCode, departmentNameTH,departmentNameEN ], (err, result) => {
        if (err) throw err;
        const sql = "SELECT * FROM departments ORDER BY no ASC";

        db.query(sql, (err, results) => {
            if (err) throw err;
    
            res.render('dataDDL/department', { 
                title: 'Department Management',
                departments: results,
                user: req.session.user
            });
        })
    })
})

router.get('/Edit/:id',isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM departments WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('dataDDL/departmentEdit', { 
            title: 'Department Edit',
            department: result[0] ,
            user: req.session.user 
        });
    });
})

router.post('/Edit/:id',isAuthenticated,(req, res) => {
    const { departmentNoE,departmentCodeE,departmentNameTHE,departmentNameENE } = req.body;
    
    const sql = "UPDATE departments SET no = ?,nameCode = ? , nameTH = ? , nameEN = ? WHERE id = ?";
    db.query(sql, [departmentNoE,departmentCodeE,departmentNameTHE,departmentNameENE , req.params.id], (err, result) => {
        if (err) throw err;
        const sql = "SELECT * FROM departments ORDER BY no ASC";

        db.query(sql, (err, results) => {
            if (err) throw err;
    
            res.render('dataDDL/department', { 
                title: 'Department Management',
                departments: results,
                user: req.session.user
            });
        })
    })
})

router.get('/Del/:id',isAuthenticated, (req, res) => {
    const sql = "DELETE FROM departments WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        const sql = "SELECT * FROM departments ORDER BY no ASC";

        db.query(sql, (err, results) => {
            if (err) throw err;
    
            res.render('dataDDL/department', { 
                title: 'Department Management',
                departments: results,
                user: req.session.user
            });
        })
    });
})

router.get('/View/:id',isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM departments WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('dataDDL/departmentView', {
            title: 'Department View', 
            department: result[0] ,
            user: req.session.user 
        });
    });
})

module.exports =  router;