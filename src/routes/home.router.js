const express = require("express");
const path = require("path");

const homepage = express.Router();

homepage.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/../index.html"));
});

module.exports = homepage;
