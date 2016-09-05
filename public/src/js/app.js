const oval = require('organic-oval')
oval.init()

require('./inner-tag')
require('./app-header')
require('./home')
require('./app-footer')

class App {
  constructor(rootEl, props, attrs) {
    oval.BaseTag(this, rootEl, props, attrs)

    this.items = [1, 2, 3]
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
          <home></home>
          <app-footer></app-footer>
      </div>
    )
  }
}

oval.registerTag('app', App)

oval.mountAll(document.body)