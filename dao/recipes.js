const knex = require('knex');
const Base = require('./base');

class Recipes extends Base {

    constructor() {
        super();
        this.table = 'recipes';
    }

    // Adds category name as well as category id.
    // Recipes have 1 category (for now).
    joinCategories() {
        this.query
            .select(
                `${this.table}.id as id`,
                `${this.table}.name as recipe_name`, 
                'categories.name as category_name'
            )
            .leftJoin('categorisables', function() {
                // Note: 'this' here refers to categorisables table
                this.on('recipes.id', '=', 'categorisables.categorisable_id')
                    .on(knex.raw("'recipes' = categorisables.categorisable_type"))
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

}

module.exports = new Recipes();