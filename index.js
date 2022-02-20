const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection.js");
const dbQuery = require("./util/dbQuery");

// connect to db for error handling and initiate the app.
db.connect((err) => {
  if (err) throw err;

  console.log(`============================================================
   You are now connected to the Project Company Database!
============================================================`);

  initialPrompt();
});

// first prompt of what the user wants to do.
function initialPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "selection",
        message: "What would you like to do?",
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role", "exit application", new inquirer.Separator()],
      },
    ])
    .then((answer) => {
      const { selection } = answer;

      switch (selection) {
        case "view all departments":
          allDept();
          break;
        case "view all roles":
          allRoles();
          break;
        case "view all employees":
          allEmployees();
          break;
        case "add a department":
          addDepartment();
          break;
        case "add a role":
          addRole();
          break;
        case "add an employee":
          console.log("add an employee");
          break;
        case "update an employee role":
          console.log("update an employee role");
          break;
        case "exit application":
          process.exit();
          break;
      }
    });
}

// view all departments
async function allDept() {
  const dept = await dbQuery.viewDepartment();

  console.log(`\n`);
  console.table(dept);
  console.log(`\n`);
  initialPrompt();
}

// view all roles
async function allRoles() {
  const role = await dbQuery.viewRole();

  console.log(`\n`);
  console.table(role);
  console.log(`\n`);
  initialPrompt();
}

// view all employees.
function allEmployees() {
  const sql = `SELECT
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
  LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.log(`\n`);
    console.table(rows);
    console.log(`\n`);
    initialPrompt();
  });
}

// adding department.
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "depName",
        message: "Enter the name of the department",
        validate: (depName) => {
          if (depName.length > 0 && isNaN(depName)) {
            return true;
          } else {
            console.log("Enter a valid department name!");
            return false;
          }
        },
      },
    ])
    .then(({ depName }) => {
      const sql = `INSERT INTO department(name) VALUES (?)`;

      db.query(sql, depName, (err, result) => {
        if (err) throw err;
        console.log(`\n`);
        console.log("Department name updated to the database");
        console.log(`\n`);
        initialPrompt();
      });
    });
}

// adding role
function addRole() {
  const deptList = [];
  db.query(`SELECT * FROM department`, (err, result) => {
    if (err) throw err;
    deptList.push(result);
  });
  const modList = deptList.map(({ id, name }) => ({ name: name, value: id }));

  inquirer.prompt([
    {
      type: "input",
      name: "eName",
      message: "Enter the role name",
      validate: (eName) => {
        if (eName.length > 0 && isNaN(eName)) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the salary",
      validate: (salary) => {
        if (!isNaN(salary)) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      type: "list",
      name: "dept",
      message: "Which department does this role belongs to?",
      choices: modList,
    },
  ]);
}
