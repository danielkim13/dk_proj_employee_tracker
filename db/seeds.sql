INSERT INTO department (name)
VALUES 
('Sales'),
('Marketing'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES 
('Sales Person', '80000', 1),
('Lead Engineer', '150000', 3),
('Social Media Manager', '90000', 2),
('Accountant', '110000', 4),
('Lawyer', '190000', 5),
('Software Engineer', '130000', 3),
('Lead Marketer', ' 130000', 2),
('Data Scientist', '132000', 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Mike', 'Rodriguez', '3', '2'),
('Andrew', 'Smith', '7', NULL),
('Kevin', 'Collins', '2', NULL),
('Susan', 'Kratzer', '8', '3'),
('Megan', 'Wendell', '2', '3'),
('Tom', 'Cotton', '1', '2');