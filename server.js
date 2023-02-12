const linkDatabase = require("./config/connection");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

linkDatabase.connect((err) => {
  if (err) {
    throw err;
} else {
  console.log("Let's Begin 😁. What would you like to do?")
}
)

const whatToDo = () => {
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
            "View combined salaries by department",
            "View all departments",
            "View all employees",
            "View all roles",
            "View employees by department",
            "View employees by manager",
            "Update an employee role",
            "Update employee managers",
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

  const viewAllDepartments = () => {
    const findAllDepartments = `SELECT department.id AS id,
    dep_name as department from department`;
    sequelize.promise().query(findAllDepartments, (err, res) => {
      if (err) { 
        throw err;
      } else {
      console.table(res);
      whatToDo();
      }
    });
  };
};
