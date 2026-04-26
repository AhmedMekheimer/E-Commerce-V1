const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/apiFeatures');

exports.deleteOneFactory = (modelName) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const deletedItem = await modelName.findByIdAndDelete(id);

        if (!deletedItem) {
            return next(new ApiError(`Failed Deletion: Item not Found`, 404));
        }
        res.status(201).json({ msg: `Item deleted Successfully` });
    })