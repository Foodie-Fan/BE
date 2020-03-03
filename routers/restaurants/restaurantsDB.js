const db = require('../../db/dbConfig');

module.exports = {
    getAll,
    add,
    findBy,
    remove,
    update
};

function getAll(filter) {
    return db('restaurants')
        .where(filter)
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
        .update({...changes}, '*')
}

function findBy(filter) {
    return db('restaurants')
        .where(filter);
}