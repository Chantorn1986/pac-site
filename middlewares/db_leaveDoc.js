const moment = require('moment');
let sql_insert_leaveDoc_full = "INSERT INTO `leaveDoc`(`id`, `doc`, `no`, `date`, `docTypeID`, `emID`, `startDate`, `endDate`, `hatfDate`, `status`, `leaveDays`, `remark`, `remarkHR`, `file`, `contact`, `statusAppHead`, `dateAppHead`, `nameAppHead`, `statusAppHR`, `dateAppHR`, `nameAppHR`, `statusAppMD`, `dateAppMD`, `nameAppMD`, `createdAt`, `updatedAt`) ";
sql_insert_leaveDoc_full += "VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]','[value-7]','[value-8]','[value-9]','[value-10]','[value-11]','[value-12]','[value-13]','[value-14]','[value-15]','[value-16]','[value-17]','[value-18]','[value-19]','[value-20]','[value-21]','[value-22]','[value-23]','[value-24]','[value-25]','[value-26]')";

// let sql_insert_leaveDoc_user = "INSERT INTO `leaveDoc`(`id`, `doc`, `no`, `date`, `docTypeID`, `emID`, `startDate`, `endDate`, `hatfDate`, `status`, `leaveDays`, `remark`, `file`, `contact`, `statusAppHead`, `dateAppHead`, `nameAppHead`, `statusAppHR`, `nameAppHR`, `statusAppMD`, `nameAppMD`, `createdAt`) ";
// sql_leaveDoc_full += "VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]','[value-7]','[value-8]','[value-9]','[value-10]','[value-11]','[value-12]','[value-13]','[value-14]','[value-15]','[value-16]','[value-17]','[value-18]','[value-19]','[value-20]','[value-21]','[value-22]')";

let sql_insert_leaveDoc_user = "INSERT INTO `leaveDoc`(`id`, `doc`, `no`, `date`, `docTypeID`, `emID`, `startDate`, `endDate`, `hatfDate`, `status`, `leaveDays`, `remark`, `file`, `contact`, `statusAppHead`, `dateAppHead`, `nameAppHead`, `statusAppHR`, `nameAppHR`, `statusAppMD`, `nameAppMD`, `createdAt`) ";
sql_insert_leaveDoc_user += "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

let sql_update_leaveDoc_user = "UPDATE `leaveDoc` SET `doc`=?,`no`=?,`date`=?,`docTypeID`=?,`emID`=?,`startDate`=?,`endDate`=?, `hatfDate`=?,`status`=?,`leaveDays`=?,`remark`=?,`file`=?"
sql_update_leaveDoc_user += ",`contact`=?,`statusAppHead`=?,`nameAppHead`=?,`statusAppHR`=?,`nameAppHR`=?,`statusAppMD`=?,`nameAppMD`=?,`updatedAt`=? WHERE `id`=?"

let sql_delete_leaveDoc_user = "DELETE FROM `leaveDoc` WHERE `id`=? ";

let sql_view_leaveDoc_full = "SELECT `id`, `doc`, `no`, `date`, `docTypeID`, `emID`, `startDate`, `endDate`, `hatfDate`, `status`, `leaveDays`, `remark`, `remarkHR`, `file`, `contact`, `statusAppHead`, `dateAppHead`, `nameAppHead`, `statusAppHR`, `dateAppHR`, `nameAppHR`, `statusAppMD`, `dateAppMD`, `nameAppMD` "
sql_view_leaveDoc_full += ", DATE_FORMAT(`createdAt`, '%d/%m/%Y %H:%i:%s') as `createdAt`,DATE_FORMAT(`updatedAt`, '%d/%m/%Y %H:%i:%s') as `updatedAt` FROM `leaveDoc` WHERE 1";

const coverDate = {
  date: null,
  startDate: null,
  endDate: null,
  createdAt: null,
  updatedAt: null

}
if (results[0]['date']) {
  if (results[0]['date'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
    coverDate.date = moment(results[0]['date']).format();
  }
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
if (results[0]['createdAt']) {
  if (results[0]['createdAt'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
    coverDate.createdAt = moment(results[0]['createdAt']).format('YYYY-MM-DD');
  }
}
if (results[0]['updatedAt']) {
  if (results[0]['updatedAt'].toString() !== "Thu Nov 30 1899 00:00:00 GMT+0642 (เวลาอินโดจีน)") {
    coverDate.updatedAt = moment(results[0]['updatedAt']).format('YYYY-MM-DD');
  }
}

const today = new Date();
const timestamp = moment(today).format();

const now = new Date();
const dateString = moment(now).format('YYYY-MM-DD');

const statusApp = ["รออนุมัติ", "อนุมัติ", "ไม่อนุมัติ"]
const statusAppH = ["รอ Leader อนุมัติ", "รอ HR อนุมัติ", "รอ MD อนุมัติ", "ไม่อนุมัติ", "อนุมัติสำเร็จ"]