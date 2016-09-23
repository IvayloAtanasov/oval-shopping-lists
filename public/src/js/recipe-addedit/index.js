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
          this.categoryName = recipe.category
          this.products = recipe.products
          this.update()
        })
    }

    // load products and categories in datalists
    this.injectDirectives({
      'products-autocomplete': (tag, directiveName) => {
        return {
          postCreate: (el, productsList) => {
            // reselect element in DOM
            // this fixes "Cannot read property 'insertBefore' of null" in autocomplete.js
            const refAttr = el.attributes['ref'].value
            el = document.querySelector(`body input[ref="${refAttr}"]`)

            const productOptions = Array.from(productsList, product => {
              return {label: product.name, value: product.name}
            })

            // init with timeout just because..
            // http://stackoverflow.com/questions/37495059/failed-to-execute-removechild-on-node-parameter-1-is-not-of-type-node
            setTimeout(() => {
              new Awesomplete(el, {
                list: productOptions
              })
            })
          }
        }
      },
      'categories-autocomplete': (tag, directiveName) => {
        return {
          postCreate: (el, categoriesList) => {
            // reselect element in DOM to get parent reference
            const refAttr = el.attributes['ref'].value
            el = document.querySelector(`input[ref="${refAttr}"]`)

            const categoryOptions = Array.from(categoriesList, category => {
              return {label: category.name, value: category.name}
            })

            // Timeout fixes DOMException: 
            // Failed to execute 'insertBefore' on 'Node': 
            // The node before which the new node is to be inserted is not a child of this node.
            // similar to the problem with products-autocomplete
            setTimeout(() => {
              new Awesomplete(el, {
                list: categoryOptions
              })
            })
          }
        }
      }
    })

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
      // map category to id
      const categoryId = this.findIdByName(this.allCategories, values.category)
      if (categoryId) {
        category.id = categoryId
      } else {
        // if not found in categories list, category is new
        category.name = values.category
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
          // map input content to id
          const productId = this.findIdByName(this.allProducts, values[key])
          if (productId) {
            // product already exist, set id
            product.id = productId
          } else {
            // product is new, set as name, id remains null
            product.name = values[key]
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

    this.allProducts = []
    products.get()
      .then(products => {
        this.allProducts = products
        this.update()
      })

    this.allCategories = []
    categories.get()
      .then(categories => {
        this.allCategories = categories
        this.update()
      })

    this.findIdByName = (collecton, name) => {
      console.log(collecton)
      const found = collecton.find(entry => entry.name === name)
      return found ? found.id : 0
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
              <input categories-autocomplete={this.allCategories}
                type="text" 
                ref="category" 
                value={this.categoryName} />
              <each product, index in {this.products}>
                <div class="row">
                  <div class="column column-80">
                    <input products-autocomplete={this.allProducts}
                      type="text"
                      ref={`product-${index}`} 
                      value={product.name} />
                  </div>
                  <div class="column column-15 column-offset-5">
                    <input type="text" placeholder="100 кг" ref={`productQty-${index}`} value={product.quantity} />
                  </div>
                </div>
              </each>
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