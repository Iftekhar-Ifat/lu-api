# LU-API

The Leading University API is a REST API that provides access to data scraped from the Leading University's website. The data is cached, ensuring continuous access even if the Leading University's website is unavailable or takes more than 7 seconds to load.

## How to start the script

Clone this repo to your local machine

In the root directory, you can run:

### `npm install`

To install required dependencies.

To start the server, you can run:

### `npm start`

Which runs the server in the development mode.
Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

## Adding caching mechanism

If you want to add caching mechanism,

-   Create your mongodb database and add a collection name `faculty` and `result`

-   Add a file named `.env` in the root directory and add your mongodb uri as `MONGODB_URI` & your databse name as `DB_NAME`.

Although you can use the application without using any caching mechanism.
