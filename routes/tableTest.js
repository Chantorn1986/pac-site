const express = require('express');
const router = express.Router();
//const mysql = require('mysql2');
const path = require('path');
const { v4: uuidv4 } = require("uuid");
router.use(express.urlencoded({ extended: true }));
const db = require("../db/db.js");
const moment = require('moment');
const multer = require('multer');
const {isAuthenticated} = require('../middlewares/authCheck')
// const { uploadPic} = require('../middlewares/callFunction')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
})
const upload = multer({ storage });

router.get('/', (req, res) => {
  try {
    const sql = "SELECT `id`, `acNo`, `code`, `name`, `date`, `dateF`, `dayTypeWork`, `onDuty`, `offDuty`, `clockIn`, `clockOut`, `remark`, `late`, `lateHour`, `lateMinute`, `statusScan`, IF(`lateHour`>0,IF(`lateMinute`>0,CONCAT(`lateHour`,' ชม. ',`lateMinute`,' นาที'),CONCAT(`lateHour`,' ชม.')) ,IF(`lateMinute`>0,CONCAT(`lateMinute`,' นาที'),'-')) AS `timeLate` FROM `view_statusClockInOut`";
    db.query(sql, (err, results) => {
      if (err) throw err;

      res.render('sbAdmin/tables', {
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

router.get('/Sub/:id', (req, res) => {
  try {
    const sql1 = "SELECT * FROM `view_employeeFull` WHERE id = ?";
    const sql2 = "SELECT * FROM `employeeEducation` WHERE empID = ?"
    const sql3 = "SELECT `id`, `emID`, `Card`,DATE_FORMAT(`createdAt`, '%d/%m/%Y %H:%i:%s') as createdAt FROM `employeeCard` WHERE emID = ?"
    const sql4 = "SELECT * FROM `employeeVehicle` WHERE emID = ?"
    db.query(sql1, [req.params.id], (err, results) => {
      if (err) throw err;
      db.query(sql2, [req.params.id], (err, emEducation) => {
        if (err) throw err;
        db.query(sql3, [req.params.id], (err, emCard) => {
          if (err) throw err;
          db.query(sql4, [req.params.id], (err, emCar) => {
            if (err) throw err;

            const coverDate = {
              startDate: null,
              endDate: null,
              dateOfBirth: null,
              registrationDate: null,
              graduationDate: null
            }
            if (results[0]['startDate']) {
              if (results[0]['startDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
                coverDate.startDate = moment(results[0]['endDate']).format('YYYY-MM-DD');
              }
            }
            if (results[0]['endDate']) {
              if (results[0]['endDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
                coverDate.endDate = moment(results[0]['endDate']).format('YYYY-MM-DD');
              }
            }
            if (results[0]['dateOfBirth']) {
              if (results[0]['dateOfBirth'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
                coverDate.dateOfBirth = moment(results[0]['dateOfBirth']).format('YYYY-MM-DD');
              }
            }
            if (results[0]['registrationDate']) {
              if (results[0]['registrationDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
                coverDate.registrationDate = moment(results[0]['registrationDate']).format('YYYY-MM-DD');
              }
            }
            if (results[0]['graduationDate']) {
              if (results[0]['graduationDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
                coverDate.graduationDate = moment(results[0]['graduationDate']).format('YYYY-MM-DD');
              }
            }
            res.render('sbAdmin/tablesSub', {
              title: 'Employee Management',
              emEducation: emEducation,
              emCard: emCard,
              emCar: emCar,
              employeeFull: results[0],
              coverDate: coverDate,
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

router.get('/Add', (req, res) => {
  const sql1 = "SELECT * FROM departments ORDER BY no ASC";
  const sql2 = "SELECT * FROM positions ORDER BY no ASC";
  const sql3 = "SELECT * FROM workLevel ORDER BY no ASC";
  const sql4 = "SELECT * FROM users ORDER BY name ASC";
  try {
    const sql = "SELECT * FROM workLevel ORDER BY no ASC";
    db.query(sql1, (err, departments) => {
      if (err) throw err;

      db.query(sql2, (err, positions) => {
        if (err) throw err;

        db.query(sql3, (err, workLevel) => {
          if (err) throw err;

          db.query(sql4, (err, users) => {
            if (err) throw err;

            res.render('sbAdmin/tablesAdd', {
              title: 'Employee Create',
              departments: departments,
              positions: positions,
              workLevel: workLevel,
              users: users,
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

router.post('/Add', upload.single('image'), (req, res) => {
  const { employeeCode, serialNumber, mobile, internalTelephone, nameTH, nameEN, departmentID,
    positionID, workLevelID, employmentType, startDate, endDate, ReasonForLeaving, userLogin,
    dateOfBirth, nameTitle, gender, bloodGroup, maritalStatus, religion, nationality, ethnicity, taxID,
    bank, bankNumber, address, subdistrict, district, province, postcode } = req.body;

  const image = req.file ? req.file.filename : null;
  const uuid1 = uuidv4();
  const sqlAdd1 = "INSERT INTO `employee`(`id`, `code`, `serialNumber`, `mobile`, `InternalTelephone`, `nameTH`, `nameEN`, `departmentID`, `positionID`, `workLevelID`, `employmentType`, `startDate`, `endDate`, `reasonForLeaving`, `userID`,`image`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  const uuid2 = uuidv4();
  const sqlAdd2 = "INSERT INTO `employeeInfo`(`id`, `address`, `subdistrict`, `district`, `province`, `postcode`, `dateOfBirth`, `nameTitle`, `gender`, `bloodGroup`, `maritalStatus`, `religion`, `nationality`, `ethnicity`, `taxID`, `bank`, `bankNumber`, `emID`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  try {
    db.query(sqlAdd1, [uuid1, employeeCode, serialNumber, mobile, internalTelephone, nameTH, nameEN, departmentID,
      positionID, workLevelID, employmentType, startDate, endDate, ReasonForLeaving, userLogin, image], (err, result1) => {
        if (err) throw err;

        db.query(sqlAdd2, [uuid2, address, subdistrict, district, province, postcode, dateOfBirth, nameTitle, gender, bloodGroup,
          maritalStatus, religion, nationality, ethnicity, taxID, bank, bankNumber, uuid1], (err, results) => {
            if (err) throw err;

            const sql = "SELECT * FROM employee ORDER BY serialNumber ASC";
            db.query(sql, (err, results) => {
              if (err) throw err;

              res.render('sbAdmin/tables', {
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

router.get('/Edit/:id', (req, res) => {
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
                startDate: null,
                endDate: null,
                dateOfBirth: null,
                registrationDate: null,
                graduationDate: null
              }
              if (results[0]['startDate']) {
                if (results[0]['startDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
                  coverDate.startDate = moment(results[0]['endDate']).format('YYYY-MM-DD');
                }
              }
              if (results[0]['endDate']) {
                if (results[0]['endDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
                  coverDate.endDate = moment(results[0]['endDate']).format('YYYY-MM-DD');
                }
              }
              if (results[0]['dateOfBirth']) {
                if (results[0]['dateOfBirth'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
                  coverDate.dateOfBirth = moment(results[0]['dateOfBirth']).format('YYYY-MM-DD');
                }
              }
              if (results[0]['registrationDate']) {
                if (results[0]['registrationDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
                  coverDate.registrationDate = moment(results[0]['registrationDate']).format('YYYY-MM-DD');
                }
              }
              if (results[0]['graduationDate']) {
                if (results[0]['graduationDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
                  coverDate.graduationDate = moment(results[0]['graduationDate']).format('YYYY-MM-DD');
                }
              }

              res.render('sbAdmin/tablesEdit', {
                title: 'Employee Edit',
                employeeFull: results[0],
                user: req.session.user,
                departments: departments,
                positions: positions,
                workLevel: workLevel,
                coverDate: coverDate,
                users: users
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

router.post('/Edit/:id', upload.single('imageE'), (req, res) => {
  const paramID = req.params.id;
  const { employeeCodeE, serialNumberE, mobileE, internalTelephoneE, nameTHE, nameENE, departmentIDE,
    positionIDE, workLevelIDE, employmentTypeE, startDateE, endDateE, ReasonForLeavingE, userLoginE,
    dateOfBirthE, nameTitleE, genderE, bloodGroupE, maritalStatusE, religionE, nationalityE, ethnicityE, taxIDE,
    bankE, bankNumberE, addressE, subdistrictE, districtE, provinceE, postcodeE } = req.body;

  const image = req.file ? req.file.filename : req.body.oldImage;
  const sql1 = "UPDATE `employee` SET `code`= ?, `serialNumber`= ?, `mobile`= ?, `InternalTelephone`= ?, `nameTH`= ?, `nameEN`= ?, `departmentID`= ?, `positionID`= ?, `workLevelID`= ?, `employmentType`= ?, `startDate`= ?, `endDate`= ?, `reasonForLeaving`= ?, `userID` = ?,`updatedAt`=?,`image` = ? WHERE id = ?";
  const sql2 = "UPDATE `employeeInfo` SET `address`= ?, `subdistrict`= ?, `district`= ?, `province`= ?, `postcode`= ?, `dateOfBirth`= ?, `nameTitle`= ?, `gender`= ?, `bloodGroup`= ?, `maritalStatus`= ?, `religion`= ?, `nationality`= ?, `ethnicity`= ?, `taxID`= ?, `bank`= ?, `bankNumber`= ?,`updatedAt`=? WHERE emID = ?";
  const sql3 = "SELECT * FROM `employeeInfo` WHERE emID = ?";
  const sqlAdd = "INSERT INTO `employeeInfo`(`id`, `address`, `subdistrict`, `district`, `province`, `postcode`, `dateOfBirth`, `nameTitle`, `gender`, `bloodGroup`, `maritalStatus`, `religion`, `nationality`, `ethnicity`, `taxID`, `bank`, `bankNumber`, `emID`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  const today = new Date();
  const timestamp = moment(today).format();
  try {
    db.query(sql1, [employeeCodeE, serialNumberE, mobileE, internalTelephoneE, nameTHE, nameENE, departmentIDE,
      positionIDE, workLevelIDE, employmentTypeE, startDateE, endDateE, ReasonForLeavingE, userLoginE, timestamp, image, req.params.id], (err, result1) => {
        if (err) throw err;

        db.query(sql3, [req.params.id], (err, result3) => {
          if (err) throw err;

          if (result3.length > 0) {
            db.query(sql2, [addressE, subdistrictE, districtE, provinceE, postcodeE, dateOfBirthE, nameTitleE, genderE, bloodGroupE,
              maritalStatusE, religionE, nationalityE, ethnicityE, taxIDE, bankE, bankNumberE, timestamp, req.params.id], (err, result2) => {
                if (err) throw err;

                res.redirect('/tableTest/Sub/' + paramID);
              })
          } else {

            const uuid = uuidv4();
            db.query(sqlAdd, [uuid, addressE, subdistrictE, districtE, provinceE, postcodeE, dateOfBirthE, nameTitleE, genderE, bloodGroupE,
              maritalStatusE, religionE, nationalityE, ethnicityE, taxIDE, bankE, bankNumberE, req.params.id], (err, resultsAdd) => {
                if (err) throw err;

                res.redirect('/tableTest/Sub/' + paramID);
              })
          }
        })

      })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

router.get('/Del/:id', (req, res) => {
  const sqlDel = "DELETE FROM employeeEducation WHERE id = ?";
  const sql = "SELECT * FROM employeeEducation WHERE id = ?";
  try {
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;


      db.query(sqlDel, [req.params.id], (err, resultDel) => {
        if (err) throw err;

        res.redirect('/tableTest/Sub/' + result[0]['emID']);


      })
    });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

router.get('/View/:id', (req, res) => {
  const sql = "SELECT * FROM employeeEducation WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.render('sbAdmin/tablesView', {
      title: 'Education View',
      employeeEducation: result[0],
      user: req.session.user
    });
  });
})

router.get('/SubAdd/:id', (req, res) => {

  res.render('sbAdmin/tablesSubAdd', {
    title: 'Education Create',
    employeeID: [req.params.id],
    user: req.session.user
  });
});

router.post('/SubAdd/:id', (req, res) => {
  const { educationLevel, university, registrationDate, graduationDate, studyPeriod, major, addressUniversity, yearGraduation } = req.body;
  const uuid = uuidv4();
  const paramID = req.params.id;
  const sqlAdd = "INSERT INTO `employeeEducation`(`id`, `empID`, `educationLevel`, `university`, `registrationDate`, `graduationDate`, `studyPeriod`, `major`, `addressUniversity`, `yearGraduation`)  VALUES (?,?,?,?,?,?,?,?,?,?)";
  try {
    db.query(sqlAdd, [uuid, req.params.id, educationLevel, university, registrationDate, graduationDate, studyPeriod, major, addressUniversity, yearGraduation], (err, result) => {
      if (err) throw err;

      res.redirect('/tableTest/Sub/' + paramID);

    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

router.get('/SubEdit/:id', (req, res) => {
  const sql = "SELECT * FROM employeeEducation WHERE id = ?";
  try {
    db.query(sql, [req.params.id], (err, results) => {
      if (err) throw err;

      const coverDate = {
        registrationDate: null,
        graduationDate: null
      }
      if (results[0]['gradregistrationDateuationDate']) {
        if (results[0]['gradregistrationDateuationDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
          coverDate.registrationDate = moment(results[0]['graduationDate']).format('YYYY-MM-DD');
        }
      }
      if (results[0]['graduationDate']) {
        if (results[0]['graduationDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
          coverDate.graduationDate = moment(results[0]['graduationDate']).format('YYYY-MM-DD');
        }
      }
      res.render('sbAdmin/tablesSubEdit', {
        title: 'Education Edit',
        employeeEducation: results[0],
        coverDate: coverDate,
        user: req.session.user
      });
    });
  } catch (err) {
    console.error('Error show data:', err);
    res.status(500).json({ error: 'Error Show data into the database.' });
  }
})

router.post('/SubEdit/:id', (req, res) => {
  const { educationLevelE, universityE, registrationDateE, graduationDateE, studyPeriodE, majorE, addressUniversityE, yearGraduationE } = req.body;
  const paramID = req.params.id;
  const sqlEdit = "UPDATE `employeeEducation` SET `educationLevel`=?,`university`=?,`registrationDate`=?,`graduationDate`=?,`studyPeriod`=?,`major`=?,`addressUniversity`=?,`yearGraduation`=?,`updatedAt`=? WHERE `id`=?";
  const today = new Date();
  const timestamp = moment(today).format();
  const sql = "SELECT * FROM employeeEducation WHERE id = ?";
  try {
    db.query(sqlEdit, [educationLevelE, universityE, registrationDateE, graduationDateE, studyPeriodE, majorE, addressUniversityE, yearGraduationE, timestamp, paramID], (err, resultEdit) => {
      if (err) throw err;

      db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;

        res.redirect('/tableTest/Sub/' + result[0]['empID']);

      })
    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

router.get('/SubDel/:id', (req, res) => {
  const sqlDel = "DELETE FROM employeeEducation WHERE id = ?";
  const sql = "SELECT * FROM employeeEducation WHERE id = ?";
  try {
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;

      db.query(sqlDel, [req.params.id], (err, resultDel) => {
        if (err) throw err;

        res.redirect('/tableTest/Sub/' + result[0]['empID']);

      })
    });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

router.get('/SubView/:id', (req, res) => {
  const sql = "SELECT * FROM employeeEducation WHERE id = ?";
  try {
    db.query(sql, [req.params.id], (err, results) => {

      const coverDate = {
        registrationDate: null,
        graduationDate: null
      }
      if (results[0]['gradregistrationDateuationDate']) {
        if (results[0]['gradregistrationDateuationDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
          coverDate.registrationDate = moment(results[0]['graduationDate']).format('YYYY-MM-DD');
        }
      }
      if (results[0]['graduationDate']) {
        if (results[0]['graduationDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
          coverDate.graduationDate = moment(results[0]['graduationDate']).format('YYYY-MM-DD');
        }
      }
      if (err) throw err;
      res.render('sbAdmin/tablesSubView', {
        title: 'Education View',
        employeeEducation: results[0],
        coverDate: coverDate,
        user: req.session.user
      });
    });
  } catch (err) {
    console.error('Error show data:', err);
    res.status(500).json({ error: 'Error Show data into the database.' });
  }
})

router.get('/SubZAdd/:id', (req, res) => {

  res.render('sbAdmin/tablesSubZAdd', {
    title: 'Card Create',
    employeeID: [req.params.id],
    user: req.session.user
  });
});

const isAuthen_assCard = [isAuthenticated, upload.single('card')];

router.post('/SubZAdd/:id', upload.single('card'), (req, res) => {
  const uuid = uuidv4();
  const paramID = req.params.id;
  const image = req.file ? req.file.filename : null;
  const sqlAdd = "INSERT INTO `employeeCard`(`id`, `emID`, `Card`)  VALUES (?,?,?)";
  try {
    db.query(sqlAdd, [uuid, req.params.id, image], (err, result) => {
      if (err) throw err;

      res.redirect('/tableTest/Sub/' + paramID);

    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

router.get('/SubZEdit/:id', (req, res) => {
  const sql = "SELECT `id`, `emID`, `Card`, `createdAt` FROM `employeeCard` WHERE id = ?";
  try {
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;

      const coverDate = {
        createdAt: moment(result[0]['createdAt']).format('YYYY-MM-DD')
      }
      res.render('sbAdmin/tablesSubZEdit', {
        title: 'Card Edit',
        employeeCard: result[0],
        coverDate: coverDate,
        user: req.session.user
      });
    });
  } catch (err) {
    console.error('Error show data:', err);
    res.status(500).json({ error: 'Error Show data into the database.' });
  }
})

const isAuthen_assCardE = [isAuthenticated, upload.single('cardE')];

router.post('/SubZEdit/:id', upload.single('cardE'), (req, res) => {
  const paramID = req.params.id;
  const sqlEdit = "UPDATE `employeeCard` SET `Card`=? WHERE `id`=?";
  const today = new Date();
  const timestamp = moment(today).format();
  const image = req.file ? req.file.filename : req.body.oldImage;
  const sql = "SELECT * FROM employeeCard WHERE id = ?";
  try {
    db.query(sqlEdit, [image, paramID], (err, resultEdit) => {
      if (err) throw err;

      db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;

        res.redirect('/tableTest/Sub/' + result[0]['emID']);

      })
    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

router.get('/SubZView/:id', (req, res) => {
  const sql = "SELECT * FROM employeeCard WHERE id = ?";
  try {
    db.query(sql, [req.params.id], (err, result) => {

      const coverDate = {
        createdAt: moment(result[0]['createdAt']).format('YYYY-MM-DD')
      }
      if (err) throw err;
      res.render('sbAdmin/tablesSubZView', {
        title: 'Card View',
        employeeCard: result[0],
        coverDate: coverDate,
        user: req.session.user
      });
    });
  } catch (err) {
    console.error('Error show data:', err);
    res.status(500).json({ error: 'Error Show data into the database.' });
  }
})

module.exports = router;