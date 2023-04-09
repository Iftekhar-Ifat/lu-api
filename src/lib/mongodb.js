require("dotenv").config;
const { MongoClient } = require("mongodb");

const MONGO_PASS = encodeURIComponent(process.env.PASSWORD);
const MONGODB_URI = process.env.MONGODB_URI.replace('<password>', MONGO_PASS);
const MONGODB_DB = process.env.DB_NAME;

// check the MongoDB URI
if (!MONGODB_URI) {
    throw new Error("Define the MONGODB_URI environmental variable");
}

// check the MongoDB DB
if (!MONGODB_DB) {
    throw new Error("Define the MONGODB_DB environmental variable");
}

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    // check the cached.
    if (cachedClient && cachedDb) {
        // load from cache
        return {
            client: cachedClient,
            db: cachedDb,
        };
    }

    // set the connection options
    const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    // Connect to cluster
    const client = await MongoClient.connect(MONGODB_URI, opts);
    console.log("Connected to MongoDB");
    const db = await client.db(MONGODB_DB);

    // set cache
    cachedClient = client;
    cachedDb = db;

    return {
        client,
        db,
    };
}

module.exports = connectToDatabase;
