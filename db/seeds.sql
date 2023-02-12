INSERT INTO department (dep_name)
VALUES ("Store"),
       ("Grooming");

INSERT INTO company_role (title, salary, department_id)
VALUES ("Manager", 60000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tod", "Smith", 10, 0);