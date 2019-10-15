
exports.seed = function(knex) {
  return knex('auth').del()
    .then(function () {
      return knex('auth').insert([
        {id: 1, username: 'sasha', password: "sasha"},
        {id: 2, username: 'vasilii', password: "vasilii"},
        {id: 3, username: 'olya', password: "olya"},
      ]);
    });
};
