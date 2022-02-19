const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection.js");

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
          allDepartment();
          break;
        case "view all roles":
          console.log("view all roles");
          break;
        case "view all employees":
          console.log("view all employees");
          break;
        case "add a department":
          console.log("add a department");
          break;
        case "add a role":
          console.log("add a role");
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

function allDepartment() {
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.log(`\n`);
    console.table(rows);
    console.log(`\n`);
    initialPrompt();
  });
}
