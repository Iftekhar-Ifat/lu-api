const express = require("express");
const scrap_faculty = require("../../models/web_scraping/scrap_faculty");

const facultyRouter = express.Router();

facultyRouter.get("/api/faculty/:department", async (req, res) => {
    const department = req.params.department;
    try {
        await scrap_faculty(department)
            .then((response) => {
                res.status(200).send({ faculty: response });
            })
            .catch((err) => {
                res.status(200).send({ error: err.message });
            });
    } catch (error) {
        res.status(500).send({ error: "An error occurred" });
    }
});

module.exports = facultyRouter;
