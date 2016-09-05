const Base = require('./base')

class Recipes extends Base {
  constructor() {
    super()
  }

  get() {
    return new Promise((resolve, reject) => {
      // TODO
      resolve([
        {name: 'recipe 1', category: 'Dinner', timeToCook: 40}, 
        {name: 'recipe 2', category: 'Breakfast', timeToCook: 120}, 
        {name: 'recipe 3', category: 'Dinner', timeToCook: 60}
    ]);
    })
  }
}

module.exports = new Recipes()