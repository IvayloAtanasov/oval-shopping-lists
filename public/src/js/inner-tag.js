const oval = require('organic-oval')

class InnerTag {
  constructor(tagName, root) {
    oval.BaseTag(this, tagName, root)
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
