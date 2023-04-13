const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const path = require('path');

const databaseConnection = require("./database").connection;



databaseConnection();

app.use(express.json());
app.use(bodyParser.json());


module.exports = app;