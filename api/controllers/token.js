let jwt    = require('jsonwebtoken');
let env = process.env.NODE_ENV || 'development';
let config = require('../../config/config')[env];

import { User } from '../models';

function ensureAuthenticated(req, res, next){
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-auth-token'];

    // if there is no token return an error
    if (!token) return res.error('no token', 401, 'No token provided');

    // verifies secret and checks exp
    jwt.verify(token, config.secret, async function(err, decoded) {
        if (err) {
            return res.json({ status: 401, reason: 'Failed to authenticate token.' });
        } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            req.user = await User.findByIdAsync(req.decoded._id);
            next();
        }
    });
}

module.exports = {
    ensureAuthenticated: ensureAuthenticated
};