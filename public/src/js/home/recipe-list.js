const oval = require('organic-oval')

class RecipeList {
  constructor(rootEl, props, attrs) {
    oval.BaseTag(this, rootEl, props, attrs)
  }

  render(createElement) {
    return (
      <table>
        <thead>
          <tr>
            <th>Име</th>
            <th>Категория</th>
            <th>Време за приготвяне</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Stephen Curry</td>
            <td>27</td>
            <td>1,91</td>
            <td>1,91</td>
          </tr>
          <tr>
            <td>Klay Thompson</td>
            <td>25</td>
            <td>2,01</td>
            <td>2,01</td>
          </tr>
        </tbody>
      </table>
    )
  }
}

oval.registerTag('recipe-list', RecipeList)