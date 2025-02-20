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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({ storage });

router.get('/',isAuthenticated,(req, res) => {
    try {
        const sql = "SELECT * FROM `view_employeeSub`";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('hrm/employee', { 
                title: 'Employee Management',
                employee : results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});

router.get('/Sub/:id',isAuthenticated,(req, res) => {
    try {
        const sql1 = "SELECT * FROM `view_employeeFull` WHERE id = ?";
        const sql2 = "SELECT * FROM `employeeEducation` WHERE empID = ?"
        const sql3 = "SELECT `id`, `emID`, `Card`,DATE_FORMAT(`createdAt`, '%d/%m/%Y %H:%i:%s') as createdAt FROM `employeeCard` WHERE emID = ?"
        const sql4 = "SELECT * FROM `employeeVehicle` WHERE emID = ?"
        db.query(sql1,[req.params.id], (err, results) => {
            if (err) throw err;
            db.query(sql2,[req.params.id], (err, emEducation) => {
                if (err) throw err;
                db.query(sql3,[req.params.id], (err, emCard) => {
                    if (err) throw err;
                    db.query(sql4,[req.params.id], (err, emCar) => {
                        if (err) throw err;

                        const coverDate = {
                            startDate : null,
                            endDate : null,
                            dateOfBirth : null,
                            registrationDate : null,
                            graduationDate : null
                        }
                        if(results[0]['startDate']){
                            if(results[0]['startDate'].toString()!== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)" ){
                                coverDate.startDate = moment(results[0]['startDate']).format('YYYY-MM-DD');}}
                        if(results[0]['endDate']){
                            if(results[0]['endDate'].toString()!== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)" ){
                                coverDate.endDate = moment(results[0]['endDate']).format('YYYY-MM-DD');}}
                        if(results[0]['dateOfBirth']){
                            if(results[0]['dateOfBirth'].toString()!== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)" ){
                                coverDate.dateOfBirth = moment(results[0]['dateOfBirth']).format('YYYY-MM-DD');}}
                        if(results[0]['registrationDate']){                
                            if(results[0]['registrationDate'].toString()!== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)" ){
                                coverDate.registrationDate = moment(results[0]['registrationDate']).format('YYYY-MM-DD');}}
                        if(results[0]['graduationDate']){
                            if(results[0]['graduationDate'].toString()!== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)" ){
                                coverDate.graduationDate = moment(results[0]['graduationDate']).format('YYYY-MM-DD');}}
                                res.render('hrm/employeeSub', { 
                                    title: 'Employee Management',
                                    emEducation: emEducation,
                                    emCard : emCard,
                                    emCar:emCar,
                                    employeeFull : results[0],
                                    coverDate : coverDate,
                                    user: req.session.user
                                });
                    })
                })
            })
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});

router.get('/Add',isAuthenticated, (req, res) => {
        const sql1 = "SELECT * FROM departments ORDER BY no ASC";
        const sql2 = "SELECT * FROM positions ORDER BY no ASC";
        const sql3 = "SELECT * FROM workLevel ORDER BY no ASC";
        const sql4 = "SELECT * FROM users ORDER BY name ASC";
        const now = new Date();
        const dateString = moment(now).format('YYYY-MM-DD');
        try { 
            db.query(sql1, (err, departments) => {
                if (err) throw err;

                db.query(sql2, (err, positions) => {
                    if (err) throw err;

                    db.query(sql3, (err, workLevel) => {
                        if (err) throw err;
                        
                        db.query(sql4, (err, users) => {
                            if (err) throw err;
                            
                            res.render('hrm/employeeAdd', { 
                                title: 'Employee Create',
                                departments : departments,
                                positions:positions,
                                workLevel:workLevel,
                                users:users,
                                dateDefault:dateString,
                                user: req.session.user
                            });
                        }) 
                    }) 
                })  
 
            })
        }
        catch (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ error: 'Error inserting data into the database.' });
        } 
})

const isAuthen_assImage = [isAuthenticated, upload.single('image')];

router.post('/Add',isAuthen_assImage,(req, res) => {
    const { employeeCode , serialNumber , mobile , internalTelephone , nameTH , nameEN ,nickname, departmentID ,
        positionID , workLevelID , employmentType , startDate , endDate , ReasonForLeaving ,userLogin ,
        dateOfBirth , nameTitle , gender , bloodGroup , maritalStatus , religion , nationality ,ethnicity, taxID ,
        bank , bankNumber , address , subdistrict , district , province , postcode }= req.body;

    const image = req.file ? req.file.filename : null;
    const uuid1 = uuidv4();
    const sqlAdd1 = "INSERT INTO `employee`(`id`, `code`, `serialNumber`, `mobile`, `InternalTelephone`, `nameTH`, `nameEN`,`nickname`, `departmentID`, `positionID`, `workLevelID`, `employmentType`, `startDate`, `endDate`, `reasonForLeaving`, `userID`,`image`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const uuid2 = uuidv4();
    const sqlAdd2 = "INSERT INTO `employeeInfo`(`id`, `address`, `subdistrict`, `district`, `province`, `postcode`, `dateOfBirth`, `nameTitle`, `gender`, `bloodGroup`, `maritalStatus`, `religion`, `nationality`, `ethnicity`, `taxID`, `bank`, `bankNumber`, `emID`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    try{
       db.query(sqlAdd1, [ uuid1 , employeeCode , serialNumber , mobile , internalTelephone , nameTH , nameEN ,nickname, departmentID ,
            positionID , workLevelID , employmentType , startDate , endDate , ReasonForLeaving ,userLogin,image ], (err, result1) => {
            if (err) throw err;

            db.query(sqlAdd2,[uuid2,address , subdistrict , district , province , postcode, dateOfBirth , nameTitle , gender , bloodGroup , 
                maritalStatus , religion , nationality ,ethnicity, taxID , bank , bankNumber ,uuid1], (err, results) => {
                if (err) throw err;
        
                const sql = "SELECT * FROM employee ORDER BY serialNumber ASC";
                db.query(sql, (err, results) => {
                    if (err) throw err;
            
                    res.render('hrm/employee', { 
                        title: 'Employee Management',
                        employee: results,
                        user: req.session.user
                    });
                })
            })
        })
    }
    catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/Edit/:id',isAuthenticated, (req, res) => {
    const sql1 = "SELECT * FROM departments ORDER BY no ASC";
    const sql2 = "SELECT * FROM positions ORDER BY no ASC";
    const sql3 = "SELECT * FROM workLevel ORDER BY no ASC";
    const sql4 = "SELECT * FROM users ORDER BY name ASC";
    const sql = "SELECT * FROM `view_employeeFull` WHERE id = ?";
    try { 
        db.query(sql1, (err, departments) => {
            if (err) throw err;

            db.query(sql2, (err, positions) => {
                if (err) throw err;

                db.query(sql3, (err, workLevel) => {
                    if (err) throw err;
                    
                    db.query(sql4, (err, users) => {
                        if (err) throw err;
                        
                        db.query(sql, [req.params.id], (err, results) => {
                            if (err) throw err;
                    const coverDate = {
                        startDate : null,
                        endDate : null,
                        dateOfBirth : null,
                        registrationDate : null,
                        graduationDate : null
                    }
                    if(results[0]['startDate']){
                        if(results[0]['startDate'].toString()!== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)" ){
                            coverDate.startDate = moment(results[0]['startDate']).format('YYYY-MM-DD');}}
                    if(results[0]['endDate']){
                        if(results[0]['endDate'].toString()!== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)" ){
                            coverDate.endDate = moment(results[0]['endDate']).format('YYYY-MM-DD');}}
                    if(results[0]['dateOfBirth']){
                        if(results[0]['dateOfBirth'].toString()!== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)" ){
                            coverDate.dateOfBirth = moment(results[0]['dateOfBirth']).format('YYYY-MM-DD');}}
                    if(results[0]['registrationDate']){                
                        if(results[0]['registrationDate'].toString()!== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)" ){
                            coverDate.registrationDate = moment(results[0]['registrationDate']).format('YYYY-MM-DD');}}
                    if(results[0]['graduationDate']){
                        if(results[0]['graduationDate'].toString()!== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)" ){
                            coverDate.graduationDate = moment(results[0]['graduationDate']).format('YYYY-MM-DD');}}

                            res.render('hrm/employeeEdit', { 
                                title: 'Employee Edit',
                                employeeFull: results[0] ,
                                user: req.session.user ,
                                departments : departments,
                                positions:positions,
                                workLevel:workLevel,
                                coverDate:coverDate,
                                users:users
                            });
                        });
                    }) 
                }) 
            })  

        })
    }
    catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

const isAuthen_assImageE = [isAuthenticated, upload.single('imageE')];

router.post('/Edit/:id',isAuthen_assImageE,(req, res) => {
    const paramID = req.params.id;
    const { employeeCodeE , serialNumberE , mobileE , internalTelephoneE , nameTHE , nameENE ,nicknameE, departmentIDE ,
        positionIDE , workLevelIDE , employmentTypeE , startDateE , endDateE , ReasonForLeavingE ,userLoginE ,
        dateOfBirthE , nameTitleE , genderE , bloodGroupE , maritalStatusE , religionE , nationalityE ,ethnicityE, taxIDE ,
        bankE , bankNumberE , addressE , subdistrictE , districtE , provinceE , postcodeE }= req.body;
    
    const image = req.file ? req.file.filename : req.body.oldImage;
    const sql1 = "UPDATE `employee` SET `code`= ?, `serialNumber`= ?, `mobile`= ?, `InternalTelephone`= ?, `nameTH`= ?, `nameEN`= ?,`nickname`=?, `departmentID`= ?, `positionID`= ?, `workLevelID`= ?, `employmentType`= ?, `startDate`= ?, `endDate`= ?, `reasonForLeaving`= ?, `userID` = ?,`updatedAt`=?,`image` = ? WHERE id = ?";
    const sql2 = "UPDATE `employeeInfo` SET `address`= ?, `subdistrict`= ?, `district`= ?, `province`= ?, `postcode`= ?, `dateOfBirth`= ?, `nameTitle`= ?, `gender`= ?, `bloodGroup`= ?, `maritalStatus`= ?, `religion`= ?, `nationality`= ?, `ethnicity`= ?, `taxID`= ?, `bank`= ?, `bankNumber`= ?,`updatedAt`=? WHERE emID = ?";
    const sql3 = "SELECT * FROM `employeeInfo` WHERE emID = ?";
    const sqlAdd = "INSERT INTO `employeeInfo`(`id`, `address`, `subdistrict`, `district`, `province`, `postcode`, `dateOfBirth`, `nameTitle`, `gender`, `bloodGroup`, `maritalStatus`, `religion`, `nationality`, `ethnicity`, `taxID`, `bank`, `bankNumber`, `emID`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const today = new Date();
    const timestamp= moment(today).format();
    try {
        db.query(sql1, [employeeCodeE , serialNumberE , mobileE , internalTelephoneE , nameTHE , nameENE ,nicknameE, departmentIDE ,
            positionIDE , workLevelIDE , employmentTypeE , startDateE , endDateE , ReasonForLeavingE ,userLoginE ,timestamp,image, req.params.id], (err, result1) => {
            if (err) throw err;
            
            db.query(sql3, [ req.params.id], (err, result3) => {
                    if (err) throw err;

                    if (result3.length > 0) {
                        db.query(sql2, [addressE , subdistrictE , districtE , provinceE , postcodeE , dateOfBirthE , nameTitleE , genderE , bloodGroupE , 
                            maritalStatusE , religionE , nationalityE , ethnicityE, taxIDE , bankE , bankNumberE  ,timestamp, req.params.id], (err, result2) => {
                            if (err) throw err;
                    
                            res.redirect('/employee/Sub/'+paramID);
                        })
                    }else{

                        const uuid = uuidv4();
                        db.query(sqlAdd,[uuid,addressE , subdistrictE , districtE , provinceE , postcodeE, dateOfBirthE , nameTitleE , genderE , bloodGroupE , 
                            maritalStatusE , religionE , nationalityE , ethnicityE , taxIDE , bankE , bankNumberE ,req.params.id], (err, resultsAdd) => {
                            if (err) throw err;

                            res.redirect('/employee/Sub/'+paramID);
                            })
                    }
                })

        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/Del/:id',isAuthenticated, (req, res) => {
    const sqlDel = "DELETE FROM employeeEducation WHERE id = ?";
    const sql = "SELECT * FROM employeeEducation WHERE id = ?";
    try{
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            

            db.query(sqlDel,[req.params.id], (err, resultDel) => {
                if (err) throw err;
        
                res.redirect('/employee/Sub/'+result[0]['emID']);

                
            })
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/View/:id',isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM employeeEducation WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('hrm/employeeView', {
            title: 'Employee Education View', 
            employeeEducation : result[0] ,
            user: req.session.user 
        });
    });
})

router.get('/SubAdd/:id',isAuthenticated,(req, res) => {

    res.render('hrm/employeeSubAdd', {
        title: 'Education Create',
        employeeID : [req.params.id],
        user: req.session.user
    });
});

router.post('/SubAdd/:id',isAuthenticated,(req, res) => {
    const { educationLevel,university,registrationDate,graduationDate,studyPeriod,major,addressUniversity,yearGraduation }= req.body;
    const uuid = uuidv4();
    const paramID = req.params.id;
    const sqlAdd = "INSERT INTO `employeeEducation`(`id`, `empID`, `educationLevel`, `university`, `registrationDate`, `graduationDate`, `studyPeriod`, `major`, `addressUniversity`, `yearGraduation`)  VALUES (?,?,?,?,?,?,?,?,?,?)";
    try {
        db.query(sqlAdd, [ uuid,req.params.id,educationLevel,university,registrationDate,graduationDate,studyPeriod,major,addressUniversity,yearGraduation], (err, result) => {
            if (err) throw err;

            res.redirect('/employee/Sub/'+paramID);
            
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/SubEdit/:id',isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM employeeEducation WHERE id = ?";
    try{
        db.query(sql, [req.params.id], (err, results) => {
            if (err) throw err;

            const coverDate = {
                registrationDate : null,
                graduationDate : null
            }
            if(results[0]['gradregistrationDateuationDate']){
                if(results[0]['gradregistrationDateuationDate'].toString()!== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)" ){
                    coverDate.registrationDate = moment(results[0]['graduationDate']).format('YYYY-MM-DD');}}
            if(results[0]['graduationDate']){
                if(results[0]['graduationDate'].toString()!== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)" ){
                    coverDate.graduationDate = moment(results[0]['graduationDate']).format('YYYY-MM-DD');}}
            res.render('hrm/employeeSubEdit', {
                title: 'Education Edit', 
                employeeEducation : results[0] ,
                coverDate:coverDate,
                user: req.session.user 
            });
        });
    } catch (err) {
        console.error('Error show data:', err);
        res.status(500).json({ error: 'Error Show data into the database.' });
    } 
})

router.post('/SubEdit/:id',isAuthenticated,(req, res) => {
    const { educationLevelE,universityE,registrationDateE,graduationDateE,studyPeriodE,majorE,addressUniversityE,yearGraduationE }= req.body;
    const paramID = req.params.id;
    const sqlEdit = "UPDATE `employeeEducation` SET `educationLevel`=?,`university`=?,`registrationDate`=?,`graduationDate`=?,`studyPeriod`=?,`major`=?,`addressUniversity`=?,`yearGraduation`=?,`updatedAt`=? WHERE `id`=?";
    const today = new Date();
    const timestamp= moment(today).format();
    const sql = "SELECT * FROM employeeEducation WHERE id = ?";
    try {
        db.query(sqlEdit, [ educationLevelE,universityE,registrationDateE,graduationDateE,studyPeriodE,majorE,addressUniversityE,yearGraduationE,timestamp,paramID], (err, resultEdit) => {
            if (err) throw err;

            db.query(sql, [req.params.id], (err, result) => {
                if (err) throw err;

                res.redirect('/employee/Sub/'+result[0]['empID']);

            })
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/SubDel/:id',isAuthenticated, (req, res) => {
    const sqlDel = "DELETE FROM employeeEducation WHERE id = ?";
    const sql = "SELECT * FROM employeeEducation WHERE id = ?";
    try{
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            
            db.query(sqlDel,[req.params.id], (err, resultDel) => {
                if (err) throw err;
                
                res.redirect('/employee/Sub/'+result[0]['empID']);
                
            })
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/SubView/:id',isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM employeeEducation WHERE id = ?";
    try{
        db.query(sql, [req.params.id], (err, results) => {

            const coverDate = {
                registrationDate : null,
                graduationDate : null
            }
            if(results[0]['gradregistrationDateuationDate']){
                if(results[0]['gradregistrationDateuationDate'].toString()!== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)" ){
                    coverDate.registrationDate = moment(results[0]['graduationDate']).format('YYYY-MM-DD');}}
            if(results[0]['graduationDate']){
                if(results[0]['graduationDate'].toString()!== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)" ){
                    coverDate.graduationDate = moment(results[0]['graduationDate']).format('YYYY-MM-DD');}}
            if (err) throw err;
            res.render('hrm/employeeSubView', {
                title: 'Education View', 
                employeeEducation : results[0] ,
                coverDate:coverDate,
                user: req.session.user 
            });
        });
    } catch (err) {
        console.error('Error show data:', err);
        res.status(500).json({ error: 'Error Show data into the database.' });
    } 
})

router.get('/SubZAdd/:id',isAuthenticated,(req, res) => {

    res.render('hrm/employeeSubZAdd', {
        title: 'Card Create',
        employeeID : [req.params.id],
        user: req.session.user
    });
});

const isAuthen_assCard = [isAuthenticated, upload.single('card')];

router.post('/SubZAdd/:id',isAuthen_assCard,(req, res) => {
    const uuid = uuidv4();
    const paramID = req.params.id;
    const image = req.file ? req.file.filename : null;
    const sqlAdd = "INSERT INTO `employeeCard`(`id`, `emID`, `Card`)  VALUES (?,?,?)";
    try {
        db.query(sqlAdd, [ uuid,req.params.id,image], (err, result) => {
            if (err) throw err;

            res.redirect('/employee/Sub/'+paramID);
            
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/SubZEdit/:id',isAuthenticated, (req, res) => {
    const sql = "SELECT `id`, `emID`, `Card`, `createdAt` FROM `employeeCard` WHERE id = ?";
    try{
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;

            const coverDate = {
                createdAt : moment(result[0]['createdAt']).format('YYYY-MM-DD')
            }
            res.render('hrm/employeeSubZEdit', {
                title: 'Card Edit', 
                employeeCard : result[0],
                coverDate : coverDate,
                user: req.session.user 
            });
        });
    } catch (err) {
        console.error('Error show data:', err);
        res.status(500).json({ error: 'Error Show data into the database.' });
    } 
})

const isAuthen_assCardE = [isAuthenticated, upload.single('cardE')];

router.post('/SubZEdit/:id',isAuthen_assCardE,(req, res) => {
    const paramID = req.params.id;
    const sqlEdit = "UPDATE `employeeCard` SET `Card`=? WHERE `id`=?";
    const today = new Date();
    const timestamp= moment(today).format();
    const image = req.file ? req.file.filename : req.body.oldImage;
    const sql = "SELECT * FROM employeeCard WHERE id = ?";
    try {
        db.query(sqlEdit, [ image,paramID], (err, resultEdit) => {
            if (err) throw err;

            db.query(sql, [req.params.id], (err, result) => {
                if (err) throw err;

                res.redirect('/employee/Sub/'+result[0]['emID']);

            })
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/SubZDel/:id',isAuthenticated, (req, res) => {
    const sqlDel = "DELETE FROM employeeCard WHERE id = ?";
    const sql = "SELECT * FROM employeeCard WHERE id = ?";
    try{
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            
            db.query(sqlDel,[req.params.id], (err, resultDel) => {
                if (err) throw err;
                
                res.redirect('/employee/Sub/'+result[0]['emID']);
                
            })
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/SubZView/:id',isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM employeeCard WHERE id = ?";
    try{
        db.query(sql, [req.params.id], (err, result) => {

            const coverDate = {
                createdAt : moment(result[0]['createdAt']).format('YYYY-MM-DD')
            }
            if (err) throw err;
            res.render('hrm/employeeSubZView', {
                title: 'Card View', 
                employeeCard : result[0] ,
                coverDate:coverDate,
                user: req.session.user 
            });
        });
    } catch (err) {
        console.error('Error show data:', err);
        res.status(500).json({ error: 'Error Show data into the database.' });
    } 
})

router.get('/SubZzAdd/:id',isAuthenticated,(req, res) => {

    res.render('hrm/employeeSubZzAdd', {
        title: 'Conveyance Create',
        employeeID : [req.params.id],
        user: req.session.user
    });
});


router.post('/SubZzAdd/:id',isAuthenticated,(req, res) => {
    const { vehicle,carBrand,carModel,carColor,carRegistration  }= req.body;
    const uuid = uuidv4();
    const paramID = req.params.id;
    const sqlAdd = "INSERT INTO `employeeVehicle`(`id`, `emID`, `vehicle`, `brand`, `model`, `color`, `registration`)  VALUES (?,?,?,?,?,?,?);";
    try {
        db.query(sqlAdd, [ uuid,req.params.id,vehicle,carBrand,carModel,carColor,carRegistration ], (err, result) => {
            if (err) throw err;

            res.redirect('/employee/Sub/'+paramID);
            
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/SubZzEdit/:id',isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM `employeeVehicle` WHERE id = ?";
    try{
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;


            res.render('hrm/employeeSubZzEdit', {
                title: 'Card Edit', 
                employeeCar : result[0],
                user: req.session.user 
            });
        });
    } catch (err) {
        console.error('Error show data:', err);
        res.status(500).json({ error: 'Error Show data into the database.' });
    } 
})

router.post('/SubZzEdit/:id',isAuthenticated,(req, res) => {
    const { vehicleE,brandE,modelE,colorE,registrationE }= req.body;
    const paramID = req.params.id;
    const sqlEdit = "UPDATE `employeeVehicle` SET `vehicle`=?,`brand`=?,`model`=?,`color`=?,`registration`=?,`updatedAt`=? WHERE `id`=?";
    const today = new Date();
    const timestamp= moment(today).format();
    const sql = "SELECT * FROM employeeVehicle WHERE id = ?";
    try {
        db.query(sqlEdit, [ vehicleE,brandE,modelE,colorE,registrationE,timestamp,paramID], (err, resultEdit) => {
            if (err) throw err;

            db.query(sql, [req.params.id], (err, result) => {
                if (err) throw err;

                res.redirect('/employee/Sub/'+result[0]['emID']);

            })
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/SubZzDel/:id',isAuthenticated, (req, res) => {
    const sqlDel = "DELETE FROM employeeVehicle WHERE id = ?";
    const sql = "SELECT * FROM employeeVehicle WHERE id = ?";
    try{
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            
            db.query(sqlDel,[req.params.id], (err, resultDel) => {
                if (err) throw err;
                
                res.redirect('/employee/Sub/'+result[0]['emID']);
                
            })
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
})

router.get('/SubZzView/:id',isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM employeeVehicle WHERE id = ?";
    try{
        db.query(sql, [req.params.id], (err, result) => {

            const coverDate = {
                createdAt : null,
                updatedAt : null
            }
            if(result[0]['createdAt']){
                if(result[0]['createdAt'].toString()!== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)" ){
                    coverDate.createdAt = moment(result[0]['createdAt']).format('YYYY-MM-DD');}}
            if(result[0]['updatedAt']){
                if(result[0]['updatedAt'].toString()!== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)" ){
                    coverDate.updatedAt = moment(result[0]['updatedAt']).format('YYYY-MM-DD');}}
            if (err) throw err;
            res.render('hrm/employeeSubZzView', {
                title: 'Vehicle View', 
                emCar : result[0] ,
                coverDate:coverDate,
                user: req.session.user 
            });
        });
    } catch (err) {
        console.error('Error show data:', err);
        res.status(500).json({ error: 'Error Show data into the database.' });
    } 
})

router.get('/rptContact',isAuthenticated,(req, res) => {
    try {
        const sql = "SELECT * FROM `view_employeeSub`";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('hrm/rptEmployeeContact', { 
                title: 'Employee Contact Report',
                employee : results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});

router.get('/rptInformation',isAuthenticated,(req, res) => {
    try {
        const sql = "SELECT * FROM `view_employeeSub`";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('hrm/rptEmployeeInformation', { 
                title: 'Employee Information Report',
                employee : results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});
router.get('/rptEducation',isAuthenticated,(req, res) => {
    try {
        const sql = "SELECT * FROM `view_employeeFull`";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('hrm/rptEmployeeEducation', { 
                title: 'Employee Education Report',
                employee : results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});
router.get('/rptWorkPeriod',isAuthenticated,(req, res) => {
    try {
        const sql = "SELECT * FROM `view_employeeSub`";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('hrm/rptEmployeeWorkPeriod', { 
                title: 'Employee Work Period Report',
                employee : results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});
router.get('/rptCards',isAuthenticated,(req, res) => {
    try {
        const sql = "SELECT * FROM `view_cardEmployee`";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('hrm/rptEmployeeCards', { 
                title: 'Employee Cards Report',
                employee : results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});
router.get('/rptVehicle',isAuthenticated,(req, res) => {
    try {
        const sql = "SELECT * FROM `view_carEmployee`";
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('hrm/rptEmployeeVehicle', { 
                title: 'Employee Vehicle Report',
                employee : results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    } 
});
module.exports =  router;