const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

const homepage = require("./routes/home.router");
const facultyRouter = require("./routes/faculty/faculty.router");
const resultRouter = require("./routes/result/result.router");

app.use(cors());
app.use(express.static(path.join(__dirname + "/../public")));
app.use(homepage);
app.use(facultyRouter);
app.use(resultRouter);

module.exports = app;
