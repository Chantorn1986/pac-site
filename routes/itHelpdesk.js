const express = require('express');
const router = express.Router();
//const mysql = require('mysql2');
const path = require('path');
const { v4: uuidv4 } = require("uuid");
router.use(express.urlencoded({ extended: true }));
const db = require("../db/db.js");
const moment = require('moment');
const multer = require('multer');
const { isAuthenticated } = require('../middlewares/authCheck')

router.get('/user', isAuthenticated, (req, res) => {
  try {
    const sql = "SELECT `itHelpdeskDoc`.`id`, `no`, `document`,DATE_FORMAT(`datetime`, '%d/%m/%Y %H:%i:%s') as `datetimeS` , `datetime`, `reporter`, `problem`, `location`, `equipment`, `emIT`, `solve`, `datetimeSolve`, `datetimeFinish`, `status`,DATE_FORMAT(`datetimeSolve`, '%d/%m/%Y %H:%i:%s') as datetimeSolveS,DATE_FORMAT(`datetimeFinish`, '%d/%m/%Y %H:%i:%s') as datetimeFinishS,`InternalTelephone` FROM `itHelpdeskDoc` LEFT JOIN `employee` ON `employee`.`nameTH` = `itHelpdeskDoc`.`reporter` WHERE `itHelpdeskDoc`.`status` = 'รอ' ORDER BY `document` DESC";
    db.query(sql, (err, results) => {
      if (err) throw err;

      res.render('itHelpdesk/itHelpdeskUser', {
        title: 'Problem Management',
        results: results,
        user: req.session.user
      });
    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
});

router.get('/user/Add', isAuthenticated, (req, res) => {
  const sqlLBLmaxNo = "SELECT IFNULL(MAX( `no`),0)+1 as maxNo FROM `itHelpdeskDoc`";
  const now = new Date();
  const dateString = moment(now).format('YYYY-MM-DD');
  const timestamp = moment(now).format();
  const sqlName = "SELECT `nameTH` FROM `employee` ORDER BY `nameTH` ASC";
  try {
    db.query(sqlLBLmaxNo, (err, resultsMaxNo) => {
      if (err) throw err;
      db.query(sqlName, (err, resultsName) => {
        if (err) throw err;
        res.render('itHelpdesk/itHelpdeskUserAdd', {
          title: 'Problem Create',
          maxNo: resultsMaxNo[0],
          resultsName: resultsName,
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

router.post('/user/Add', isAuthenticated, (req, res) => {
  const { itHelpdeskDocument, itHelpdeskReporter, itHelpdeskProblem, itHelpdeskLocation, tagValueA } = req.body;
  const sqlLBLmaxNo = "SELECT IFNULL(MAX( `no`),0)+1 as maxNo FROM `itHelpdeskDoc`";
  const uuid = uuidv4();
  const sqlAdd = "INSERT INTO `itHelpdeskDoc`(`id`, `no`, `document`, `reporter`, `problem`, `location`, `equipment`, `status`) VALUES (?,?,?,?,?,?,?,?)";
  const sql = "SELECT `itHelpdeskDoc`.`id`, `no`, `document`,DATE_FORMAT(`datetime`, '%d/%m/%Y %H:%i:%s') as `datetimeS` , `datetime`, `reporter`, `problem`, `location`, `equipment`, `emIT`, `solve`, `datetimeSolve`, `datetimeFinish`, `status`,DATE_FORMAT(`datetimeSolve`, '%d/%m/%Y %H:%i:%s') as datetimeSolveS,DATE_FORMAT(`datetimeFinish`, '%d/%m/%Y %H:%i:%s') as datetimeFinishS,`InternalTelephone` FROM `itHelpdeskDoc` LEFT JOIN `employee` ON `employee`.`nameTH` = `itHelpdeskDoc`.`reporter` WHERE `itHelpdeskDoc`.`status` = 'รอ' ORDER BY `document` DESC";

  try {
    db.query(sqlLBLmaxNo, (err, docMaxNo) => {
      if (err) throw err;
      const docNo = docMaxNo[0]['maxNo'];
      const statusDoc = "รอ";
      db.query(sqlAdd, [uuid, docNo, itHelpdeskDocument, itHelpdeskReporter, itHelpdeskProblem, itHelpdeskLocation, tagValueA, statusDoc], (err, result) => {
        if (err) throw err;
        db.query(sql, (err, results) => {
          if (err) throw err;
          res.render('itHelpdesk/itHelpdeskUser', {
            title: 'Problem Management',
            results: results,
            user: req.session.user
          });
        })
      })
    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
});

router.get('/user/Edit/:id', isAuthenticated, (req, res) => {
  const sql = "SELECT `id`, `no`, `document`,DATE_FORMAT(`datetime`, '%d/%m/%Y %H:%i:%s') as `datetimeS` , `datetime`, `reporter`, `problem`, `location`, `equipment`, `emIT`, `solve`, `datetimeSolve`, `datetimeFinish`, `status`,DATE_FORMAT(`datetimeSolve`, '%d/%m/%Y %H:%i:%s') as datetimeSolveS,DATE_FORMAT(`datetimeFinish`, '%d/%m/%Y %H:%i:%s') as datetimeFinishS FROM `itHelpdeskDoc` WHERE `id` = ?";
  const sqlName = "SELECT `nameTH` FROM `employee` ORDER BY `nameTH` ASC";
  try {
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      db.query(sqlName, (err, resultsName) => {
        if (err) throw err;

        let tagArray = null;
        if (result[0]['equipment']) {
          tagArray = result[0]['equipment'].split(";");
        }
        res.render('itHelpdesk/itHelpdeskUserEdit', {
          title: 'Problem Edit',
          resultsName: resultsName,
          results: result[0],
          tagArray: tagArray,
          user: req.session.user
        });
      })
    });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

router.post('/user/Edit/:id', isAuthenticated, (req, res) => {
  const { itHelpdeskReporterE, itHelpdeskProblemE, itHelpdeskLocationE, tagValueE } = req.body;
  const sqlEdit = "UPDATE `itHelpdeskDoc` SET `reporter`=?, `problem`=?, `location`=?, `equipment`=? WHERE id = ?";
  const sql = "SELECT `itHelpdeskDoc`.`id`, `no`, `document`,DATE_FORMAT(`datetime`, '%d/%m/%Y %H:%i:%s') as `datetimeS` , `datetime`, `reporter`, `problem`, `location`, `equipment`, `emIT`, `solve`, `datetimeSolve`, `datetimeFinish`, `status`,DATE_FORMAT(`datetimeSolve`, '%d/%m/%Y %H:%i:%s') as datetimeSolveS,DATE_FORMAT(`datetimeFinish`, '%d/%m/%Y %H:%i:%s') as datetimeFinishS,`InternalTelephone` FROM `itHelpdeskDoc` LEFT JOIN `employee` ON `employee`.`nameTH` = `itHelpdeskDoc`.`reporter` WHERE `itHelpdeskDoc`.`status` = 'รอ' ORDER BY `document` DESC";
  try {
    db.query(sqlEdit, [itHelpdeskReporterE, itHelpdeskProblemE, itHelpdeskLocationE, tagValueE, req.params.id], (err, result) => {
      if (err) throw err;
      db.query(sql, (err, results) => {
        if (err) throw err;

        res.render('itHelpdesk/itHelpdeskUser', {
          title: 'Problem Management',
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

router.get('/user/Del/:id', isAuthenticated, (req, res) => {
  const sqlDel = "DELETE FROM `itHelpdeskDoc` WHERE id = ?";
  const sql = "SELECT `itHelpdeskDoc`.`id`, `no`, `document`,DATE_FORMAT(`datetime`, '%d/%m/%Y %H:%i:%s') as `datetimeS` , `datetime`, `reporter`, `problem`, `location`, `equipment`, `emIT`, `solve`, `datetimeSolve`, `datetimeFinish`, `status`,DATE_FORMAT(`datetimeSolve`, '%d/%m/%Y %H:%i:%s') as datetimeSolveS,DATE_FORMAT(`datetimeFinish`, '%d/%m/%Y %H:%i:%s') as datetimeFinishS,`InternalTelephone` FROM `itHelpdeskDoc` LEFT JOIN `employee` ON `employee`.`nameTH` = `itHelpdeskDoc`.`reporter` WHERE `itHelpdeskDoc`.`status` = 'รอ' ORDER BY `document` DESC";
  try {
    db.query(sqlDel, [req.params.id], (err, result) => {
      if (err) throw err;

      db.query(sql, (err, results) => {
        if (err) throw err;

        res.render('itHelpdesk/itHelpdeskUser', {
          title: 'Problem Management',
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

router.get('/user/View/:id', isAuthenticated, (req, res) => {
  const sql = "SELECT `itHelpdeskDoc`.`id`, `no`, `document`,DATE_FORMAT(`datetime`, '%d/%m/%Y %H:%i:%s') as `datetimeS` , `datetime`, `reporter`, `problem`, `location`, `equipment`, `emIT`, `solve`, `datetimeSolve`, `datetimeFinish`, `status`,DATE_FORMAT(`datetimeSolve`, '%d/%m/%Y %H:%i:%s') as datetimeSolveS,DATE_FORMAT(`datetimeFinish`, '%d/%m/%Y %H:%i:%s') as datetimeFinishS,`InternalTelephone` FROM `itHelpdeskDoc` LEFT JOIN `employee` ON `employee`.`nameTH` = `itHelpdeskDoc`.`reporter` WHERE `itHelpdeskDoc`.`id` = ?";
  try {
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      let tagArray = null;
      if (result[0]['equipment']) {
        tagArray = result[0]['equipment'].split(";");
      }
      res.render('itHelpdesk/itHelpdeskUserView', {
        title: 'Problem View',
        results: result[0],
        tagArray: tagArray,
        user: req.session.user
      });
    });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

router.get('/admin', isAuthenticated, (req, res) => {
  try {
    const sql = "SELECT `itHelpdeskDoc`.`id`, `no`, `document`,DATE_FORMAT(`datetime`, '%d/%m/%Y %H:%i:%s') as `datetimeS` , `datetime`, `reporter`, `problem`, `location`, `equipment`, `emIT`, `solve`, `datetimeSolve`, `datetimeFinish`, `status`,DATE_FORMAT(`datetimeSolve`, '%d/%m/%Y %H:%i:%s') as datetimeSolveS,DATE_FORMAT(`datetimeFinish`, '%d/%m/%Y %H:%i:%s') as datetimeFinishS,`InternalTelephone` FROM `itHelpdeskDoc` LEFT JOIN `employee` ON `employee`.`nameTH` = `itHelpdeskDoc`.`reporter` WHERE `itHelpdeskDoc`.`status` != 'สำเร็จ' ORDER BY `document` DESC";
    db.query(sql, (err, results) => {
      if (err) throw err;

      res.render('itHelpdesk/itHelpdeskAdmin', {
        title: 'IT Helpdesk Management',
        results: results,
        user: req.session.user
      });
    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
});

router.get('/admin/Add', isAuthenticated, (req, res) => {
  const sqlLBLmaxNo = "SELECT IFNULL(MAX( `no`),0)+1 as maxNo FROM `itHelpdeskDoc`";
  const now = new Date();
  const dateString = moment(now).format('YYYY-MM-DD');
  const timestamp = moment(now).format('YYYY-MM-DDTHH:mm');
  const sqlName = "SELECT `nameTH` FROM `employee` ORDER BY `nameTH` ASC";
  try {
    db.query(sqlLBLmaxNo, (err, resultsMaxNo) => {
      if (err) throw err;
      db.query(sqlName, (err, resultsName) => {
        if (err) throw err;

        res.render('itHelpdesk/itHelpdeskAdminAdd', {
          title: 'IT Helpdesk Create',
          maxNo: resultsMaxNo[0],
          resultsName: resultsName,
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

router.post('/admin/Add', isAuthenticated, (req, res) => {
  const { itHelpdeskDocumentA, itHelpdeskDatetimeA, itHelpdeskReporterA, itHelpdeskLocationA, itHelpdeskProblemA, itHelpdeskSolveA, itHelpdeskEmITA, itHelpdeskITDatetimeA, itHelpdeskStatusA, tagValueA } = req.body;
  const sqlLBLmaxNo = "SELECT IFNULL(MAX( `no`),0)+1 as maxNo FROM `itHelpdeskDoc`";
  const uuid = uuidv4();
  const now = new Date();
  const dateString = moment(now).format('YYYY-MM-DD');
  const timestamp = moment(now).format();
  const sqlAdd = "INSERT INTO `itHelpdeskDoc`(`id`, `no`, `document`, `reporter`, `problem`, `location`, `equipment`, `status`, `solve`, `datetimeSolve`, `emIT`,`datetimeFinish`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
  const sql = "SELECT `itHelpdeskDoc`.`id`, `no`, `document`,DATE_FORMAT(`datetime`, '%d/%m/%Y %H:%i:%s') as `datetimeS` , `datetime`, `reporter`, `problem`, `location`, `equipment`, `emIT`, `solve`, `datetimeSolve`, `datetimeFinish`, `status`,DATE_FORMAT(`datetimeSolve`, '%d/%m/%Y %H:%i:%s') as datetimeSolveS,DATE_FORMAT(`datetimeFinish`, '%d/%m/%Y %H:%i:%s') as datetimeFinishS,`InternalTelephone` FROM `itHelpdeskDoc` LEFT JOIN `employee` ON `employee`.`nameTH` = `itHelpdeskDoc`.`reporter` ORDER BY `document` DESC";

  try {
    db.query(sqlLBLmaxNo, (err, docMaxNo) => {
      if (err) throw err;
      const docNo = docMaxNo[0]['maxNo'];
      let DTFinish = null;
      if (itHelpdeskStatusA === "สำเร็จ") {
        DTFinish = timestamp;
      }

      db.query(sqlAdd, [uuid, docNo, itHelpdeskDocumentA, itHelpdeskReporterA, itHelpdeskProblemA, itHelpdeskLocationA, tagValueA, itHelpdeskStatusA, itHelpdeskSolveA, timestamp, itHelpdeskEmITA, DTFinish], (err, result) => {
        if (err) throw err;
        db.query(sql, (err, results) => {
          if (err) throw err;
          res.render('itHelpdesk/itHelpdeskAdmin', {
            title: 'IT Helpdesk',
            results: results,
            user: req.session.user
          });
        })
      })
    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
});

router.get('/admin/Edit/:id', isAuthenticated, (req, res) => {
  const sql = "SELECT `id`, `no`, `document`,DATE_FORMAT(`datetime`, '%d/%m/%Y %H:%i:%s') as `datetimeS` , `datetime`, `reporter`, `problem`, `location`, `equipment`, `emIT`, `solve`, `datetimeSolve`, `datetimeFinish`, `status`,DATE_FORMAT(`datetimeSolve`, '%d/%m/%Y %H:%i:%s') as datetimeSolveS,DATE_FORMAT(`datetimeFinish`, '%d/%m/%Y %H:%i:%s') as datetimeFinishS FROM `itHelpdeskDoc` WHERE `id` = ?";
  const sqlName = "SELECT `nameTH` FROM `employee` ORDER BY `nameTH` ASC";
  const now = new Date();
  const dateString = moment(now).format('YYYY-MM-DD');
  const timestamp = moment(now).format();
  try {
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      db.query(sqlName, (err, resultsName) => {
        if (err) throw err;
        const coverDate = {
          datetime: null,
          datetimeSolve: null,
          datetimeFinish: null,
          timestamp: moment(timestamp).format('DD/MM/YYYY HH:mm:ss')
        }
        if (result[0]['datetime']) {
          if (result[0]['datetime'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
            coverDate.datetime = moment(result[0]['datetime']).format('DD/MM/YYYY HH:mm:ss');
          }
        }
        if (result[0]['datetimeSolve']) {
          if (result[0]['datetimeSolve'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
            coverDate.datetimeSolve = moment(result[0]['datetimeSolve']).format('DD/MM/YYYY HH:mm:ss');
          }
        }
        if (result[0]['datetimeFinish']) {
          if (result[0]['datetimeFinish'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
            coverDate.datetimeFinish = moment(result[0]['datetimeFinish']).format('DD/MM/YYYY HH:mm:ss');
          }
        }
        let tagArray = null;
        if (result[0]['equipment']) {
          tagArray = result[0]['equipment'].split(";");
        }
        res.render('itHelpdesk/itHelpdeskAdminEdit', {
          title: 'IT Helpdesk Edit',
          resultsName: resultsName,
          results: result[0],
          tagArray: tagArray,
          timestamp: timestamp,
          coverDate: coverDate,
          user: req.session.user
        });
      })
    });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

router.post('/admin/Edit/:id', isAuthenticated, (req, res) => {
  const { itHelpdeskDocumentAE, itHelpdeskDatetimeAE, itHelpdeskReporterAE, itHelpdeskLocationAE, itHelpdeskProblemAE, itHelpdeskSolveAE, itHelpdeskEmITAE, itHelpdeskITDatetimeAE, itHelpdeskStatusAE, tagValueE } = req.body;
  const sqlEdit = "UPDATE `itHelpdeskDoc` SET `reporter`=?, `problem`=?, `location`=?, `equipment`=?,`emIT`=?, `solve`=?, `datetimeSolve`=?, `datetimeFinish`=?, `status`=? WHERE id = ?";
  const sql = "SELECT `itHelpdeskDoc`.`id`, `no`, `document`,DATE_FORMAT(`datetime`, '%d/%m/%Y %H:%i:%s') as `datetimeS` , `datetime`, `reporter`, `problem`, `location`, `equipment`, `emIT`, `solve`, `datetimeSolve`, `datetimeFinish`, `status`,DATE_FORMAT(`datetimeSolve`, '%d/%m/%Y %H:%i:%s') as datetimeSolveS,DATE_FORMAT(`datetimeFinish`, '%d/%m/%Y %H:%i:%s') as datetimeFinishS,`InternalTelephone` FROM `itHelpdeskDoc` LEFT JOIN `employee` ON `employee`.`nameTH` = `itHelpdeskDoc`.`reporter` WHERE `itHelpdeskDoc`.`status` != 'สำเร็จ' ORDER BY `document` DESC";
  const now = new Date();
  const dateString = moment(now).format('YYYY-MM-DD');
  const timestamp = moment(now).format();
  try {
    let DTFinish = null;
    if (itHelpdeskStatusAE === "สำเร็จ") {
      DTFinish = timestamp;
    }
    db.query(sqlEdit, [itHelpdeskReporterAE, itHelpdeskProblemAE, itHelpdeskLocationAE, tagValueE, itHelpdeskEmITAE, itHelpdeskSolveAE, timestamp, DTFinish, itHelpdeskStatusAE, req.params.id], (err, result) => {
      if (err) throw err;
      db.query(sql, (err, results) => {
        if (err) throw err;

        res.render('itHelpdesk/itHelpdeskAdmin', {
          title: 'IT Helpdesk Management',
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

router.get('/admin/Del/:id', isAuthenticated, (req, res) => {
  const sqlDel = "DELETE FROM `itHelpdeskDoc` WHERE id = ?";
  const sql = "SELECT `itHelpdeskDoc`.`id`, `no`, `document`,DATE_FORMAT(`datetime`, '%d/%m/%Y %H:%i:%s') as `datetimeS` , `datetime`, `reporter`, `problem`, `location`, `equipment`, `emIT`, `solve`, `datetimeSolve`, `datetimeFinish`, `status`,DATE_FORMAT(`datetimeSolve`, '%d/%m/%Y %H:%i:%s') as datetimeSolve,DATE_FORMAT(`datetimeFinish`, '%d/%m/%Y %H:%i:%s') as datetimeFinishS,`InternalTelephone` FROM `itHelpdeskDoc` LEFT JOIN `employee` ON `employee`.`nameTH` = `itHelpdeskDoc`.`reporter` ORDER BY `document` DESC";
  try {
    db.query(sqlDel, [req.params.id], (err, result) => {
      if (err) throw err;

      db.query(sql, (err, results) => {
        if (err) throw err;

        res.render('itHelpdesk/itHelpdeskAdmin', {
          title: 'Problem Management',
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

router.get('/admin/View/:id', isAuthenticated, (req, res) => {
  const sql = "SELECT `itHelpdeskDoc`.`id`, `no`, `document`,DATE_FORMAT(`datetime`, '%d/%m/%Y %H:%i:%s') as `datetimeS` , `datetime`, `reporter`, `problem`, `location`, `equipment`, `emIT`, `solve`, `datetimeSolve`, `datetimeFinish`, `status`,DATE_FORMAT(`datetimeSolve`, '%d/%m/%Y %H:%i:%s') as datetimeSolveS,DATE_FORMAT(`datetimeFinish`, '%d/%m/%Y %H:%i:%s') as datetimeFinishS,`InternalTelephone` FROM `itHelpdeskDoc` LEFT JOIN `employee` ON `employee`.`nameTH` = `itHelpdeskDoc`.`reporter` WHERE `itHelpdeskDoc`.`id` = ?";
  try {
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      let tagArray = null;
      if (result[0]['equipment']) {
        tagArray = result[0]['equipment'].split(";");
      }
      res.render('itHelpdesk/itHelpdeskAdminView', {
        title: 'Problem View',
        results: result[0],
        tagArray: tagArray,
        user: req.session.user
      });
    });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

router.get('/report', isAuthenticated, (req, res) => {
  try {
    const sql = "SELECT `itHelpdeskDoc`.`id`, `no`, `document`,DATE_FORMAT(`datetime`, '%d/%m/%Y %H:%i:%s') as `datetimeS` , `datetime`, `reporter`, `problem`, `location`, `equipment`, `emIT`, `solve`, `datetimeSolve`, `datetimeFinish`, `status`,DATE_FORMAT(`datetimeSolve`, '%d/%m/%Y %H:%i:%s') as datetimeSolve,DATE_FORMAT(`datetimeFinish`, '%d/%m/%Y %H:%i:%s') as datetimeFinishS,`InternalTelephone` FROM `itHelpdeskDoc` LEFT JOIN `employee` ON `employee`.`nameTH` = `itHelpdeskDoc`.`reporter` WHERE `itHelpdeskDoc`.`status` != 'รอ' ORDER BY `document` DESC";
    db.query(sql, (err, results) => {
      if (err) throw err;

      res.render('itHelpdesk/itHelpdeskReport', {
        title: 'Problem Report',
        results: results,
        user: req.session.user
      });
    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
});

router.get('/report/View/:id', isAuthenticated, (req, res) => {
  const sql = "SELECT `itHelpdeskDoc`.`id`, `no`, `document`,DATE_FORMAT(`datetime`, '%d/%m/%Y %H:%i:%s') as `datetimeS` , `datetime`, `reporter`, `problem`, `location`, `equipment`, `emIT`, `solve`, `datetimeSolve`, `datetimeFinish`, `status`,DATE_FORMAT(`datetimeSolve`, '%d/%m/%Y %H:%i:%s') as datetimeSolveS,DATE_FORMAT(`datetimeFinish`, '%d/%m/%Y %H:%i:%s') as datetimeFinishS,`InternalTelephone` FROM `itHelpdeskDoc` LEFT JOIN `employee` ON `employee`.`nameTH` = `itHelpdeskDoc`.`reporter` WHERE `itHelpdeskDoc`.`id` = ?";
  try {
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      let tagArray = null;
      if (result[0]['equipment']) {
        tagArray = result[0]['equipment'].split(";");
      }
      const coverDate = {
        datetime: null,
        datetimeSolve: null,
        datetimeFinish: null
      }
      if (result[0]['datetime']) {
        if (result[0]['datetime'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
          coverDate.datetime = moment(result[0]['datetime']).format('DD/MM/YYYY HH:mm:ss');
        }
      }
      if (result[0]['datetimeSolve']) {
        if (result[0]['datetimeSolve'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
          coverDate.datetimeSolve = moment(result[0]['datetimeSolve']).format('DD/MM/YYYY HH:mm:ss');
        }
      }
      if (result[0]['datetimeFinish']) {
        if (result[0]['datetimeFinish'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
          coverDate.datetimeFinish = moment(result[0]['datetimeFinish']).format('DD/MM/YYYY HH:mm:ss');
        }
      }
      res.render('itHelpdesk/itHelpdeskReportView', {
        title: 'Problem View',
        results: result[0],
        tagArray: tagArray,
        coverDate: coverDate,
        user: req.session.user
      });
    });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

module.exports = router;