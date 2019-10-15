//latest
exports.up = function(knex) {
    return knex.schema.createTable('users', (users) =>{
        users.increments();
        users.string('username', 128)
            .notNullable()
            .unique();
        users.string('name', 300)
            .notNullable();
        users.string('password', 128)
            .notNullable();
        users.string('avatar', 500)
            .notNullable()
            .defaultTo('https://res.cloudinary.com/krik13333/image/upload/v1570241223/il_fullxfull.1009061980_zajb_lwprk1.jpg');
    })
};

//rollback
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};
