const oval = require('organic-oval')
const Navigo = require('navigo')
oval.init()

require('./inner-tag')
require('./app-header')
require('./home')
require('./app-footer')


class App {
  constructor(rootEl, props, attrs) {
    oval.BaseTag(this, rootEl, props, attrs)

    this.items = [1, 2, 3]

    this.state;
    var router = oval.router = new Navigo()
    router.on({
        '/away': () => {
          console.log('away')
          this.state = 'away'
          this.update()
        },
        '*': () => {
          console.log('home')
          this.state = 'home'
          this.update()
        },
    })
    .resolve() // Note: no code executes after resolve()
  }

  show() {
    return false
  }

  render(createElement) {
    return (
      <div>
          <h1 if={this.show()} style="color: red; text-align: center">
            Hello Organic World Hidden!
          </h1>
          <h1 if={!this.show()} style="color: green; text-align: center">
            Hello Organic World omg omg omg its working!
          </h1>

          <ul>
            <each itemValue, itemIndex in {this.items}>
              <li>{itemIndex} - {itemValue}</li>
            </each>
          </ul>
          <inner-tag></inner-tag>

          <app-header></app-header>
          <home if={this.state === 'home'}></home>
          <div if={this.state === 'away'}>
            <h1 style="color: blue; text-align: center">Away tab</h1>
          </div>
          <app-footer></app-footer>
      </div>
    )
  }
}

oval.registerTag('app', App)

oval.mountAll(document.body)