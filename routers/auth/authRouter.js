const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('./authDB');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({path: "../../.env"});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const imagePath = "https://res.cloudinary.com/krik13333/image/upload/v1583272561/il_fullxfull.1009061980_zajb_lwprk1_j4i7w8.png";

router.post('/register', validateUser, hashPassword, uploadImage, (req, res) => {
    const user = req.body;
    console.log('STEP 4 ', user);
    db.add(user)
        .then(([user]) => {
            res.status(201).json(user)
        })
        .catch(err => res.status(500).json({error: "There was an error while saving the user to the database."}))

});

function validateUser(req, res, next) {
    const user = req.body;
    db.findBy({username: user.username})
        .then(validateUserName => {
            if (validateUserName.length) {
                res.status(400).json({errorMessage: "Username already exists."})
            } else {
                console.log('STEP 1');
                user.username && user.password && user.name ? next() : res.status(400).json({errorMessage: 'Invalid Data.'});
            }
        });
}

function hashPassword(req, res, next) {
    const user = req.body;
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) res.status(500).json({error: err});
        if (hash) {
            user.password = hash;
            req.user = user;
            console.log('STEP 2 ', user);
            next();
        }

    });
}

function uploadImage(req, res, next) {
    const user = req.body;

    if (req.files) {
        const {avatar} = req.files;
        console.log(req.files);
        cloudinary.uploader.upload(avatar.tempFilePath, function (err, result) {
            err ? res.status(500).json({error: err})
                : user.avatar = result.url;
            console.log('STEP3 v1 ', user);
            next();
        })
    } else {
        user.avatar = imagePath;
        console.log('STEP3 v2 ', user);
        next();
    }
}

router.post('/login', validateCredentials, (req, res) => {
    const {username, password} = req.body;
    db.findBy({username})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user);
                res.status(200).json(token);
            }
        })
});

function validateCredentials(req, res, next) {
    const {username, password} = req.body;
    if (username && password) {
        db.findBy({username})
            .first()
            .then(user => {
                if (user) {
                    next()
                } else {
                    res.status(401).json({errorMessage: "Invalid Credentials"})
                }
            })
    }
}

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username
    };
    const options = {
        expiresIn: '1d'
    };

    return jwt.sign(payload, process.env.API_SECRET, options);
}

module.exports = router;