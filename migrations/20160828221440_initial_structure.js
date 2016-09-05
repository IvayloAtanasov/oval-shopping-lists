
exports.up = function(knex, Promise) {
	const createCategories = knex.schema.createTable('categories', (t) => {
		t.increments('id');
		t.string('name');
	});

	const createCategorisables = knex.schema.createTable('categorisables', (t) => {
		t.increments('id');
		t.integer('categorisable_id').unsigned().index();
		t.string('categorisable_type', 50).index();
		t.integer('category_id').unsigned();
		t.foreign('category_id').references('categories.id').onDelete('CASCADE');
	});

	const createRecipes = knex.schema.createTable('recipes', (t) => {
		t.increments('id');
		t.string('name');
		t.text('description');
		t.integer('minutes_to_cook').unsigned();
		t.timestamps();
	});

	const createProducts = knex.schema.createTable('products', (t) => {
		t.increments('id');
		t.string('name');
	});

	const createProductRecipes = knex.schema.createTable('product_recipes', (t) => {
		t.increments('id');
		t.integer('product_id').unsigned();
		t.foreign('product_id').references('products.id').onDelete('NO ACTION');
		t.integer('recipe_id').unsigned();
		t.foreign('recipe_id').references('recipes.id').onDelete('CASCADE');
		t.string('quantity', 50);
	});

	const createShoppingLists = knex.schema.createTable('shopping_lists', (t) => {
		t.increments('id');
		t.timestamps();
	});

	const createRecipeShoppingLists = knex.schema.createTable('recipe_shopping_lists', (t) => {
		t.increments('id');
		t.integer('recipe_id').unsigned();
		t.foreign('recipe_id').references('recipes.id').onDelete('NO ACTION');
		t.integer('shopping_list_id').unsigned();
		t.foreign('shopping_list_id').references('shopping_lists.id').onDelete('NO ACTION');
	});

	return Promise.all([
		createCategories, createCategorisables, createRecipes, createProducts, createProductRecipes,
		createShoppingLists, createRecipeShoppingLists
	]);
};

exports.down = function(knex, Promise) {
	const dropCategories = knex.schema.dropTable('categories');
	const dropCategorisables = knex.schema.dropTable('categorisables');
	const dropRecipes = knex.schema.dropTable('recipes');
	const dropProducts = knex.schema.dropTable('products');
	const dropProductRecipes = knex.schema.dropTable('product_recipes');
	const dropShoppingLists = knex.schema.dropTable('shopping_lists');
	const dropRecipeShoppingLists = knex.schema.dropTable('recipe_shopping_lists');

	return Promise.all([
		dropCategorisables, dropCategories, dropProductRecipes, dropProducts,
		dropRecipeShoppingLists, dropRecipes, dropShoppingLists
	]);
};
