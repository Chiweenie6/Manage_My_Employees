const linkDB = require("./config/connection");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

linkDB.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("Let's Begin 😁.");
  }
});

const userOptions = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "option",
        message: "What would you like to do?",
        choices: [
          "Add a department",
          "Add a role",
          "Add an employee",
          "Delete departments, roles and employees",
          "View all departments",
          "View all employees",
          "View all roles",
          "View combined salaries by department",
          "View employees by department",
          "View employees by manager",
          "Update an employee role",
          "Update employee managers",
          "All Done 🛑",
        ],
      },
    ])
    .then((input) => {
      switch (input.option) {
        case "Add a department":
          addADepartment();
          break;
        case "Add a role":
          addARole();
          break;
        case "Add an employee":
          addAnEmployee();
          break;
        case "Delete departments, roles and employees":
          deleteThings();
          break;
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View combined salaries by department":
          viewCombinedSalaries();
          break;
        case "View employees by department":
          viewEmployeesByDepartment();
          break;
        case "View employees by manager":
          viewEmployeesByManager();
          break;
        case "Update an employee role":
          updateAnEmployeeRole();
          break;
        case "Update employee managers":
          updateEmployeeManagers();
          break;
        case "All Done":
          allDone();
      }
    });
};

const addADepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDep",
        message: "Input new department name?",
        validate: (input) => {
          if (input === "") {
            return "Must enter valid department";
          }
          return true;
        },
      },
    ])
    .then((answer) => {
      let tableInfo = `INSERT INTO department (dep_name) VALUES (?)`;
      linkDB.query(tableInfo, answer.newDep, (err, res) => {
        if (err) {
          throw err;
        } else {
          console.log(answer.newDep + res);
        }
      });
      userOptions();
    });
};

const addARole = () => {
  
};

const addAnEmployee = () => {};

const deleteThings = () => {};

const viewAllDepartments = () => {
  linkDB.query("SELECT * FROM department", (err, res) => {
    console.table(res);
    userOptions();
  });
};

const viewAllEmployees = () => {
  linkDB.query("SELECT * FROM employee", (err, res) => {
    console.table(res);
    userOptions();
  })
};

const viewAllRoles = () => {
  linkDB.query("SELECT * FROM company_role", (err, res) => {
    console.table(res);
    userOptions();
  })
};

const viewCombinedSalaries = () => {};

const viewEmployeesByDepartment = () => {};

const viewEmployeesByManager = () => {};

const updateAnEmployeeRole = () => {};

const updateEmployeeManagers = () => {};

const allDone = () => {};

userOptions();
