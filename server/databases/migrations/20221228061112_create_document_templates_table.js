/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('document_templates', function (table) {
      table.increments();
      table.string('name').nullable();
      table.string('description').nullable();
      table.jsonb('content').nullable();
      table.string('locale').nullable();
      table.integer('status').nullable();
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
      table.integer('createdBy').nullable().index().references('id').inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
      table.integer('updatedBy').nullable().index().references('id').inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema.dropTable('document_templates');
  };
  