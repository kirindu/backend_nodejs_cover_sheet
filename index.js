
require('dotenv').config();
const express = require("express");

const cors = require('cors');

const { dbConnection } = require("./database/config");

//creating the express server
const app = express();

// Setting CORS
app.use(cors());


//DataBase
dbConnection();

//Routes
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    msg: "Hi world",
  });
});

app.listen(process.env.PORT, () => {
  console.log('Server running on port 3000' + process.env.PORT);
});
