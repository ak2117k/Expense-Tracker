const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Aryan@420",
  database: "finance_tracker",
});

module.exports = db;
