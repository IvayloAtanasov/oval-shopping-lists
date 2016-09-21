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
      const deleteConfirmed = confirm(`Sure you want to delete recipe ${recipeId}, mate?`)
      if (deleteConfirmed) {
        return recipes.delete(recipeId)
          .then(this.getRecipes)
      }
    }

    this.addToShoppingList = (recipeId) => {
      console.log(recipeId)
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
            <tr class="recipe-row">
              <td colspan="1">{recipe.name}</td>
              <td colspan="1">{recipe.category}</td>
              <td colspan="1">{recipe.minutesToCook}</td>
              <td colspan="4">
                <a 
                  href={`#${oval.router.generate('recipe.edit', {id: recipe.id})}`} 
                  class="button button-clear button-small" 
                  data-navigo>
                    <i class="fa fa-pencil-square-o fa-2" aria-hidden="true"></i>
                </a>
                <button 
                  type="button"
                  class="button button-clear button-small"
                  onclick={this.deleteRecipe.bind(this, recipe.id)}>
                    <i class="fa fa-bomb fa-2" aria-hidden="true"></i>
                </button>
                <button 
                  type="button"
                  class="button button-clear button-small"
                  onclick={this.addToShoppingList.bind(this, recipe.id)}>
                    <i class="fa fa-calendar-plus-o fa-2" aria-hidden="true"></i>
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