const oval = require('organic-oval')
const recipes = require('../models/recipes')
const categories = require('../models/categories')
const products = require('../models/products')

class RecipeAddedit {
  constructor(rootEl, props, attrs) {
    oval.BaseTag(this, rootEl, props, attrs)

    // set initial form values
    this.products = [{id: null, quantity: null}]

    this.editMode = oval.router.state === 'recipe.edit'
    if (this.editMode) {
      const recipeId = this.props.id

      recipes.get(recipeId)
        .then(recipe => {
          console.log(recipe)
          // reset products array first
          // this fixes null first input row values bug when reasigning products
          this.products = []
          this.update()

          this.id = recipe.id
          this.name = recipe.name
          this.description = recipe.description
          this.minutesToCook = recipe.minutesToCook
          this.categoryId = recipe.categoryId
          this.products = recipe.products
          this.update()
        })
    }

    // load products and categories in datalists
    this.allCategories = []
    this.allProducts = []
    const categoriesPromise = categories.get()
      .then(categories => this.allCategories = categories)
    const productsPromise = products.get()
      .then(products => this.allProducts = products)
    Promise.all([categoriesPromise, productsPromise])
      .then(() => this.update())

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

      // call API
      if (this.editMode) {
        recipes.update(this.id, recipe)
          .then(() => {
            // redirect home
            oval.router.navigate('/')
          })
      } else {
        recipes.create(recipe)
          .then(() => {
            // redirect home
            oval.router.navigate('/')
          })
      }
    }

    this.addProductRow = () => {
      this.products.push({id: null, quantity: null})
      this.update()
    }
  }

  render(createElement) {
    return (
      <div>
        <section class="container">
          <form onsubmit={this.submit}>
            <fieldset>
              <label for="recipeName">Име</label>
              <input 
                type="text" 
                placeholder="Пълнени чушки (not to be confused with пиперки)" 
                id="recipeName" 
                ref="recipeName"
                value={this.name} />
              <label for="recipeDescription">Описание</label>
              <textarea 
                placeholder="Намери си чушки..." 
                id="recipeDescription" 
                ref="recipeDescription">
                {this.description}
              </textarea>
              <label for="minutesToCook">Време за приготвяне (в минути)</label>
              <input 
                type="number" 
                placeholder="30" 
                id="minutesToCook" 
                ref="minutesToCook"
                value={this.minutesToCook} />
              <input 
                type="text" 
                list="category" 
                ref="category" 
                value={this.categoryId} />
              <datalist id="category">
                <each category, index in {this.allCategories}>
                  <option value={category.id}>{category.name}</option>
                </each>
              </datalist>
              <each product, index in {this.products}>
                <div class="row">
                  <div class="column column-80">
                    <input type="text" list="products" ref={`product-${index}`} value={product.id} />
                  </div>
                  <div class="column column-15 column-offset-5">
                    <input type="text" placeholder="100 кг" ref={`productQty-${index}`} value={product.quantity} />
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