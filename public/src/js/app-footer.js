const oval = require('organic-oval')

class AppFooter {
  constructor(rootEl, props, attrs) {
    oval.BaseTag(this, rootEl, props, attrs)
  }

  render(createElement) {
    return (
      <footer class="footer">
        <section class="container">
          <p>Designed in the late hours by aivo</p>
        </section>
      </footer>
    )
  }
}

oval.registerTag('app-footer', AppFooter)