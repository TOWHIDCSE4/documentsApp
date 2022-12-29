
exports.up = function (knex) {
  return knex.schema.createTable('roles', function (table) {
    table.increments();
    table.string('name').nullable();
    table.text('description').nullable();
    table.integer('parentId').nullable();
    table.string('key').nullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table.integer('createdBy').nullable().index().references('id').inTable('roles')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');
    table.integer('updatedBy').nullable().index().references('id').inTable('roles')
      .onUpdate('CASCADE')
      .onDelete('SET NULL');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('roles');
};
