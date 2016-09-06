const Base = require('./base')

class Recipes extends Base {
  constructor() {
    super()
  }

  get() {
      /*{
        "id": Number,
        "name": "String",
        "description": "String",
        "minutesToCook": Number,
        "categoryId": Number,
        "category": "String"
      },*/
      return this.fetch('/recipes')
  }

  create(recipe) {
    return fetch('/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipe)
    })
    .then((res) => console.log(res))
  }
}

module.exports = new Recipes()