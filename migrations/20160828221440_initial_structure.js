
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

	const createRecipies = knex.schema.createTable('recipies', (t) => {
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

	const createProductRecipies = knex.schema.createTable('product_recipies', (t) => {
		t.increments('id');
		t.integer('product_id').unsigned();
		t.foreign('product_id').references('products.id').onDelete('NO ACTION');
		t.integer('recipe_id').unsigned();
		t.foreign('recipe_id').references('recipies.id').onDelete('CASCADE');
		t.string('quantity', 50);
	});

	const createShoppingLists = knex.schema.createTable('shopping_lists', (t) => {
		t.increments('id');
		t.timestamps();
	});

	const createRecipeShoppingLists = knex.schema.createTable('recipe_shopping_lists', (t) => {
		t.increments('id');
		t.integer('recipe_id').unsigned();
		t.foreign('recipe_id').references('recipies.id').onDelete('NO ACTION');
		t.integer('shopping_list_id').unsigned();
		t.foreign('shopping_list_id').references('shopping_lists.id').onDelete('NO ACTION');
	});

	return Promise.all([
		createCategories, createCategorisables, createRecipies, createProducts, createProductRecipies,
		createShoppingLists, createRecipeShoppingLists
	]);
};

exports.down = function(knex, Promise) {
	const dropCategories = knex.schema.dropTable('categories');
	const dropCategorisables = knex.schema.dropTable('categorisables');
	const dropRecipies = knex.schema.dropTable('recipies');
	const dropProducts = knex.schema.dropTable('products');
	const dropProductRecipies = knex.schema.dropTable('product_recipies');
	const dropShoppingLists = knex.schema.dropTable('shopping_lists');
	const dropRecipeShoppingLists = knex.schema.dropTable('recipe_shopping_lists');

	return Promise.all([
		dropCategorisables, dropCategories, dropProductRecipies, dropProducts,
		dropRecipeShoppingLists, dropRecipies, dropShoppingLists
	]);
};
