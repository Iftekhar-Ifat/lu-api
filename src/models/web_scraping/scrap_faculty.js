require("dotenv").config();
const puppeteer = require("puppeteer");
const get_faculty = require("../database_calls/get_faculty");
const set_faculty = require("../database_calls/set_faculty");

async function scrap_faculty(department) {
    const URL = `https://www.lus.ac.bd/faculty-of-${department}/`;

    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    });
    const page = await browser.newPage();

    try {
        await page.goto(URL, { timeout: 7000 });
        const teacherDivs = await page.$$(".teacher-info");
        const allFaculty = [];
        for (let i = 0; i < teacherDivs.length; i++) {
            const facultyName = await teacherDivs[i].$eval(
                "a",
                (a) => a.innerText
            );
            const facultyURL = await teacherDivs[i].$eval("a", (a) => a.href);
            const facultyDesignation = await teacherDivs[i].$eval("p", (p) =>
                p.innerText.replace(/[\r\n]/gm, "")
            );
            const facultyImg = await teacherDivs[i].$eval(
                "img",
                (img) => img.src
            );
            let eachFaculty = {
                name: facultyName,
                url: facultyURL,
                designation: facultyDesignation,
                image: facultyImg,
            };
            allFaculty.push(eachFaculty);
        }
        await set_faculty(department, allFaculty);
        await browser.close();

        return allFaculty;
    } catch (error) {
        return await get_faculty(department);
    } finally {
        await browser.close();
    }
}

module.exports = scrap_faculty;
