
exports.seed = function (knex, Promise) {
  const data = [
    {
      "id": "1",
      "roleId": "1",
      "permissionId": "1",
      "value": "15",
      "key": "root",
    }
  ]

  // Deletes ALL existing entries
  return knex('role_permissions').del()
    .then(async () => {
      // Inserts seed entries
      await knex('role_permissions').insert(data);
      await knex.raw('select setval(\'role_permissions_id_seq\', max(id)) from role_permissions');
    });
};
