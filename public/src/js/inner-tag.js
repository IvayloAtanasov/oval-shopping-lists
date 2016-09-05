const oval = require('organic-oval')

class InnerTag {
  constructor(rootEl, props, attrs) {
    oval.BaseTag(this, rootEl, props, attrs)
  }

  render(createElement) {
    return (
      <div>
          <p>Some inner content up in this page</p>
      </div>
    )
  }
}

oval.registerTag('inner-tag', InnerTag)
