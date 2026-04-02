const express = require("express")
const dotenv = require('dotenv')

const app = express()
const PORT = process.env.PORT || 8000

app.get("/", (req, res) => {
    res.send("Hello Server")
})



app.listen(PORT, () => {
    console.log("App Listening");

})