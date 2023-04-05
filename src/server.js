require("dotenv").config();
const PORT = process.env.PORT || 8080;

const http = require("http");
const app = require("./app");

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
