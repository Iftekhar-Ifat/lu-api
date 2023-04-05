const connectToDatabase = require("../../lib/mongodb");

async function get_result(studentID, studentDate) {
    try {
        const { db } = await connectToDatabase();
        const resultCollection = await db.collection("result");

        if (studentDate) {
            const data = await resultCollection
                .find(
                    { studentID: studentID },
                    { projection: { _id: 0, studentID: 0 } }
                )
                .toArray();
            return { public: data[0].public, private: data[0].private };
        } else {
            const data = await resultCollection
                .find(
                    { studentID: studentID },
                    { projection: { _id: 0, studentID: 0, private: 0 } }
                )
                .toArray();
            return { public: data[0].public, private: {} };
        }
    } catch (error) {
        return "An error occurred in database";
    }
}

module.exports = get_result;
