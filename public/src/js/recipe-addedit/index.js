const oval = require('organic-oval')

class RecipeAddedit {
  constructor(rootEl, props, attrs) {
    oval.BaseTag(this, rootEl, props, attrs)

    this.editMode = false
    if (oval.router.state === 'recipe.edit')
        this.editMode = true


    this.submit = (e) => {
      e.preventDefault()
      console.log(this.refs)
    }

    this.products = [{}]

    this.allProducts = [{id: 1, name: 'Морков', qty: '20 кг.'}, {id: 2, name: 'Сметана', qty: '500 гр.'}]
  }

  render(createElement) {
    return (
      <div>
        <section class="container">
          <form onsubmit={this.submit}>
            <fieldset>
              <label for="recipeName">Име</label>
              <input type="text" placeholder="Пълнени чушки (not to be confused with пиперки)" id="recipeName" ref="recipeName" />
              <label for="recipeDescription">Описание</label>
              <textarea placeholder="Намери си чушки..." id="recipeDescription" ref="recipeDescription"></textarea>
              <label for="cookingTime">Време за приготвяне (в минути)</label>
              <input type="number" placeholder="30" id="cookingTime" ref="cookingTime" />
              
              <input type="text" list="category" ref="categoryId" />
              <datalist id="category">
                <option value="1">Вечеря</option>
              </datalist>


              <each product, index in {this.products}>
                <div class="row">
                  <input type="text" list="products" ref="productId" />
                  <input type="text" placeholder="100 кг" ref="productQty" />
                </div>
              </each>
              <datalist id="products">
                <each product, index in {this.allProducts}>
                  <option value={product.id}>{product.name}</option>
                </each>
              </datalist>

              <div>
                <input type="checkbox" id="confirmField" />
                <label class="label-inline" for="confirmField">цък</label>
              </div>
              <input class="button-primary" type="submit" value="Send" />
            </fieldset>
          </form>
        </section>
      </div>
    )
  }
}

oval.registerTag('recipe-addedit', RecipeAddedit)