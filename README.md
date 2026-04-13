// News_Backend

// This Project is about the news backend, which is responsible for fetching news data from the news API and storing it in the database. It also provides APIs for the frontend to fetch news data from the database.

// The main files in this project are:
// - app.js: the main entry point of the application, which sets up the Express server and connects to the database.
// - routes/news.js: the route handler for the news API, which defines the endpoints for fetching news data.
// - controllers/newsController.js: the controller for the news API, which contains the logic for fetching news data from the news API and storing it in the database.
// - models/news.js: the Mongoose model for the news data, which defines the schema for the news data in the database.
// - utils/email.js: the utility function for sending emails, which is used to send email notifications when there is an error fetching news data from the news API.

// To run this project, you need to have Node.js and MongoDB installed on your machine. You also need to create a .env file in the root directory of the project and add the following environment variables:
// - NEWS_API_KEY: your API key for the news API
// - MONGODB_URI: the URI for your MongoDB database
// - EMAIL_USER: your email address for sending email notifications

// To start the server, run the following command in the terminal:
// npm run dev

// This will start the server in development mode, which will automatically restart the server when there are changes to the code. You can then access the news API at http://localhost:3000/api/v1/news.

// The news API has the following endpoints:
// - GET /api/v1/news: fetches all news data from the database.
// - GET /api/v1/news/:id: fetches a single news item by its
// - POST /api/v1/news: creates a new news item in the database.
// - PUT /api/v1/news/:id: updates an existing news item in the database.
// - DELETE /api/v1/news/:id: deletes a news item from the database.

// The news data in the database has the following schema:
// - title: the title of the news item
// - description: the description of the news item
// - newsDate: the date of the news item
// - newsDeadline: the deadline of the news item
// newsType: the type of the news item (e.g. Domestic, International etc.)
// - newsCategory: the category of the news item (e.g. Politics, Sports etc.)
// - channel: the channel of the news item (e.g. CNN, BBC etc.)
// - isbreaking: whether the news item is breaking news or not
// - url: the URL of the news item
