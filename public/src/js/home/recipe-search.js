const oval = require('organic-oval')

class RecipeSearch {
  constructor(rootEl, props, attrs) {
    oval.BaseTag(this, rootEl, props, attrs)
  }

  render(createElement) {
    return (
      <section class="container">
        <div class="row">
          <div class="column">
            <div class="row recipe-controls">
              <div class="column column-75">
                <fieldset class="search-holder">
                  <input type="text" placeholder="Търсиш рецепта" />
                </fieldset>
              </div>
              <div class="column column-25">
                <button class="button button-outline">Добави нова</button>
              </div>
            </div>
          </div>
          <div class="column column-25 column-offset-25">
            <blockquote>
              "Не е яко да си готин, готино е да си як!"
              <p>Паоло Ко-не лю</p>
            </blockquote>
          </div>
        </div>
      </section>
    )
  }
}

oval.registerTag('recipe-search', RecipeSearch)