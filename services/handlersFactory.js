const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/apiFeatures');

exports.deleteOneFactory = (Model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const deletedItem = await Model.findByIdAndDelete(id);

        if (!deletedItem) {
            return next(new ApiError(`Failed Deletion: Item not Found`, 404));
        }
        res.status(201).json({ msg: `Item deleted Successfully` });
    })

exports.updateOneFactory = (Model) =>
    asyncHandler(async (req, res, next) => {
        const document = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!document) {
            return next(new ApiError('Update Failed: Item not Found', 404))
        }

        res.status(201).json({ data: document })
    })