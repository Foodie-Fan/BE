//latest
exports.up = function (knex) {
    return knex.schema.createTable('reviews', (users) => {
        users.increments();
        users.string('name', 128)
            .notNullable();
        // type of cuisine
        users.string('cuisine', 128);
        users.integer('restaurant_id')
            .unsigned()
            .references("id")
            .inTable("restaurants")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        users.string('price', 128);
        // overall rating
        users.integer('rating')
            .notNullable();
        //====!!!!!! Shorter review like 300 characters !!!!!!======
        users.string('review', 500);
        //====!!!!!! Another photo for reviews !!!!!!======
        users.string('photo', 500)
            .notNullable()
            .defaultTo('https://res.cloudinary.com/krik13333/image/upload/v1570241223/il_fullxfull.1009061980_zajb_lwprk1.jpg');
    })
};

//rollback
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('reviews');
};