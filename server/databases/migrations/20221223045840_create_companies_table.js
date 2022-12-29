/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('companies', function (table) {
        table.increments();
        table.string('name').nullable();
        table.string('sector').nullable();
        table.string('email').nullable();
        table.string('image').nullable();
        table.integer('phoneNumber').nullable();
        table.string('streetAddress').nullable();
        table.integer('appartmentNumber').nullable();
        table.integer('zipCode').nullable();
        table.string('state').nullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('companies');
};