const db = require('../../db/dbConfig');

module.exports = {
    getAll,
    add,
    findBy,
    remove,
    update
};

function getAll() {
    return db('restaurants')
}

function add(item) {
    return db('restaurants')
        .insert(item, 'id')
        .then(([id]) => {
            return findBy({id})
        });
}

async function remove(filter) {
    const restaurant = await findBy(filter);
    if (restaurant.length) {
        await db('restaurants')
            .where(filter)
            .del();
        return restaurant;
    } else return null;
}

function update(filter, changes) {
    return db('restaurants')
        .where(filter)
        .update({...changes}, ['id'])
}

function findBy(filter) {
    return db('restaurants')
        .where(filter);
}