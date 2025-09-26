const db = require("../db/db.js");
const { v4: uuidv4 } = require("uuid");
const moment = require('moment');

exports.listLeaveType = async (req, res) => {
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
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List leave type invalid.' })
  }
}

exports.getCreateLeaveType = async (req, res) => {
  try {
    res.render('leave/leaveTypeAdd', {
      title: 'Leave Type Create',
      user: req.session.user
    })
  } catch {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create leave Type invalid.' })
  }
}

exports.postCreateLeaveType = async (req, res) => {
  try {
    const { leaveTypeNo, leaveTypeQuota, leaveTypeNameTH, leaveTypeNameEN } = req.body;
    const uuid = uuidv4();
    const sqlAdd = "INSERT INTO `leaveType` ( `id`, `no`, `nameTH`, `nameEN`, `quota` ) VALUES(?, ?, ?, ?, ?)";
    const sql = "SELECT * FROM `leaveType` ORDER BY `no` ASC";
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
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create leave type invalid.' })
  }
}

exports.getUpdateLeaveType = async (req, res) => {
  try {
    const sql = "SELECT * FROM `leaveType` WHERE `id` = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.render('leave/leaveTypeEdit', {
        title: 'Leave Type Edit',
        results: result[0],
        user: req.session.user
      })
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update leave type invalid.' })
  }
}

exports.putUpdateLeaveType = async (req, res) => {
  try {
    const { leaveTypeNoE, leaveTypeNameTHE, leaveTypeNameENE, leaveTypeQuotaE } = req.body;
    const sql = "UPDATE `leaveType` SET no = ?,Code = ? , nameTH = ? , nameEN = ? WHERE id = ?";
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
    console.error('Error put data :', err);
    res.status(500).json({ error: 'Put update leave type invalid.' })
  }
}

exports.getRemoveLeaveType = async (req, res) => {
  try {
    const sql = "DELETE FROM `leaveType` WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      const sql = "SELECT * FROM `leaveType` ORDER BY no ASC";

      db.query(sql, (err, results) => {
        if (err) throw err;

        res.render('leave/leaveType', {
          title: 'Leave Type Management',
          results: results,
          user: req.session.user
        })
      })
    })
  } catch (err) {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove leave type invalid.' })
  }
}

exports.getViewLeaveType = async (req, res) => {
  try {
    const sql = "SELECT * FROM `leaveType` WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      res.render('leave/leaveTypeView', {
        title: 'Leave Type View',
        results: result[0],
        user: req.session.user
      })
    })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view leave type invalid.' })
  }
}

exports.listLeaveApprove = async (req, res) => {
  try {
    const sql = "SELECT * FROM `view_leaveApprove` ORDER BY `nameTH` ASC";
    db.query(sql, (err, results) => {
      if (err) throw err;

      res.render('leave/leaveApprove', {
        title: 'Leave Approve Management',
        results: results,
        user: req.session.user
      })
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List leave approve invalid.' })
  }
}

exports.getCreateLeaveApprove = async (req, res) => {
  try {
    const sqlName = "SELECT `id`,`nameTH` FROM `employee` ORDER BY `nameTH` ASC";
    db.query(sqlName, (err, resultsName) => {
      if (err) throw err;
      res.render('leave/leaveApproveAdd', {
        title: 'leave Approve Create',
        resultsName: resultsName,
        user: req.session.user
      })
    })
  } catch {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create leave approve invalid.' })
  }
}

exports.postCreateLeaveApprove = async (req, res) => {
  try {
    const { leaveApproveEmployee, leaveApproveHead, leaveApproveHR, leaveApproveMD } = req.body;
    const sqlAdd = "INSERT INTO `leaveApprove` (`id`, `emID`, `approveHead`, `approveHR`, `approveMD`) VALUES(?, ?, ?, ?, ?);";
    const sql = "SELECT * FROM `view_leaveApprove` ORDER BY `nameTH` ASC";
    db.query(sqlAdd, [uuidv4(), leaveApproveEmployee, leaveApproveHead, leaveApproveHR, leaveApproveMD], (err, resultAdd) => {
      if (err) throw err;
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('leave/leaveApprove', {
          title: 'leave Approve Management',
          results: results,
          user: req.session.user
        })
      })
    })
  } catch (err) {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create leave approve invalid.' })
  }
}

exports.getUpdateLeaveApprove = async (req, res) => {
  try {
    const sql = "SELECT * FROM FROM `view_leaveApprove` WHERE `leaveAppID` = ?";
    const sqlName = "SELECT `id`,`nameTH` FROM `employee` ORDER BY `nameTH` ASC";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      db.query(sqlName, (err, resultName) => {
        if (err) throw err;
        res.render('leave/leaveApproveEdit', {
          title: 'leave Approve Edit',
          results: result[0],
          resultName: resultName,
          user: req.session.user
        })
      })
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update leave approve invalid.' })
  }
}

exports.putUpdateLeaveApprove = async (req, res) => {
  try {
    const { leaveApproveEmployeeE, leaveApproveHeadE, leaveApproveHRE, leaveApproveMDE } = req.body;
    const now = new Date();
    const timestamp = moment(now).format();
    const sql = "SELECT * FROM `view_leaveApprove` ORDER BY `nameTH` ASC";
    const sqlEdit = "UPDATE `leaveApprove` SET `emID`=?, `approveHead`=?, `approveHR`=?, `approveMD`=?,`updatedAt`=?  WHERE id = ?";
    db.query(sqlEdit, [leaveApproveEmployeeE, leaveApproveHeadE, leaveApproveHRE, leaveApproveMDE, timestamp, req.params.id], (err, result) => {
      if (err) throw err;
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('leave/leaveApprove', {
          title: 'leave Approve Management',
          results: results,
          user: req.session.user
        })
      })
    })
  } catch (err) {
    console.error('Error put data :', err);
    res.status(500).json({ error: 'Put update leave approve invalid.' })
  }
}

exports.getRemoveLeaveApprove = async (req, res) => {
  try {
    const sqlDel = "DELETE FROM `leaveApprove` WHERE id = ?";
    const sql = "SELECT * FROM `view_leaveApprove` ORDER BY `nameTH` ASC";
    db.query(sqlDel, [req.params.id], (err, result) => {
      if (err) throw err;
      db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('leave/leaveApprove', {
          title: 'leave Approve Management',
          results: results,
          user: req.session.user
        })
      })
    })
  } catch (err) {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove leave approve invalid.' })
  }
}

exports.getViewLeaveApprove = async (req, res) => {
  try {
    const sql = "SELECT * FROM `view_leaveApprove` WHERE `leaveAppID` = ?";
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
      })
    })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view leave approve invalid.' })
  }
}

exports.listLeaveQuotaMain = async (req, res) => {
  try {
    const sql = "SELECT * FROM `view_leaveQuotaTypeEmMain` ORDER BY `code` ASC";
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.render('leave/leaveQuotaMain', {
        title: 'Leave Quota Management',
        results: results,
        user: req.session.user
      })
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List leave quota invalid.' })
  }
}

exports.getCreateLeaveQuota = async (req, res) => {
  try {
    const sqlMain = "SELECT * FROM `view_leaveQuotaTypeEmMain` WHERE `employeeID` = ? ";
    const sqlType = "SELECT `id`, `no`, `nameTH`, `nameEN`, `quota` FROM `leaveType` ORDER BY `no` ASC";
    const sqlData = "SELECT * FROM `view_leaveQuotaTypeEm`  WHERE `emID` = ?";
    const now = new Date();
    const yearString = moment(now).format('YYYY');
    db.query(sqlMain, [req.params.id], (err, resultsMain) => {
      if (err) throw err;
      db.query(sqlType, (err, resultsType) => {
        if (err) throw err;
        if (resultsMain[0]['leaveQuotaType'] > 0) {
          db.query(sqlData, [req.params.id], (err, results) => {
            if (err) throw err;
            res.render('leave/leaveQuotaAdd', {
              title: 'Leave Quota Management',
              results: results,
              resultsType: resultsType,
              resultsMain: resultsMain[0],
              user: req.session.user
            });
          })
        } else {
          res.render('leave/leaveQuotaAdd', {
            title: 'Leave Quota Management',
            results: null,
            resultsType: resultsType,
            resultsMain: resultsMain[0],
            user: req.session.user
          })
        }
      })
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List leave quota invalid.' })
  }
}

exports.postCreateLeaveQuota = async (req, res) => {
  try {
    const { leaveAnnual, leavePersonal, leaveSick, leaveAbsence, leaveStudy, leaveSterilization, leaveCompassionate, leaveMarriage, leaveMaternity, leaveOrdination } = req.body;
    const now = new Date();
    const yearString = moment(now).format('YYYY');
    const typeID = {
      idPersonal: '094a23e9-f8fa-4cd3-a492-b85968a4038b',
      idAnnual: '339202ac-3db2-4be2-93b7-6500a60af708',
      idSick: '98b462d0-673e-43a3-882c-3fef8c5cec3e',
      idMaternity: '162cd45a-9f0d-438d-9647-0b8b12ab7b8e',
      idStudy: '09865a88-2138-4203-a1b3-2e449c995cdf',
      idOrdination: 'ec460910-6a99-4837-ae43-381810c4c794',
      idAbsence: 'f3240fcc-0e99-48d5-b193-4e20d921e01b',
      idSterilization: '47c63260-7c46-4bd9-8b89-38d30f164851',
      idCompassionate: '8f7a973c-78f3-4edb-a6e2-544ce84c138c',
      idMarriage: '395d3f73-5365-4883-aaea-aebe28d45158',
      idAbsent: '8b7be7fd-a42b-44ac-9c25-74ac37715637',
      idResign: '378a0dc1-d8a8-4e97-b930-4ee25362cfd5'
    }
    let sqlAdd = "INSERT INTO `leaveQuota`(`id`, `emID`, `leaveTypeID`, `quota`, `year`) VALUES('" + uuidv4() + "', '" + req.params.id + "', '" + typeID.idPersonal + "'," + leavePersonal + ", '" + yearString + "') ";
    sqlAdd += ", ('" + uuidv4() + "', '" + req.params.id + "', '" + typeID.idAnnual + "'," + leaveAnnual + ", '" + yearString + "') ";
    sqlAdd += ", ('" + uuidv4() + "', '" + req.params.id + "', '" + typeID.idSick + "'," + leaveSick + ", '" + yearString + "') ";
    sqlAdd += ", ('" + uuidv4() + "', '" + req.params.id + "', '" + typeID.idMaternity + "'," + leaveMaternity + ", '" + yearString + "') ";
    sqlAdd += ", ('" + uuidv4() + "', '" + req.params.id + "', '" + typeID.idStudy + "'," + leaveStudy + ", '" + yearString + "') ";
    sqlAdd += ", ('" + uuidv4() + "', '" + req.params.id + "', '" + typeID.idOrdination + "'," + leaveOrdination + ", '" + yearString + "') ";
    sqlAdd += ", ('" + uuidv4() + "', '" + req.params.id + "', '" + typeID.idAbsence + "'," + leaveAbsence + ", '" + yearString + "') ";
    sqlAdd += ", ('" + uuidv4() + "', '" + req.params.id + "', '" + typeID.idSterilization + "'," + leaveSterilization + ", '" + yearString + "') ";
    sqlAdd += ", ('" + uuidv4() + "', '" + req.params.id + "', '" + typeID.idCompassionate + "'," + leaveCompassionate + ", '" + yearString + "') ";
    sqlAdd += ", ('" + uuidv4() + "', '" + req.params.id + "', '" + typeID.idMarriage + "'," + leaveMarriage + ", '" + yearString + "') ";
    sqlAdd += ", ('" + uuidv4() + "', '" + req.params.id + "', '" + typeID.idAbsent + "',0, '" + yearString + "') ";
    sqlAdd += ", ('" + uuidv4() + "', '" + req.params.id + "', '" + typeID.idResign + "',1, '" + yearString + "') ";
    const sqlMain = "SELECT * FROM `view_leaveQuotaTypeEmMain` WHERE `employeeID` = ? ";
    const sqlData = "SELECT * FROM `view_leaveQuotaTypeEm`  WHERE `emID` = ?";
    const sql = "SELECT * FROM `view_leaveQuotaTypeEmMain` ORDER BY `code` ASC";
    db.query(sqlMain, [req.params.id], (err, resultsMain) => {
      if (err) throw err;
      if (resultsMain[0]['leaveQuotaType'] > 0) {
        db.query(sqlData, [req.params.id], (err, resultsData) => {
          if (err) throw err;
          resultsData.forEach(resultsD => {
            if (resultsD.leaveTypeID === typeID.idPersonal && resultsD.typeQuota !== leavePersonal) {
              const sqlEdit = "UPDATE `leaveQuota` SET `quota`=" + leavePersonal + "  WHERE `emID`='" + req.params.id + "' AND `leaveTypeID`='" + typeID.idPersonal + "' AND `year`='" + yearString + "' ;";
              db.query(sqlEdit, (err, resultEdit) => {
                if (err) throw err;
              })
            }
            if (resultsD.leaveTypeID === typeID.idAnnual && resultsD.typeQuota !== leaveAnnual) {
              const sqlEdit = "UPDATE `leaveQuota` SET `quota`=" + leaveAnnual + "  WHERE `emID`='" + req.params.id + "' AND `leaveTypeID`='" + typeID.idAnnual + "' AND `year`='" + yearString + "' ;";
              db.query(sqlEdit, (err, resultEdit) => {
                if (err) throw err;
              })
            }
            if (resultsD.leaveTypeID === typeID.idSick && resultsD.typeQuota !== leaveSick) {
              const sqlEdit = "UPDATE `leaveQuota` SET `quota`=" + leaveSick + "  WHERE `emID`='" + req.params.id + "' AND `leaveTypeID`='" + typeID.idSick + "' AND `year`='" + yearString + "' ;";
              db.query(sqlEdit, (err, resultEdit) => {
                if (err) throw err;
              })
            }
            if (resultsD.leaveTypeID === typeID.idMaternity && resultsD.typeQuota !== leaveMaternity) {
              const sqlEdit = "UPDATE `leaveQuota` SET `quota`=" + leaveMaternity + "  WHERE `emID`='" + req.params.id + "' AND `leaveTypeID`='" + typeID.idMaternity + "' AND `year`='" + yearString + "' ;";
              db.query(sqlEdit, (err, resultEdit) => {
                if (err) throw err;
              })
            }
            if (resultsD.leaveTypeID === typeID.idStudy && resultsD.typeQuota !== leaveStudy) {
              const sqlEdit = "UPDATE `leaveQuota` SET `quota`=" + leaveStudy + "  WHERE `emID`='" + req.params.id + "' AND `leaveTypeID`='" + typeID.idStudy + "' AND `year`='" + yearString + "' ;";
              db.query(sqlEdit, (err, resultEdit) => {
                if (err) throw err;
              })
            }
            if (resultsD.leaveTypeID === typeID.idOrdination && resultsD.typeQuota !== leaveOrdination) {
              const sqlEdit = "UPDATE `leaveQuota` SET `quota`=" + leaveOrdination + "  WHERE `emID`='" + req.params.id + "' AND `leaveTypeID`='" + typeID.idOrdination + "' AND `year`='" + yearString + "' ;";
              db.query(sqlEdit, (err, resultEdit) => {
                if (err) throw err;
              })
            }
            if (resultsD.leaveTypeID === typeID.idAbsence && resultsD.typeQuota !== leaveAbsence) {
              const sqlEdit = "UPDATE `leaveQuota` SET `quota`=" + leaveAbsence + "  WHERE `emID`='" + req.params.id + "' AND `leaveTypeID`='" + typeID.idAbsence + "' AND `year`='" + yearString + "' ;";
              db.query(sqlEdit, (err, resultEdit) => {
                if (err) throw err;
              })
            }
            if (resultsD.leaveTypeID === typeID.idSterilization && resultsD.typeQuota !== leaveSterilization) {
              const sqlEdit = "UPDATE `leaveQuota` SET `quota`=" + leaveSterilization + "  WHERE `emID`='" + req.params.id + "' AND `leaveTypeID`='" + typeID.idSterilization + "' AND `year`='" + yearString + "' ;";
              db.query(sqlEdit, (err, resultEdit) => {
                if (err) throw err;
              })
            }
            if (resultsD.leaveTypeID === typeID.idCompassionate && resultsD.typeQuota !== leaveCompassionate) {
              const sqlEdit = "UPDATE `leaveQuota` SET `quota`=" + leaveCompassionate + "  WHERE `emID`='" + req.params.id + "' AND `leaveTypeID`='" + typeID.idCompassionate + "' AND `year`='" + yearString + "' ;";
              db.query(sqlEdit, (err, resultEdit) => {
                if (err) throw err;
              })
            }
            if (resultsD.leaveTypeID === typeID.idMarriage && resultsD.typeQuota !== leaveMarriage) {
              const sqlEdit = "UPDATE `leaveQuota` SET `quota`=" + leaveMarriage + "  WHERE `emID`='" + req.params.id + "' AND `leaveTypeID`='" + typeID.idMarriage + "' AND `year`='" + yearString + "' ;";
              db.query(sqlEdit, (err, resultEdit) => {
                if (err) throw err;
              })
            }
          })
          db.query(sql, (err, results) => {
            if (err) throw err;
            res.render('leave/leaveQuotaMain', {
              title: 'Leave Quota Management',
              results: results,
              user: req.session.user
            });
          })
        })
      } else {
        db.query(sqlAdd, (err, resultAdd) => {
          if (err) throw err;
          db.query(sql, (err, results) => {
            if (err) throw err;
            res.render('leave/leaveQuotaMain', {
              title: 'Leave Quota Management',
              results: results,
              user: req.session.user
            });
          })
        })
      }
    })
  } catch (err) {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create leave quota invalid.' })
  }
}

exports.listLeaveDoc = async (req, res) => {
  try {
    const sql = "SELECT * FROM `view_docLeaveMain` ";
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.render('leave/leaveDocumentMain', {
        title: 'Leave Document Management',
        results: results,
        user: req.session.user
      })
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List leave doc invalid.' })
  }
}

exports.getCreateLeaveDoc = async (req, res) => {
  try {
    const sql = "SELECT * FROM `view_docLeave` WHERE  `emID` = ? ORDER BY `doc` ASC";
    const sqlName = "SELECT `id`,`nameTH`,`code`,`mobile` FROM `employee` WHERE id = ?";
    db.query(sql, [req.params.id], (err, results) => {
      if (err) throw err;
      db.query(sqlName, [req.params.id], (err, resultsName) => {
        if (err) throw err;
        if (results.length > 0) {
          const coverDate = {
            date: null,
            startDate: null,
            endDate: null,
            createdAt: null,
            updatedAt: null
          }
          if (results[0]['date']) {
            if (results[0]['date'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
              coverDate.date = moment(results[0]['date']).format('DD/MM/YYYY');
            }
          }
          if (results[0]['startDate']) {
            if (results[0]['startDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
              coverDate.startDate = moment(results[0]['startDate']).format('DD/MM/YYYY');
            }
          }
          if (results[0]['endDate']) {
            if (results[0]['endDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
              coverDate.endDate = moment(results[0]['endDate']).format('DD/MM/YYYY');
            }
          }
          if (results[0]['createdAt']) {
            if (results[0]['createdAt'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
              coverDate.createdAt = moment(results[0]['createdAt']).format('DD/MM/YYYY HH:mm:ss');
            }
          }
          if (results[0]['updatedAt']) {
            if (results[0]['updatedAt'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
              coverDate.updatedAt = moment(results[0]['updatedAt']).format('DD/MM/YYYY HH:mm:ss');
            }
          }
          res.render('leave/leaveDocument', {
            title: 'Leave Document Management',
            results: results,
            resultsName: resultsName[0],
            coverDate: coverDate,
            user: req.session.user
          });
        } else {
          const coverDate = {
            date: null,
            startDate: null,
            endDate: null,
            createdAt: null,
            updatedAt: null
          }
          res.render('leave/leaveDocument', {
            title: 'Leave Document Management',
            results: results,
            resultsName: resultsName[0],
            coverDate: coverDate,
            user: req.session.user
          })
        }
      })
    })
  } catch {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create leave doc invalid.' })
  }
}

exports.getCreateLeaveDocID = async (req, res) => {
  try {
    const sqlName = "SELECT `id`,`nameTH`,`code`,`mobile` FROM `employee` WHERE id = ?";
    const sqlType = "SELECT `id`, `no`, `nameTH`, `nameEN`, `quota` FROM `leaveType` ORDER BY `no` ASC";
    const now = new Date();
    const dateStamp = moment(now).format('YYYY-MM-DD');
    const timestamp = moment(now).format();
    const sqlLBLmaxNo = "SELECT IFNULL(MAX( `no`),0)+1 as maxNo FROM `leaveDoc` WHERE `emID` = ? ";
    db.query(sqlName, [req.params.id], (err, resultsName) => {
      if (err) throw err;
      db.query(sqlType, (err, resultsType) => {
        if (err) throw err;
        db.query(sqlLBLmaxNo, [req.params.id], (err, resultsMaxNo) => {
          if (err) throw err;
          res.render('leave/leaveDocumentAdd', {
            title: 'leave Document Create',
            resultsName: resultsName[0],
            resultsType: resultsType,
            dateStamp: dateStamp,
            maxNo: resultsMaxNo[0],
            user: req.session.user
          })
        })
      })
    })
  } catch {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create Leave Doc ID invalid.' })
  }
}

exports.postCreateLeaveDoc = async (req, res) => {
  try {
    const { leaveDocument, leaveDocTypeID, leaveDocDays, leaveDocStartDate, leaveDocEndDate, leaveDocHatfDate, leaveDocRemark, leaveDocContact } = req.body;
    const image = req.file ? req.file.filename : null;
    const paramID = req.params.id;
    const uuid = uuidv4();
    const today = new Date();
    const timestamp = moment(today).format();
    const dateString = moment(today).format('YYYY-MM-DD');
    let sql_insert_leaveDoc_user = "INSERT INTO `leaveDoc`(`id`, `doc`, `no`, `date`, `docTypeID`, `emID`, `startDate`, `endDate`, `hatfDate`, `status`, `leaveDays`, `remark`, `file`, `contact`, `statusAppHead`, `nameAppHead`, `statusAppHR`, `nameAppHR`, `statusAppMD`, `nameAppMD`) ";
    sql_insert_leaveDoc_user += "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const sqlQtnMaxNo = "SELECT IFNULL(MAX( `no`),0)+1 as maxNo FROM `leaveDoc` WHERE `emID` = ? ";
    const sqlApproveHHM = "SELECT `id`, `emID`, `approveHead`, `approveHR`, `approveMD`, `createdAt`, `updatedAt` FROM `leaveApprove` WHERE `emID` = ? ";
    const sqlQuata = "SELECT `quota`, `year` FROM `leaveQuota` WHERE `emID` =? and `leaveTypeID`=? and `year`=?";
    let sqlEmDetail = "SELECT  `code`, `serialNumber`, `mobile`, `InternalTelephone`, `nameTH`, `nameEN`, `nickname`";
    sqlEmDetail += ",`approveHead`, `approveHR`, `approveMD` FROM `employee` LEFT JOIN `leaveApprove` ON `leaveApprove`.`emID` = `employee`.`id` WHERE `employee`.`id` =?";
    const sqlCheckLeave = "SELECT  `docTypeID`, `emID`, SUM(`leaveDays`) as `leaveDaysSum` FROM `leaveDoc` WHERE `status` = 'อนุมัติ'  and `emID` = ? and  `docTypeID=? GROUP BY  `docTypeID`, `emID ";
    db.query(sqlQtnMaxNo, [req.params.id], (err, QtnMaxNo) => {
      if (err) throw err;
      db.query(sqlEmDetail, [req.params.id], (err, emDetail) => {
        if (err) throw err;
        const QtnNo = QtnMaxNo[0]['maxNo'];
        let QtnDoc = QtnNo;
        if (QtnNo.length = 1) { QtnDoc = "LE" + emDetail[0]['code'] + new Date().toLocaleString("en-US", { year: "2-digit" }) + "-" + "00" + QtnNo; }
        else if (QtnNo.length = 2) { QtnDoc = "LE" + emDetail[0]['code'] + new Date().toLocaleString("en-US", { year: "2-digit" }) + "-" + "0" + QtnNo; }
        db.query(sql_insert_leaveDoc_user, [uuid, QtnDoc, QtnNo, dateString, leaveDocTypeID, req.params.id, leaveDocStartDate, leaveDocEndDate, leaveDocHatfDate, "รอ Leader อนุมัติ", leaveDocDays, leaveDocRemark, image, leaveDocContact, "รออนุมัติ", emDetail[0]['approveHead'], "รออนุมัติ", emDetail[0]['approveHR'], "รออนุมัติ", emDetail[0]['approveMD']], (err, result) => {
          if (err) throw err;
          res.redirect('/leave/leaveDoc/' + paramID);
        })
      })
    })
  } catch (err) {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create leave doc invalid.' })
  }
}

exports.getUpdateLeaveDoc = async (req, res) => {
  try {
    const sqlLeaveDoc = "SELECT * FROM `view_docLeave` WHERE id = ?";
    const sqlType = "SELECT `id`, `no`, `nameTH`, `nameEN`, `quota` FROM `leaveType` ORDER BY `no` ASC";
    const now = new Date();
    const dateStamp = moment(now).format('YYYY-MM-DD');
    const timestamp = moment(now).format();
    const sqlLBLmaxNo = "SELECT IFNULL(MAX( `no`),0)+1 as maxNo FROM `leaveDoc` WHERE `emID` = ? ";
    db.query(sqlLeaveDoc, [req.params.id], (err, resultsLeaveDoc) => {
      if (err) throw err;
      db.query(sqlType, (err, resultsType) => {
        if (err) throw err;
        const coverDate = {
          date: null,
          startDate: null,
          endDate: null,
          createdAt: null,
          updatedAt: null
        }
        if (resultsLeaveDoc[0]['date']) {
          if (resultsLeaveDoc[0]['date'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
            coverDate.date = moment(resultsLeaveDoc[0]['date']).format('YYYY-MM-DD');
          }
        }
        if (resultsLeaveDoc[0]['startDate']) {
          if (resultsLeaveDoc[0]['startDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
            coverDate.startDate = moment(resultsLeaveDoc[0]['startDate']).format('YYYY-MM-DD');
          }
        }
        if (resultsLeaveDoc[0]['endDate']) {
          if (resultsLeaveDoc[0]['endDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
            coverDate.endDate = moment(resultsLeaveDoc[0]['endDate']).format('YYYY-MM-DD');
          }
        }
        if (resultsLeaveDoc[0]['createdAt']) {
          if (resultsLeaveDoc[0]['createdAt'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
            coverDate.createdAt = moment(resultsLeaveDoc[0]['createdAt']).format('DD/MM/YYYY HH:mm:ss');
          }
        }
        if (resultsLeaveDoc[0]['updatedAt']) {
          if (resultsLeaveDoc[0]['updatedAt'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
            coverDate.updatedAt = moment(resultsLeaveDoc[0]['updatedAt']).format('DD/MM/YYYY HH:mm:ss');
          }
        }
        res.render('leave/leaveDocumentEdit', {
          title: 'leave Document Edit',
          resultsLeaveDoc: resultsLeaveDoc[0],
          resultsType: resultsType,
          dateStamp: dateStamp,
          user: req.session.user,
          coverDate: coverDate,
        });
      })
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update leave doc invalid.' })
  }
}

exports.putUpdateLeaveDoc = async (req, res) => {
  try {
    const { leaveDocumentE, leaveDocTypeIDE, leaveDocDaysE, leaveDocStartDateE, leaveDocEndDateE, leaveDocHatfDateE, leaveDocRemarkE, leaveDocContactE } = req.body;
    const image = req.file ? req.file.filename : null;
    const paramID = req.params.id;
    const today = new Date();
    const timestamp = moment(today).format();
    const dateString = moment(today).format('YYYY-MM-DD');
    let sql_edit_leaveDoc_user = "UPDATE `leaveDoc` SET `docTypeID` = ?, `startDate`= ?, `endDate`= ?, `hatfDate`= ?, `status`= ?, `leaveDays`= ?, `remark`= ?, `file`=?, `contact`= ?,  ";
    sql_edit_leaveDoc_user += " `statusAppHead`= ?, `nameAppHead`= ?, `statusAppHR`= ?, `nameAppHR`= ?, `statusAppMD`= ?, `nameAppMD`= ?, `updatedAt`= ? WHERE `id` = ? ";
    const sqlLeaveDocEmID = "SELECT `emID` FROM `leaveDoc` WHERE `id` = ? ";
    const sqlQuata = "SELECT `quota`, `year` FROM `leaveQuota` WHERE `emID` =? and `leaveTypeID`=? and `year`=?";
    let sqlEmDetail = "SELECT  `employee`.`id`,`code`, `serialNumber`, `mobile`, `InternalTelephone`, `nameTH`, `nameEN`, `nickname`";
    sqlEmDetail += ",`approveHead`, `approveHR`, `approveMD` FROM `employee` LEFT JOIN `leaveApprove` ON `leaveApprove`.`emID` = `employee`.`id` WHERE `employee`.`id` =?";
    const sqlCheckLeave = "SELECT  `docTypeID`, `emID`, SUM(`leaveDays`) as `leaveDaysSum` FROM `leaveDoc` WHERE `status` = 'อนุมัติ'  and `emID` = ? and  `docTypeID=? GROUP BY  `docTypeID`, `emID ";
    db.query(sqlLeaveDocEmID, [req.params.id], (err, leaveDocEmID) => {
      if (err) throw err;
      db.query(sqlEmDetail, [leaveDocEmID[0]['emID']], (err, emDetail) => {
        if (err) throw err;
        db.query(sql_edit_leaveDoc_user, [leaveDocTypeIDE, leaveDocStartDateE, leaveDocEndDateE, leaveDocHatfDateE, "รอ Leader อนุมัติ", leaveDocDaysE, leaveDocRemarkE, image, leaveDocContactE, "รออนุมัติ", emDetail[0]['approveHead'], "รออนุมัติ", emDetail[0]['approveHR'], "รออนุมัติ", emDetail[0]['approveMD'], timestamp, req.params.id], (err, result) => {
          if (err) throw err;
          res.redirect('/leave/leaveDoc/' + emDetail[0]['id']);
        })
      })
    })
  } catch (err) {
    console.error('Error put data :', err);
    res.status(500).json({ error: 'Put update leave doc invalid.' })
  }
}

exports.getRemoveLeaveDoc = async (req, res) => {
  try {
  const sqlDel = "DELETE FROM `leaveDoc` WHERE id = ?";
  const sql = "SELECT `emID` FROM `leaveDoc` WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      const emID = result[0]['emID'];
      db.query(sqlDel, [req.params.id], (err, results) => {
        if (err) throw err;
        res.redirect('/leave/leaveDoc/' + emID);
      })
    })
  } catch (err) {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove leave doc invalid.' })
  }
}

exports.getViewLeaveDoc = async (req, res) => {
  try {
 const sqlLeaveDoc = "SELECT * FROM `view_docLeave` WHERE id = ?";
  const sqlType = "SELECT `id`, `no`, `nameTH`, `nameEN`, `quota` FROM `leaveType` ORDER BY `no` ASC";
  const now = new Date();
  const dateStamp = moment(now).format('YYYY-MM-DD');
  const timestamp = moment(now).format();
    db.query(sqlLeaveDoc, [req.params.id], (err, resultsLeaveDoc) => {
      if (err) throw err;
      const coverDate = {
        date: null,
        startDate: null,
        endDate: null,
        createdAt: null,
        updatedAt: null

      }
      if (resultsLeaveDoc[0]['date']) {
        if (resultsLeaveDoc[0]['date'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
          coverDate.date = moment(resultsLeaveDoc[0]['date']).format('YYYY-MM-DD');
        }
      }
      if (resultsLeaveDoc[0]['startDate']) {
        if (resultsLeaveDoc[0]['startDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
          coverDate.startDate = moment(resultsLeaveDoc[0]['startDate']).format('YYYY-MM-DD');
        }
      }
      if (resultsLeaveDoc[0]['endDate']) {
        if (resultsLeaveDoc[0]['endDate'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
          coverDate.endDate = moment(resultsLeaveDoc[0]['endDate']).format('YYYY-MM-DD');
        }
      }
      if (resultsLeaveDoc[0]['createdAt']) {
        if (resultsLeaveDoc[0]['createdAt'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
          coverDate.createdAt = moment(resultsLeaveDoc[0]['createdAt']).format('DD/MM/YYYY HH:mm:ss');
        }
      }
      if (resultsLeaveDoc[0]['updatedAt']) {
        if (resultsLeaveDoc[0]['updatedAt'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
          coverDate.updatedAt = moment(resultsLeaveDoc[0]['updatedAt']).format('DD/MM/YYYY HH:mm:ss');
        }
      }
      res.render('leave/leaveDocumentView', {
        title: 'leave Document View',
        resultsLeaveDoc: resultsLeaveDoc[0],
        dateStamp: dateStamp,
        user: req.session.user,
        coverDate: coverDate
      })
    })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view leave doc invalid.' })
  }
}