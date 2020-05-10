const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employees'
});

connection.connect(err => {
    if (err) {
        throw err;
    };
    console.log(`Connection success. Connected to thread: ${connection.threadId}`);
    init();
});

const init = () => {
    inquirer
        .prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'task',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
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
                    addDepartment();
                    break;
                case 'Exit':
                    exit();
                    break;
            }
        });
};

const viewEmployees = () => {
    connection.query(
        'SELECT employee.id, first_name, last_name, title, department.name, salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY employee.id',
        (err, res) => {
            if (err) {
                throw err;
            }
            console.table(res);
            init();
        });
};

const addEmployee = () => {
    connection.query(
        'SELECT first_name, last_name, id FROM employee',
        (err, res) => {
            if (err) throw err;
            const employees = res.map(employee => ({id: employee.id, name: `${employee.first_name} ${employee.last_name}`}));
            employees.push({id: null, name: 'No Manager'});

            connection.query(
                'SELECT title, id FROM role',
                (err, res) => {
                    if(err) throw err;
                    const roles = res.map(role => ({name: role.title, id: role.id}));

                    inquirer.prompt([
                        {
                            type: 'input',
                            message: 'What is the employee\'s first name?',
                            name: 'firstName'
                        },
                        {
                            type: 'input',
                            message: 'What is the employee\'s last name?',
                            name: 'lastName'
                        },
                        {
                            type: 'list',
                            message: 'What is the employee\'s role?',
                            name: 'role',
                            choices: roles
                        },
                        {
                            type: 'list',
                            message: 'Who is the employee\'s manager?',
                            name: 'manager',
                            choices: employees
                        }
                    ]).then((answers) => {
                        employees.forEach(employee => {
                            if(employee.name === answers.manager){
                                const managerId = employee.id;
                                let roleId;
                                roles.forEach(role => {
                                    if(role.name === answers.role){
                                        roleId = role.id;
                                    }
                                })

                                connection.query(
                                'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)',
                                [answers.firstName, answers.lastName, roleId, managerId],
                                (err, res) => {
                                    if (err) throw err;
                                    console.log(answers.firstName, answers.lastName, 'added');
                                    init();
                                });
                            }
                        })
                    });        
                }
            )
        }
    )
};

const updateEmployeeRole = () => {
    connection.query(
        'SELECT title, id FROM role',
        (err,res) => {
            if (err) throw err;
            const roles = res.map(role => ({name: role.title, id: role.id}));
            connection.query(
                'SELECT first_name, last_name, id FROM employee',
                (err, res) => {
                    if (err) throw err;
                    const employees = res.map(employee => ({id: employee.id, name: `${employee.first_name} ${employee.last_name}`}));

                    inquirer.prompt(
                        [
                            {
                                type: 'list',
                                message: 'which employee\'s role would you like to update?',
                                name: 'employee',
                                choices: employees
                            },
                            {
                                type: 'list',
                                message: 'What would you like to change their role to?',
                                name: 'newRole',
                                choices: roles
                            }
                        ]
                    ).then((answer) => {
                        let employeeId;
                        employees.forEach(employee => {
                            if(employee.name = answer.employee) {
                                employeeId = employee.id;
                            }
                        })
                        let roleId;
                        roles.forEach(role => {
                            if(role.name = answer.newRole) {
                                roleId = role.id;
                            }
                        })
                        connection.query(
                            'UPDATE employee SET role_id = ? WHERE id = ?',
                            [roleId, employeeId],
                            (err,res) => {
                                if(err) throw err;
                                console.log('Updated role of', answer.employee, 'to', answer.newRole);
                                init();
                            } //// Doesn't appear to actually update
                        )
                    })
                }
            )
        
        }
    )
};

const viewRoles = () => {
    connection.query(
        'SELECT role.id, title, salary, department.name FROM role LEFT JOIN department ON role.department_id = department.id',
        (err, res) => {
            if (err) {
                throw err;
            }
            console.table(res);
            init();
        }
    )
};

const addRole = () => {
    connection.query('SELECT name FROM department',
    (err,res) => {
        if (err) throw err;
        // console.log(res);
        inquirer.prompt(
            [
                {
                    type: 'input',
                    message: 'What role would you like to add?',
                    name: 'role'
                },
                {
                    type: 'input',
                    message: 'What is their salary?',
                    name: 'salary'
                },
                {
                    type: 'list',
                    message: 'What department is it a part of?',
                    name: 'department',
                    choices: res
                }
            ]
        ).then((answer) => {
            connection.query('SELECT name, id FROM department',
                (err,res) => {
                    if (err) throw err;
                    const departments = res;
                    let departmentId;
                    departments.forEach(department => {
                        if(answer.department === department.name){
                            departmentId = department.id;
                        }
                    })
                    connection.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?)',
                        [answer.role, answer.salary, departmentId],
                        (err,res) => {
                            if(err) throw err;
                            console.log('Added new role', answer.role, 'to', answer.department);
                            init();
                        })
                })
        })
    })
};

const viewDepartments = () => {
    connection.query(
        'SELECT * FROM department',
        (err, res) => {
            if (err) {
                throw err;
            }
            console.table(res);
            init();
        }
    )
};

const addDepartment = () => {
    inquirer.prompt(
        {
            type: 'input',
            message: 'What department would you like to add?',
            name: 'department'
        }
    ).then((answer) => {
        connection.query(
            'INSERT INTO department (name) VALUES (?)',
            [answer.department],
            (err, res) => {
                if (err) throw err;
                console.log(answer.department, 'added');
                init();
            }
        )
    })
};

const exit = () => {
    console.log('Have a nice day!');
    connection.end();
};