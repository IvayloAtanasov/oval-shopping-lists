
class Base {
  constructor() {
    this.apiUrl = 'http://localhost:8080/api' // TODO: env
  }

  fetch(url) {
    return fetch(`${this.apiUrl}${url}`)
      .then(res => res.json())
      .catch(err => {
        console.error(err)

        return []
      });
  }
}

module.exports = Base