const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Category Required'],
            unique: [true, 'Category must be unique'],
            minLength: [3, 'Category name is too short'],
            maxLength: [32, 'Category name is too long']
        },
        slug: {
            type: String,
            lowercase: true
        },
        image: String
    }
    , { timestamps: true }
)

module.exports = mongoose.model('Category', categorySchema)