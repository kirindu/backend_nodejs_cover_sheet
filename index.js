
require('dotenv').config();
const express = require("express");

const cors = require('cors');

const { dbConnection } = require("./database/config");

//creating the express server
const app = express();

// Setting CORS
app.use(cors());

// Reading the Body
app.use(express.json());


//DataBase
dbConnection();

//Routes
app.use('/api/users',require('./routes/users'));
app.use('/api/categories',require('./routes/categories'));
app.use('/api/posts',require('./routes/posts'));
app.use('/api/login',require('./routes/auth'));

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port 3000' + process.env.PORT);
});
