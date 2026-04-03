const express = require("express")
const dotenv = require('dotenv')
const morgan = require('morgan')
const dbConnection = require('./config/database')
const categoryRoute = require('./routes/categoryRoute')

// tell dotenv to actually go find your .env file and load it.
// .env is the default name, another name would have to use 'path' inside
dotenv.config() // Actually reads the .env file and pushes those values into process.env.

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


const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log("App Listening");
})