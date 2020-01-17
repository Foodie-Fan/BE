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
    db.getAll()
        .then(restaurants => res.status(200).json(restaurants))
        .catch(err => res.status(500).json({error: "Server could not retrieve restaurants"}))
});
router.put('/:id', (req, res) => {
    db.update({id: req.params.id})
        .then(restaurant_res => res.status(200).json(restaurant_res))
        .catch(err => res.status(500).json({error: "Server could not update a restaurant"}))

});

router.delete('/:id', (req, res) => {
    db.remove({id: req.params.id})
        .then(restaurant_res => res.status(200).json(restaurant_res))
        .catch(err => res.status(500).json({error: "Server could not update a restaurant"}))
});


module.exports = router;