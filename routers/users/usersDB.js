const db = require('../../db/dbConfig')

module.exports = {
    findAllPeople,
}



function findAllPeople() {
    return db('users')
        .select('id', 'username', 'name', 'avatar')
}
