const oval = require('organic-oval')

class AppHeader {
  constructor(rootEl, props, attrs) {
    oval.BaseTag(this, rootEl, props, attrs)
  }

  render(createElement) {
    return (
      <header class="header">
        <section class="container">
          <h1>Да ядем!</h1>
          <p>Добави си рецепти и създай списък за пазаруване</p>
        </section>
      </header>
    )
  }
}

oval.registerTag('app-header', AppHeader)
