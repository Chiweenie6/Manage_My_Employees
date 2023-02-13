const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection(
  {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  },
  console.log("Link to company_db successful 👍"
));

module.exports = connection;