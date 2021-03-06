CREATE DATABASE employees;

USE employees;

CREATE TABLE department(
id INTEGER AUTO_INCREMENT NOT NULL,
name VARCHAR(30) NOT NULL,

PRIMARY KEY (id)
);

CREATE TABLE role(
id INTEGER AUTO_INCREMENT NOT NULL,
title VARCHAR(30) NOT NULL,
salary DECIMAL(20,2) NOT NULL,
department_id INTEGER REFERENCES department(id),

PRIMARY KEY (id)
);

CREATE TABLE employee(
id INTEGER AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER REFERENCES role(id),
manager_id INTEGER REFERENCES employee(id),

PRIMARY KEY (id)
);