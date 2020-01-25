const router = require('express').Router();
const db = require('./reviewsDB');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({path: "../../.env"});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const imagePath = "https://res.cloudinary.com/krik13333/image/upload/v1570241223/il_fullxfull.1009061980_zajb_lwprk1.jpg";


router.post('/', uploadImage, (req, res) => {
    const review = req.body;
    review.user_id = req.user.id
    db.add(review)
        .then(review_res => res.status(201).json(review_res))
        .catch(err => res.status(500).json({error: "Server could not add a review"}))
});

function uploadImage(req, res, next) {
    const review = req.body;

    if (req.files) {
        const {photo} = req.files;
        cloudinary.uploader.upload(photo.tempFilePath, function (err, result) {
            err ? res.status(500).json({error: err})
                : review.photo = result.url;
            next();
        })
    } else {
        review.photo = imagePath;
        next();
    }
}

router.get('/', (req, res) => {
    db.getAll({"reviews.user_id": req.user.id})
        .then(reviews => res.status(200).json(reviews))
        .catch(err => res.status(500).json({error: "Server could not retrieve reviews"}))
});

router.get('/all/:user_id', (req, res) => {
    db.getAll({"reviews.user_id": req.params.user_id})
        .then(reviews => res.status(200).json(reviews))
        .catch(err => res.status(500).json({error: "Server could not retrieve reviews"}))
});

function findRest(req, res, next) {
    db.findBy({id: req.params.id})
        .then(([res]) => {
            console.log(' *********** ', res);
            req.review = res;
            next();
        })
        .catch(err => res.status(500).json({error: "Server could not retrieve a restaurant"}))
}

router.put('/:id', uploadImage, findRest, (req, res) => {
    const changes = req.body;
    if (changes.photo === imagePath) {
        delete changes.photo
    } else {
        const {photo} = req.review;
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
        .catch(err => res.status(500).json({error: "Server could not update a review"}))
});

router.delete('/:id', (req, res) => {
    db.remove({id: req.params.id})
        .then(review_res =>{
            res.status(200).json(review_res);
            const {photo} = review_res[0];
            if(photo !== imagePath){
                const id = photo.slice(photo.lastIndexOf('/') + 1, photo.length - 4);
                cloudinary.uploader.destroy(id, function (error, result) {
                    console.log("error ", error);
                    console.log("result ", result);
                })
            }
        })
        .catch(err => res.status(500).json({error: "Server could not delete a review"}))
});


module.exports = router;