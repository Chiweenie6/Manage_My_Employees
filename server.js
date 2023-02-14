const linkDB = require("./config/connection");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const { INTEGER } = require("sequelize");

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
        name: "dep_name",
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
      let tableInfo = "INSERT INTO department (dep_name) VALUES (?)";
      linkDB.query(tableInfo, answer.dep_name, (err, res) => {
        if (err) {
          throw err;
        } else {
          console.log(answer.dep_name + " added to department table.");
        }
      });
      userOptions();
    });
};

const addARole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Input position title?",
        validate: (input) => {
          if (input === "") {
            return "Must enter valid department";
          }
          return true;
        },
      },
      {
        type: "number",
        name: "salary",
        message: "Position salary?",
        validate: (input) => {
          if (input === "") {
            return "Must enter a numbered salary.";
          }
          return true;
        },
      },
      {
        type: "number",
        name: "department_id",
        message: "Department ID?",
        validate: (input) => {
          if (input === "") {
            return "Must enter a numbered ID.";
          }
          return true;
        },
      },
    ])
    .then((answer) => {
      let tableInfo =
        "INSERT INTO company_role (title, salary, department_id) VALUES (?, ?, ?)";
      linkDB.query(
        tableInfo,
        [answer.title, answer.salary, answer.department_id],
        (err, res) => {
          if (err) {
            throw err;
          } else {
            console.log(answer.title + " added to company_role table.");
          }
        }
      );
      userOptions();
    });
};

const addAnEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Employee first name?",
        validate: (input) => {
          if (input === "") {
            return "Must enter valid first name";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "last_name",
        message: "Employee last name?",
        validate: (input) => {
          if (input === "") {
            return "Must enter valid last name.";
          }
          return true;
        },
      },
      {
        type: "number",
        name: "role_id",
        message: "Role ID?",
        validate: (input) => {
          if (input === "") {
            return "Must enter a numbered role ID.";
          }
          return true;
        },
      },
      {
        type: "number",
        name: "manager_id",
        message: "Manager ID?",
        validate: (input) => {
          if (input === "") {
            return "Must enter a valid ID, enter 0 if no manager.";
          } else {
            if (input === 0) {
              return null;
            }
          }
          return true;
        },
      },
    ])
    .then((answer) => {
      let tableInfo =
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
      linkDB.query(
        tableInfo,
        [
          answer.first_name,
          answer.last_name,
          answer.role_id,
          answer.manager_id,
        ],
        (err, res) => {
          if (err) {
            throw err;
          } else {
            console.log(answer.first_name + " added to employee table.");
          }
        }
      );
      userOptions();
    });
};

const deleteThings = () => {};

const viewAllDepartments = () => {
  linkDB.query("SELECT * FROM department", (err, res) => {
    console.table(res);
    userOptions();
  });
};

const viewAllEmployees = () => {
  linkDB.query(
    "SELECT employee.id, employee.first_name, employee.last_name, company_role.title, department.dep_name, company_role.salary, employee.manager_id From ((employee INNER JOIN company_role ON company_role.id = employee.role_id) INNER JOIN department ON department.id = company_role.department_id)",
    (err, res) => {
      console.table(res);
      userOptions();
    }
  );
};

const viewAllRoles = () => {
  linkDB.query(
    "SELECT company_role.id, company_role.title, department.dep_name, company_role.salary From company_role INNER JOIN department ON department.id = company_role.department_id",
    (err, res) => {
      console.table(res);
      userOptions();
    }
  );
};

const viewCombinedSalaries = () => {
  linkDB.query(
    "SELECT department.id, department.dep_name, SUM(salary) AS total_salary FROM company_role INNER JOIN department ON department.id = company_role.department_id GROUP BY company_role.department_id",
    (err, res) => {
      console.table(res);
      userOptions();
    }
  );
};

const viewEmployeesByDepartment = () => {
  linkDB.query(
    "SELECT employee.first_name, employee.last_name, department.dep_name FROM ((employee LEFT JOIN company_role ON company_role.id = employee.role_id) LEFT JOIN department ON department.id = company_role.department_id)",
    (err, res) => {
      console.table(res);
      userOptions();
    }
  );
};

const viewEmployeesByManager = () => {
  linkDB.query(
    "SELECT a.first_name, a.last_name, b.first_name AS manager FROM employee a INNER JOIN employee b ON a.manager_id = b.id",
    (err, res) => {
      console.table(res);
      userOptions();
    }
  );
};

const updateAnEmployeeRole = () => {};

const updateEmployeeManagers = () => {};

const allDone = () => {
  return;
};

userOptions();
