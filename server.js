const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3001;

//  Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);


// Turn the db connection on
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
