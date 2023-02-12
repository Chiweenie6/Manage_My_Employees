-- Data to go into "department" table
INSERT INTO department (dep_name)
VALUES ("Store"),
       ("Grooming");

-- Data to go into "company_role" table
INSERT INTO company_role (title, salary, department_id)
VALUES ("Manager", 60000, 1),
       ("Pet Care", 25000, 1),
       ("Stylist", 35000, 2),
       ("Bather", 25000, 2);

-- Data to go into "employee" table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tod", "Smith", 1, NULL),
       ("Lily", "Roberts", 2, 1),
       ("Julie", "Jones", 3, 2),
       ("Kodi", "West", 4, 2);