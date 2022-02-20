const mysql = require("mysql2");

// connect database.
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "proj_company",
});

module.exports = db;
