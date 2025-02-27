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

router.get('/brands',(req, res) => {
    try {
        const sql = "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryBrands`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryBrands`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryBrands`";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('library/libraryBrands', { 
                title: 'Library Brands Management',
                libraryBrands : results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});

router.get('/brands/Add',(req, res) => {
    try {
        res.render('library/libraryBrandsAdd', { 
            title: 'Library Brands Create',
            user: req.session.user
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});

router.post('/brands/Add',(req, res) => {
    const { libraryBrandsCode,libraryBrandsNameTH,libraryBrandsNameEN }= req.body;
    const uuid = uuidv4();
    const sqlAdd = "INSERT INTO `libraryBrands` ( `id`, `code`, `nameTH`, `nameEN` ) VALUES(?, ?, ?, ?)";
    try{
        db.query(sqlAdd, [ uuid, libraryBrandsCode,libraryBrandsNameTH,libraryBrandsNameEN], (err, result) => {
            if (err) throw err;
            const sql = "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryBrands`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryBrands`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryBrands`";
    
            db.query(sql, (err, results) => {
                if (err) throw err;
        
                res.render('library/libraryBrands', { 
                    title: 'Library Brands Management',
                    libraryBrands : results,
                    user: req.session.user
                });
            })
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});

router.get('/brands/Edit/:id', (req, res) => {
    try {
         const sql2t =  "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryBrands`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryBrands`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryBrands` WHERE `id` = ? ";
        db.query(sql2t, [req.params.id], (err, result) => {
            if (err) throw err;
                res.render('library/libraryBrandsEdit', {
                    title: 'Library Brands Edit', 
                    libraryBrands : result[0] ,
                    user: req.session.user 
                });

        });
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' });
    }
})

router.post('/brands/Edit/:id',(req, res) => {
    const { libraryBrandsCodeE,libraryBrandsNameTHE,libraryBrandsNameENE } = req.body;
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    const timestamp = dateTime;
    const sqlEdit = "UPDATE `libraryBrands` SET `code` = ?, `nameTH` = ?,`nameEN` = ?, `updatedAt` =?  WHERE `id` = ?";
    try {
        db.query(sqlEdit, [libraryBrandsCodeE,libraryBrandsNameTHE,libraryBrandsNameENE ,timestamp, req.params.id], (err, result) => {
            if (err) throw err;
            const sql = "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryBrands`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryBrands`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryBrands`";
    
            db.query(sql, (err, results) => {
                if (err) throw err;
        
                res.render('library/libraryBrands', { 
                    title: 'Library Brands Management',
                    libraryBrands : results,
                    user: req.session.user
                });
            })

        })
    } catch (err) {
        console.error('Error editing data:', err);
        res.status(500).json({ error: 'Error editing data into the database.' });
    } 
})

router.get('/brands/Del/:id', (req, res) => {
    const sqlDel = "DELETE FROM `libraryBrands` WHERE id = ?";
    const sql = "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryBrands`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryBrands`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryBrands`";
    try{
        db.query(sqlDel, [req.params.id], (err, resultDel) => {
            if (err) throw err;
            db.query(sql, (err, results) => {
                if (err) throw err;
        
                res.render('library/libraryBrands', { 
                    title: 'Library Brands Management',
                    libraryBrands : results,
                    user: req.session.user
                });
            })
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/brands/View/:id', (req, res) => {
    const sql = "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryBrands`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryBrands`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryBrands` WHERE `id` = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('library/libraryBrandsView', {
            title: 'Library Brands View', 
            libraryBrands : result[0] ,
            user: req.session.user 
        });
    });
})

router.get('/industryType',(req, res) => {
    try {
        const sql = "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryIndustryType`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryIndustryType`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryIndustryType`";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('library/libraryIndustryType', { 
                title: 'Industry Type Management',
                libraryIndustryType : results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});

router.get('/industryType/Add',(req, res) => {
    try {
        res.render('library/libraryIndustryTypeAdd', { 
            title: 'Industry Type Create',
            user: req.session.user
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});

router.post('/industryType/Add',(req, res) => {
    const { libraryIndustryTypeCode,libraryIndustryTypeNameTH,libraryIndustryTypeNameEN }= req.body;
    const uuid = uuidv4();
    const sqlAdd = "INSERT INTO `libraryIndustryType` ( `id`, `code`, `nameTH`, `nameEN` ) VALUES(?, ?, ?, ?)";
    try{
        db.query(sqlAdd, [ uuid, libraryIndustryTypeCode,libraryIndustryTypeNameTH,libraryIndustryTypeNameEN ], (err, result) => {
            if (err) throw err;
            const sql = "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryIndustryType`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryIndustryType`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryIndustryType`";
    
            db.query(sql, (err, results) => {
                if (err) throw err;
        
                res.render('library/libraryIndustryType', { 
                    title: 'Industry Type Management',
                    libraryIndustryType : results,
                    user: req.session.user
                });
            })
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});

router.get('/industryType/Edit/:id', (req, res) => {
    try {
         const sql2t =  "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryIndustryType`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryIndustryType`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryIndustryType` WHERE `id` = ? ";
        db.query(sql2t, [req.params.id], (err, result) => {
            if (err) throw err;
                res.render('library/libraryIndustryTypeEdit', {
                    title: 'Industry Type Edit', 
                    libraryIndustryType : result[0] ,
                    user: req.session.user 
                });

        });
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' });
    }
})

router.post('/industryType/Edit/:id',(req, res) => {
    const { libraryIndustryTypeCodeE,libraryIndustryTypeNameTHE,libraryIndustryTypeNameENE } = req.body;
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    const timestamp = dateTime;
    const sqlEdit = "UPDATE `libraryIndustryType` SET `code` = ?, `nameTH` = ?,`nameEN` = ?, `updatedAt` =?  WHERE `id` = ?";
    try {
        db.query(sqlEdit, [libraryIndustryTypeCodeE,libraryIndustryTypeNameTHE,libraryIndustryTypeNameENE  ,timestamp, req.params.id], (err, result) => {
            if (err) throw err;
            const sql = "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryIndustryType`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryIndustryType`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryIndustryType`";
    
            db.query(sql, (err, results) => {
                if (err) throw err;
        
                res.render('library/libraryIndustryType', { 
                    title: 'Industry Type Management',
                    libraryIndustryType : results,
                    user: req.session.user
                });
            })

        })
    } catch (err) {
        console.error('Error editing data:', err);
        res.status(500).json({ error: 'Error editing data into the database.' });
    } 
})

router.get('/industryType/Del/:id', (req, res) => {
    const sqlDel = "DELETE FROM `libraryIndustryType` WHERE id = ?";
    const sql = "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryIndustryType`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryIndustryType`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryIndustryType`";
    try{
        db.query(sqlDel, [req.params.id], (err, resultDel) => {
            if (err) throw err;
            db.query(sql, (err, results) => {
                if (err) throw err;
        
                res.render('library/libraryIndustryType', { 
                    title: 'Industry Type Management',
                    libraryIndustryType : results,
                    user: req.session.user
                });
            })
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/industryType/View/:id', (req, res) => {
    const sql = "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryIndustryType`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryIndustryType`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryIndustryType` WHERE `id` = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('library/libraryIndustryTypeView', {
            title: 'Industry Type View', 
            libraryIndustryType : result[0] ,
            user: req.session.user 
        });
    });
})

router.get('/productType',(req, res) => {
    try {
        const sql = "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryProductType`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryProductType`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryProductType`";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('library/libraryProductType', { 
                title: 'Product Type Management',
                libraryProductType : results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});

router.get('/productType/Add',(req, res) => {
    try {
        res.render('library/libraryProductTypeAdd', { 
            title: 'Product Type Create',
            user: req.session.user
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});

router.post('/productType/Add',(req, res) => {
    const { libraryProductTypeCode,libraryProductTypeNameTH,libraryProductTypeNameEN }= req.body;
    const uuid = uuidv4();
    const sqlAdd = "INSERT INTO `libraryProductType` ( `id`, `code`, `nameTH`, `nameEN` ) VALUES(?, ?, ?, ?)";
    try{
        db.query(sqlAdd, [ uuid, libraryProductTypeCode,libraryProductTypeNameTH,libraryProductTypeNameEN ], (err, result) => {
            if (err) throw err;
            const sql = "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryProductType`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryProductType`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryProductType`";
    
            db.query(sql, (err, results) => {
                if (err) throw err;
        
                res.render('library/libraryProductType', { 
                    title: 'Product Type Management',
                    libraryProductType : results,
                    user: req.session.user
                });
            })
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});

router.get('/productType/Edit/:id', (req, res) => {
    try {
         const sql2t =  "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryProductType`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryProductType`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryProductType` WHERE `id` = ? ";
        db.query(sql2t, [req.params.id], (err, result) => {
            if (err) throw err;
                res.render('library/libraryProductTypeEdit', {
                    title: 'Product Type Edit', 
                    libraryProductType : result[0] ,
                    user: req.session.user 
                });

        });
    } catch (err) {
        console.error('Error view data:', err);
        res.status(500).json({ error: 'Error view data into the database.' });
    }
})

router.post('/productType/Edit/:id',(req, res) => {
    const { libraryProductTypeCodeE,libraryProductTypeNameTHE,libraryProductTypeNameENE } = req.body;
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    const timestamp = dateTime;
    const sqlEdit = "UPDATE `libraryProductType` SET `code` = ?, `nameTH` = ?,`nameEN` = ?, `updatedAt` =?  WHERE `id` = ?";
    try {
        db.query(sqlEdit, [libraryProductTypeCodeE,libraryProductTypeNameTHE,libraryProductTypeNameENE   ,timestamp, req.params.id], (err, result) => {
            if (err) throw err;
            const sql = "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryProductType`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryProductType`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryProductType`";
    
            db.query(sql, (err, results) => {
                if (err) throw err;
        
                res.render('library/libraryProductType', { 
                    title: 'Product Type Management',
                    libraryProductType : results,
                    user: req.session.user
                });
            })

        })
    } catch (err) {
        console.error('Error editing data:', err);
        res.status(500).json({ error: 'Error editing data into the database.' });
    } 
})

router.get('/productType/Del/:id', (req, res) => {
    const sqlDel = "DELETE FROM `libraryProductType` WHERE id = ?";
    const sql = "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryProductType`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryProductType`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryProductType`";
    try{
        db.query(sqlDel, [req.params.id], (err, resultDel) => {
            if (err) throw err;
            db.query(sql, (err, results) => {
                if (err) throw err;
        
                res.render('library/libraryProductType', { 
                    title: 'Product Type Management',
                    libraryProductType : results,
                    user: req.session.user
                });
            })
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/productType/View/:id', (req, res) => {
    const sql = "SELECT `id`, `code`, `nameTH`, `nameEN`, `createdAt`, `updatedAt`,DATE_FORMAT(`pac_system`.`libraryProductType`.`createdAt`,'%d/%m/%Y %H:%i:%s') AS `createdF`,DATE_FORMAT(`pac_system`.`libraryProductType`.`updatedAt`,'%d/%m/%Y %H:%i:%s') AS `updatedF` FROM `libraryProductType` WHERE `id` = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('library/libraryProductTypeView', {
            title: 'Product Type View', 
            libraryProductType : result[0] ,
            user: req.session.user 
        });
    });
})

module.exports =  router;