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
          "Update employee manager",
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
        case "Update employee manager":
          updateEmployeeManager();
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
    "SELECT employee.id, employee.first_name, employee.last_name, company_role.title, department.dep_name, company_role.salary, b.first_name AS manager From (((employee INNER JOIN company_role ON company_role.id = employee.role_id) INNER JOIN department ON department.id = company_role.department_id) LEFT JOIN employee b ON employee.manager_id = b.id)",
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
    "SELECT a.first_name, a.last_name, b.first_name AS manager FROM employee a LEFT JOIN employee b ON a.manager_id = b.id",
    (err, res) => {
      console.table(res);
      userOptions();
    }
  );
};

const updateAnEmployeeRole = () => {
  let tableInfo =
    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id FROM employee, company_role, department WHERE employee.role_id = company_role.id AND company_role.department_id = department.id";
  linkDB.query(tableInfo, (err, res) => {
    if (err) {
      throw err;
    } else {
      let employeeList = [];
      res.forEach((employee) => {
        employeeList.push(employee.first_name + " " + employee.last_name);

        console.log(employeeList);
        console.log(employee)
;      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeName",
            message: "Choose employee to update?",
            choices: employeeList,
          },
        ])
        .then((answer) => {
          let employeeID;
          res.forEach((employee) => {
            if (
              answer.employeeName ===
              employee.first_name + " " + employee.last_name
            ) {
              console.log(answer.employeeName);

              console.log(employee);

              employeeID = employee.id;

              console.log(employeeID);
            }
          });
          let tableInfo =
            "SELECT company_role.id, company_role.title FROM company_role";
          linkDB.query(tableInfo, (err, res) => {
            if (err) {
              throw err;
            } else {
              let companyRoles = [];
              res.forEach((role) => {
                companyRoles.push(role.title);
              });
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "newRole",
                    message: "Choose new role?",
                    choices: companyRoles,
                  },
                ])
                .then((answer) => {
                  let newEmployeeRole;
                  res.forEach((role) => {
                    if (answer.newRole === role.title) {
                      newEmployeeRole = role.id;

                      console.log(role.title);
                      console.log(newEmployeeRole);
                    }
                  });
                  let tableInfo =
                    "UPDATE employee SET employee.role_id = ? WHERE employee.id = ?";
                  linkDB.query(
                    tableInfo,
                    [newEmployeeRole, employeeID],
                    (err) => {
                      if (err) {
                        throw err;
                      } else {
                        console.log("Employee Updated ✍️");
                        userOptions();
                      }
                    });
                });
            }
          });
        });
    }
  });
};

const updateEmployeeManager = () => {
  let tableInfo =
    "SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id FROM employee";
  linkDB.query(tableInfo, (err, res) => {
    const employeeList = [];
    res.forEach((employee) => {
      employeeList.push(employee.first_name + " " + employee.last_name);
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeName",
          message: "Select employee with new manager?",
          choices: employeeList,
        },
        {
          type: "list",
          name: "manager",
          message: "Choose manager?",
          choices: employeeList,
        },
      ])
      .then((answer) => {
        console.log(answer);

        let managerID;
        let employeeID;
        res.forEach((employee) => {
          if (
            answer.employeeName ===
            employee.first_name + " " + employee.last_name
          );
          {
            employeeID = employee.id;
            console.log(employeeID);
          }
          if (
            answer.manager ===
            employee.first_name + " " + employee.last_name
          );
          {
            managerID = employee.id;
            console.log(managerID);
          }
        });

        let tableInfo =
          "UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?";
        linkDB.query(tableInfo, [managerID, employeeID], (err) => {
          if (err) {
            throw err;
          } else {
            console.log("Employee's New Manager updated. 👍");
            userOptions();
          }
        });
      });
  });
};
const allDone = () => {
  return;
};

userOptions();
