const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const path = require('path');
const { v4: uuidv4 } = require("uuid");
router.use(express.urlencoded({ extended: true }));

const condb = require("../db");
const db = mysql.createConnection({
    host: condb.host(),
    user: condb.user(),
    password: condb.password(),
    database: condb.database()
})

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

router.get('/',isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM departments ORDER BY no ASC";

    db.query(sql, (err, results) => {
        if (err) throw err;

        res.render('department', { 
            title: 'department',
            departments: results,
            user: req.session.user
        });
    })
});

router.get('/Add',isAuthenticated, (req, res) => {
    res.render('departmentAdd',{ user: req.session.user });
})

router.post('/Add',isAuthenticated, (req, res) => {
    const { departmentNo, departmentCode,departmentNameTH,departmentNameEN }= req.body;
    const uuid = uuidv4();
    const sql = "INSERT INTO departments ( id, no, code, nameTH, nameEN ) VALUES(?, ?, ?, ?,?)";
    db.query(sql, [ uuid,departmentNo, departmentCode,departmentNameTH,departmentNameEN ], (err, result) => {
        if (err) throw err;

        res.redirect('/department',{ user: req.session.user });
    })
})

router.get('/Edit/:id',isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM departments WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('departmentEdit', { 
            department: result[0] ,
            user: req.session.user 
        });
    });
})

router.post('/Edit/:id',isAuthenticated,(req, res) => {
    const { departmentNoE, departmentCodeE,departmentNameTHE,departmentNameENE } = req.body;
    
    const sql = "UPDATE departments SET no = ?, code = ?, nameTH = ? , nameEN = ? WHERE id = ?";
    db.query(sql, [departmentNoE, departmentCodeE,departmentNameTHE,departmentNameENE , req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/department',{ user: req.session.user });
    })
})

router.get('/Del/:id',isAuthenticated, (req, res) => {
    const sql = "DELETE FROM departments WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/department',{ user: req.session.user });
    });
})

module.exports =  router;