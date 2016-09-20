const Base = require('./base');

class Recipes extends Base {

    constructor() {
        super();
        this.table = 'recipes';
    }

    // Adds category name as well as category id.
    // Recipes have 1 category (for now).
    joinCategories() {
        const db = this.db;
        this.query
            .select(
                `${this.table}.id as id`,
                `${this.table}.name as recipe_name`, 
                'categories.name as category_name'
            )
            .leftJoin('categorisables', function() {
                // Note: 'this' here refers to categorisables table
                this.on('recipes.id', '=', 'categorisables.categorisable_id')
                    .on(db.raw("'recipes' = categorisables.categorisable_type"))
            })
            .leftJoin('categories', 'categorisables.category_id', 'categories.id');

            return this;
    }

    // Adds products of recipes with their quantities.
    // Keep in mind that 1 recipe can have multiple products e.g. resulting table can have
    // several records for one recipe.
    joinProducts() {
        this.query
            .select(
                `${this.table}.id as id`,
                `${this.table}.name as recipe_name`,
                'products.name as product_name'
            )
            .leftJoin('product_recipes', `${this.table}.id`, 'product_recipes.recipe_id')
            .leftJoin('products', 'product_recipes.product_id', 'products.id');

            return this;
    }

    insert(recipeName, recipeDescription, minutesToCook, category, products) {
        return this.db.transaction(trx => {

            // insert recipe
            return trx
                .insert({
                    name: recipeName, 
                    description: recipeDescription, 
                    minutes_to_cook: minutesToCook
                }, 'id')
                .into(this.table)
                .then(recipeId => {
                    recipeId = recipeId[0];
                    //console.log('inserted recipeID', recipeId);
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
                        //console.log('inserted categoryId', categoryId);

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
                                //console.log(`inserted ${productIds.length} products`);

                                return 'All records inserted';
                            });
                    });
                });
        });
    }

    delete(recipeId) {
        return this.db.transaction(trx => {
            // detach products - delete from product_recipes
            return trx
                .del()
                .from('product_recipes')
                .where('recipe_id', recipeId)
                .then(deletedCount => {
                    console.log(`Deleted ${deletedCount} records from product recipes.`);
                    // detach category - delete from categorisables
                    return trx
                        .del()
                        .from('categorisables')
                        .where({
                            categorisable_id: recipeId,
                            categorisable_type: 'recipes'
                        })
                        .then(deletedCount => console.log(`Detached ${deletedCount} categories from recipe.`));
                })
                .then(() => {
                    // delete recipe
                    return trx
                        .del()
                        .from(this.table)
                        .where('id', recipeId)
                        .then(deletedCount => console.log(`Deleted ${deletedCount} recipe`));
                });
        });
    }

    update(recipeId, recipeName, recipeDescription, minutesToCook, category, products) {

    }

}

module.exports = new Recipes();