const router = require('express').Router();
const db = require('./restaurantsDB');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({path: "../../.env"});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const imagePath = "https://res.cloudinary.com/krik13333/image/upload/v1570241223/il_fullxfull.1009061980_zajb_lwprk1.jpg";


router.post('/', uploadImage, findRestaurant, (req, res) => {
    const restaurant = req.body;
    restaurant.user_id = req.user.id
    db.add(restaurant)
        .then(restaurant_res => res.status(201).json(restaurant_res))
        .catch(err => res.status(500).json({error: "Server could not add a restaurant"}))
});

function findRestaurant(req, res, next) {
    db.findBy({name: req.body.name})
        .then(res => {
            if (res.length > 0) {
                res.status(400).json({error: 'Restaurant name should be unique'})
            } else {
                next()
            }
        })
        .catch(err => res.status(500).json({error: "Server could not retrieve a restaurant"}))
}

function uploadImage(req, res, next) {
    const restaurant = req.body;

    if (req.files) {
        const {photo} = req.files;
        cloudinary.uploader.upload(photo.tempFilePath, function (err, result) {
            err ? res.status(500).json({error: err})
                : restaurant.photo = result.url;
            next();
        })
    } else {
        restaurant.photo = imagePath;
        next();
    }
}

router.get('/', (req, res) => {
    db.getAll({"user_id": req.user.id})
        .then(restaurants => res.status(200).json(restaurants))
        .catch(err => res.status(500).json({error: "Server could not retrieve restaurants"}))
});

function findRest(req, res, next) {
    db.findBy({id: req.params.id})
        .then(([res]) => {
            console.log(' *********** ', res);
            req.restaurant = res;
            next();
        })
        .catch(err => res.status(500).json({error: "Server could not retrieve a restaurant"}))
}

router.put('/:id', uploadImage, findRest, (req, res) => {
    const changes = req.body;
    if (changes.photo === imagePath) {
        delete changes.photo
    } else {
        const {photo} = req.restaurant;
        const id = photo.slice(photo.lastIndexOf('/') + 1, photo.length - 4);
        cloudinary.uploader.destroy(id, function (error, result) {
            console.log("error ", error);
            console.log("result ", result);
        })
    }
    db.update({id: req.params.id}, changes)
        .then(([restaurant_res]) => {
            res.status(200).json(restaurant_res);
        })
        .catch(err => res.status(500).json({error: "Server could not update a restaurant"}))
});

router.delete('/:id', (req, res) => {
    db.remove({id: req.params.id})
        .then(restaurant_res => {
            res.status(200).json(restaurant_res);
            const {photo} = restaurant_res[0];
            if (photo !== imagePath) {
                const id = photo.slice(photo.lastIndexOf('/') + 1, photo.length - 4);
                cloudinary.uploader.destroy(id, function (error, result) {
                    console.log("error ", error);
                    console.log("result ", result);
                })
            }
        })
        .catch(err => res.status(500).json({error: "Server could not delete a restaurant"}))
});


module.exports = router;