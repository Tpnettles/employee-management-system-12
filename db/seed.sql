use employees_db;

INSERT INTO department 
    (name)
VALUES 
    ("Engineering"),
    ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Senior engineer", 175,000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jacob", "Marc", 1, NULL);
