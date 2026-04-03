const mongoose = require('mongoose')

// Schema
const categorySchema = new mongoose.Schema({
    name: String
})
const CategoryModel = mongoose.model('Category', categorySchema)

module.exports = CategoryModel