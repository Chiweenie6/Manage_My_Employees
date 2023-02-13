const mysql = require('mysql2');
require('dotenv').config();

const linkDB = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  console.log("Link to company_db successful 👍"
));

module.exports = linkDB;