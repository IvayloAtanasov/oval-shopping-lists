const dbConfig = require('./knexfile').development;
const knex = require('knex')(dbConfig);

console.log(knex);


console.log('Hey, Im working ...almost');