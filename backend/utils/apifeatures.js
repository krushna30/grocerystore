class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword, //regular expression
            $options: "i", //case insensitive
          },
        }
      : {};
    // console.log("search function", keyword)
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    // Removing some fields for category

    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter for Price and Rating

    // converting normal to $ instruction
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
    }
    
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1; // 50 product
        //skipping the product
        
        const skip = resultPerPage * (currentPage - 1);
          // use of limit and skip method to display limited no of products
        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
        
    }
}

module.exports = ApiFeatures;
