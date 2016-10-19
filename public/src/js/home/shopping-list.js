const oval = require('organic-oval')

class ShoppingList {
  constructor(rootEl, props, attrs) {
    oval.BaseTag(this, rootEl, props, attrs)

    this.removeItem = (id) => {

    }
  }

  render(createElement) {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Име</th>
              <th>Категория</th>
              <th>Минути</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr class="recipe-row">
              <td>Торта</td>
              <td>Десерти</td>
              <td>90</td>
              <td>
                <button 
                  type="button"
                  class="button button-clear button-small"
                  onclick={this.removeItem.bind(this, 1)}>
                    <i class="fa fa-calendar-times-o fa-2" aria-hidden="true"></i>
                </button>
              </td>
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