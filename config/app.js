const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const routes = require("../routes/index.route");

const databaseConnection = require("./database").connection;

const morgan = require("morgan");
const cors = require("cors");



databaseConnection();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use(routes);

module.exports = app;