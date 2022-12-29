
exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('username').notNullable();
    table.string('password').notNullable();
    table.string('firstName').nullable();
    table.string('lastName').nullable();
    table.string('email').nullable();
    table.string('image').nullable();
    table.timestamp('dateOfBirth').nullable();
    table.integer('phoneNumber').nullable();
    table.integer('roleId').index().references('id').inTable('roles')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
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

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};