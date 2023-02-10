const express = require('express');
// const routes = require('./routes');
const sequelize = require('./config/connection');
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Query database
db.query('SELECT * FROM department', function (err, results) {
    console.log(results);
  });

  db.query('SELECT * FROM role', function (err, results) {
    console.log(results);
  });

  db.query('SELECT * FROM employee', function (err, results) {
    console.log(results);
  });

// Response when input is incorrect
app.use((req, res) => {
    console.log(404).end();
});


// Turn the db connection on
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
