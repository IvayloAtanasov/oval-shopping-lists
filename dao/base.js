const dbConfig = require('../knexfile').development;
const knex = require('knex')(dbConfig);

class Base {
    constructor() {
        this.db = knex;
        this.table = '';
    }

    builder() {
        this.query = this.db.queryBuilder();

        return this;
    }

    find(id) {
        this.query
            .where(`${this.table}.id`, '=', id);

        return this;
    }

    select(...fields) {
        this.query
            .select(...fields)
            .from(this.table);

            return this;
    }

    then(callback) {
        return this.query.then(resolved => callback(resolved));
    }

    builderEnd() {
        return this.query;
    }
}

module.exports = Base;