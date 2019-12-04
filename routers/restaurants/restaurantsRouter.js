const router = require('express').Router();
const db = require('./restaurantsDB');

router.post('/', (req, res) => {
    const restaurant = req.body;
    db.add(restaurant)
        .then(restaurant_res => res.status(201).json(restaurant_res))
        .catch(err => res.status(500).json({error: "Server could not add a restaurant"}))
});

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