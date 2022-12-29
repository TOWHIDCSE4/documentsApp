
exports.seed = function (knex, Promise) {
  const data = [
    {
      "id": "1",
      "username": "root",
      "password": "$2b$10$iNT.d38.rdsRvRMU95WTSu0ZMUBi/Dbwsrzw7yu0vT60T9EPu8eNi", // 123456@
      "firstName": "root",
      "lastName": "towhi",
      "roleId": "1",
      "code" : '5c5652e878449245a480bb2ded80fadd',
      "email" : 'tow@gmail.com',
      "image" : '',
      "dateOfBirth" : '10/10/1989',
      "phoneNumber" : '101225555',
      "streetAddress" : 'Hanoi my 10122',
      "appartmentNumber" : '15558562',
      "zipCode" : '8555',
      "state" : 'hanoi',
    }
  ]

  // Deletes ALL existing entries
  return knex('users').del()
    .then(async () => {
      // Inserts seed entries
      await knex('users').insert(data);
      await knex.raw('select setval(\'users_id_seq\', max(id)) from users');
    });
};