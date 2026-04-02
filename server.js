const express = require("express")
const dotenv = require('dotenv')
const morgan = require('morgan')
const mongoose = require('mongoose')

// tell dotenv to actually go find your .env file and load it.
// .env is the default name, another name would have to use 'path' inside
dotenv.config() // Actually reads the .env file and pushes those values into process.env.

mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`Database Connected at ${conn.connection.host}`);

}).catch((err) => {
    console.error(`Database Error: ${err}`)
    process.exit(1)
})

const app = express()

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
    console.log(`mode: ${process.env.NODE_ENV}`);
}

// Routing
app.get("/", (req, res) => {
    res.send("Hello Server")
})


const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log("App Listening");
})