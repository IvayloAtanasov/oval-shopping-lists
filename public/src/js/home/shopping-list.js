const oval = require('organic-oval')

class ShoppingList {
  constructor(rootEl, props, attrs) {
    oval.BaseTag(this, rootEl, props, attrs)
  }

  render(createElement) {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Име</th>
              <th>Категория</th>
              <th>Време за приготвяне</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Stephen Curry</td>
              <td>27</td>
              <td>1,91</td>
            </tr>
          </tbody>
        </table>
        <div class="row">
          <div class="column column-25 column-offset-75">
            <button class="button">Създай списък</button>
          </div>
        </div>
        <div class="row">
          <div class="column column-25 column-offset-75">
            <button class="button button-clear">Добави допълнително</button>
          </div>
        </div>
        <div class="row">
          <div class="column column-25 column-offset-75">
            <button class="button">Изпрати email</button>
          </div>
        </div>
      </div>
    )
  }
}

oval.registerTag('shopping-list', ShoppingList)