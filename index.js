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
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "view employees by a department",
          "view employees by a manager",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
          "update an employee manager",
          "delete a department",
          "delete a role",
          "delete an employee",
          "exit application",
          new inquirer.Separator(),
        ],
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
        case "view employees by a department":
          viewEmpByDept();
          break;
        case "view employees by a manager":
          viewEmpByManager();
          break;
        case "add a department":
          addDepartment();
          break;
        case "add a role":
          addRole();
          break;
        case "add an employee":
          addEmployee();
          break;
        case "update an employee role":
          updateEmpRole();
          break;
        case "update an employee manager":
          updateEmpMan();
          break;
        case "delete a department":
          deleteDept();
          break;
        case "delete a role": 
          deleteRole();
          break;
        case "delete an employee": //TODO write it
          deleteEmp();
          break;
        case "exit application":
          console.log("Application session ended. Thank you!");
          process.exit();
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
async function allEmployees() {
  const emp = await dbQuery.viewEmployee();

  console.log(`\n`);
  console.table(emp);
  console.log(`\n`);
  initialPrompt();
}

// view employees by a department.
async function viewEmpByDept() {
  const dept = await dbQuery.viewAllDept();
  const deptList = dept.map(({ id, name }) => ({ name: name, value: id }));

  const userAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "dept",
      message: "Select a department",
      choices: deptList,
    },
  ]);

  const empByDept = await dbQuery.viewEmpByDept(userAnswer.dept);
  console.log(`\n`);
  console.table(empByDept);
  console.log(`\n`);
  initialPrompt();
}

// view employees by a manager.
async function viewEmpByManager() {
  const emp = await dbQuery.allEmp();
  const manList = emp.map(({ id, full_name }) => ({ name: full_name, value: id }));

  const userAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "manager",
      message: "Select a manager",
      choices: manList,
    },
  ]);

  const empByMan = await dbQuery.viewEmpByMan(userAnswer.manager);
  console.log(`\n`);
  console.table(empByMan);
  console.log(`\n`);
  initialPrompt();
}

// adding department.
async function addDepartment() {
  const deptName = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter the name of the department",
      validate: (name) => {
        if (name.length > 0 && isNaN(name)) {
          return true;
        } else {
          console.log("Enter a valid department name!");
          return false;
        }
      },
    },
  ]);
  await dbQuery.addDept(deptName);
  console.log(`\n`);
  console.log("Department has been added to the database");
  console.log(`\n`);
  initialPrompt();
}

// adding role
async function addRole() {
  const dept = await dbQuery.viewAllDept();
  const deptList = dept.map(({ id, name }) => ({ name: name, value: id }));

  const roleAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter the role name",
      validate: (title) => {
        if (title.length > 0 && isNaN(title)) {
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
      name: "department_id",
      message: "Which department does this role belongs to?",
      choices: deptList,
    },
  ]);

  await dbQuery.addRole(roleAnswer);
  console.log(`\n`);
  console.log("Role has been added to the database");
  console.log(`\n`);
  initialPrompt();
}
// add employee
async function addEmployee() {
  const dispRole = await dbQuery.modRole();
  const roleList = dispRole.map(({ id, title }) => ({ name: title, value: id }));

  const dispEmp = await dbQuery.modEmp();
  const manList = dispEmp.map(({ id, manager }) => ({ name: manager, value: id }));

  const employeeAnswer = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "Enter new employee's first name",
      validate: (firstName) => {
        if (firstName.length > 0 && isNaN(firstName)) {
          return true;
        } else {
          console.log("Enter valid first name!");
          return false;
        }
      },
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter new employee's last name",
      validate: (lastName) => {
        if (lastName.length > 0 && isNaN(lastName)) {
          return true;
        } else {
          console.log("Enter valid last name!");
          return false;
        }
      },
    },
    {
      type: "list",
      name: "role_id",
      message: "select the employee's role",
      choices: roleList,
    },
    {
      type: "list",
      name: "manager_id",
      message: "Select the employee's manager",
      choices: manList,
    },
  ]);
  await dbQuery.addEmployee(employeeAnswer);
  console.log(`\n`);
  console.log("Employee has been added to the database");
  console.log(`\n`);
  initialPrompt();
}
// update employee role
async function updateEmpRole() {
  const emp = await dbQuery.allEmp();
  const empList = emp.map(({ id, full_name }) => ({ name: full_name, value: id }));

  const empId = await inquirer.prompt([
    {
      type: "list",
      name: "id",
      message: "Select the employee to change role",
      choices: empList,
    },
  ]);

  const role = await dbQuery.allRol();
  const roleList = role.map(({ id, title }) => ({ name: title, value: id }));

  const roleId = await inquirer.prompt([
    {
      type: "list",
      name: "role_id",
      message: "Select the employee's role",
      choices: roleList,
    },
  ]);
  console.log(roleId.role_id);

  await dbQuery.modEmployeeRole(roleId.role_id, empId.id);
  console.log(`\n`);
  console.log("Employee's role has been updated to the database");
  console.log(`\n`);
  initialPrompt();
}
// update employee manager
async function updateEmpMan() {
  const emp = await dbQuery.allEmp();
  const empList = emp.map(({ id, full_name }) => ({ name: full_name, value: id }));

  const man = await dbQuery.modEmp();
  const manList = man.map(({ id, manager }) => ({ name: manager, value: id }));

  const userAnswers = await inquirer.prompt([
    {
      type: "list",
      name: "empId",
      message: "Select employee to change his/her manager",
      choices: empList,
    },
    {
      type: "list",
      name: "manId",
      message: "Select the employee's manager",
      choices: manList,
    },
  ]);
  await dbQuery.modEmpManager(userAnswers.manId, userAnswers.empId);

  console.log(`\n`);
  console.log("Employee manager has been updated to the database");
  console.log(`\n`);
  initialPrompt();
}

// delete a department.
async function deleteDept() {
  const dept = await dbQuery.viewAllDept();
  const deptList = dept.map(({ id, name }) => ({ name: name, value: id }));

  const deptAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "dept",
      message: "Select a department to delete",
      choices: deptList,
    },
  ]);

  await dbQuery.deleteDept(deptAnswer.dept);

  console.log(`\n`);
  console.log("The department has been deleted");
  console.log(`\n`);
  initialPrompt();
}

// delete a role.
async function deleteRole() {
  const role = await dbQuery.modRole();
  const roleList = role.map(({ id, title }) => ({ name: title, value: id }));

  const roleAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "role",
      message: "Select a role to delete",
      choices: roleList,
    },
  ]);

  await dbQuery.deleteRole(roleAnswer.role);

  console.log(`\n`);
  console.log("The role has been deleted");
  console.log(`\n`);
  initialPrompt();
}
