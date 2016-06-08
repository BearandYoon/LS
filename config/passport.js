import { User } from '../api/models';
let LocalStrategy = require('passport-local').Strategy;


module.exports = function (passport) {
    // require('./initializer')

    // serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id)
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({ _id: id }, function (err, user) {
            done(err, user)
        })
    })
};
