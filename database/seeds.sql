INSERT INTO department (name)
VALUES ('Sales'), ('Legal'), ('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES ('Lead Salesperson', 50000.00, 1), ('Salesperson', 40000.00, 1), ('Paralegal', 50000.00, 2), ('Lawyer', 100000.00, 2), ('Lead Software Engineer', 120000.00, 3), ('Software Engineer', 80000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Kevin', 'Johnson', 1, NULL), ('John', 'Jameson', 2, 1), ('James', 'Jackson', 3, NULL), ('Jack', 'Ericson', 4, 3), ('Eric', 'Samson', 5, NULL), ('Sam', 'Carson', 6, 5);