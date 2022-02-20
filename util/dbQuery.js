const db = require("../db/connection");
const util = require("util");

// without util module, this.db.query doesn't work
db.query = util.promisify(db.query);

class dbQuery {
  constructor(db) {
    this.db = db;
  }

  viewDepartment() {
    return this.db.query(`SELECT 
        department.id AS department_id, 
        department.name AS department_name 
        FROM department`);
  }

  viewRole() {
    return this.db.query(`SELECT 
      role.id AS role_id, 
      role.title AS job_title, 
      role.salary, 
      department.name AS department_name 
      FROM role 
      LEFT JOIN department ON role.department_id = department.id`);
  }
}

module.exports = new dbQuery(db);
