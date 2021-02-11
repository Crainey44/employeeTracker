const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port, if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'password',
  database: 'employeeTracker_DB',
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  connection.end();
});

function start(){
  inquirer
  .prompt ([
    {
      type: "list",
      message: "What would you like to do?",
      name: "start",
      choices: [
        "Add Employee",
        "View all Employees",
        "Remove Employee",
        "Update Employee Role",
        "Add Department",
        "View all Departments",
        "Add Roles",
        "View all Roles",
        "Exit"
      ]
    }
  ])
  .then (function(res){
    switch (res.start){

      case "Add Employee":
        addEmployee();
        break;

      case "View all Employees":
          viewAllEmployees();
          break;
        
      case "Remove Employees":
        removeEmployees();
        break;

      case "Update Employee Role":
        updateEmployeeRole();
        break;

      case "Add Department":
        addDepartment();
        break;

      case "View All Departments":
        viewAllDepartments();
        break;

      case "Add Roles":
        addRoles();
        break;

      case "View All Roles":
        viewAllRoles();
        break;

      case "Exit":
        connection.end();
        break;
    
    }
  })
}

function addEmployee() {
  console.log("Inserting a new employee.\n");
  inquirer
  .prompt ([
    {
      type: "input",
      message: "First Name?",
      name: "first_name",
    },
    {
      type: "input",
      message: "Last Name?",
      name: "last_name",
    },
    {
      type: "list",
      message: "what is the employee's role?",
      name: "role_id",
      choices: [1,2,3]
    },
    {
      type: "input",
      message: "Who is their manager?",
      name: "manager_id"
    }
  ])
  .then (function(res){
    const query = connection.query(
      "INSERT INTO employees SET ?",
      res,
      function(err,res) {
        if (err) throw err;
        console.log("Employee has been added\n");

        start ();
      }
    );
  })
}
function viewAllEmployees() {

  connection.query("SELECT employees.first_name, employees.last_name, roles.title AS \"role\", managers.first_name AS \"manager\" FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN employees managers ON employees.manager_id = managers.id GROUP BY employees.id",  
  function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function removeEmployee(){
  let employeeList = [];
  connection.query(
    "SELECT employees.first_name, employees.last_name FROM employees", (err,res) => {
      for (let i = 0; i < res.length; i++){
        employeeList.push(res[i].first_name + " " + res[i].last_name);
      }
  inquirer 
  .prompt ([ 
    {
      type: "list", 
      message: "Which employee would you like to delete?",
      name: "employee",
      choices: employeeList

    },
  ])
  .then (function(res){
    const query = connection.query(
      `DELETE FROM employees WHERE concat(first_name, ' ' ,last_name) = '${res.employee}'`,
        function(err, res) {
        if (err) throw err;
        console.log( "Employee has been deleted\n");
     start();
    });
    });
    }
      );
      };

     
function updateEmployeeRole(){
        ​
  connection.query("SELECT first_name, last_name, id FROM employees",
    function(err,res){
      for (let i=0; i <res.length; i++){
       employees.push(res[i].first_name + " " + res[i].last_name);
      }
     const employees = res.map(employee => ({name: employee.first_name + " " + employee.last_name, value: employee.id}))
        ​
     inquirer
     .prompt([
            {
     type: "list",
     name: "employeeName",
     message: "Which employee's role would you like to update?", 
     choices: employees
      },
      {
       type: "input",
       name: "role",
       message: "What is your new role?"
            }
          ])
          .then (function(res){
            connection.query(`UPDATE employees SET role_id = ${res.role} WHERE id = ${res.employeeName}`,
            function (err, res){
              console.log(res);
              start()
            }
            );
          })
        }
        )
        }
  function addDepartment(){
          inquirer
          .prompt([
            {
              type: "input",
              name: "departmentName", 
              message: "What Department would you like to add?"
            }
          ])
          .then(function(res){
            console.log(res);
            const query = connection.query(
              "INSERT INTO departments SET ?", 
              {
                name: res.departmentName
              }, 
              function(err, res){
                connection.query("SELECT * FROM departments", function(err, res){
                  console.table(res); 
                  start(); 
                })
              }
            )
          })
        }
function viewAllDepartments(){
          connection.query ("SELECT * FROM departments", function(err, res){
            console.table(res);
            start();
          })
          }

function addRole() {
  const departments= [];
  connection.query("SELECT * FROM departments",
  function(err,res){
    if(err) throw err;
    for (let i=0; i <res.length; i++){
      res[i].first_name + " " + res[i].last_name
      departments.push({name, value: res[i].id}); 
    }
    inquirer
    .prompt([
      {
        type: "input", 
    name: "title",
    message: "What role would you like to add?"
  },
  {
    type: "input",
    name: "salary",
    message: "What is the salary for the role?"
  },
  {
    type: "list",
    name: "department",
    message: "what department?",
    choices: departments
  }
    ])
    .then (function(res){
      console.log(res);
      const query = connection.query(
        "INSERT INTO roles SET ?",
        {
          title: res.title,
          salary: res.salary,
          department_id: res.department
        },
        function (err,res){
          if (err, res){
            if (err) throw err;
            start();
          }
        }
      )
    })
  })
  function viewAllRoles(){
    connection.query ("SELECT * FROM roles", function(err, res){
      console.table(res);
      start();
    })
    }
}
        
    
