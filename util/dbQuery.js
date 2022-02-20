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

  viewEmployee() {
    return this.db.query(`SELECT
      employee.id AS employee_id,
      employee.first_name,
      employee.last_name,
      role.title AS job_title,
      department.name AS department,
      role.salary AS salary,
      CONCAT(manager.first_name,' ',manager.last_name) AS manager
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id`);
  }

  addDept(deptName) {
    return this.db.query(`INSERT INTO department SET ?`, deptName);
  }
}

module.exports = new dbQuery(db);
