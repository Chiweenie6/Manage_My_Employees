const linkDB = require("./config/connection");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const { INTEGER, NUMBER, DECIMAL } = require("sequelize");

// Connect to database
linkDB.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("Let's Begin 😁.");
  }
});

// Shows the user all options and gives the ability to choose what to do
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
          "Delete a department",
          "Delete a role",
          "Delete an employee",
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
        case "Delete a department":
          deleteADepartment();
          break;
        case "Delete a role":
          deleteARole();
          break;
        case "Delete an employee":
          deleteAnEmployee();
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

// Add new department to table
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

// Add new job position to table
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
        type: "input",
        name: "salary",
        message: "Position salary?",
        validate: (input) => {
          let notNumber = isNaN(parseInt(input));
          if (notNumber) {
            return "Must enter a numbered salary.";
          }
          return true;
        },
      },
    ])
    .then((answer) => {
      const newRole = [answer.title, answer.salary];
      let tableInfo =
        "SELECT department.id, department.dep_name FROM department";
      linkDB.query(tableInfo, (err, info) => {
        if (err) {
          throw err;
        } else {
          const roleDepartment = info.map(({ id, dep_name }) => ({
            name: dep_name,
            value: id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "department",
                message: "Department role belongs to?",
                choices: roleDepartment,
              },
            ])
            .then((answer) => {
              const roleDepartment = answer.department;
              newRole.push(roleDepartment);
              let tableInfo =
                "INSERT INTO company_role (title, salary, department_id) VALUES (?, ?, ?)";
              linkDB.query(tableInfo, newRole, (err) => {
                if (err) {
                  throw err;
                } else {
                  console.log("New Role added. 👍");
                  userOptions();
                }
              });
            });
        }
      });
    });
};

// Add new employee to table
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
    ])
    .then((answer) => {
      const newEmployee = [answer.first_name, answer.last_name];
      let tableInfo =
        "SELECT company_role.id, company_role.title FROM company_role";
      linkDB.query(tableInfo, (err, info) => {
        if (err) {
          throw err;
        } else {
          const employeeRoles = info.map(({ id, title }) => ({
            name: title,
            value: id,
          }));
          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "Choose new employee's position?",
                choices: employeeRoles,
              },
            ])
            .then((answer) => {
              let newEmployeeRole = answer.role;
              newEmployee.push(newEmployeeRole);
              let tableInfo = "SELECT * FROM employee";
              linkDB.query(tableInfo, (err, info) => {
                if (err) {
                  throw err;
                } else {
                  const managers = info.map(
                    ({ id, first_name, last_name }) => ({
                      name: first_name + " " + last_name,
                      value: id,
                    })
                  );
                  inquirer
                    .prompt([
                      {
                        type: "list",
                        name: "manager",
                        message: "Who is the employee's manager?",
                        choices: managers,
                      },
                    ])
                    .then((answer) => {
                      const employeeManager = answer.manager;
                      newEmployee.push(employeeManager);
                      let tableInfo =
                        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                      linkDB.query(tableInfo, newEmployee, (err) => {
                        if (err) {
                          throw err;
                        } else {
                          console.log("New Employee added. 👍");
                          userOptions();
                        }
                      });
                    });
                }
              });
            });
        }
      });
    });
};

const deleteADepartment = () => {
  let tableInfo = "SELECT department.id, department.dep_name FROM department";
  linkDB.query(tableInfo, (err, res) => {
    if (err) {
      throw err;
    } else {
      let departmentList = [];
      res.forEach((department) => {
        departmentList.push(department.dep_name);
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "departmentName",
            message: "Select department to remove?",
            choices: departmentList,
          },
        ])
        .then((answer) => {
          let departmentID;
          res.forEach((department) => {
            if (answer.departmentName === department.dep_name) {
              departmentID = department.id;
            }
          });
          let tableInfo = "DELETE FROM department WHERE department.id = ?";
          linkDB.query(tableInfo, [departmentID], (err) => {
            if (err) {
              throw err;
            } else {
              console.log("Selected department Deleted. 🔥");
              userOptions();
            }
          });
        });
    }
  });
};

// Delete selected role from the tables
const deleteARole = () => {
  let tableInfo =
    "SELECT company_role.id, company_role.title FROM company_role";
  linkDB.query(tableInfo, (err, res) => {
    if (err) {
      throw err;
    } else {
      let roleList = [];
      res.forEach((role) => {
        roleList.push(role.title);
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "role",
            message: "Select company role to remove?",
            choices: roleList,
          },
        ])
        .then((answer) => {
          let roleID;
          res.forEach((role) => {
            if (answer.role === role.title) {
              roleID = role.id;
            }
          });
          let tableInfo = "DELETE FROM company_role WHERE company_role.id = ?";
          linkDB.query(tableInfo, [roleID], (err) => {
            if (err) {
              throw err;
            } else {
              console.log("Selected role Deleted. 🔥");
              userOptions();
            }
          });
        });
    }
  });
};

// Delete selected employee from table
const deleteAnEmployee = () => {
  let tableInfo =
    "SELECT employee.id, employee.first_name, employee.last_name FROM employee";
  linkDB.query(tableInfo, (err, res) => {
    if (err) {
      throw err;
    } else {
      let employeeList = [];
      res.forEach((employee) => {
        employeeList.push(employee.first_name + " " + employee.last_name);
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "employeeName",
            message: "Select employee to remove?",
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
              employeeID = employee.id;
            }
          });
          let tableInfo = "DELETE FROM employee WHERE employee.id = ?";
          linkDB.query(tableInfo, [employeeID], (err) => {
            if (err) {
              throw err;
            } else {
              console.log("Selected Employee Deleted. 🔥");
              userOptions();
            }
          });
        });
    }
  });
};

// View all departments
const viewAllDepartments = () => {
  linkDB.query(
    "SELECT department.id AS ID, department.dep_name AS Department FROM department ORDER by department.id ASC",
    (err, res) => {
      console.table(res);
      userOptions();
    }
  );
};

// View all employees; showing id, name, job title, department, salary, manager
const viewAllEmployees = () => {
  linkDB.query(
    "SELECT employee.id AS ID, employee.first_name AS FirstName, employee.last_name AS LastName, company_role.title AS Position, department.dep_name AS Department, company_role.salary AS Salary, b.first_name AS Manager From (((employee INNER JOIN company_role ON company_role.id = employee.role_id) INNER JOIN department ON department.id = company_role.department_id) LEFT JOIN employee b ON employee.manager_id = b.id) ORDER by employee.id ASC",
    (err, res) => {
      console.table(res);
      userOptions();
    }
  );
};

// View all company roles; showing role Id, job title, department, salary
const viewAllRoles = () => {
  linkDB.query(
    "SELECT company_role.id AS ID, company_role.title AS Position, department.dep_name AS Department, company_role.salary AS Salary From company_role INNER JOIN department ON department.id = company_role.department_id ORDER by company_role.id ASC",
    (err, res) => {
      console.table(res);
      userOptions();
    }
  );
};

// View the total combined salaries of each department
const viewCombinedSalaries = () => {
  linkDB.query(
    "SELECT department.id AS ID, department.dep_name AS Departmment, SUM(salary) AS Total_Salary FROM company_role INNER JOIN department ON department.id = company_role.department_id GROUP BY company_role.department_id",
    (err, res) => {
      console.table(res);
      userOptions();
    }
  );
};

// View all employee's ordered by department
const viewEmployeesByDepartment = () => {
  linkDB.query(
    "SELECT employee.first_name AS FirstName, employee.last_name AS LastName, department.dep_name AS Department FROM ((employee LEFT JOIN company_role ON company_role.id = employee.role_id) LEFT JOIN department ON department.id = company_role.department_id)",
    (err, res) => {
      console.table(res);
      userOptions();
    }
  );
};

// View all employees ordered by their manager
const viewEmployeesByManager = () => {
  linkDB.query(
    "SELECT a.first_name AS FirstName, a.last_name AS LastName, b.first_name AS Manager FROM employee a LEFT JOIN employee b ON a.manager_id = b.id",
    (err, res) => {
      console.table(res);
      userOptions();
    }
  );
};

// Update a current employee's role.
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
      });
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
              employeeID = employee.id;
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
                    }
                  );
                });
            }
          });
        });
    }
  });
};

// Update a current employee's manager
const updateEmployeeManager = () => {
  let tableInfo =
    "SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id FROM employee";
  linkDB.query(tableInfo, (err, res) => {
    if (err) {
      throw err;
    } else {
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
            ) {
              employeeID = employee.id;
              console.log(employeeID + "💡");
            }
            if (
              answer.manager ===
              employee.first_name + " " + employee.last_name
            ) {
              managerID = employee.id;
              console.log(managerID + "👀");
            }
          });

          let tableInfo =
            "UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?";
          linkDB.query(tableInfo, [managerID, employeeID], (err) => {
            if (err) {
              throw err;
            } else {
              console.log("Employee's New Manager updated. ✍️");
              userOptions();
            }
          });
        });
    }
  });
};

const allDone = () => {
  return;
};

userOptions();
