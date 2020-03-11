const inquirer = require('inquirer');
const mysql = require('mysql');
const 

inquirer
    .prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'task',
        choices: [
            'View All Employees', 
            'View All Employees By Role', 
            'View All Employees By Manager', 
            'Add Employee', 
            'Remove Employee', 
            'Update Employee Role', 
            'Update Employee Manager', 
            'View All Roles', 
            'Add Role', 
            'Remove Role', 
            'Exit']
    }).then((answer) => {
        switch (answer.task) {
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;            
            case 'Update Employee Role':
                updateEmployeeRole();
                break;        
            case 'View All Roles':
                viewRoles();
                break;        
            case 'Add Role':
                addRole();
                break;        
            case 'View All Departments':
                viewDepartments();
                break;
            case 'Add Department':
                addDepartments();
                break;
            case 'Exit':
                exit();
                break;
        }
    });

const viewEmployees = () => {

};

const addEmployee = () => {

};

const updateEmployeeRole = () => {

};

const viewRoles = () => {

};

const addRole = () => {

};

const viewDepartments = () => {

};

const addRole = () => {

};

const exit = () => {
    console.log('Have a nice day!');
    connection.end();
};