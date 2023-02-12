DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;


CREATE TABLE department (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  dep_name VARCHAR(30) NOT NULL
);

CREATE TABLE company_role (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id)
  REFERENCES department(id)
);

CREATE TABLE employee (
  id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL
  REFERENCES company_role(id),
  manager_id INT,
  FOREIGN KEY (role_id)
  REFERENCES employee(id)
  ON DELETE CASCADE
);