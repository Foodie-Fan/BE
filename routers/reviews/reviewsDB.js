const db = require('../../db/dbConfig');

module.exports = {
    getAll,
    add,
    findBy,
    remove,
    update
};

function getAll(filter) {
    return db('reviews')
        .join('restaurants', 'reviews.restaurant_id', 'restaurants.id')
        .where(filter)
        .select('reviews.id', 'reviews.name', 'reviews.cuisine', 'reviews.rating', 'reviews.price', 'reviews.review', 'reviews.photo', 'restaurants.name as restaurant', 'reviews.restaurant_id',)
}

function add(item) {
    return db('reviews')
        .insert(item, 'id')
        .then(([id]) => {
            return findBy({id})
        });
}

async function remove(filter) {
    const reviews = await findBy(filter);
    if (reviews.length) {
        await db('reviews')
            .where(filter)
            .del();
        return reviews;
    } else return null;
}

function update(filter, changes) {
    return db('reviews')
        .where(filter)
        .update({...changes}, ['id'])
}

function findBy(filter) {
    return db('reviews')
        .where(filter);
}