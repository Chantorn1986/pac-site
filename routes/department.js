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


router.get('/', (req, res) => {
    const sql = "SELECT * FROM departments ORDER BY no ASC";

    db.query(sql, (err, results) => {
        if (err) throw err;

        res.render('department', { 
            title: 'department',
            departments: results
        });
    })
});

router.get('/Add', (req, res) => {
    res.render('departmentAdd');
})

router.post('/Add', (req, res) => {
    const { departmentNo, departmentCode,departmentNameTH,departmentNameEN }= req.body;
    const uuid = uuidv4();
    const sql = "INSERT INTO departments ( id, no, code, nameTH, nameEN ) VALUES(?, ?, ?, ?,?)";
    db.query(sql, [ uuid,departmentNo, departmentCode,departmentNameTH,departmentNameEN ], (err, result) => {
        if (err) throw err;

        res.redirect('/department');
    })
})

router.get('/Edit/:id', (req, res) => {
    const sql = "SELECT * FROM departments WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('departmentEdit', { department: result[0] });
    });
})

router.post('/Edit/:id',(req, res) => {
    const { departmentNoE, departmentCodeE,departmentNameTHE,departmentNameENE } = req.body;
    
    const sql = "UPDATE departments SET no = ?, code = ?, nameTH = ? , nameEN = ? WHERE id = ?";
    db.query(sql, [departmentNoE, departmentCodeE,departmentNameTHE,departmentNameENE , req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/department');
    })
})

router.get('/Del/:id', (req, res) => {
    const sql = "DELETE FROM departments WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/department');
    });
})

module.exports =  router;