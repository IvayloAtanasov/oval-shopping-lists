const oval = require('organic-oval')
const recipes = require('../models/recipes')

class RecipeList {
  constructor(rootEl, props, attrs) {
    oval.BaseTag(this, rootEl, props, attrs)

    this.recipes = []

    this.getRecipes = () => {
      return recipes.get()
        .then(recipes => {
          this.recipes = recipes
          this.update()
        })
    }
    this.getRecipes()

    this.deleteRecipe = (recipeId) => {
      return recipes.delete(recipeId)
        .then(this.getRecipes)
    }
  }

  render(createElement) {
    return (
      <table>
        <thead>
          <tr>
            <th colspan="1">Име</th>
            <th colspan="1">Категория</th>
            <th colspan="1">Минути</th>
            <th colspan="4">Действия</th>
          </tr>
        </thead>
        <tbody>
          <each recipe, index in {this.recipes}>
            <tr>
              <td colspan="1">{recipe.name}</td>
              <td colspan="1">{recipe.category}</td>
              <td colspan="1">{recipe.minutesToCook}</td>
              <td colspan="4">
                <a 
                  href={`#${oval.router.generate('recipe.edit', {id: recipe.id})}`} 
                  class="button button-clear button-small" 
                  data-navigo>
                    Редактирай
                </a>
                <button 
                  class="button button-clear button-small"
                  onclick={this.deleteRecipe.bind(this, recipe.id)}>
                    Изтрий
                </button>
              </td>
            </tr>
          </each>
        </tbody>
      </table>
    )
  }
}

oval.registerTag('recipe-list', RecipeList)