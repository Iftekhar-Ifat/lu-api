require("dotenv").config();
const edgeChromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const set_result = require("../database_calls/set_result");
const get_result = require("../database_calls/get_result");

const URL = "https://www.lus.ac.bd/result/";

let publicResult = {};
let privateResult = {};

const LOCAL_CHROME_EXECUTABLE = process.env.CHROMIUM_PATH;

async function scrap_result(studentID, studentDate) {
    const executablePath =
        (await edgeChromium.executablePath) || LOCAL_CHROME_EXECUTABLE;

    const browser = await puppeteer.launch({
        executablePath,
        args: edgeChromium.args,
        headless: true,
        ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    try {
        await page.goto(URL, { timeout: 7000 });
        await page.type("#student_id", studentID);
        if (studentDate) {
            await page.type("#dob", studentDate);
        }
        await page.click(".btn");
        await page.waitForSelector(".ng-binding");
        // for public data
        const publicWrapperDiv = await page.$$("#student-info > div > div");
        for (let element of publicWrapperDiv) {
            const dataDiv = await page.evaluate((el) => el.innerText, element);
            function processData(dataDiv) {
                const splittedArray = dataDiv.split(" : ");
                const title = splittedArray[0].replace(" ", "_").toLowerCase();
                const value = splittedArray[1];
                publicResult[title] = value;
            }
            processData(dataDiv);
        }
        // for private data
        let numberOfYear = 0;
        if (studentDate) {
            const privateWrapperDiv = await page.$$("#results > div > div");
            for (let yearData of privateWrapperDiv) {
                numberOfYear++;
                let allSemesterInAYear = {};
                // catch all the divs inside the yearData div
                const yearDataDivs = await yearData.$$("div");
                for (let semesterData of yearDataDivs) {
                    let eachSemesterName = await semesterData.$eval(
                        "h2",
                        (el) => el.innerText
                    );
                    eachSemesterName = eachSemesterName
                        .toLowerCase()
                        .replace(/\s+/g, "")
                        .replace(/-/g, "_");
                    const tableRows = await semesterData.$$eval(
                        "table > tbody > tr",
                        (rows) =>
                            rows.map((row) => {
                                const columns = row.querySelectorAll("td");
                                return Array.from(columns).map(
                                    (column) => column.innerText
                                );
                            })
                    );
                    async function processTableData(unprocessedRows) {
                        let processedSemester = {};
                        processedSemester["course_code"] = unprocessedRows[0];
                        processedSemester["course_title"] = unprocessedRows[1];
                        processedSemester["credit"] = unprocessedRows[2];
                        processedSemester["gp"] = unprocessedRows[3];
                        processedSemester["grade"] = unprocessedRows[4];
                        return processedSemester;
                    }
                    let eachSemesterResult = [];
                    tableRows.forEach(async (element) => {
                        let processedDataObject = await processTableData(
                            element
                        );
                        eachSemesterResult.push(processedDataObject);
                    });
                    allSemesterInAYear[eachSemesterName] = eachSemesterResult;
                }
                privateResult[`year_${numberOfYear}`] = allSemesterInAYear;
            }
        }
        await browser.close();
        await set_result(studentID, {
            public: publicResult,
            private: privateResult,
        });
        return { public: publicResult, private: privateResult };
    } catch (error) {
        return await get_result(studentID, studentDate);
    }
}

module.exports = scrap_result;
