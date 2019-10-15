const router = require('express').Router();
const db = require('../auth/authDB');

router.get('/', (req, res) =>{
    console.log(req.user);
    const id = req.user.id;
    db.findBy({id})
        .then(([user]) => res.status(200).json(user))
        .catch(err => res.status(500).json({error: "Server could not retrieve the user"}))
});

module.exports = router;