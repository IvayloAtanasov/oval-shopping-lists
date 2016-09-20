const Base = require('./base')

class Recipes extends Base {
  constructor() {
    super()
  }

  get(id) {
      /*
      Recipe format
      {
        "id": Number,
        "name": "String",
        "description": "String",
        "minutesToCook": Number,
        "categoryId": Number,
        "category": "String"
      },*/
      if (id) {
        // one
        return this.fetch(`/recipes/${id}`)
      } else {
        // all
        return this.fetch('/recipes')
      }
  }

  create(recipe) {
    return fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipe)
    })
    .then((res) => console.log(res))
  }

  update(id, recipe) {
    return fetch(`/api/recipes/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipe)
    })
    .then((res) => console.log(res))
  }

  delete(id) {
    return fetch(`/api/recipes/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => console.log(res))
  }
}

module.exports = new Recipes()