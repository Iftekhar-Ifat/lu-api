const connectToDatabase = require("../../lib/mongodb");

async function set_faculty(department, data) {
    const { db } = await connectToDatabase();
    const facultyCollection = db.collection("faculty");

    const updateData = {};
    updateData[department] = data;

    await facultyCollection.updateOne(
        {},
        {
            $set: updateData,
        },
        { upsert: true }
    );
}

module.exports = set_faculty;
