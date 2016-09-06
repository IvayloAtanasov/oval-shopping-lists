const Base = require('./base')

class Categories extends Base {
  constructor() {
    super()
  }

  get() {
      /*{
        "id": Number,
        "name": "String"
      },*/
      return this.fetch('/categories')
  }
}

module.exports = new Categories()