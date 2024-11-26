class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  filter() {
    const extraFields = ["page", "limit", "sort"];
    let queryObj = { ...this.queryStr };
    extraFields.forEach((element) => {
      delete queryObj[element];
    });
    this.queryStr = JSON.stringify(queryObj);
    this.queryStr = this.queryStr.replace(
      /\b(lt|lte|gt|gte)\b/g,
      (opt) => `$${opt}`
    );
    this.query = this.query.find(JSON.parse(this.queryStr));
    return this;
  }
  pagination() {
    const page = req.query.page || 1;
    const limit = req.query.limit || 6;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
  sort() {
    if (req.query.sort) {
      const sort = req.query.sort.split(",").join(" ");
      this.query = this.query.sort(sort);
    } else {
      this.query = this.query.sort("-created_at");
    }
    return this;
  }
}
module.exports = ApiFeatures;
