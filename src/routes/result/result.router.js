const express = require("express");
const scrap_result = require("../../models/web_scraping/scrap_result");

const resultRouter = express.Router();

resultRouter.get("/api/result/:std_id", async (req, res) => {
    const studentID = req.params.std_id;
    try {
        await scrap_result(studentID)
            .then((response) => {
                res.status(200).send({ result: response });
            })
            .catch((err) => {
                res.status(200).send({ error: err.message });
            });
    } catch (error) {
        res.status(500).send({ error: "An error occurred" });
    }
});

resultRouter.get("/api/result/:std_id/:date", async (req, res) => {
    const studentID = req.params.std_id;
    const studentDate = req.params.date;
    try {
        await scrap_result(studentID, studentDate)
            .then((response) => {
                res.status(200).send({ result: response });
            })
            .catch((err) => {
                res.status(200).send({ error: err.message });
            });
    } catch (error) {
        res.status(500).send({ error: "An error occurred" });
    }
});

module.exports = resultRouter;
