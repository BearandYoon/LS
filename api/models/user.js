/**
 * Module dependencies.
 */

import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
var crypto = require ('crypto');
import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
//import uniqueValidator from 'mongoose-unique-validator';

/**
 * User Schema
 */

var User = new Schema ({
    userID: {
        type: String,
        unique: true,
        required: 'UserID is required.'
    },
    hashed_password: {
        type: String,
        required: 'Password cannot be blank.'
    },
    email: {
        type: String,
        unique: true,
        required: 'Email address is required. '
    },
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    avatar: {type: String, default: ''}
});

User.virtual('password')
    .set(function(password) {
        this._password = password;
        this._salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password
    });

var validatePresenceOf = function(value) {
    return value && value.length
};

User.path('email').validate(function (email) {
    return  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}, 'Please fill a valid email address. ');

User.path('email').validate(function (email, fn) {
    var User = mongoose.model('User');
    // Check only when it is a new user or when email field is modified
    User.find({ email: email }).exec(function (err, users) {
        //return true;
        fn((!err && users.length === 0));
    });
}, 'Email already exists.');

/**
 * Pre-save hook
 */

User.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password))
        next(new Error('Invalid password'));
    else
        next()
});

/**
 * Methods
 */

User.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function(password) {
        if (!password)
            return '';
        return crypto.createHmac('sha1', 'salt').update(password).digest('hex')
    },

    addAvatar: function(avatar){
        this.image = avatar

    },

    getAvatar: function(){
        return this.image
    }
};

module.exports = mongoose.model('User', User);
P.promisifyAll(module.exports);
P.promisifyAll(module.exports.prototype);
