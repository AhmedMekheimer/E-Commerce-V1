const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Product Title Required'],
            unique: [true, 'Product Title must be unique'],
            minLength: [3, 'Product Title is too short'],
            maxLength: [100, 'Product Title is too long']
        },
        slug: {
            type: String,
            required: true,
            lowercase: true
        },
        category: {
            type: mongoose.Schema.ObjectId,
            required: [true, 'Category Required'],
            ref: 'Category',
        },
        subCategories: [{
            type: mongoose.Schema.ObjectId,
            ref: 'SubCategory',
        }],
        brand: {
            type: mongoose.Schema.ObjectId,
            ref: 'Brand',
        },
        colors: [{
            type: String,
            unique: [true, 'Product color must be unique']
        }],
        description: {
            type: String,
            required: [true, 'Product Description Required'],
            minLength: [20, 'Product Description is too short'],
            maxLength: [2000, 'Product Description is too long']
        },
        price: {
            type: Number,
            required: [true, 'Product Price Required'],
        },
        priceAfterDiscount: {
            type: Number,
        },
        quantity: {
            type: Number,
            required: [true, 'Product Quantity Required'],
        },
        soldCounter: {
            type: Number,
            default: 0
        },
        coverImage: {
            type: String,
            required: [true, 'Product cover image is Required'],
        },
        images: [String],
        averageRating: {
            type: Number,
            min: [1, 'Rating cannot be smaller than 1'],
            max: [5, 'Rating cannot be greater tahn 5']
        },
        ratingsCounter: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)