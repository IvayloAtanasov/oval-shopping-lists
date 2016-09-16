const dbConfig = require('./knexfile').development;
const knex = require('knex')(dbConfig);

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

app.get('/api/recipes', (req, res) => {
    knex
        .select(
            '*', 
            'recipes.id as id',
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

app.get('/api/recipes/:id', (req, res) => {
    console.log(req.params.id);

    // TODO: query db, return recipe with category and products ids
    // make it the same as get all recipes

    res
        .status(200)
        .json({});
});

app.post('/api/recipes', (req, res) => {
    let { recipeName, recipeDescription, minutesToCook,
        category, products} = req.body;

    // TODO: params validation

    //console.log( recipeName, recipeDescription, minutesToCook, category, products);

    knex.transaction(trx => {

        // insert recipe
        return trx
            .insert({
                name: recipeName, 
                description: recipeDescription, 
                minutes_to_cook: minutesToCook
            }, 'id')
            .into('recipes')
            .then(recipeId => {
                recipeId = recipeId[0];
                console.log('inserted recipeID', recipeId);
                // insert category
                return new Promise((resolve, reject) => {
                    // link recipe to category in pivot table
                    // returns categoryId in resolver
                    function setRecipeCategory(recipeId, categoryId) {
                        return trx
                            .insert({
                                categorisable_id: recipeId,
                                categorisable_type: 'recipes',
                                category_id: categoryId
                            })
                            .into('categorisables')
                            .then(() => categoryId);
                    }

                    const categoryId = category.id;
                    if (categoryId) {
                        return setRecipeCategory(recipeId, categoryId)
                            .then(resolve)
                            .catch(reject);
                    } else {
                        // no such category, create one, then insert
                        return trx
                            .insert({name: category.name}, 'id')
                            .into('categories')
                            .then(categoryId => {
                                return setRecipeCategory(recipeId, categoryId);
                            })
                            .then(resolve)
                            .catch(reject);
                    }
                })
                .then(categoryId => {
                    console.log('inserted categoryId', categoryId);

                    function setRecipeProduct(recipeId, productId, quantity) {
                        return trx
                            .insert({
                                product_id: productId,
                                recipe_id: recipeId,
                                quantity: quantity
                            })
                            .into('product_recipes')
                            .then(() => productId);
                    }

                    let productInsertPromises = [];
                    products.forEach(product => {
                        let productPromise = new Promise((resolve, reject) => {
                            const productId = product.id;
                            if (productId) {
                                return setRecipeProduct(recipeId, productId, product.qty)
                                .then(resolve)
                                .catch(reject);
                            } else {
                                // no such product, create one then set to this recipe
                                return trx
                                    .insert({name: product.name}, 'id')
                                    .into('products')
                                    .then(productId => {
                                        return setRecipeProduct(recipeId, productId, product.qty);
                                    })
                                    .then(resolve)
                                    .catch(reject);
                            }
                        });

                        productInsertPromises.push(productPromise);
                    });

                    return Promise.all(productInsertPromises)
                        .then(productIds => {
                            console.log(`inserted ${productIds.length} products`);

                            return 'All records inserted';
                        });
                });
            })
    })
    .then(successMsg => {
        console.log(successMsg);
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

app.put('/api/recipes', (req, res) => {
    // TODO: edit recipe. Reuse from post recipe
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