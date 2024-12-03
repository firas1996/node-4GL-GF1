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
    const page = this.queryStr.page || 1;
    const limit = this.queryStr.limit || 6;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const sort = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sort);
    } else {
      this.query = this.query.sort("-created_at");
    }
    console.log("zzz");
    return this;
  }
}
module.exports = ApiFeatures;
