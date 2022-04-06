import { Query } from 'mongoose'
import { TModels } from '../../typing/app.type'

export default class APIFeatures<T extends TModels> {
  public query: Query<T[], T>
  protected queryString: any

  constructor(query: Query<T[], T>, queryString: any) {
    this.query = query
    this.queryString = queryString
  }

  filter() {
    let queryStr = JSON.stringify(this.queryString)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    this.query = this.query.find(JSON.parse(queryStr))
    return this
    //query = TourModel.find(JSON.parse(queryStr));
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString!.sort.toString().split(',').join(' ')

      this.query = this.query.sort(sortBy)
    } else {
      //https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065094#questions/12847927
      //https://stackoverflow.com/questions/49760024/why-mongodb-sort-by-id-is-much-faster-than-sort-by-any-other-indexed-field
      this.query = this.query.sort({ _id: -1 })
    }
    return this
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.toString().split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      //here `-` means : excluding
      this.query.select('-__v')
    }
    return this
  }

  paginate() {
    const page = this.queryString.page
      ? parseInt(this.queryString.page.toString())
      : 1
    const limit = this.queryString.limit
      ? parseInt(this.queryString.limit.toString())
      : 100
    const skip = (page - 1) * limit

    //page=2&limit=10 => 1-10 is page 1, 11-20 is page 2
    this.query = this.query.skip(skip).limit(limit)
    return this
  }
}
