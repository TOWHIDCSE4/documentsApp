
exports.seed = function (knex, Promise) {
  const data = [
    {
      "id": "1",
      "name": "root",
      "description": "root",
      "value": "15",
      "key": "root",
    },
    {
      "id": "2",
      "name": "users",
      "description": "users",
      "value": "15",
      "key": "users",
    },
    {
      "id": "3",
      "name": "roles",
      "description": "roles",
      "value": "15",
      "key": "roles",
    },
    {
      "id": "4",
      "name": "adminDecentralization",
      "description": "adminDecentralization",
      "value": "2",
      "key": "adminDecentralization",
    },
    {
      "id": "5",
      "name": "dashboard",
      "description": "dashboard",
      "value": "4",
      "key": "dashboard",
    }
  ]

  // Deletes ALL existing entries
  return knex('permissions').del()
    .then(async () => {
      // Inserts seed entries
      await knex('permissions').insert(data);
      await knex.raw('select setval(\'permissions_id_seq\', max(id)) from permissions');
    });
};
