const oval = require('organic-oval')

require('./recipe-search')
require('./recipe-list')
require('./shopping-list')

class Home {
  constructor(rootEl, props, attrs) {
    oval.BaseTag(this, rootEl, props, attrs)
  }

  render(createElement) {
    return (
      <div>
        <recipe-search></recipe-search>
        <section class="container">
          <div class="row">
            <article class="column">
              <recipe-list></recipe-list>
            </article>
            <article class="column">
              <shopping-list></shopping-list>
            </article>
          </div>
        </section>
      </div>
    )
  }
}

oval.registerTag('home', Home)