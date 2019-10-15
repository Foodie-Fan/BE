require('dotenv').config({ path: "../../.env"});
const environment = process.env.NODE_ENV;

const configFile = require('../knexfile')[environment];

module.exports = require('knex')(configFile);