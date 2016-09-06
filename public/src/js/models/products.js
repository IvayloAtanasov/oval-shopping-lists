const Base = require('./base')

class Products extends Base {
  constructor() {
    super()
  }

  get() {
      /*{
        "id": Number,
        "name": "String"
      },*/
      return this.fetch('/products')
  }
}

module.exports = new Products()