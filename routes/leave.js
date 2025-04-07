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

router.get('/leaveType', isAuthenticated, (req, res) => {
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
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
});

router.get('/leaveType/Add', isAuthenticated, (req, res) => {
    res.render('leave/leaveTypeAdd', {
        title: 'Leave Type Create',
        user: req.session.user
    });
})

router.post('/leaveType/Add', isAuthenticated, (req, res) => {
    const { leaveTypeNo, leaveTypeQuota, leaveTypeNameTH, leaveTypeNameEN } = req.body;
    const uuid = uuidv4();
    const sqlAdd = "INSERT INTO `leaveType` ( `id`, `no`, `nameTH`, `nameEN`, `quota` ) VALUES(?, ?, ?, ?, ?)";
    const sql = "SELECT * FROM `leaveType` ORDER BY `no` ASC";
    try {
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
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
});

router.get('/leaveType/Edit/:id', isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM `leaveType` WHERE `id` = ?";
    try {
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            res.render('leave/leaveTypeEdit', {
                title: 'Leave Type Edit',
                results: result[0],
                user: req.session.user
            });
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
})

router.post('/leaveType/Edit/:id', isAuthenticated, (req, res) => {
    const { leaveTypeNoE, leaveTypeNameTHE, leaveTypeNameENE, leaveTypeQuotaE } = req.body;

    const sql = "UPDATE `leaveType` SET no = ?,Code = ? , nameTH = ? , nameEN = ? WHERE id = ?";
    try {
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
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
})

router.get('/leaveType/Del/:id', isAuthenticated, (req, res) => {
    const sql = "DELETE FROM `leaveType` WHERE id = ?";
    try {
        db.query(sql, [req.params.id], (err, result) => {
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
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
})

router.get('/leaveType/View/:id', isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM `leaveType` WHERE id = ?";
    try {
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            res.render('leave/leaveTypeView', {
                title: 'Leave Type View',
                results: result[0],
                user: req.session.user
            });
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
})

router.get('/leaveApprove', isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM `view_leaveApprove` ORDER BY `nameTH` ASC";
    try {
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('leave/leaveApprove', {
                title: 'Leave Approve Management',
                results: results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
});

router.get('/leaveApprove/Add', isAuthenticated, (req, res) => {
    const sqlName = "SELECT `id`,`nameTH` FROM `employee` ORDER BY `nameTH` ASC";
    try {
        db.query(sqlName, (err, resultsName) => {
            if (err) throw err;
            res.render('leave/leaveApproveAdd', {
                title: 'leave Approve Create',
                resultsName: resultsName,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }

})

router.post('/leaveApprove/Add', isAuthenticated, (req, res) => {
    const { leaveApproveEmployee, leaveApproveHead, leaveApproveHR, leaveApproveMD } = req.body;
    const uuid = uuidv4();
    const sqlAdd = "INSERT INTO `leaveApprove` (`id`, `emID`, `approveHead`, `approveHR`, `approveMD`) VALUES(?, ?, ?, ?, ?)";
    const sql = "SELECT * FROM `view_leaveApprove` ORDER BY `nameTH` ASC";
    try {
        db.query(sqlAdd, [uuid, leaveApproveEmployee, leaveApproveHead, leaveApproveHR, leaveApproveMD], (err, resultAdd) => {
            if (err) throw err;

            db.query(sql, (err, results) => {
                if (err) throw err;

                res.render('leave/leaveApprove', {
                    title: 'leave Approve Management',
                    results: results,
                    user: req.session.user
                });
            })
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
});

router.get('/leaveApprove/Edit/:id', isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM FROM `view_leaveApprove` WHERE `leaveAppID` = ?";
    const sqlName = "SELECT `id`,`nameTH` FROM `employee` ORDER BY `nameTH` ASC";
    try {
        db.query(sql, [req.params.id], (err, result) => {
            if (err) throw err;
            db.query(sqlName, (err, resultName) => {
                if (err) throw err;
                res.render('leave/leaveApproveEdit', {
                    title: 'leave Approve Edit',
                    results: result[0],
                    resultName: resultName,
                    user: req.session.user
                });
            })
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
})

router.post('/leaveApprove/Edit/:id', isAuthenticated, (req, res) => {
    const { leaveApproveEmployeeE, leaveApproveHeadE, leaveApproveHRE, leaveApproveMDE } = req.body;
    const now = new Date();
    const timestamp = moment(now).format();
    const sql = "SELECT * FROM `view_leaveApprove` ORDER BY `nameTH` ASC";
    const sqlEdit = "UPDATE `leaveApprove` SET `emID`=?, `approveHead`=?, `approveHR`=?, `approveMD`=?,`updatedAt`=?  WHERE id = ?";
    try {
        db.query(sqlEdit, [leaveApproveEmployeeE, leaveApproveHeadE, leaveApproveHRE, leaveApproveMDE, timestamp, req.params.id], (err, result) => {
            if (err) throw err;


            db.query(sql, (err, results) => {
                if (err) throw err;

                res.render('leave/leaveApprove', {
                    title: 'leave Approve Management',
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

router.get('/leaveApprove/Del/:id', isAuthenticated, (req, res) => {
    const sqlDel = "DELETE FROM `leaveApprove` WHERE id = ?";
    const sql = "SELECT * FROM `view_leaveApprove` ORDER BY `nameTH` ASC";
    try {
        db.query(sqlDel, [req.params.id], (err, result) => {
            if (err) throw err;
            db.query(sql, (err, results) => {
                if (err) throw err;
                res.render('leave/leaveApprove', {
                    title: 'leave Approve Management',
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

router.get('/leaveApprove/View/:id', isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM `view_leaveApprove` WHERE `leaveAppID` = ?";
    try {
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
            });
        });
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
})

router.get('/leaveQuotaMain', isAuthenticated, (req, res) => {
    const sql = "SELECT * FROM `view_leaveQuotaTypeEmMain` ORDER BY `code` ASC";
    try {
        db.query(sql, (err, results) => {
            if (err) throw err;

            res.render('leave/leaveQuotaMain', {
                title: 'Leave Quota Management',
                results: results,
                user: req.session.user
            });
        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
});

router.get('/leaveQuota/Add/:id', isAuthenticated, (req, res) => {
    const sqlMain = "SELECT * FROM `view_leaveQuotaTypeEmMain` WHERE `employeeID` = ? ";
    const sqlType = "SELECT `id`, `no`, `nameTH`, `nameEN`, `quota` FROM `leaveType` ORDER BY `no` ASC";
    const sqlData = "SELECT * FROM `view_leaveQuotaTypeEm`  WHERE `emID` = ?";
    const now = new Date();
    const yearString = moment(now).format('YYYY');
    try {
        db.query(sqlMain, [req.params.id], (err, resultsMain) => {
            if (err) throw err;
            db.query(sqlType, (err, resultsType) => {
                if (err) throw err;
                
                if(resultsMain[0]['leaveQuotaType'] >0 )
                {
                    db.query(sqlData, [req.params.id], (err, results) => {
                        if (err) throw err;
                        res.render('leave/leaveQuotaAdd', {
                            title: 'Leave Quota Management',
                            results: results,
                            resultsType:resultsType,
                            resultsMain:resultsMain[0],
                            user: req.session.user
                        });
                    })
                } else{
                    res.render('leave/leaveQuotaAdd', {
                        title: 'Leave Quota Management',
                        results: null,
                        resultsType:resultsType,
                        resultsMain:resultsMain[0],
                        user: req.session.user
                    });
                }
            })

        })
    } catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
});

router.post('/leaveQuota/Add/:id', isAuthenticated, (req, res) => {
    const { leaveAnnual,leavePersonal,leaveSick,leaveAbsence,leaveStudy,leaveSterilization,leaveCompassionate,leaveMarriage,leaveMaternity,leaveOrdination } = req.body;
    const now = new Date();
    const yearString = moment(now).format('YYYY');
    const typeID ={
        idPersonal : '094a23e9-f8fa-4cd3-a492-b85968a4038b',
        idAnnual : '339202ac-3db2-4be2-93b7-6500a60af708',
        idSick : '98b462d0-673e-43a3-882c-3fef8c5cec3e',
        idMaternity : '162cd45a-9f0d-438d-9647-0b8b12ab7b8e',
        idStudy : '09865a88-2138-4203-a1b3-2e449c995cdf',
        idOrdination : 'ec460910-6a99-4837-ae43-381810c4c794',
        idAbsence : 'f3240fcc-0e99-48d5-b193-4e20d921e01b',
        idSterilization : '47c63260-7c46-4bd9-8b89-38d30f164851',
        idCompassionate : '8f7a973c-78f3-4edb-a6e2-544ce84c138c',
        idMarriage : '395d3f73-5365-4883-aaea-aebe28d45158',
        idAbsent : '8b7be7fd-a42b-44ac-9c25-74ac37715637',
        idResign : '378a0dc1-d8a8-4e97-b930-4ee25362cfd5'
    }
    let sqlAdd = "INSERT INTO `leaveQuota`(`id`, `emID`, `leaveTypeID`, `quota`, `year`) VALUES('"+uuidv4()+"', '"+req.params.id+"', '"+typeID.idPersonal+"',"+leavePersonal+", '"+yearString+"') ";
    sqlAdd += ", ('"+uuidv4()+"', '"+req.params.id+"', '"+typeID.idAnnual+"',"+leaveAnnual+", '"+yearString+"') ";
    sqlAdd += ", ('"+uuidv4()+"', '"+req.params.id+"', '"+typeID.idSick+"',"+leaveSick+", '"+yearString+"') ";
    sqlAdd += ", ('"+uuidv4()+"', '"+req.params.id+"', '"+typeID.idMaternity+"',"+leaveMaternity+", '"+yearString+"') ";
    sqlAdd += ", ('"+uuidv4()+"', '"+req.params.id+"', '"+typeID.idStudy+"',"+leaveStudy+", '"+yearString+"') ";
    sqlAdd += ", ('"+uuidv4()+"', '"+req.params.id+"', '"+typeID.idOrdination+"',"+leaveOrdination+", '"+yearString+"') ";
    sqlAdd += ", ('"+uuidv4()+"', '"+req.params.id+"', '"+typeID.idAbsence+"',"+leaveAbsence+", '"+yearString+"') ";
    sqlAdd += ", ('"+uuidv4()+"', '"+req.params.id+"', '"+typeID.idSterilization+"',"+leaveSterilization+", '"+yearString+"') ";
    sqlAdd += ", ('"+uuidv4()+"', '"+req.params.id+"', '"+typeID.idCompassionate+"',"+leaveCompassionate+", '"+yearString+"') ";
    sqlAdd += ", ('"+uuidv4()+"', '"+req.params.id+"', '"+typeID.idMarriage+"',"+leaveMarriage+", '"+yearString+"') ";
    sqlAdd += ", ('"+uuidv4()+"', '"+req.params.id+"', '"+typeID.idAbsent+"',0, '"+yearString+"') ";
    sqlAdd += ", ('"+uuidv4()+"', '"+req.params.id+"', '"+typeID.idResign+"',1, '"+yearString+"') ";
    const sqlMain = "SELECT * FROM `view_leaveQuotaTypeEmMain` WHERE `employeeID` = ? ";
    const sqlData = "SELECT * FROM `view_leaveQuotaTypeEm`  WHERE `emID` = ?";
    const sql = "SELECT * FROM `view_leaveQuotaTypeEmMain` ORDER BY `code` ASC";
    try {
        db.query(sqlMain, [req.params.id], (err, resultsMain) => {
            if (err) throw err;
            if(resultsMain[0]['leaveQuotaType'] >0 )
                {
                    db.query(sqlData, [req.params.id], (err, resultsData) => {
                        if (err) throw err;
                        resultsData.forEach(resultsD => { 
                            if( resultsD.leaveTypeID === typeID.idPersonal && resultsD.typeQuota !== leavePersonal ){ 
                                const sqlEdit = "UPDATE `leaveQuota` SET `quota`="+leavePersonal+"  WHERE `emID`='"+req.params.id+"' AND `leaveTypeID`='"+typeID.idPersonal+"' AND `year`='"+yearString+"' ;";
                                db.query(sqlEdit, (err, resultEdit) => {
                                    if (err) throw err;
                                })
                            } 
                             if( resultsD.leaveTypeID === typeID.idAnnual && resultsD.typeQuota !== leaveAnnual ){ 
                                const sqlEdit = "UPDATE `leaveQuota` SET `quota`="+leaveAnnual+"  WHERE `emID`='"+req.params.id+"' AND `leaveTypeID`='"+typeID.idAnnual+"' AND `year`='"+yearString+"' ;";
                                db.query(sqlEdit, (err, resultEdit) => {
                                    if (err) throw err;
                                })
                            } 
                            if( resultsD.leaveTypeID === typeID.idSick && resultsD.typeQuota !== leaveSick ){ 
                                const sqlEdit = "UPDATE `leaveQuota` SET `quota`="+leaveSick+"  WHERE `emID`='"+req.params.id+"' AND `leaveTypeID`='"+typeID.idSick+"' AND `year`='"+yearString+"' ;";
                                db.query(sqlEdit, (err, resultEdit) => {
                                    if (err) throw err;
                                })
                            } 
                             if( resultsD.leaveTypeID === typeID.idMaternity && resultsD.typeQuota !== leaveMaternity ){ 
                                const sqlEdit = "UPDATE `leaveQuota` SET `quota`="+leaveMaternity+"  WHERE `emID`='"+req.params.id+"' AND `leaveTypeID`='"+typeID.idMaternity+"' AND `year`='"+yearString+"' ;";
                                db.query(sqlEdit, (err, resultEdit) => {
                                    if (err) throw err;
                                })
                            } 
                            if( resultsD.leaveTypeID === typeID.idStudy && resultsD.typeQuota !== leaveStudy ){ 
                                const sqlEdit = "UPDATE `leaveQuota` SET `quota`="+leaveStudy+"  WHERE `emID`='"+req.params.id+"' AND `leaveTypeID`='"+typeID.idStudy+"' AND `year`='"+yearString+"' ;";
                                db.query(sqlEdit, (err, resultEdit) => {
                                    if (err) throw err;
                                })
                            } 
                            if( resultsD.leaveTypeID === typeID.idOrdination && resultsD.typeQuota !== leaveOrdination ){ 
                                const sqlEdit = "UPDATE `leaveQuota` SET `quota`="+leaveOrdination+"  WHERE `emID`='"+req.params.id+"' AND `leaveTypeID`='"+typeID.idOrdination+"' AND `year`='"+yearString+"' ;";
                                db.query(sqlEdit, (err, resultEdit) => {
                                    if (err) throw err;
                                })
                            } 
                            if( resultsD.leaveTypeID === typeID.idAbsence && resultsD.typeQuota !== leaveAbsence ){ 
                                const sqlEdit = "UPDATE `leaveQuota` SET `quota`="+leaveAbsence+"  WHERE `emID`='"+req.params.id+"' AND `leaveTypeID`='"+typeID.idAbsence+"' AND `year`='"+yearString+"' ;";
                                db.query(sqlEdit, (err, resultEdit) => {
                                    if (err) throw err;
                                })
                            } 
                            if( resultsD.leaveTypeID === typeID.idSterilization && resultsD.typeQuota !== leaveSterilization ){ 
                                const sqlEdit = "UPDATE `leaveQuota` SET `quota`="+leaveSterilization+"  WHERE `emID`='"+req.params.id+"' AND `leaveTypeID`='"+typeID.idSterilization+"' AND `year`='"+yearString+"' ;";
                                db.query(sqlEdit, (err, resultEdit) => {
                                    if (err) throw err;
                                })
                            } 
                            if( resultsD.leaveTypeID === typeID.idCompassionate && resultsD.typeQuota !== leaveCompassionate ){ 
                                const sqlEdit = "UPDATE `leaveQuota` SET `quota`="+leaveCompassionate+"  WHERE `emID`='"+req.params.id+"' AND `leaveTypeID`='"+typeID.idCompassionate+"' AND `year`='"+yearString+"' ;";
                                db.query(sqlEdit, (err, resultEdit) => {
                                    if (err) throw err;
                                })
                            } 
                            if( resultsD.leaveTypeID === typeID.idMarriage && resultsD.typeQuota !== leaveMarriage ){ 
                                const sqlEdit = "UPDATE `leaveQuota` SET `quota`="+leaveMarriage+"  WHERE `emID`='"+req.params.id+"' AND `leaveTypeID`='"+typeID.idMarriage+"' AND `year`='"+yearString+"' ;";
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
                }else{
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
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data into the database.' });
    }
});

module.exports = router;