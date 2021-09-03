const mysql = require("mysql2")
const connection = mysql.createConnection({
  host: "localhost",
  // Your username
  user: "root",
  // Your password
  password: "Letmein11!",
  database: "employees_db"
});
connection.connect(function (err) {
  if (err) throw err;
});
module.exports = connection;