const router = require('express').Router();
const authDb = require('../auth/authDB');
const restaurantsDb = require('../restaurants/restaurantsDB');
const reviewsDb = require('../reviews/reviewsDB');
const db = require('./usersDB');

function getUsersRestaurants(req, res, next) {
    //get all restaurant
    restaurantsDb.getAll({"user_id": req.user.id})
        .then(restaurants => {
            req.restaurants = restaurants.length;
            next()
        })
        .catch(err => res.status(500).json({error: "Server could not retrieve restaurants"}))
}

function getUsersReviews(req, res, next) {
    //get all  dishes
    reviewsDb.getAll({"reviews.user_id": req.user.id})
        .then(reviews => {
            req.reviews = reviews.length;
            next()
        })
        .catch(err => res.status(500).json({error: "Server could not retrieve reviews"}))
}

router.get('/', getUsersRestaurants, getUsersReviews, (req, res) => {
    const id = req.user.id;
    authDb.findBy({id})
        .then(([user]) =>{
            user.reviews = req.reviews;
            user.restaurants = req.restaurants;
            res.status(200).json(user)
        })
        .catch(err => res.status(500).json({error: "Server could not retrieve the user"}))
});

router.get('/all', (req, res) => {
    db.findAllPeople()
        .then(people => res.status(200).json(people))
        .catch(err => res.status(500).json({error: "Server could not retrieve users"}))
});


module.exports = router;