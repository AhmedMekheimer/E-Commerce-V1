const express = require("express")
const dotenv = require('dotenv')
const morgan = require('morgan')
const dbConnection = require('./config/database')
const categoryRoute = require('./routes/categoryRoute')
const ApiError = require("./utils/ApiError")
const errorHandlingMiddleware = require("./middlewares/errorHandlingMiddleware")

// tell dotenv to actually go find your .env file and load it.
// .env is the default name, another name would have to use 'path' inside
dotenv.config() // Actually reads the .env file and pushes those values into process.env.

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1); // Crash immediately, no time for graceful shutdown here
});

dbConnection()

const app = express()

// Middlewares
app.use(express.json())

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
    console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
// Add this back in
app.get("/", (req, res) => {
    res.send("Hello Server is running!");
});

app.use('/api/v1/categories', categoryRoute)

// If we hit a 'route' that isn't found
app.all(/(.*)/, (req, res, next) => {
    next(new ApiError(`Can't find this route ${req.originalUrl}`, 400))
})

// Global Error Handler Middleware - The only 4 argument middleware in express
app.use(errorHandlingMiddleware)

const PORT = process.env.PORT || 8000
const server = app.listen(PORT, () => {
    console.log("App Listening");
})

// Handling Rejections (Errors from Promises) outside Express (Like Db Conn.)
// By listening on the event
process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection Error: ${err}`)
    server.close(() => {
        console.error('Closing Application...');
        process.exit(1)
    })
})