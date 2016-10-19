# Oval shopping lists

## A partial implementation of a shopping lists app with recipies and products made with ['organic-oval'](https://github.com/camplight/organic-oval) library.

### You should be able to:
* Perform CRUD operations on all recipes
* When creating or editing a recipe: add a product or category that already exists via autocomplete

### Not implemented features:
* Creating a shopping list (ironically)
* Send email with shopping list
* Search throught the recipes
* Note that bundle.js will not contain the libraries from bower

### Prerequisites
* NodeJS v6.3.0
* MySQL v5.6.17

### Setup
* run ``npm install`` to fetch all npm depencencies
* make a new db named 'oval-shopping-lists' (see knexfile.js for details)
* run ``./node_modules/bin/knex migrate latest`` to create your db tables
* run ``bower install`` to fetch all frontend depencencies
* run ``npm run build`` to build frontend bundle
* run ``npm start`` to start the server on port 8080
