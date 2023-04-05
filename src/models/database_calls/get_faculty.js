const connectToDatabase = require("../../lib/mongodb");

async function get_faculty(department) {
    try {
        const { db } = await connectToDatabase();

        const query = {};
        query[department] = { $exists: true };
        const projection = {};
        projection[department] = 1;
        projection._id = 0;

        const facultyData = await db
            .collection("faculty")
            .find(query)
            .project(projection)
            .toArray();
        return Object.values(facultyData[0])[0];
    } catch (error) {
        return "An error occurred in database";
    }
}

module.exports = get_faculty;
