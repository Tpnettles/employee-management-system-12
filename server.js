const mysql = require("mysql");
const { prompt } = require("inquirer");
const db = require("./db")
loadMainPrompts();

// questions/choices listed in the terminal
function loadMainPrompts() {
  prompt([
    {
      type: "list",
      name: "choice",
      message:
        "What would you like to do in regards to your employees (view, add, remove, update, or quit application)?",
      choices: [
        {
          name: "View employees",
          value: "View_employees",
        },
        {
          name: "View department",
          value: "View_department",
        },
        {
          name: "View roles",
          value: "View_roles",
        },
        {
          name: "Add employees",
          value: "Add_employees",
        },
        {
          name: "Add departments",
          value: "Add_departments",
        },
        {
          name: "Add roles",
          value: "Add_roles",
        },
        {
          name: "Update employee manager",
          value: "Update_employee_manager",
        },
        {
          name: "Update employee role",
          value: "Update_employee_role",
        },
      ],
    },
  ]).then((res) => {
    let choice = res.choice;
    console.log(choice);
    if (choice === "View_employees") {
      db.findAllEmployees().then(([row]) => {
        console.log(row);
      });
    }

    // "append an object to the end of the employee array in db.findAllEmployees"
    else if (choice === "Add_employees") {
      prompt([
        {
          name: "first_name",
          messge: "What is the employee's first name?",
        },

        {
          name: "last_name",
          message: "What is the employee's last name?",
        },
      ]).then((res) => {
        let firstName = res.first_name;
        let lastName = res.last_name;

        db.findAllRoles().then(([rows]) => {
          let roles = rows;
          const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          prompt({
            type: "list",
            name: "roleId",
            message: "What is the employee's role?",
            choices: roleChoices,
          }).then((res) => {
            let roleId = res.roleId;
            db.findAllEmployees().then(([rows]) => {
              let employees = rows;
              const managerChoices = employees.map(
                ({ id, first_name, last_name }) => ({
                  name: `${first_name} ${last_name}`,
                  value: id,
                })
              );

              managerChoices.unshift({ name: "None", value: null });

              prompt({
                type: "list",
                name: "managerId",
                message: "Who is the employee's manager?",
                choices: managerChoices,
              })
                .then((res) => {
                  let employee = {
                    manager_id: res.managerId,
                    role_id: roleId,
                    first_name: firstName,
                    last_name: lastName,
                  };

                  db.addEmployee(employee);
                })
                .then(() =>
                  console.log(`Added ${firstName} ${lastName} to the database`)
                )
              .then(() => loadMainPrompts());
            });
          });
        });
      });
    }

    else if (choice === "View_department") {
      db.findAllDepartments()
        .then(([rows]) => {
          let departments = rows;
          console.log("\n");
          console.table(departments);
        })
        .then(() => loadMainPrompts());

    }


    else if (choice === "View_roles") {
      db.findAllRoles()
        .then(([rows]) => {
          let roles = rows;
          console.log("\n");
          console.table(roles);
        })
        .then(() => loadMainPrompts());
    }


    else if (choice === "Add_departments") {
      prompt([
        {
          name: "name",
          message: "What is the name of the department?",
        },
      ]).then((res) => {
        let name = res;
        db.createDepartment(name)
          .then(() => console.log(`Added ${name.name} to the database`))
          .then(() => loadMainPrompts());
      });
    }
    else if (choice === "Add_roles") {
      db.findAllDepartments().then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
          name: name,
          value: id,
        }));

        prompt([
          {
            name: "title",
            message: "What is the name of the role?",
          },
          {
            name: "salary",
            message: "What is the salary of the role?",
          },
          {
            type: "list",
            name: "department_id",
            message: "Which department does the role belong to?",
            choices: departmentChoices,
          },
        ]).then((role) => {
          db.createRole(role)
            .then(() => console.log(`Added ${role.title} to the database`))
            .then(() => loadMainPrompts());
        });
      });
    }


    // "find an employee based on id and display it for edits"
    else if (choice === "Update_employee_role") {
      db.findAllEmployees().then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(
          ({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id,
          })
        );

        prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee's role do you want to update?",
            choices: employeeChoices,
          },
        ]).then((res) => {
          let employeeId = res.employeeId;
          db.findAllRoles().then(([rows]) => {
            let roles = rows;
            const roleChoices = roles.map(({ id, title }) => ({
              name: title,
              value: id,
            }));

            prompt([
              {
                type: "list",
                name: "roleId",
                message:
                  "Which role do you want to assign the selected employee?",
                choices: roleChoices,
              },
            ])
              .then((res) => db.updateEmployeeRole(employeeId, res.roleId))
              .then(() => console.log("Updated employee's role"))
            .then(() => loadMainPrompts());
          });
        });
      });
    }
  })
};
