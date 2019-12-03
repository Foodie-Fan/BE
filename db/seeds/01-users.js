
exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {id: 1, username: 'sasha1777', name: "Aleksandra Foksman", password: "$2a$10$biVllna/1TTBELRNEanuJeDOvMNt0snFj8msY1bD1jGkU5Bb5LYAC", avatar: "http://res.cloudinary.com/krik13333/image/upload/v1571106602/f6obyrwmul9g53lq1gq7.jpg"},
        {id: 2, username: 'nana1333', name: "Nana", password: "$2a$10$.U/jh1Wf5gjHZSAlfPqoN.TEjBEuJP.kKbc2LPyyM7UxE2ofvSSRm" , avatar: "https://res.cloudinary.com/krik13333/image/upload/v1570241223/il_fullxfull.1009061980_zajb_lwprk1.jpg"},
      ]);
    });
};
