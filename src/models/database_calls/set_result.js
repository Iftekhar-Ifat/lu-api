const connectToDatabase = require("../../lib/mongodb");

async function set_result(studentID, data) {
    const STUDENT_ID = studentID;
    const PUBLIC_DATA = data.public;
    const PRIVATE_DATA = data.private;

    const { db } = await connectToDatabase();
    const resultCollection = db.collection("result");

    const DB_SCHEMA = {
        studentID: STUDENT_ID,
        public: PUBLIC_DATA,
        private: PRIVATE_DATA,
    };
    if (
        Object.keys(PRIVATE_DATA).length !== 0 &&
        Object.keys(PUBLIC_DATA).length !== 0
    ) {
        // public private both data available
        await resultCollection.updateOne(
            { studentID: STUDENT_ID },
            { $set: DB_SCHEMA },
            { upsert: true }
        );
    } else if (Object.keys(PUBLIC_DATA).length !== 0) {
        // only public data available
        await resultCollection.updateOne(
            { studentID: STUDENT_ID },
            { $set: { public: PUBLIC_DATA } },
            { upsert: true }
        );
    }
}

module.exports = set_result;
