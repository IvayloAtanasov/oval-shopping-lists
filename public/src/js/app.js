const oval = require('organic-oval')
const Navigo = require('navigo')
oval.init()

require('./app-header')
require('./home')
require('./recipe-addedit')
require('./app-footer')

class App {
  constructor(rootEl, props, attrs) {
    oval.BaseTag(this, rootEl, props, attrs)

    oval.router = new Navigo()
    oval.router.state = null
    this.routeParams = null
    oval.router.on({
      '/recipe/add': {
        as: 'recipe.add',
        uses: () => {
          oval.router.state = 'recipe.add'
          this.update()
        }
      },
      '/recipe/:id/edit': {
        as: 'recipe.edit',
        uses: (params) => {
          this.routeParams = params
          oval.router.state = 'recipe.edit'
          this.update()
        }
      },
      '/recipe/:id': {
        as: 'recipe.show',
        uses: () => {
          oval.router.state = 'recipe.show'
          this.update()
        }
      },
      '*': {
        as: 'home',
        uses: () => {
          oval.router.state = 'home'
          this.update()
        }
      },
    })
    .resolve() // Note: no code executes after resolve()
  }

  render(createElement) {
    return (
      <div>
        <app-header></app-header>

        <home if={oval.router.state === 'home'}></home>
        <recipe-addedit if={oval.router.state === 'recipe.add'}></recipe-addedit>
        <recipe-addedit if={oval.router.state === 'recipe.edit'} prop-id={this.routeParams.id}></recipe-addedit>

        <app-footer></app-footer>
      </div>
    )
  }
}

oval.registerTag('app', App)

oval.mountAll(document.body)