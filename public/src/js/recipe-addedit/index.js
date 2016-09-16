const oval = require('organic-oval')
const recipes = require('../models/recipes')
const categories = require('../models/categories')
const products = require('../models/products')

class RecipeAddedit {
  constructor(rootEl, props, attrs) {
    oval.BaseTag(this, rootEl, props, attrs)

    this.editMode = false
    if (oval.router.state === 'recipe.edit') {
      this.editMode = true
      const recipeId = this.props.id
      // TODO: 1. find recipe, attach products and category from other models
      // 2. some kind of "hey model, please fetch and attach all relations fn"?
      // 3. expose to this.refs
      recipes.get(recipeId)
        .then(recipe => {
          console.log(recipe)
        })
    }

    this.submit = (e) => {
      e.preventDefault()

      // extract values from input ref objects
      let values = {}
      const inputs = this.refs
      Object.keys(inputs).forEach((key) => {
        values[key] = inputs[key].value
      })

      // format category
      let category = {
        id: null,
        name: null
      }
      // if category is new, the name will be passed
      if (isNaN(values.category)) {
        category.name = values.category
      } else {
        category.id = values.category
      }

      // format products and quantities
      let products = []
      const productKeys = Object.keys(values).filter((key) => key.startsWith('product-'))
      const quantityKeys = Object.keys(values).filter((key) => key.startsWith('productQty-'))
      productKeys.forEach((key) => {
          let product = {
            id: null,
            name: null,
            qty: null
          }
          // TODO: this repeats the code above
          if (isNaN(values[key])) {
            product.name = values[key]
          } else {
            product.id = values[key]
          }
          // insert on position extracted from key
          const position = key.split('-')[1]
          products.splice(position, 0, product)
      })
      quantityKeys.forEach((key) => {
        const position = key.split('-')[1]
        products[position].qty = values[key]
      })

      // build recipe object
      let recipe = {
        recipeName: values.recipeName,
        recipeDescription: values.recipeDescription,
        minutesToCook: values.minutesToCook,
        category: category,
        products: products
      }

      recipes.create(recipe)
        .then(() => {
          // redirect home
          oval.router.navigate('/')
        })
    }

    this.addProductRow = () => {
      this.products.push({})
      this.update()
    }

    // load products and categories in datalists
    this.categories = []
    this.products = [{}]
    this.allProducts = []
    const categoriesPromise = categories.get()
      .then(categories => this.categories = categories)
    const productsPromise = products.get()
      .then(products => this.allProducts = products)
    Promise.all([categoriesPromise, productsPromise])
      .then(() => this.update())
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
              <label for="minutesToCook">Време за приготвяне (в минути)</label>
              <input type="number" placeholder="30" id="minutesToCook" ref="minutesToCook" />
              <input type="text" list="category" ref="category" />
              <datalist id="category">
                <each category, index in {this.categories}>
                  <option value={category.id}>{category.name}</option>
                </each>
              </datalist>
              <each product, index in {this.products}>
                <div class="row">
                  <div class="column column-80">
                    <input type="text" list="products" ref={`product-${index}`} />
                  </div>
                  <div class="column column-15 column-offset-5">
                    <input type="text" placeholder="100 кг" ref={`productQty-${index}`} />
                  </div>
                </div>
              </each>
              <datalist id="products">
                <each product, index in {this.allProducts}>
                  <option value={product.id}>{product.name}</option>
                </each>
              </datalist>
              <div class="row">
                <div class="column column-10 column-offset-90">
                  <div class="float-right">
                    <button type="button" class="button button-outline" onclick={this.addProductRow}>&#10133;</button>
                  </div>
                </div>
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