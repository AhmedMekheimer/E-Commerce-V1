class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery
        this.queryString = queryString
    }

    filter() {
        // 1st: Only have the fields to filter on 
        let filtersObj = { ...this.queryString }
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'keyword']
        excludedFields.forEach((field) => {
            delete filtersObj[field]
        })

        if (Object.keys(filtersObj).length > 0) {
            // Adding '$' operator in the query string
            // Note: Needed to add the extended query parser in the server
            let filtersStr = JSON.stringify(filtersObj)
            filtersStr = filtersStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

            this.mongooseQuery = this.mongooseQuery.find(JSON.parse(filtersStr))
        }
        return this
    }

    sort() {
        if (this.queryString.sort) {
            // ?sort=price,-soldCounter -> price,-soldCounter -> price -soldCounter
            let sortBy = this.queryString.sort.split(',').join(' ')
            this.mongooseQuery = this.mongooseQuery.sort(sortBy)
        }
        else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt')
        }

        return this
    }

    fieldLimit() {
        if (this.queryString.fields) {
            let fields = this.queryString.fields.split(',').join(' ')
            this.mongooseQuery = this.mongooseQuery.select(fields)
        }
        else {
            this.mongooseQuery = this.mongooseQuery.select('-__v')
        }

        return this
    }

    search(modelName) {
        if (this.queryString.keyword) {
            let search = {}

            // $options:'i' not case sensitive
            if (modelName === 'products') {
                search.$or = [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } }
                ]
            }
            else {
                search.$or = [
                    { name: { $regex: this.queryString.keyword, $options: 'i' } },
                ]
            }

            this.mongooseQuery = this.mongooseQuery.find(search)
        }

        return this
    }

    paginate(countDocuments) {
        const page = Number(this.queryString.page) || 1;
        const limit = Number(this.queryString.limit) || 5;
        const skip = (page - 1) * limit;

        let pagination = {}
        pagination.numOfPages = Math.ceil(countDocuments / limit)
        pagination.currentPage = page
        pagination.limit = limit

        if (page < pagination.numOfPages) {
            pagination.next = page + 1
        }

        if (page > 1) {
            pagination.prev = page - 1
        }

        this.paginationResult = pagination
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)

        return this
    }
}

module.exports = ApiFeatures