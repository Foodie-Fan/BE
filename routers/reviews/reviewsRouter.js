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
    console.log('CREATE REVIEW ', review);
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
    db.getAll()
        .then(reviews => res.status(200).json(reviews))
        .catch(err => res.status(500).json({error: "Server could not retrieve reviews"}))
});

router.put('/:id', (req, res) => {
    db.update({id: req.params.id})
        .then(review_res => res.status(200).json(review_res))
        .catch(err => res.status(500).json({error: "Server could not update a review"}))

});

router.delete('/:id', (req, res) => {
    db.remove({id: req.params.id})
        .then(review_res => res.status(200).json(review_res))
        .catch(err => res.status(500).json({error: "Server could not update a review"}))
});


module.exports = router;