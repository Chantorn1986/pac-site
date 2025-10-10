const db = require("../db/db.js");
const { v4: uuidv4 } = require("uuid");
const moment = require('moment');
const dbCard = require('../models/employeeCard');
const dbVehicle = require('../models/employeeVehicle');
const dbInfo = require('../models/employeeInfo');
const dbEM = require('../models/employee');
const dbEMEdu = require('../models/employeeEducation');
const dbViewEmSub = require('../models/viewEmSub');
// const dbViewEmFull = require('../models/viewEmFull');
const dbDepartment = require('../models/departments');
const dbWorkLevel = require('../models/workLevel');
const dbPositions = require('../models/positions');
const dbUser = require('../models/user');

exports.list = async (req, res) => {
  try {
    const results = await dbViewEmSub.findAll({ where: { resignation: 0 } });
    res.render('hrm/employee', {
      title: 'Employee Management',
      employee: results,
      user: req.session.user
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List employee invalid.' })
  }
}

exports.getSub = async (req, res) => {
  try {
    const paramID = req.params.id;
    const employee = await dbEM.findAll({ where: { id: paramID } });
    const emInfo = await dbInfo.findAll({ where: { emID: paramID } });
    // const results = await dbViewEmFull.findAll({
    //   where: {
    //     [Op.and]: [
    //       { resignation: 0 },
    //       { id: paramID },
    //     ]
    //   }
    // });
    // const result = await dbEM.findAll({
    //   where: { id: paramID },
    //   include: {
    //     model: Address,
    //   },
    //   raw: true,
    // });
    // const results = await dbViewEmSub.findAll({ where: { id: paramID } });

    const emEducation = await dbEMEdu.findAll({ where: { empID: paramID } });
    const emCard = await dbCard.findAll({ where: { emID: paramID } });
    const emCar = await dbVehicle.findAll({ where: { emID: paramID } });
    const emDepartment = await dbDepartment.findAll({ where: { id: employee[0].departmentID } });
    const emWorkLevel = await dbWorkLevel.findAll({ where: { id: employee[0].workLevelID } });
    const emWPositions = await dbPositions.findAll({ where: { id: employee[0].positionID } });
    const emUser = await dbUser.findAll({ where: { id: employee[0].userID } });

    const coverDate = {
      startDate: null,
      endDate: null,
      dateOfBirth: null,
      registrationDate: null,
      graduationDate: null
    }

    if (results.startDate) {
      coverDate.startDate = moment(employee[0].startDate).format('YYYY-MM-DD');
    }
    if (results.endDate) {
      coverDate.endDate = moment(employee[0].endDate).format('YYYY-MM-DD');
    }
    if (results.dateOfBirth) {
      coverDate.dateOfBirth = moment(emInfo[0].dateOfBirth).format('YYYY-MM-DD');
    }
    if (results.registrationDate) {
      coverDate.registrationDate = moment(emEducation[0].registrationDate).format('YYYY-MM-DD');
    }
    if (results.graduationDate) {
      coverDate.graduationDate = moment(emEducation[0].graduationDate).format('YYYY-MM-DD');
    }
// console.log(emEducation)
    res.render('hrm/employeeSub', {
      title: 'Employee Management',
      emEducation: emEducation,
      emCard: emCard,
      emCar: emCar,
      employee:employee,
      emInfo:emInfo,
      coverDate: coverDate,
      emDepartment:emDepartment,
      emWorkLevel:emWorkLevel,
      emWPositions:emWPositions,
      emUser:emUser,
      user: req.session.user
    })

    // const sql1 = "SELECT * FROM `view_employeeFull` WHERE id = ? and `resignation`=0";
    // const sql2 = "SELECT * FROM `employeeEducation` WHERE empID = ? "
    // const sql3 = "SELECT `id`, `emID`, `Card`,DATE_FORMAT(`createdAt`, '%d/%m/%Y %H:%i:%s') as createdAt FROM `employeeCard` WHERE emID = ca9953c9-804c-4985-9ec2-41f61fa9bf42"
    // const sql4 = "SELECT * FROM `employeeVehicle` WHERE emID = ca9953c9-804c-4985-9ec2-41f61fa9bf42"
    // db.query(sql1, [req.params.id], (err, results) => {
    //   if (err) throw err;
    //   db.query(sql2, [req.params.id], (err, emEducation) => {
    //     if (err) throw err;
    //     db.query(sql3, [req.params.id], (err, emCard) => {
    //       if (err) throw err;
    //       db.query(sql4, [req.params.id], (err, emCar) => {
    //         if (err) throw err;
    //         const coverDate = {
    //           startDate: null,
    //           endDate: null,
    //           dateOfBirth: null,
    //           registrationDate: null,
    //           graduationDate: null
    //         }
    //         if (results[0]['startDate']) {
    //           if (results[0]['startDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
    //             coverDate.startDate = moment(results[0]['startDate']).format('YYYY-MM-DD');
    //           }
    //         }
    //         if (results[0]['endDate']) {
    //           if (results[0]['endDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
    //             coverDate.endDate = moment(results[0]['endDate']).format('YYYY-MM-DD');
    //           }
    //         }
    //         if (results[0]['dateOfBirth']) {
    //           if (results[0]['dateOfBirth'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
    //             coverDate.dateOfBirth = moment(results[0]['dateOfBirth']).format('YYYY-MM-DD');
    //           }
    //         }
    //         if (results[0]['registrationDate']) {
    //           if (results[0]['registrationDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
    //             coverDate.registrationDate = moment(results[0]['registrationDate']).format('YYYY-MM-DD');
    //           }
    //         }
    //         if (results[0]['graduationDate']) {
    //           if (results[0]['graduationDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
    //             coverDate.graduationDate = moment(results[0]['graduationDate']).format('YYYY-MM-DD');
    //           }
    //         }
    //         res.render('hrm/employeeSub', {
    //           title: 'Employee Management',
    //           emEducation: emEducation,
    //           emCard: emCard,
    //           emCar: emCar,
    //           employeeFull: results[0],
    //           coverDate: coverDate,
    //           user: req.session.user
    //         })
    //       })
    //     })
    //   })
    // })
  } catch {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get sub employee invalid.' })
  }
}


exports.getCreate = async (req, res) => {
  try {
    const departments = await dbDepartment.findAll();
    const positions = await dbPositions.findAll();
    const workLevel = await dbWorkLevel.findAll();
    const users = await dbUser.findAll();
    res.render('hrm/employeeAdd', {
      title: 'Employee Create',
      departments: departments,
      positions: positions,
      workLevel: workLevel,
      users: users,
      dateDefault: moment(new Date()).format('YYYY-MM-DD'),
      user: req.session.user
    });

    // const sql1 = "SELECT * FROM departments ORDER BY no ASC";
    // const sql2 = "SELECT * FROM positions ORDER BY no ASC";
    // const sql3 = "SELECT * FROM workLevel ORDER BY no ASC";
    // const sql4 = "SELECT * FROM users ORDER BY name ASC";

    // const now = new Date();
    // const dateString = moment(new Date()).format('YYYY-MM-DD');
    // db.query(sql1, (err, departments) => {
    //   if (err) throw err;

    //   db.query(sql2, (err, positions) => {
    //     if (err) throw err;

    //     db.query(sql3, (err, workLevel) => {
    //       if (err) throw err;

    //       db.query(sql4, (err, users) => {
    //         if (err) throw err;

    //         res.render('hrm/employeeAdd', {
    //           title: 'Employee Create',
    //           departments: departments,
    //           positions: positions,
    //           workLevel: workLevel,
    //           users: users,
    //           dateDefault: moment(new Date()).format('YYYY-MM-DD'),
    //           user: req.session.user
    //         });
    //       })
    //     })
    //   })

    // })
  } catch {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create employee invalid.' })
  }
}

exports.postCreate = async (req, res) => {
  try {
    const { employeeCode, serialNumber, mobile, internalTelephone, nameTH, nameEN, nickname, departmentID,
      positionID, workLevelID, employmentType, startDate, endDate, ReasonForLeaving, userLogin,
      dateOfBirth, nameTitle, gender, bloodGroup, maritalStatus, religion, nationality, ethnicity, taxID,
      bank, bankNumber, address, subdistrict, district, province, postcode, resignation } = req.body;
    let resignationV = 0;
    if (resignation) {
      resignationV = 1;
    }
    const image = req.file ? req.file.filename : null;
    const uuid1 = uuidv4();
    const sqlAdd1 = "INSERT INTO `employee`(`id`, `code`, `serialNumber`, `mobile`, `InternalTelephone`, `nameTH`, `nameEN`,`nickname`, `departmentID`, `positionID`, `workLevelID`, `employmentType`, `startDate`, `endDate`, `reasonForLeaving`, `userID`,`image`,`resignation`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const uuid2 = uuidv4();
    const sqlAdd2 = "INSERT INTO `employeeInfo`(`id`, `address`, `subdistrict`, `district`, `province`, `postcode`, `dateOfBirth`, `nameTitle`, `gender`, `bloodGroup`, `maritalStatus`, `religion`, `nationality`, `ethnicity`, `taxID`, `bank`, `bankNumber`, `emID`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.query(sqlAdd1, [uuid1, employeeCode, serialNumber, mobile, internalTelephone, nameTH, nameEN, nickname, departmentID,
      positionID, workLevelID, employmentType, startDate, endDate, ReasonForLeaving, userLogin, image, resignationV], (err, result1) => {
        if (err) throw err;

        db.query(sqlAdd2, [uuid2, address, subdistrict, district, province, postcode, dateOfBirth, nameTitle, gender, bloodGroup,
          maritalStatus, religion, nationality, ethnicity, taxID, bank, bankNumber, uuid1], (err, results) => {
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
  } catch (err) {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create employee invalid.' })
  }
}

exports.getUpdate = async (req, res) => {
  try {
    const sql1 = "SELECT * FROM departments ORDER BY no ASC";
    const sql2 = "SELECT * FROM positions ORDER BY no ASC";
    const sql3 = "SELECT * FROM workLevel ORDER BY no ASC";
    const sql4 = "SELECT * FROM users ORDER BY name ASC";
    const sql = "SELECT * FROM `view_employeeFull` WHERE id = ?";
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
                  coverDate.startDate = moment(results[0]['startDate']).format('YYYY-MM-DD');
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
              res.render('hrm/employeeEdit', {
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
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update employee invalid.' })
  }
}

exports.putUpdate = async (req, res) => {
  try {
    const paramID = req.params.id;
    const { employeeCodeE, serialNumberE, mobileE, internalTelephoneE, nameTHE, nameENE, nicknameE, departmentIDE,
      positionIDE, workLevelIDE, employmentTypeE, startDateE, endDateE, ReasonForLeavingE, userLoginE,
      dateOfBirthE, nameTitleE, genderE, bloodGroupE, maritalStatusE, religionE, nationalityE, ethnicityE, taxIDE,
      bankE, bankNumberE, addressE, subdistrictE, districtE, provinceE, postcodeE, resignationE } = req.body;
    let resignationEV = 0;
    if (resignationE) {
      resignationEV = 1;
    }
    const image = req.file ? req.file.filename : req.body.oldImage;
    const sql1 = "UPDATE `employee` SET `code`= ?, `serialNumber`= ?, `mobile`= ?, `InternalTelephone`= ?, `nameTH`= ?, `nameEN`= ?,`nickname`=?, `departmentID`= ?, `positionID`= ?, `workLevelID`= ?, `employmentType`= ?, `startDate`= ?, `endDate`= ?, `reasonForLeaving`= ?, `userID` = ?,`updatedAt`=?,`image` = ?,`resignation`=? WHERE id = ?";
    const sql2 = "UPDATE `employeeInfo` SET `address`= ?, `subdistrict`= ?, `district`= ?, `province`= ?, `postcode`= ?, `dateOfBirth`= ?, `nameTitle`= ?, `gender`= ?, `bloodGroup`= ?, `maritalStatus`= ?, `religion`= ?, `nationality`= ?, `ethnicity`= ?, `taxID`= ?, `bank`= ?, `bankNumber`= ?,`updatedAt`=? WHERE emID = ?";
    const sql3 = "SELECT * FROM `employeeInfo` WHERE emID = ?";
    const sqlAdd = "INSERT INTO `employeeInfo`(`id`, `address`, `subdistrict`, `district`, `province`, `postcode`, `dateOfBirth`, `nameTitle`, `gender`, `bloodGroup`, `maritalStatus`, `religion`, `nationality`, `ethnicity`, `taxID`, `bank`, `bankNumber`, `emID`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const today = new Date();
    const timestamp = moment(today).format();
    db.query(sql1, [employeeCodeE, serialNumberE, mobileE, internalTelephoneE, nameTHE, nameENE, nicknameE, departmentIDE,
      positionIDE, workLevelIDE, employmentTypeE, startDateE, endDateE, ReasonForLeavingE, userLoginE, timestamp, image, resignationEV, req.params.id], (err, result1) => {
        if (err) throw err;
        db.query(sql3, [req.params.id], (err, result3) => {
          if (err) throw err;
          if (result3.length > 0) {
            db.query(sql2, [addressE, subdistrictE, districtE, provinceE, postcodeE, dateOfBirthE, nameTitleE, genderE, bloodGroupE,
              maritalStatusE, religionE, nationalityE, ethnicityE, taxIDE, bankE, bankNumberE, timestamp, req.params.id], (err, result2) => {
                if (err) throw err;
                res.redirect('/employee/Sub/' + paramID);
              })
          } else {
            const uuid = uuidv4();
            db.query(sqlAdd, [uuid, addressE, subdistrictE, districtE, provinceE, postcodeE, dateOfBirthE, nameTitleE, genderE, bloodGroupE,
              maritalStatusE, religionE, nationalityE, ethnicityE, taxIDE, bankE, bankNumberE, req.params.id], (err, resultsAdd) => {
                if (err) throw err;
                res.redirect('/employee/Sub/' + paramID);
              })
          }
        })
      })
  } catch (err) {
    console.error('Error put data :', err);
    res.status(500).json({ error: 'Put update employee invalid.' })
  }
}

exports.getRemove = async (req, res) => {
  try {
    const sqlDel = "DELETE FROM employeeEducation WHERE id = ?";
    const sql = "SELECT * FROM employeeEducation WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      db.query(sqlDel, [req.params.id], (err, resultDel) => {
        if (err) throw err;
        res.redirect('/employee/Sub/' + result[0]['emID']);
      })
    })
  } catch (err) {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove employee invalid.' })
  }
}

exports.getView = async (req, res) => {
  try {
    const sql = "SELECT * FROM employeeEducation WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.render('hrm/employeeView', {
        title: 'Employee Education View',
        employeeEducation: result[0],
        user: req.session.user
      })
    })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view employee invalid.' })
  }
}

exports.getSubCreate = async (req, res) => {
  try {
    res.render('hrm/employeeSubAdd', {
      title: 'Education Create',
      employeeID: [req.params.id],
      user: req.session.user
    })
  } catch {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create education invalid.' })
  }
}

exports.postSubCreate = async (req, res) => {
  try {
    const { educationLevel, university, registrationDate, graduationDate, studyPeriod, major, addressUniversity, yearGraduation } = req.body;
    const uuid = uuidv4();
    const paramID = req.params.id;
    const sqlAdd = "INSERT INTO `employeeEducation`(`id`, `empID`, `educationLevel`, `university`, `registrationDate`, `graduationDate`, `studyPeriod`, `major`, `addressUniversity`, `yearGraduation`)  VALUES (?,?,?,?,?,?,?,?,?,?)";
    db.query(sqlAdd, [uuid, req.params.id, educationLevel, university, registrationDate, graduationDate, studyPeriod, major, addressUniversity, yearGraduation], (err, result) => {
      if (err) throw err;
      res.redirect('/employee/Sub/' + paramID);
    })
  } catch (err) {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create education invalid.' })
  }
}

exports.getSubUpdate = async (req, res) => {
  try {
    const sql = "SELECT * FROM employeeEducation WHERE id = ?";
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
      res.render('hrm/employeeSubEdit', {
        title: 'Education Edit',
        employeeEducation: results[0],
        coverDate: coverDate,
        user: req.session.user
      })
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update education invalid.' })
  }
}

exports.putSubUpdate = async (req, res) => {
  try {
    const { educationLevelE, universityE, registrationDateE, graduationDateE, studyPeriodE, majorE, addressUniversityE, yearGraduationE } = req.body;
    const paramID = req.params.id;
    const sqlEdit = "UPDATE `employeeEducation` SET `educationLevel`=?,`university`=?,`registrationDate`=?,`graduationDate`=?,`studyPeriod`=?,`major`=?,`addressUniversity`=?,`yearGraduation`=?,`updatedAt`=? WHERE `id`=?";
    const today = new Date();
    const timestamp = moment(today).format();
    const sql = "SELECT * FROM employeeEducation WHERE id = ?";
    db.query(sqlEdit, [educationLevelE, universityE, registrationDateE, graduationDateE, studyPeriodE, majorE, addressUniversityE, yearGraduationE, timestamp, paramID], (err, resultEdit) => {
      if (err) throw err;

      db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;

        res.redirect('/employee/Sub/' + result[0]['empID']);

      })
    })
  } catch (err) {
    console.error('Error put data :', err);
    res.status(500).json({ error: 'Put update education invalid.' })
  }
}

exports.getSubRemove = async (req, res) => {
  try {
    const sqlDel = "DELETE FROM employeeEducation WHERE id = ?";
    const sql = "SELECT * FROM employeeEducation WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      db.query(sqlDel, [req.params.id], (err, resultDel) => {
        if (err) throw err;
        res.redirect('/employee/Sub/' + result[0]['empID']);
      })
    })
  } catch (err) {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove education invalid.' })
  }
}

exports.getSubView = async (req, res) => {
  try {
    const sql = "SELECT * FROM employeeEducation WHERE id = ?";
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
      res.render('hrm/employeeSubView', {
        title: 'Education View',
        employeeEducation: results[0],
        coverDate: coverDate,
        user: req.session.user
      })
    })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view education invalid.' })
  }
}

exports.getSubZCreate = async (req, res) => {
  try {
    res.render('hrm/employeeSubZAdd', {
      title: 'Card Create',
      employeeID: [req.params.id],
      user: req.session.user
    })
  } catch {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create card invalid.' })
  }
}

exports.postSubZCreate = async (req, res) => {
  try {
    const uuid = uuidv4();
    const paramID = req.params.id;
    const image = req.file ? req.file.filename : null;
    const sqlAdd = "INSERT INTO `employeeCard`(`id`, `emID`, `Card`)  VALUES (?,?,?)";
    db.query(sqlAdd, [uuid, req.params.id, image], (err, result) => {
      if (err) throw err;
      res.redirect('/employee/Sub/' + paramID);
    })
  } catch (err) {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create card invalid.' })
  }
}

exports.getSubZUpdate = async (req, res) => {
  try {
    const sql = "SELECT `id`, `emID`, `Card`, `createdAt` FROM `employeeCard` WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      const coverDate = {
        createdAt: moment(result[0]['createdAt']).format('YYYY-MM-DD')
      }
      res.render('hrm/employeeSubZEdit', {
        title: 'Card Edit',
        employeeCard: result[0],
        coverDate: coverDate,
        user: req.session.user
      })
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update card invalid.' })
  }
}

exports.putSubZUpdate = async (req, res) => {
  try {
    const paramID = req.params.id;
    const sqlEdit = "UPDATE `employeeCard` SET `Card`=? WHERE `id`=?";
    const today = new Date();
    const timestamp = moment(today).format();
    const image = req.file ? req.file.filename : req.body.oldImage;
    const sql = "SELECT * FROM employeeCard WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      db.query(sqlEdit, [image, paramID], (err, resultEdit) => {
        if (err) throw err;
        res.redirect('/employee/Sub/' + result[0]['emID']);
      })
    })
  } catch (err) {
    console.error('Error put data :', err);
    res.status(500).json({ error: 'Put update card invalid.' })
  }
}

exports.getSubZRemove = async (req, res) => {
  try {
    const sqlDel = "DELETE FROM employeeCard WHERE id = ?";
    const sql = "SELECT * FROM employeeCard WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      db.query(sqlDel, [req.params.id], (err, resultDel) => {
        if (err) throw err;
        res.redirect('/employee/Sub/' + result[0]['emID']);
      })
    })
  } catch (err) {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove card invalid.' })
  }
}

exports.getSubZView = async (req, res) => {
  try {
    const sql = "SELECT * FROM employeeCard WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      const coverDate = {
        createdAt: moment(result[0]['createdAt']).format('YYYY-MM-DD')
      }
      if (err) throw err;
      res.render('hrm/employeeSubZView', {
        title: 'Card View',
        employeeCard: result[0],
        coverDate: coverDate,
        user: req.session.user
      })
    })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view card invalid.' })
  }
}

exports.getSubZzCreate = async (req, res) => {
  try {
    res.render('hrm/employeeSubZzAdd', {
      title: 'Conveyance Create',
      employeeID: [req.params.id],
      user: req.session.user
    })
  } catch {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create conveyance invalid.' })
  }
}

exports.postSubZzCreate = async (req, res) => {
  try {
    const { vehicle, carBrand, carModel, carColor, carRegistration } = req.body;
    const uuid = uuidv4();
    const paramID = req.params.id;
    const sqlAdd = "INSERT INTO `employeeVehicle`(`id`, `emID`, `vehicle`, `brand`, `model`, `color`, `registration`)  VALUES (?,?,?,?,?,?,?);";
    db.query(sqlAdd, [uuid, req.params.id, vehicle, carBrand, carModel, carColor, carRegistration], (err, result) => {
      if (err) throw err;
      res.redirect('/employee/Sub/' + paramID);
    })
  } catch (err) {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create conveyance invalid.' })
  }
}

exports.getSubZzUpdate = async (req, res) => {
  try {
    const sql = "SELECT * FROM `employeeVehicle` WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.render('hrm/employeeSubZzEdit', {
        title: 'Card Edit',
        emCar: result[0],
        user: req.session.user
      })
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update conveyance invalid.' })
  }
}

exports.putSubZzUpdate = async (req, res) => {
  try {
    const { vehicleE, carBrandE, carModelE, carColorE, carRegistrationE } = req.body;
    const paramID = req.params.id;
    const sqlEdit = "UPDATE `employeeVehicle` SET `vehicle`=?,`brand`=?,`model`=?,`color`=?,`registration`=?,`updatedAt`=? WHERE `id`=?";
    const today = new Date();
    const timestamp = moment(today).format();
    const sql = "SELECT `id`, `emID`, `vehicle`, `brand`, `model`, `color`, `registration`, `createdAt`, `updatedAt` FROM `employeeVehicle` WHERE `id` = ?";
    db.query(sql, [paramID], (err, result) => {
      if (err) throw err;
      db.query(sqlEdit, [vehicleE, carBrandE, carModelE, carColorE, carRegistrationE, timestamp, paramID], (err, resultEdit) => {
        if (err) throw err;
        const emID = result[0]['emID'];
        res.redirect('/employee/Sub/' + emID);
      })
    })
  } catch (err) {
    console.error('Error put data :', err);
    res.status(500).json({ error: 'Put update conveyance invalid.' })
  }
}

exports.getSubZzRemove = async (req, res) => {
  try {
    const sqlDel = "DELETE FROM employeeVehicle WHERE id = ?";
    const sql = "SELECT * FROM employeeVehicle WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      db.query(sqlDel, [req.params.id], (err, resultDel) => {
        if (err) throw err;
        res.redirect('/employee/Sub/' + result[0]['emID']);
      })
    })
  } catch (err) {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove conveyance invalid.' })
  }
}

exports.getSubZzView = async (req, res) => {
  try {
    const sql = "SELECT * FROM employeeVehicle WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      const coverDate = {
        createdAt: null,
        updatedAt: null
      }
      if (result[0]['createdAt']) {
        if (result[0]['createdAt'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
          coverDate.createdAt = moment(result[0]['createdAt']).format('YYYY-MM-DD');
        }
      }
      if (result[0]['updatedAt']) {
        if (result[0]['updatedAt'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
          coverDate.updatedAt = moment(result[0]['updatedAt']).format('YYYY-MM-DD');
        }
      }
      if (err) throw err;
      res.render('hrm/employeeSubZzView', {
        title: 'Vehicle View',
        emCar: result[0],
        coverDate: coverDate,
        user: req.session.user
      })
    })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view conveyance invalid.' })
  }
}

exports.getRptContact = async (req, res) => {
  try {
    const sql = "SELECT * FROM `view_employeeSub` WHERE `resignation`=0";
    db.query(sql, (err, results) => {
      if (err) throw err;

      res.render('hrm/rptEmployeeContact', {
        title: 'Employee Contact Report',
        employee: results,
        user: req.session.user
      });
    })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view employee contact report invalid.' })
  }
}

exports.getRptInformation = async (req, res) => {
  try {
    const sql = "SELECT * FROM `view_employeeSub` WHERE `resignation`=0";
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.render('hrm/rptEmployeeInformation', {
        title: 'Employee Information Report',
        employee: results,
        user: req.session.user
      })
    })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view information invalid.' })
  }
}

exports.geRptEducation = async (req, res) => {
  try {
    const sql = "SELECT * FROM `view_employeeFull` WHERE `resignation`=0";
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.render('hrm/rptEmployeeEducation', {
        title: 'Employee Education Report',
        employee: results,
        user: req.session.user
      })
    })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view education invalid.' })
  }
}

exports.getRptWorkPeriod = async (req, res) => {
  try {
    const sql = "SELECT * FROM `view_employeeSub` WHERE `resignation`=0";
    db.query(sql, (err, results) => {
      if (err) throw err;

      res.render('hrm/rptEmployeeWorkPeriod', {
        title: 'Employee Work Period Report',
        employee: results,
        user: req.session.user
      });
    })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view work period invalid.' })
  }
}

exports.getRptCard = async (req, res) => {
  try {
    const sql = "SELECT * FROM `view_cardEmployee` WHERE `resignation`=0";
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.render('hrm/rptEmployeeCards', {
        title: 'Employee Cards Report',
        employee: results,
        user: req.session.user
      })
    })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view card invalid.' })
  }
}

exports.getRptVehicle = async (req, res) => {
  try {
    const sql = "SELECT * FROM `view_carEmployee` WHERE `resignation`=0";
    db.query(sql, (err, results) => {
      if (err) throw err;

      res.render('hrm/rptEmployeeVehicle', {
        title: 'Employee Vehicle Report',
        employee: results,
        user: req.session.user
      });
    })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view vehicle invalid.' })
  }
}

exports.getRptProfile = async (req, res) => {
  try {
    const sql1 = "SELECT * FROM `view_employeeFull` WHERE `userID` = ?";
    const sql2 = "SELECT * FROM `employeeEducation` WHERE empID = ?";
    const sql3 = "SELECT `id`, `emID`, `Card`,DATE_FORMAT(`createdAt`, '%d/%m/%Y %H:%i:%s') as createdAt FROM `employeeCard` WHERE emID = ?";
    const sql4 = "SELECT * FROM `employeeVehicle` WHERE emID = ?";
    const sql5 = "SELECT `typeNo`,`id`, `emID`, `leaveTypeID`, `quota`, `year`, `code`, `emNameTH`, `emNameEN`, `typeNameTH`, `typeNameEN`, `typeQuota` FROM `view_leaveQuotaTypeEm` WHERE emID = ? ORDER BY `typeNo` ASC";
    const sql6 = "SELECT `leaveAppID`, `emID`, `approveHead`, `approveHR`, `approveMD`, `createdAt`, `updatedAt`, `id`, `code`, `serialNumber`, `nameTH`, `nameEN`, `nickname`, `image`, `depNameTH`, `depNameEN` FROM `view_leaveApprove`  WHERE emID = ?";
    const sqlSub = "SELECT * FROM `view_employeeSub` WHERE `userID` = ?";
    const sessionUser = req.session.user;
    db.query(sql1, [sessionUser.id], (err, results) => {
      if (err) throw err;
      db.query(sql2, [results[0]['id']], (err, emEducation) => {
        if (err) throw err;
        db.query(sql3, [results[0]['id']], (err, emCard) => {
          if (err) throw err;
          db.query(sql4, [results[0]['id']], (err, emCar) => {
            if (err) throw err;
            db.query(sqlSub, [sessionUser.id], (err, emSub) => {
              if (err) throw err;
              db.query(sql5, [sessionUser.idEM], (err, emQuota) => {
                if (err) throw err;
                db.query(sql6, [sessionUser.idEM], (err, emApprove) => {
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
                      coverDate.startDate = moment(results[0]['startDate']).format('DD-MM-YYYY');
                    }
                  }
                  if (results[0]['endDate']) {
                    if (results[0]['endDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
                      coverDate.endDate = moment(results[0]['endDate']).format('DD-MM-YYYY');
                    }
                  }
                  if (results[0]['dateOfBirth']) {
                    if (results[0]['dateOfBirth'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
                      coverDate.dateOfBirth = moment(results[0]['dateOfBirth']).format('DD-MM-YYYY');
                    }
                  }
                  if (results[0]['registrationDate']) {
                    if (results[0]['registrationDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
                      coverDate.registrationDate = moment(results[0]['registrationDate']).format('DD-MM-YYYY');
                    }
                  }
                  if (results[0]['graduationDate']) {
                    if (results[0]['graduationDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
                      coverDate.graduationDate = moment(results[0]['graduationDate']).format('DD-MM-YYYY');
                    }
                  }
                  res.render('hrm/employeeProfile', {
                    title: 'Employee Detail',
                    emEducation: emEducation,
                    emCard: emCard,
                    emCar: emCar,
                    employeeFull: results[0],
                    coverDate: coverDate,
                    emSub: emSub[0],
                    emQuota: emQuota,
                    emApprove: emApprove[0],
                    user: req.session.user
                  });
                })
              })

            })
          })
        })
      })
    })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view Profile invalid.' })
  }
}