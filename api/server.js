const express = require('express');
//we need to initialize our server as instanse of express aplication
const server = express();
const authRouter = require('../routers/auth/authRouter');
const usersRouter = require('../routers/users/usersRouter');
const authorization = require('../routers/middleware/authorization');
const restaurantsRouter = require('../routers/restaurants/restaurantsRouter');

require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const fileupload = require('express-fileupload');

server.use(express.urlencoded({extended: true}));
server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(fileupload({
    useTempFiles: true,
}));

server.use('/auth', authRouter);
server.use('/users', authorization, usersRouter);
server.use('/restaurants', authorization, restaurantsRouter);

server.get('/', (req, res) => {
    res.status(200).json('Server is up :)');
});

module.exports = server;