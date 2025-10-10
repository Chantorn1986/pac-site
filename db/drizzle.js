const { drizzle } = require("drizzle-orm/mysql2") ;
const mysql = require("mysql2/promise");
const dbConfig  = require('../config/dbconfig.js');

const poolConnection = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  password: dbConfig.password
});
const db = drizzle({ client: poolConnection });

module.exports = db;

