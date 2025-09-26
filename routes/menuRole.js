const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const path = require('path');
const { v4: uuidv4 } = require("uuid");
router.use(express.urlencoded({ extended: true }));
const db = require("../db/db.js");
const moment = require('moment');
const {isAuthenticated} = require('../middlewares/authCheck')

router.get('/menu', isAuthenticated, (req, res) => {
  try {
    const sql = "SELECT `id`, `mainMenu`, `subMenu`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`, `routesMenu` FROM `menuRole` ORDER BY `nameEN` ASC";
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.render('menuRole/menuRoleMenu', {
        title: 'Menu Management',
        results: results,
        user: req.session.user
      });
    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
});

router.get('/menu/Add', isAuthenticated, (req, res) => {
  res.render('menuRole/menuRoleMenuAdd', {
    title: 'Menu Create',
    user: req.session.user
  });
})

router.post('/menu/Add', isAuthenticated, (req, res) => {
  const { menuRoleMainMenu, menuRoleSubMenu, menuRoleNameTH, menuRoleNameEN, menuRoleRoutesMenu } = req.body;
  const uuid = uuidv4();
  const sql = "INSERT INTO `menuRole`(`id`, `mainMenu`, `subMenu`, `nameTH`, `nameEN`, `routesMenu`) VALUES (?,?,?,?,?,?)";
  try {
    db.query(sql, [uuid, menuRoleMainMenu, menuRoleSubMenu, menuRoleNameTH, menuRoleNameEN, menuRoleRoutesMenu], (err, result) => {
      if (err) throw err;
      const sql = "SELECT * FROM `menuRole` ORDER BY nameEN ASC";
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('menuRole/menuRoleMenu', {
          title: 'Menu Management',
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

router.get('/menu/Edit/:id', isAuthenticated, (req, res) => {
  const sql = "SELECT * FROM `menuRole` WHERE id = ?";
  const now = new Date();
  const timestamp = moment(now).format();
  try {
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.render('menuRole/menuRoleMenuEdit', {
        title: 'Menu Edit',
        results: result[0],
        timestamp: timestamp,
        user: req.session.user
      });
    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

router.post('/menu/Edit/:id', isAuthenticated, (req, res) => {
  const { menuRoleMainMenuE, menuRoleSubMenuE, menuRoleNameTHE, menuRoleNameENE, menuRoleRoutesMenuE } = req.body;
  const sqlEdit = "UPDATE `menuRole` SET `mainMenu` = ?,`subMenu` = ? , `nameTH` = ? , `nameEN` = ? , `updatedAt`=?, `routesMenu`=? WHERE id = ?";
  const sql = "SELECT * FROM `menuRole` ORDER BY nameEN ASC";
  const now = new Date();
  const timestamp = moment(now).format();
  try {
    db.query(sqlEdit, [menuRoleMainMenuE, menuRoleSubMenuE, menuRoleNameTHE, menuRoleNameENE, timestamp, menuRoleRoutesMenuE, req.params.id], (err, result) => {
      if (err) throw err;
      console.log(sqlEdit)
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('menuRole/menuRoleMenu', {
          title: 'Menu Management',
          results: results,
          timestamp: timestamp,
          user: req.session.user
        });
      })
    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

router.get('/menu/Del/:id', isAuthenticated, (req, res) => {
  const sql = "DELETE FROM `menuRole` WHERE id = ?";
  try {
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      const sql = "SELECT * FROM `menuRole` ORDER BY nameEN ASC";

      db.query(sql, (err, results) => {
        if (err) throw err;

        res.render('menuRole/menuRoleMenu', {
          title: 'Menu Management',
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

router.get('/menu/View/:id', isAuthenticated, (req, res) => {
  const sql = "SELECT * FROM `menuRole` WHERE id = ?";
  try {
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.render('menuRole/menuRoleMenuView', {
        title: 'Menu View',
        results: result[0],
        user: req.session.user
      });
    });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

module.exports = router;