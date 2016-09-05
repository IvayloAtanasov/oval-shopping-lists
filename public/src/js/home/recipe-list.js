const oval = require('organic-oval')
const recipes = require('../models/recipes')

class RecipeList {
  constructor(rootEl, props, attrs) {
    oval.BaseTag(this, rootEl, props, attrs)

    this.recipes = [];
    recipes.get().then((recipes) => {
      this.recipes = recipes
      this.update()
    })
  }

  render(createElement) {
    return (
      <table>
        <thead>
          <tr>
            <th>Име</th>
            <th>Категория</th>
            <th>Време за приготвяне</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <each recipe, index in {this.recipes}>
            <tr>
              <td>{recipe.name}</td>
              <td>{recipe.category}</td>
              <td>{recipe.timeToCook}</td>
              <td><button class="button button-clear">Редактирай</button></td>
            </tr>
          </each>
        </tbody>
      </table>
    )
  }
}

oval.registerTag('recipe-list', RecipeList)