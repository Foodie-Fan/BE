//latest
exports.up = function (knex) {
    return knex.schema.createTable('restaurants', (users) => {
        users.increments();

        users.integer('user_id')
            .unsigned()
            .references("id")
            .inTable('users')
            .onDelete("CASCADE")
            .onUpdate("CASCADE")

        //====!!!!!!1 restaurant name is unique !!!!!!======
        users.string('name', 128)
            .unique()
            .notNullable();
        // type of cuisine
        users.string('cuisine', 128);
        users.string('location', 128);
        //hours of operation
        users.string('hours', 30);
        // overall rating
        users.integer('rating')
            .notNullable();
        //====!!!!!! Shorter review like 300 characters !!!!!!======
        users.string('review', 500);
        //====!!!!!! Photo for restaurants is different !!!!!!======
        users.string('photo', 500)
            .notNullable()
            .defaultTo('https://res.cloudinary.com/krik13333/image/upload/v1570241223/il_fullxfull.1009061980_zajb_lwprk1.jpg');
    })
};

//rollback
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('restaurants');
};