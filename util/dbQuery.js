const db = require("../db/connection");
const util = require("util");

// without util module, this.db.query doesn't work
db.query = util.promisify(db.query);

class dbQuery {
  constructor(db) {
    this.db = db;
  }
  // method to view all the department table.
  viewDepartment() {
    return this.db.query(`SELECT 
        department.id AS department_id, 
        department.name AS department_name 
        FROM department`);
  }
  // method to view all role table.
  viewRole() {
    return this.db.query(`SELECT 
      role.id AS role_id, 
      role.title AS job_title, 
      role.salary, 
      department.name AS department_name 
      FROM role 
      LEFT JOIN department ON role.department_id = department.id`);
  }
  // method to view all employee table.
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
  // method to add department
  addDept(deptName) {
    return this.db.query(`INSERT INTO department SET ?`, deptName);
  }
  // method to view department for the addRole method. redundancy but this one doesn't modify the column names.
  viewAllDept() {
    return this.db.query(`SELECT * FROM department`);
  }
  // method to add role.
  addRole(answer) {
    return this.db.query(`INSERT INTO role SET ?`, answer);
  }
  // method to add new employee
  addEmployee(eAnswer) {
    return this.db.query(`INSERT INTO employee SET ?`, eAnswer);
  }
  // method for supporting addEmployee method.
  modRole() {
    return this.db.query(`SELECT role.id, role.title FROM role`);
  }
  // method for supporting addEmployee method
  modEmp() {
    return this.db.query(`SELECT employee.id, CONCAT(employee.first_name,' ',employee.last_name) AS manager FROM employee`);
  }

  // method updating employee role.
  modEmployeeRole(roleId, empId) {
    return this.db.query(`UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`, [roleId, empId]);
  }

  allEmp() {
    return this.db.query(`SELECT employee.id, CONCAT(employee.first_name,' ',employee.last_name) AS full_name FROM employee`);
  }

  allRol() {
    return this.db.query(`SELECT role.id, role.title FROM role`);
  }

  // method to change manager name.
  modEmpManager(manId, empId) {
    return this.db.query(`UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`, [manId, empId]);
  }

  //   method to view employees by selecting a manager.
  viewEmpByMan(managerId) {
    return this.db.query(
      `SELECT
    CONCAT(manager.first_name,' ',manager.last_name) AS manager,
    CONCAT(employee.first_name,' ',employee.last_name) AS full_name,
    role.title AS job_title,
    department.name AS department,
    role.salary AS salary
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    WHERE employee.manager_id = ?`,
      managerId
    );
  }

  //   method to view employees by selecting a department.
  viewEmpByDept(departmentId) {
    return this.db.query(
      `SELECT 
    department.name AS department,
    CONCAT(employee.first_name,' ',employee.last_name) AS full_name,
    role.title AS job_title
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    WHERE role.department_id = (SELECT department.id FROM department WHERE department.id = ?)`,
      departmentId
    );
  }

  //   method to delete a department.
  deleteDept(departmentId) {
    return this.db.query(`DELETE FROM department WHERE id = ?`, departmentId);
  }
}

module.exports = new dbQuery(db);
