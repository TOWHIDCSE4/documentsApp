/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

 exports.up = function(knex) {
  return knex.schema.table('users', function(table) {
    table.string('code').nullable().comment("code generated from id")
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = function(knex) {
  return  knex.schema.table('users', function(table) {
    table.dropColumn('code')
  })
};