// middleware/checkToken.js
const jwt = require('jsonwebtoken');

function checkToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const token = bearer[1];
        req.token = token;

        jwt.verify(token, 'privatekey', (err, authorizedData) => {
            if (err) {
                console.log("ERROR: Invalid token");
                return res.sendStatus(403);
            } else {
                req.user = authorizedData; //authorised data to req.user
                next();
            }
        });
    } else {
        // Forbidden
        res.sendStatus(403);
    }
}

module.exports = checkToken;
