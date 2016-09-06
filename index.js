const dbConfig = require('./knexfile').development;
const knex = require('knex')(dbConfig);

const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(express.static('public/bin'));

// parse request params into req.body
app.use(bodyParser.urlencoded({
	// type is default but who cares
	type: 'application/x-www-form-urlencoded',
	extended: true
}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/bin/index.html');
});

app.get('/api/recipes', (req, res) => {
    knex
        .select(
            '*', 
            'recipes.name as recipe_name', 
            'categories.name as category_name'
        )
        .from('recipes')
        .leftJoin('categorisables', function() {
            this.on('recipes.id', '=', 'categorisables.categorisable_id')
                .on(knex.raw("'recipes' = categorisables.categorisable_type"))
        })
        .leftJoin('categories', 'categorisables.category_id', 'categories.id')
        .then((recipes) => {
            // format response
            recipes = recipes.map((recipe) => {
                return {
                    id: recipe.id,
                    name: recipe.recipe_name,
                    description: recipe.description,
                    minutesToCook: recipe.minutes_to_cook,
                    categoryId: recipe.category_id,
                    category: recipe.category_name
                };
            });
            res
                .status(200)
                .json(recipes);
        });
});

app.get('/api/categories', (req, res) => {
    knex
        .select()
        .from('categories')
        .then(categories => {
            res
                .status(200)
                .json(categories);
        })
});

app.get('/api/products', (req, res) => {
    knex
        .select()
        .from('products')
        .then(products => {
            res
                .status(200)
                .json(products);
        })
});

app.listen(8080, () => console.log('API listening on port 8080'));