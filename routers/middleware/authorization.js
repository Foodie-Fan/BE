const jwt = require('jsonwebtoken');
require('dotenv').config({ path: "../../.env"});

module.exports = (req, res, next) => {
    //get token
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.API_SECRET, (err, decodedToken) => {
            if (err) {
                res.status(401).json({errorMessage: 'You shall not pass'});
            } else {
                req.user = {id: decodedToken.subject, username: decodedToken.username};
                next();
            }
        })
    } else {
        res.status(401).json({errorMessage: 'No credentials provided'})
    }
};