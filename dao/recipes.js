const knex = require('knex');
const Base = require('./base');

class Recipes extends Base {

    constructor() {
        super();
        this.table = 'recipes';
    }

    categories() {
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

}

module.exports = new Recipes();