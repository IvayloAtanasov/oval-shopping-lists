const Base = require('./base')

class Recipes extends Base {
  constructor() {
    super()
  }

  get() {
    // TODO: base error handling
      /*{
        "id": Number,
        "name": "String",
        "description": "String",
        "minutesToCook": Number,
        "categoryId": Number,
        "category": "String"
      },*/
      return fetch('http://localhost:8080/api/recipes')
        .then(res => res.json());

  }
}

module.exports = new Recipes()