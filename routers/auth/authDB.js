const db = require('../../db/dbConfig');

module.exports = {
    add,
    findBy,
    remove
};

function add(user) {
    return db('users')
        .insert(user)
        .returning(['id', 'name', 'username', 'avatar']);
}

function findBy(filter) {
    return db('users')
        .where(filter);
}

async function remove(filter) {
    const users = await findBy(filter);
    if (users.length) {
        await db('users')
            .where(filter)
            .del();
        return users;
    } else return null;
}