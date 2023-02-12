-- Removes mockup comany_db and creates new company_db
DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

-- Makes "department" table inside company_db
CREATE TABLE department (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  dep_name VARCHAR(30) NOT NULL
);

-- Makes "company_role" table inside company_db
CREATE TABLE company_role (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(20, 2) NOT NULL,
  department_id INT NOT NULL
  REFERENCES department(id)
);

-- Makes "employee" table inside company_db
CREATE TABLE employee (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL
  REFERENCES company_role(id),
  manager_id INT
  REFERENCES employee(id)
  ON DELETE CASCADE
);