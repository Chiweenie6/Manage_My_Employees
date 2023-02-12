const express = require("express");
const sequelize = require("./config/connection");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Response when input is incorrect
app.use((req, res) => {
  res.status(404).end();
});

// Turn the db connection on
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});

const whatToDo = () => {
  const userOptions = () => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "option",
          message: "What would you like to do?",
          choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
          ],
        },
      ])
      .then((input) => {
        switch (input.option) {
          case "View all departments":
            viewAllDepartments();
            break;
          case "View all roles":
            viewAllRoles();
            break;
          case "View all employees":
            viewAllEmployees();
            break;
          case "Add a department":
            addADepartment();
            break;
          case "Add a role":
            addARole();
            break;
          case "Add an enployee":
            addAnEmployee();
            break;
          case "Update an employee role":
            updateAnEmployeeRole();
            break;
        }
      });
  };
};
