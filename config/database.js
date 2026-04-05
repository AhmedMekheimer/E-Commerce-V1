const mongoose = require('mongoose')

const dbConnection = () => {
    mongoose.connect(process.env.DB_URI).then((conn) => {
        console.log(`Database Connected at ${conn.connection.host}`);
    })
}

module.exports = dbConnection