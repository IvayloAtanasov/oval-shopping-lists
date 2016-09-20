const dbConfig = require('./knexfile').development;
const knex = require('knex')(dbConfig);

const recipes = require('./dao/recipes');

const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(express.static('public/bin'));

// parse request params into req.body
app.use(bodyParser.json({
    type: 'application/json'
}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/bin/index.html');
});

/**
 * Request body:
 * {}
 *
 * Response body:
 * [{
 *     "id": Number,
 *     "name": String,
 *     "description": String,
 *     "minutesToCook": Number,
 *     "categoryId": Number,
 *     "category": String,
 *     "products": [
 *       {
 *         "id": Number,
 *         "name": String,
 *         "quantity": String
 *       }
 *     ]
 * }]
 */
app.get('/api/recipes', (req, res) => {
    recipes
        .builder()
        .select('*')
        .joinCategories()
        .joinProducts()
        .then(recipes => {
            // format response
            recipes = compactRecipesIntoJson(recipes);

            res
                .status(200)
                .json(recipes);
        });
});

/**
 * Request body:
 * {}
 *
 * Response body:
 * {
 *     "id": Number,
 *     "name": String,
 *     "description": String,
 *     "minutesToCook": Number,
 *     "categoryId": Number,
 *     "category": String,
 *     "products": [
 *       {
 *         "id": Number,
 *         "name": String,
 *         "quantity": String
 *       }
 *     ]
 * }
 */
app.get('/api/recipes/:id', (req, res) => {
    const recipeId = req.params.id;

    recipes
        .builder()
        .find(recipeId)
        .select('*')
        .joinCategories()
        .joinProducts()
        .then(records => {
            if (!records.length) {
                return res
                    .status(404)
                    .json({
                        error: 'Recipe not found.'
                    });
            }

            // found
            // compact records into recipe objects
            const recipes = compactRecipesIntoJson(records);

            if (recipes.length !== 1)
                throw new Error('Response records should contain only one recipe!');

            // format response
            let recipe = recipes[0];

            return res
                .status(200)
                .json(recipe);
        });
});

// TODO: export in route file as private helper
function compactRecipesIntoJson(records) {
    let recipes = {};
    records.forEach(record => {
        const recipeId = record.id;
        if (recipeId in recipes) {
            // add products of existing recipe
            recipes[recipeId].products.push({
                id: record.product_id,
                name: record.product_name,
                quantity: record.quantity
            });
        } else {
            // add new recipe to list
            let products = [];
            if (record.product_id) {
                products.push({
                    id: record.product_id,
                    name: record.product_name,
                    quantity: record.quantity
                });
            }
            recipes[recipeId] = {
                id: recipeId,
                name: record.recipe_name,
                description: record.description,
                minutesToCook: record.minutes_to_cook,
                categoryId: record.category_id,
                category: record.category_name,
                products: products
            };
        }
    });
    // cast to array
    const recipesList = Object.keys(recipes).map(recipeId => recipes[recipeId]);

    return recipesList;
}

/**
 * Request body:
 * { 
 *     recipeName: String, 
 *     recipeDescription: String, 
 *     minutesToCook: Number,
 *     category: {
 *         id: Number [Optional],
 *         name: String [Optional]
 *     }, 
 *     products: [{
 *         id: Number [Optional],
 *         name: String [Optional],
 *         qty: String
 *     }]
 * }
 *
 * Response body:
 * {
 *     msg: String
 * }
 */
app.post('/api/recipes', (req, res) => {
    const { recipeName, recipeDescription, minutesToCook,
        category, products} = req.body;

    // TODO: params validation

    //console.log( recipeName, recipeDescription, minutesToCook, category, products);

    recipes
        .insert(recipeName, recipeDescription, minutesToCook, category, products)
        .then(successMsg => {
            // TODO: how to return the new recipe here? + new products if any
            res
                .status(200)
                .json({
                    msg: successMsg
                });
        })
        .catch(err => {
            console.log(err);
            res
                .status(500)
                .json({
                    error: err
                });
        });
});


/**
 * Request body:
 * { 
 *     recipeName: String, 
 *     recipeDescription: String, 
 *     minutesToCook: Number,
 *     category: {
 *         id: Number [Optional],
 *         name: String [Optional]
 *     }, 
 *     products: [{
 *         id: Number [Optional],
 *         name: String [Optional],
 *         qty: String
 *     }]
 * }
 *
 * Response body:
 * {
 *     msg: String
 * }
 */
app.put('/api/recipes/:id', (req, res) => {
    const recipeId = req.params.id;
    const { recipeName, recipeDescription, minutesToCook,
        category, products} = req.body;

    // TODO: params validation

    recipes
        .update(recipeId, recipeName, recipeDescription, minutesToCook, category, products)
        .then(() => {
            // TODO: how to return the updated recipe here? + new products if any
            res
                .status(200)
                .json({
                    msg: `Recipe updated (with new id)`
                });
        })
        .catch(err => {
            console.log(err);
            res
                .status(500)
                .json({
                    error: err
                });
        });
});


/**
 * Request body:
 * {}
 *
 * Response body:
 * {}
 */
app.delete('/api/recipes/:id', (req, res) => {
    const recipeId = req.params.id;
    // seek and destroy
    recipes
        .delete(recipeId)
        .then(() => {
            res
                .status(200)
                .json({});
        })
        .catch(err => {
            res
                .status(500)
                .json({
                    error: err
                });
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
        });
});

app.get('/api/products', (req, res) => {
    knex
        .select()
        .from('products')
        .then(products => {
            res
                .status(200)
                .json(products);
        });
});

app.listen(8080, () => console.log('API listening on port 8080'));